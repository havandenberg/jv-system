CREATE TABLE person_contact (
	id BIGSERIAL PRIMARY KEY,
	company_id TEXT
		REFERENCES company(id)
		ON DELETE SET NULL,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	is_primary BOOLEAN NOT NULL,
	email TEXT NOT NULL,
	secondary_email TEXT NOT NULL,
	home_phone TEXT NOT NULL,
	cell_phone TEXT NOT NULL,
	work_phone TEXT NOT NULL,
	work_extension TEXT NOT NULL,
	image_src TEXT NOT NULL,
	preferred_method TEXT NOT NULL,
	roles TEXT NOT NULL
);

INSERT INTO person_contact (
	company_id,
	first_name,
	last_name,
	is_primary,
	email,
	secondary_email,
	home_phone,
	cell_phone,
	work_phone,
	work_extension,
	image_src,
	preferred_method,
	roles
) VALUES (
	'jac-vandenberg',
	'Halsey',
	'Vandenberg',
	false,
	'hvandenberg@jacvandenberg.com',
	'',
	'',
	'(914) 703-2060',
	'',
	'',
	'',
	'',
	''
);

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
