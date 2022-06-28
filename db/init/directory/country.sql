CREATE TABLE directory.country (
	id TEXT PRIMARY KEY,
	country_name TEXT NOT NULL
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
		    country_name
      )
        VALUES (
          co.id,
		      co.country_name
        )
      ON CONFLICT (id) DO UPDATE SET
			  country_name=EXCLUDED.country_name
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
