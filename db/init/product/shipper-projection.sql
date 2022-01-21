CREATE TABLE product.shipper_projection_vessel (
	id BIGSERIAL PRIMARY KEY,
	vessel_name TEXT,
	departure_date DATE,
	arrival_date DATE,
	arrival_port TEXT,
	vessel_status TEXT,
  is_reviewed BOOLEAN,
  previous_name TEXT,
  shipper_id TEXT
		REFERENCES directory.shipper(id)
		ON DELETE SET NULL
);

CREATE TABLE product.shipper_projection_product (
	id BIGSERIAL PRIMARY KEY,
  species TEXT,
  variety TEXT,
  size TEXT,
  pack_type TEXT,
  plu TEXT,
  shipper_id TEXT
		REFERENCES directory.shipper(id)
		ON DELETE SET NULL
);

CREATE TABLE product.shipper_projection_entry (
	id BIGSERIAL PRIMARY KEY,
	pallet_count NUMERIC,
	vessel_id BIGINT
		REFERENCES product.shipper_projection_vessel(id)
		ON DELETE SET NULL,
	product_id BIGINT
		REFERENCES product.shipper_projection_product(id)
		ON DELETE SET NULL
);

CREATE FUNCTION product.bulk_upsert_shipper_projection_vessel(
  vessels product.shipper_projection_vessel[]
)
RETURNS setof product.shipper_projection_vessel
AS $$
  DECLARE
    v product.shipper_projection_vessel;
    vals product.shipper_projection_vessel;
  BEGIN
    FOREACH v IN ARRAY vessels LOOP
      INSERT INTO product.shipper_projection_vessel(
        id,
        vessel_name,
        departure_date,
        arrival_date,
        arrival_port,
        vessel_status
      )
        VALUES (
          COALESCE(v.id, (select nextval('product.shipper_projection_vessel_id_seq'))),
          v.vessel_name,
          v.departure_date,
          v.arrival_date,
          v.arrival_port,
          v.vessel_status
        )
      ON CONFLICT (id) DO UPDATE SET
        vessel_name=EXCLUDED.vessel_name,
        departure_date=EXCLUDED.departure_date,
        arrival_date=EXCLUDED.arrival_date,
        arrival_port=EXCLUDED.arrival_port,
        vessel_status=EXCLUDED.vessel_status
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_shipper_projection_product(
  products product.shipper_projection_product[]
)
RETURNS setof product.shipper_projection_product
AS $$
  DECLARE
    p product.shipper_projection_product;
    vals product.shipper_projection_product;
  BEGIN
    FOREACH p IN ARRAY products LOOP
      INSERT INTO product.shipper_projection_product(
        id,
        species,
        variety,
        size,
        pack_type,
        plu,
        shipper_id
      )
        VALUES (
          COALESCE(p.id, (select nextval('product.shipper_projection_product_id_seq'))),
          p.species,
          p.variety,
          p.size,
          p.pack_type,
          p.plu,
          p.shipper_id
        )
      ON CONFLICT (id) DO UPDATE SET
        species=EXCLUDED.species,
        variety=EXCLUDED.variety,
        size=EXCLUDED.size,
        pack_type=EXCLUDED.pack_type,
        plu=EXCLUDED.plu
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_delete_shipper_projection_product(IN ids_to_delete BIGINT[])
    RETURNS setof BIGINT
AS $$
  DELETE FROM product.shipper_projection_product
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;

CREATE FUNCTION product.bulk_upsert_shipper_projection_entry(
  entries product.shipper_projection_entry[]
)
RETURNS setof product.shipper_projection_entry
AS $$
  DECLARE
    e product.shipper_projection_entry;
    vals product.shipper_projection_entry;
  BEGIN
    FOREACH e IN ARRAY entries LOOP
      INSERT INTO product.shipper_projection_entry(
        id,
        pallet_count
      )
        VALUES (
          COALESCE(e.id, (select nextval('product.shipper_projection_entry_id_seq'))),
          e.pallet_count
        )
      ON CONFLICT (id) DO UPDATE SET
        pallet_count=EXCLUDED.pallet_count
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_delete_shipper_projection_entry(IN ids_to_delete BIGINT[])
    RETURNS setof BIGINT
AS $$
  DELETE FROM product.shipper_projection_entry
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
