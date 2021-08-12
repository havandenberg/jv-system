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

CREATE TABLE directory.warehouse_person_contact (
  warehouse_id TEXT NOT NULL,
  person_contact_id BIGINT NOT NULL,
  PRIMARY KEY (warehouse_id, person_contact_id),
  FOREIGN KEY (warehouse_id) REFERENCES directory.warehouse(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (person_contact_id) REFERENCES directory.person_contact(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE FUNCTION directory.warehouse_search_text(IN w directory.warehouse)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		w.warehouse_name,
		w.phone,
		w.address_1,
		w.address_2,
		w.address_3,
		w.city,
		w.postal_state,
		w.zip_code,
		w.country_id,
		c.country_name,
		w.out_queue,
		w.state_tax_code,
		w.county_tax_code,
		w.city_tax_code,
		w.misc_tax_code
	) FROM directory.warehouse ww FULL JOIN directory.country c ON (w.country_id = c.id) WHERE w.id = ww.id
$BODY$;
