CREATE TABLE product.shipper_projection (
	id BIGSERIAL PRIMARY KEY,
	completed_at TIMESTAMP,
  is_reviewed BOOLEAN,
  shipper_id TEXT
		REFERENCES directory.shipper(id)
		ON DELETE SET NULL
);

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
		ON DELETE SET NULL,
	projection_id BIGINT
		REFERENCES product.shipper_projection(id)
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
        vessel_status,
        previous_name
      )
        VALUES (
          COALESCE(v.id, (select nextval('product.shipper_projection_vessel_id_seq'))),
          v.vessel_name,
          v.departure_date,
          v.arrival_date,
          v.arrival_port,
          v.vessel_status,
          v.previous_name
        )
      ON CONFLICT (id) DO UPDATE SET
        vessel_name=EXCLUDED.vessel_name,
        departure_date=EXCLUDED.departure_date,
        arrival_date=EXCLUDED.arrival_date,
        arrival_port=EXCLUDED.arrival_port,
        vessel_status=EXCLUDED.vessel_status,
        previous_name=EXCLUDED.previous_name
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
        pallet_count,
        shipper_projection_id
      )
        VALUES (
          COALESCE(e.id, (select nextval('product.shipper_projection_entry_id_seq'))),
          e.pallet_count,
          e.shipper_projection_id
        )
      ON CONFLICT (id) DO UPDATE SET
        pallet_count=EXCLUDED.pallet_count,
        shipper_projection_id=EXCLUDED.shipper_projection_id
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

CREATE FUNCTION product.upsert_shipper_projection(
  projection product.shipper_projection
)
  RETURNS product.shipper_projection
AS $$
    INSERT INTO product.shipper_projection(
      id,
      completed_at,
      is_reviewed,
      shipper_id
    )
      VALUES (
        COALESCE(projection.id, (select nextval('product.shipper_projection_id_seq'))),
        projection.completed_at,
        projection.is_reviewed,
        projection.shipper_id
      )
    ON CONFLICT (id) DO UPDATE SET
      completed_at=EXCLUDED.completed_at,
      is_reviewed=EXCLUDED.is_reviewed,
      shipper_id=EXCLUDED.shipper_id
    RETURNING (id, completed_at, is_reviewed, shipper_id)
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;

CREATE FUNCTION product.shipper_projection_total_pallets(IN p product.shipper_projection)
	RETURNS BIGINT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT SUM (
      spe.pallet_count
    ) FROM product.shipper_projection sp
    LEFT JOIN product.shipper_projection_entry spe
      ON spe.shipper_projection_id = sp.id
    WHERE p.id = sp.id
$BODY$;
COMMENT ON FUNCTION product.shipper_projection_total_pallets(p product.shipper_projection) IS E'@sortable';

CREATE FUNCTION product.shipper_projection_search_text(IN p product.shipper_projection)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT CONCAT (
		p.id,
		CAST(p.completed_at AS TEXT),
		p.is_reviewed,
    p.shipper_id,
    array_to_string(array_agg(sh.shipper_name), ''),
    array_to_string(array_agg(spv.id), ''),
    array_to_string(array_agg(spv.vessel_name), ''),
    array_to_string(array_agg(spp.species), ''),
    array_to_string(array_agg(spp.variety), ''),
    array_to_string(array_agg(spp.size), ''),
    array_to_string(array_agg(spp.pack_type), ''),
    array_to_string(array_agg(spp.plu), '')
	) FROM product.shipper_projection sp
    LEFT JOIN product.shipper_projection_entry spe
      ON spe.shipper_projection_id = sp.id
    LEFT JOIN directory.shipper sh
      ON sp.shipper_id = sh.id
    LEFT JOIN product.shipper_projection_vessel spv
      ON spe.vessel_id = spv.id
    LEFT JOIN product.shipper_projection_product spp
      ON spe.product_id = spp.id
	WHERE p.id = sp.id
$BODY$;
