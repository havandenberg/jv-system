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
