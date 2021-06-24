CREATE TABLE directory.country (
	id TEXT PRIMARY KEY,
	country_name TEXT NOT NULL
);

CREATE TABLE directory.shipper (
	id TEXT PRIMARY KEY,
	shipper_name TEXT NOT NULL,
	country_id TEXT
		REFERENCES directory.country(id)
		ON DELETE SET NULL,
	group_id TEXT,
	logo_src TEXT,
	notes TEXT,
	website TEXT
);

CREATE TABLE directory.customer (
	id TEXT PRIMARY KEY,
	customer_name TEXT NOT NULL,
	address_1 TEXT,
	address_2 TEXT,
	city TEXT,
	postal_state TEXT,
	zip_code TEXT,
	country_id TEXT
		REFERENCES directory.country(id)
		ON DELETE SET NULL,
	phone TEXT,
	logo_src TEXT,
	notes TEXT,
	website TEXT,
	active BOOLEAN NOT NULL
);

CREATE TABLE directory.warehouse (
	id TEXT PRIMARY KEY,
	warehouse_name TEXT NOT NULL,
	address_1 TEXT,
	address_2 TEXT,
	address_3 TEXT,
	city TEXT,
	postal_state TEXT,
	country_id TEXT
		REFERENCES directory.country(id)
		ON DELETE SET NULL,
	zip_code TEXT,
	phone TEXT,
	out_queue TEXT,
	state_tax_code TEXT,
	county_tax_code TEXT,
	city_tax_code TEXT,
	misc_tax_code TEXT
);

CREATE TABLE directory.person_contact (
	id BIGSERIAL PRIMARY KEY,
	shipper_id TEXT
		REFERENCES directory.shipper(id)
		ON DELETE SET NULL,
	customer_id TEXT
		REFERENCES directory.customer(id)
		ON DELETE SET NULL,
	warehouse_id TEXT
		REFERENCES directory.warehouse(id)
		ON DELETE SET NULL,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	is_primary BOOLEAN NOT NULL,
	email TEXT,
	secondary_email TEXT,
	home_phone TEXT,
	cell_phone TEXT,
	work_phone TEXT,
	work_extension TEXT,
	image_src TEXT,
	is_internal BOOLEAN NOT NULL,
	roles TEXT
);

CREATE TABLE directory.contact_alias (
	id BIGSERIAL PRIMARY KEY,
	alias_description TEXT NOT NULL,
	alias_name TEXT NOT NULL,
  user_id BIGINT
		REFERENCES directory.user(id)
		ON DELETE SET NULL
);

CREATE TABLE directory.contact_alias_person_contact (
  alias_id BIGINT NOT NULL,
  person_contact_id BIGINT NOT NULL,
  PRIMARY KEY (alias_id, person_contact_id),
  FOREIGN KEY (alias_id) REFERENCES directory.contact_alias(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (person_contact_id) REFERENCES directory.person_contact(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE directory.user (
	id BIGSERIAL PRIMARY KEY,
	pin TEXT UNIQUE,
	display_name TEXT
);
