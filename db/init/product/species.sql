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
