CREATE TABLE product.repack_style (
  id TEXT PRIMARY KEY,
  style_name TEXT,
  style_description TEXT,
  lqd_code TEXT,
  film_length NUMERIC,
  pack_out_weight NUMERIC
);

CREATE FUNCTION product.repack_style_search_text(IN r product.repack_style)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		rs.id,
		rs.style_name,
		rs.style_description,
		rs.lqd_code
	) FROM product.repack_style rs WHERE rs.id = r.id
$BODY$;

CREATE FUNCTION product.bulk_upsert_repack_style(
  repack_styles product.repack_style[]
)
RETURNS setof product.repack_style
AS $$
  DECLARE
    s product.repack_style;
    vals product.repack_style;
  BEGIN
    FOREACH s IN ARRAY repack_styles LOOP
      INSERT INTO product.repack_style(
        id,
        style_name,
        style_description,
        lqd_code,
        film_length,
        pack_out_weight
      )
        VALUES (
          s.id,
          s.style_name,
          s.style_description,
          s.lqd_code,
          s.film_length,
          s.pack_out_weight
        )
      ON CONFLICT (id) DO UPDATE SET
        style_name=EXCLUDED.style_name,
        style_description=EXCLUDED.style_description,
        lqd_code=EXCLUDED.lqd_code,
        film_length=EXCLUDED.film_length,
        pack_out_weight=EXCLUDED.pack_out_weight
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_delete_repack_style(IN ids_to_delete TEXT[])
  RETURNS setof TEXT
AS $$
  DELETE FROM product.repack_style
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
