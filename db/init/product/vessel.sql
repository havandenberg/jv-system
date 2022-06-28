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
  inv_flag BOOLEAN
);

CREATE FUNCTION product.vessel_country(IN v product.vessel)
    RETURNS directory.country
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.country c WHERE c.id = v.country_id
$BODY$;

CREATE FUNCTION product.vessel_warehouse(IN v product.vessel)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = v.arrival_port
$BODY$;

CREATE FUNCTION product.vessel_arrival_port_distinct_values()
  RETURNS SETOF TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT DISTINCT CONCAT(w.warehouse_name, ' (', v.arrival_port, ')')
  FROM product.vessel v
  LEFT JOIN directory.warehouse w
  ON w.id = v.arrival_port;
$BODY$;

CREATE FUNCTION product.vessel_inventory_items(IN v product.vessel)
    RETURNS SETOF product.inventory_item
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.inventory_item i WHERE i.vessel_code = v.vessel_code order by v.id DESC
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
    v.coast
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
        inv_flag
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
          v.inv_flag
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
			  inv_flag=EXCLUDED.inv_flag
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
