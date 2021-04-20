-- migrate:up
CREATE FUNCTION public.person_contact_search_text(IN person person_contact)
    RETURNS text
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		person.first_name,
		person.last_name,
		person.email,
		person.secondary_email,
		person.home_phone,
		person.cell_phone,
		person.work_phone,
		person.work_extension,
		person.preferred_method,
		person.roles
	) FROM person_contact
$BODY$;

CREATE FUNCTION public.office_search_text(IN o office)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		o.office_name,
		o.office_description,
		o.email,
		o.secondary_email,
		o.phone,
		o.secondary_phone,
		o.address_1,
		o.address_2,
		o.city,
		o.postal_state,
		o.zip_code,
		c.company_name
	) FROM office oo FULL JOIN company c ON (o.company_id = c.id) WHERE o.id = oo.id
$BODY$;

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

-- migrate:down
DROP FUNCTION person_contact_search_text;
DROP FUNCTION office_search_text;
DROP TYPE company_primary_contact;
DROP FUNCTION company_primary_contact;
DROP FUNCTION company_search_text;
