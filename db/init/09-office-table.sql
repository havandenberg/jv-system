CREATE TABLE office (
	id TEXT PRIMARY KEY,
	company_id TEXT
		REFERENCES company(id)
		ON DELETE SET NULL,
	office_name TEXT NOT NULL,
	office_description TEXT NOT NULL,
	email TEXT NOT NULL,
	secondary_email TEXT NOT NULL,
	phone TEXT NOT NULL,
	secondary_phone TEXT NOT NULL,
	address_1 TEXT NOT NULL,
	address_2 TEXT NOT NULL,
	city TEXT NOT NULL,
	postal_state TEXT NOT NULL,
	zip_code TEXT NOT NULL
);

INSERT INTO office (
	id,
	company_id,
	office_name,
	office_description,
	email,
	secondary_email,
	phone,
	secondary_phone,
	address_1,
	address_2,
	city,
	postal_state,
	zip_code
) VALUES (
	'jv-east',
	'jac-vandenberg',
	'East Coast Main',
	'Primary office on East Coast',
	'',
	'',
	'(914) 964-5900',
	'',
	'100 Corporate Blvd',
	'',
	'Yonkers',
	'NY',
	'10701'
);

CREATE FUNCTION public.office_search_text(IN o office)
    RETURNS text
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
	) FROM office o FULL JOIN company c ON (o.company_id = c.id) WHERE o.id = id
$BODY$;
