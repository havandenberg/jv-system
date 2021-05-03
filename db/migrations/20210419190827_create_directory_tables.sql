-- migrate:up
CREATE TABLE directory.company (
	id TEXT PRIMARY KEY,
	company_name TEXT NOT NULL,
	company_type TEXT NOT NULL,
	logo_src TEXT NOT NULL,
	notes TEXT NOT NULL,
	website TEXT NOT NULL
);

CREATE TABLE directory.person_contact (
	id BIGSERIAL PRIMARY KEY,
	company_id TEXT
		REFERENCES directory.company(id)
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

CREATE TABLE directory.office (
	id TEXT PRIMARY KEY,
	company_id TEXT
		REFERENCES directory.company(id)
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

-- migrate:down
DROP TABLE directory.person_contact;
DROP TABLE directory.company;
DROP TABLE directory.office;
