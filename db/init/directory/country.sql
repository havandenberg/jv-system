CREATE TABLE directory.country (
	id TEXT PRIMARY KEY,
	country_name TEXT NOT NULL,
	cmb_id TEXT
);

CREATE FUNCTION directory.country_search_text(IN c directory.country)
    RETURNS text
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		c.id,
		c.country_name
		c.cmb_id
	) FROM directory.country cc WHERE c.id = cc.id
$BODY$;

CREATE FUNCTION directory.bulk_upsert_country(
  countries directory.country[]
)
RETURNS setof directory.country
AS $$
  DECLARE
    co directory.country;
    vals directory.country;
  BEGIN
    FOREACH co IN ARRAY countries LOOP
      INSERT INTO directory.country(
        id,
		    country_name,
        cmb_id
      )
        VALUES (
          co.id,
		      co.country_name,
          co.cmb_id
        )
      ON CONFLICT (id) DO UPDATE SET
			  country_name=EXCLUDED.country_name,
			  cmb_id=EXCLUDED.cmb_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION directory.bulk_delete_country(IN ids_to_delete TEXT[])
  RETURNS setof TEXT
AS $$
  DELETE FROM directory.country
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
