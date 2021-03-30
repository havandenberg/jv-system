CREATE TABLE company (
	id TEXT PRIMARY KEY,
	company_name TEXT NOT NULL,
	company_type TEXT NOT NULL,
	logo_src TEXT NOT NULL,
	notes TEXT NOT NULL,
	website TEXT NOT NULL
);

INSERT INTO company (
	id,
	company_name,
	company_type,
	logo_src,
	notes,
	website
) VALUES (
	'jac-vandenberg',
	'Jac Vandenberg',
	'',
	'',
	'',
	'http://www.jacvandenberg.com/'
);

CREATE TYPE company_primary_contact AS (contact_name text, email text);

CREATE FUNCTION public.company_primary_contact(IN c company)
    RETURNS company_primary_contact
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		first_name,
		' ',
		last_name
	) as contact_name, email FROM person_contact WHERE company_id = c.id AND is_primary = true
$BODY$;

CREATE FUNCTION public.company_search_text(IN c company)
    RETURNS text
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		c.company_name,
		c.company_type,
		c.notes,
		c.website
	) FROM company
$BODY$;
