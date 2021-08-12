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

CREATE TABLE directory.shipper_person_contact (
  shipper_id TEXT NOT NULL,
  person_contact_id BIGINT NOT NULL,
  PRIMARY KEY (shipper_id, person_contact_id),
  FOREIGN KEY (shipper_id) REFERENCES directory.shipper(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (person_contact_id) REFERENCES directory.person_contact(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE FUNCTION directory.shipper_search_text(IN s directory.shipper)
    RETURNS text
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		s.id,
		s.shipper_name,
		s.country_id,
		c.country_name,
		s.group_id,
		s.notes,
		s.website
	) FROM directory.shipper ss FULL JOIN directory.country c ON (s.country_id = c.id) WHERE s.id = ss.id
$BODY$;
