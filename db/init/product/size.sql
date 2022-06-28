CREATE TABLE product.product_size (
	id BIGSERIAL PRIMARY KEY,
	species_id TEXT,
	variety_id TEXT,
	jv_code TEXT,
	jv_description TEXT,
	shipper_code TEXT,
	shipper_description TEXT,
	combine_with TEXT,
	combine_description TEXT,
	shipper_id TEXT
);

CREATE FUNCTION product.product_size_search_text(IN s product.product_size)
    RETURNS text
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		s.id,
		s.jv_code,
		s.jv_description,
    s.species_id,
    s.variety_id,
		s.shipper_code,
		s.shipper_description,
		s.combine_description,
		s.shipper_id
	) FROM product.product_size ss WHERE s.id = ss.id
$BODY$;

CREATE FUNCTION product.product_size_shipper(IN s product.product_size)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper sh WHERE sh.id = s.shipper_id
$BODY$;

CREATE FUNCTION product.product_size_species(IN s product.product_size)
    RETURNS product.product_species
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_species sp WHERE sp.id = s.species_id
$BODY$;

CREATE FUNCTION product.product_size_variety(IN s product.product_size)
    RETURNS product.product_variety
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_variety v WHERE v.id = s.variety_id
$BODY$;

CREATE FUNCTION product.bulk_upsert_product_size(
  sizes product.product_size[]
)
RETURNS setof product.product_size
AS $$
  DECLARE
    s product.product_size;
    vals product.product_size;
  BEGIN
    FOREACH s IN ARRAY sizes LOOP
      INSERT INTO product.product_size(
        id,
        species_id,
        variety_id,
        jv_code,
        jv_description,
        shipper_code,
        shipper_description,
        combine_with,
        combine_description,
        shipper_id
      )
        VALUES (
          COALESCE(s.id, (select nextval('product.product_size_id_seq'))),
					s.species_id,
					s.variety_id,
					s.jv_code,
					s.jv_description,
					s.shipper_code,
					s.shipper_description,
					s.combine_with,
					s.combine_description,
					s.shipper_id
        )
      ON CONFLICT (id) DO UPDATE SET
			  species_id=EXCLUDED.species_id,
			  variety_id=EXCLUDED.variety_id,
			  jv_code=EXCLUDED.jv_code,
			  jv_description=EXCLUDED.jv_description,
			  shipper_code=EXCLUDED.shipper_code,
			  shipper_description=EXCLUDED.shipper_description,
			  combine_with=EXCLUDED.combine_with,
			  combine_description=EXCLUDED.combine_description,
			  shipper_id=EXCLUDED.shipper_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_delete_product_size(IN ids_to_delete BIGINT[])
  RETURNS setof BIGINT
AS $$
  DELETE FROM product.product_size
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
