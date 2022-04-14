CREATE TABLE product.product_variety (
	id TEXT PRIMARY KEY,
	variety_description TEXT,
	secondary_description TEXT,
	customer_letter_sequence TEXT,
	summary_code TEXT,
	variety_group TEXT,
  combine_with TEXT
);

CREATE FUNCTION product.product_variety_search_text(IN v product.product_variety)
    RETURNS text
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		v.id,
		v.variety_description,
		v.secondary_description,
		v.customer_letter_sequence,
		v.summary_code,
		v.variety_group
	) FROM product.product_variety vv WHERE v.id = vv.id
$BODY$;
