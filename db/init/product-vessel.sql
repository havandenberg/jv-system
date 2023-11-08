CREATE TABLE product.vessel (
  id BIGSERIAL PRIMARY KEY,
  vessel_code TEXT NOT NULL,
  pre_vessel_code TEXT,
  vessel_name TEXT,
  arrival_port TEXT,
  country_id TEXT,
  departure_date DATE,
  arrival_date DATE,
  discharge_date DATE,
  coast TEXT,
  is_pre BOOLEAN,
  is_available BOOLEAN,
  inv_flag BOOLEAN,
  schedule_notes TEXT
);

CREATE INDEX ON product.vessel (vessel_code, discharge_date, is_pre);

CREATE FUNCTION product.vessel_country(IN v product.vessel)
    RETURNS directory.country
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.country c WHERE c.id = v.country_id
$BODY$;

CREATE FUNCTION product.vessel_original_arrival_port(IN v product.vessel)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT p.original_location_id FROM product.pallet p WHERE p.vessel_code = v.vessel_code LIMIT 1
$BODY$;

CREATE FUNCTION product.vessel_warehouse(IN v product.vessel)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = COALESCE((SELECT product.vessel_original_arrival_port(v)), v.arrival_port)
$BODY$;

CREATE FUNCTION product.vessel_inventory_items(IN v product.vessel)
    RETURNS SETOF product.inventory_item
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.inventory_item i WHERE i.vessel_code = v.vessel_code AND i.is_pre = v.is_pre ORDER BY v.id DESC
$BODY$;

CREATE FUNCTION product.vessel_pallets(IN v product.vessel)
    RETURNS SETOF product.pallet
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet p WHERE p.vessel_code = v.vessel_code
$BODY$;

CREATE FUNCTION product.vessel_containers(IN v product.vessel)
    RETURNS SETOF product.container
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.container c WHERE c.vessel_code = v.vessel_code
$BODY$;

CREATE FUNCTION product.vessel_search_text(IN v product.vessel)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		v.vessel_code,
		v.pre_vessel_code,
		v.vessel_name,
		v.arrival_port,
		v.country_id,
		c.country_name,
    CAST(v.departure_date AS TEXT),
    CAST(v.arrival_date AS TEXT),
    CAST(v.discharge_date AS TEXT),
    v.coast,
    v.schedule_notes
	) FROM product.vessel vv FULL JOIN directory.country c ON (v.country_id = c.id) WHERE v.id = vv.id
$BODY$;

CREATE FUNCTION product.bulk_upsert_vessel(
  vessels product.vessel[]
)
RETURNS setof product.vessel
AS $$
  DECLARE
    v product.vessel;
    vals product.vessel;
  BEGIN
    FOREACH v IN ARRAY vessels LOOP
      INSERT INTO product.vessel(
        id,
        vessel_code,
        pre_vessel_code,
        vessel_name,
        arrival_port,
        country_id,
        departure_date,
        arrival_date,
        discharge_date,
        coast,
        is_pre,
        is_available,
        inv_flag,
        schedule_notes
      )
        VALUES (
          COALESCE(v.id, (select nextval('product.vessel_id_seq'))),
					v.vessel_code,
          v.pre_vessel_code,
					v.vessel_name,
					v.arrival_port,
					v.country_id,
					v.departure_date,
					v.arrival_date,
					v.discharge_date,
					v.coast,
          v.is_pre,
          v.is_available,
          v.inv_flag,
          v.schedule_notes
        )
      ON CONFLICT (id) DO UPDATE SET
			  vessel_code=EXCLUDED.vessel_code,
			  pre_vessel_code=EXCLUDED.pre_vessel_code,
			  vessel_name=EXCLUDED.vessel_name,
			  arrival_port=EXCLUDED.arrival_port,
			  country_id=EXCLUDED.country_id,
			  departure_date=EXCLUDED.departure_date,
			  arrival_date=EXCLUDED.arrival_date,
			  discharge_date=EXCLUDED.discharge_date,
			  coast=EXCLUDED.coast,
			  is_pre=EXCLUDED.is_pre,
        is_available=EXCLUDED.is_available,
			  inv_flag=EXCLUDED.inv_flag,
        schedule_notes=EXCLUDED.schedule_notes
      RETURNING * INTO vals;
      RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_delete_vessel(IN ids_to_delete BIGINT[])
  RETURNS setof BIGINT
AS $$
  DELETE FROM product.vessel
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
