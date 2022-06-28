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

CREATE FUNCTION product.bulk_upsert_product_variety(
  varieties product.product_variety[]
)
RETURNS setof product.product_variety
AS $$
  DECLARE
    v product.product_variety;
    vals product.product_variety;
  BEGIN
    FOREACH v IN ARRAY varieties LOOP
      INSERT INTO product.product_variety(
        id,
				variety_description,
				secondary_description,
				customer_letter_sequence,
				summary_code,
				variety_group,
				combine_with
      )
        VALUES (
          v.id,
					v.variety_description,
					v.secondary_description,
					v.customer_letter_sequence,
					v.summary_code,
					v.variety_group,
					v.combine_with
        )
      ON CONFLICT (id) DO UPDATE SET
			  variety_description=EXCLUDED.variety_description,
			  secondary_description=EXCLUDED.secondary_description,
			  customer_letter_sequence=EXCLUDED.customer_letter_sequence,
			  summary_code=EXCLUDED.summary_code,
			  variety_group=EXCLUDED.variety_group,
			  combine_with=EXCLUDED.combine_with
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_delete_product_variety(IN ids_to_delete TEXT[])
  RETURNS setof TEXT
AS $$
  DELETE FROM product.product_variety
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
