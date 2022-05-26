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
