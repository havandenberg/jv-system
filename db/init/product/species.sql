CREATE TABLE product.product_species (
	id TEXT PRIMARY KEY,
	species_description TEXT,
	secondary_description TEXT,
	fda_product_code TEXT,
	fda_industry_code TEXT,
	default_temperature TEXT
);

CREATE FUNCTION product.product_species_search_text(IN s product.product_species)
    RETURNS text
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		s.id,
		s.species_description,
		s.secondary_description,
		s.fda_product_code,
		s.fda_industry_code,
		s.default_temperature
	) FROM product.product_species ss WHERE s.id = ss.id
$BODY$;

CREATE FUNCTION product.product_species_common_species(IN s product.product_species)
    RETURNS product.common_species
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT * FROM product.common_species ss WHERE ss.product_species_id = s.id LIMIT 1
$BODY$;

CREATE FUNCTION product.bulk_upsert_product_species(
  specieses product.product_species[]
)
RETURNS setof product.product_species
AS $$
  DECLARE
    s product.product_species;
    vals product.product_species;
  BEGIN
    FOREACH s IN ARRAY specieses LOOP
      INSERT INTO product.product_species(
        id,
				species_description,
				secondary_description,
				fda_product_code,
				fda_industry_code,
				default_temperature
      )
        VALUES (
          s.id,
					s.species_description,
					s.secondary_description,
					s.fda_product_code,
					s.fda_industry_code,
					s.default_temperature
        )
      ON CONFLICT (id) DO UPDATE SET
			  species_description=EXCLUDED.species_description,
			  secondary_description=EXCLUDED.secondary_description,
			  fda_product_code=EXCLUDED.fda_product_code,
			  fda_industry_code=EXCLUDED.fda_industry_code,
			  default_temperature=EXCLUDED.default_temperature
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_delete_product_species(IN ids_to_delete TEXT[])
  RETURNS setof TEXT
AS $$
  DELETE FROM product.product_species
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
