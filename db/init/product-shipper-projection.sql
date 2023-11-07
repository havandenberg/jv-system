CREATE TABLE product.shipper_projection (
	id BIGSERIAL PRIMARY KEY,
	submitted_at TIMESTAMP,
  shipper_comments TEXT,
  jv_comments TEXT,
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  review_status INT,
  shipper_id TEXT
		REFERENCES directory.shipper(id)
		ON DELETE SET NULL
);

CREATE TABLE product.shipper_projection_vessel (
	id BIGSERIAL PRIMARY KEY,
  shipper_id TEXT
		REFERENCES directory.shipper(id)
		ON DELETE SET NULL,
  vessel_id BIGINT
		REFERENCES product.vessel(id)
		ON DELETE SET NULL
);

CREATE TABLE product.shipper_projection_vessel_info (
	id BIGSERIAL PRIMARY KEY,
	vessel_name TEXT,
	departure_date DATE,
	arrival_date DATE,
	arrival_port TEXT,
	vessel_status TEXT,
  shipper_id TEXT
		REFERENCES directory.shipper(id)
		ON DELETE SET NULL,
	projection_id BIGINT
		REFERENCES product.shipper_projection(id)
		ON DELETE SET NULL,
	vessel_id BIGINT
		REFERENCES product.shipper_projection_vessel(id)
		ON DELETE SET NULL
);

CREATE TABLE product.shipper_projection_product (
	id BIGSERIAL PRIMARY KEY,
  species TEXT,
  variety TEXT,
  size TEXT,
  pack_type TEXT,
  plu TEXT,
  customer_value TEXT,
  common_species_id BIGINT
		REFERENCES product.common_species(id)
		ON DELETE SET NULL,
  common_variety_id BIGINT
		REFERENCES product.common_variety(id)
		ON DELETE SET NULL,
  common_size_id BIGINT
		REFERENCES product.common_size(id)
		ON DELETE SET NULL,
  common_pack_type_id BIGINT
		REFERENCES product.common_pack_type(id)
		ON DELETE SET NULL,
  shipper_id TEXT
		REFERENCES directory.shipper(id)
		ON DELETE SET NULL,
  customer_id TEXT
		REFERENCES directory.customer(id)
		ON DELETE SET NULL
);

CREATE TABLE product.shipper_projection_entry (
	id BIGSERIAL PRIMARY KEY,
	pallet_count NUMERIC,
	vessel_info_id BIGINT
		REFERENCES product.shipper_projection_vessel_info(id)
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
        shipper_id,
        vessel_id
      )
        VALUES (
          COALESCE(v.id, (select nextval('product.shipper_projection_vessel_id_seq'))),
          v.shipper_id,
          v.vessel_id
        )
      ON CONFLICT (id) DO UPDATE SET
        shipper_id=EXCLUDED.shipper_id,
        vessel_id=EXCLUDED.vessel_id
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
        shipper_id,
        common_species_id,
        common_variety_id,
        common_size_id,
        common_pack_type_id,
        customer_id,
        customer_value
      )
        VALUES (
          COALESCE(p.id, (select nextval('product.shipper_projection_product_id_seq'))),
          p.species,
          p.variety,
          p.size,
          p.pack_type,
          p.plu,
          p.shipper_id,
          p.common_species_id,
          p.common_variety_id,
          p.common_size_id,
          p.common_pack_type_id,
          p.customer_id,
          p.customer_value
        )
      ON CONFLICT (id) DO UPDATE SET
        species=EXCLUDED.species,
        variety=EXCLUDED.variety,
        size=EXCLUDED.size,
        pack_type=EXCLUDED.pack_type,
        plu=EXCLUDED.plu,
        common_species_id=EXCLUDED.common_species_id,
        common_variety_id=EXCLUDED.common_variety_id,
        common_size_id=EXCLUDED.common_size_id,
        common_pack_type_id=EXCLUDED.common_pack_type_id,
        customer_id=EXCLUDED.customer_id,
        customer_value=EXCLUDED.customer_value
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
    LEFT JOIN product.shipper_projection_vessel_info spvi
      ON sp.id = spvi.projection_id
    LEFT JOIN product.shipper_projection_entry spe
      ON spe.vessel_info_id = spvi.id
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
		CAST(p.submitted_at AS TEXT),
		CAST(p.approved_at AS TEXT),
		CAST(p.rejected_at AS TEXT),
		p.shipper_comments,
		p.jv_comments,
    p.shipper_id,
    array_to_string(array_agg(sh.shipper_name), ''),
    array_to_string(array_agg(spvi.vessel_name), ''),
    array_to_string(array_agg(spp.species), ''),
    array_to_string(array_agg(spp.variety), ''),
    array_to_string(array_agg(spp.size), ''),
    array_to_string(array_agg(spp.pack_type), ''),
    array_to_string(array_agg(spp.plu), '')
	) FROM product.shipper_projection sp
    LEFT JOIN directory.shipper sh
      ON sp.shipper_id = sh.id
    LEFT JOIN product.shipper_projection_vessel_info spvi
      ON sp.id = spvi.projection_id
    LEFT JOIN product.shipper_projection_entry spe
      ON spe.vessel_info_id = spvi.id
    LEFT JOIN product.shipper_projection_product spp
      ON spe.product_id = spp.id
	WHERE p.id = sp.id
$BODY$;
