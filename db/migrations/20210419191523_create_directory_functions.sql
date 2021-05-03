-- migrate:up
CREATE FUNCTION directory.person_contact_search_text(IN person directory.person_contact)
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
	) FROM directory.person_contact
$BODY$;

CREATE FUNCTION directory.office_search_text(IN o directory.office)
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
	) FROM directory.office oo FULL JOIN directory.company c ON (o.company_id = c.id) WHERE o.id = oo.id
$BODY$;

CREATE TYPE directory.company_primary_contact AS (contact_name text, email text);

CREATE FUNCTION directory.company_primary_contact(IN c company)
    RETURNS directory.company_primary_contact
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		first_name,
		' ',
		last_name
	) as contact_name, email FROM directory.person_contact WHERE company_id = c.id AND is_primary = true
$BODY$;

CREATE FUNCTION directory.company_search_text(IN c directory.company)
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
	) FROM directory.company
$BODY$;

-- migrate:down
DROP FUNCTION directory.person_contact_search_text;
DROP FUNCTION directory.office_search_text;
DROP TYPE directory.company_primary_contact;
DROP FUNCTION directory.company_primary_contact;
DROP FUNCTION directory.company_search_text;
