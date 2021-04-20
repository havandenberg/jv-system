-- migrate:up
CREATE TABLE contact_alias (
	id BIGSERIAL PRIMARY KEY,
	alias_description TEXT NOT NULL,
	alias_name TEXT NOT NULL,
	alias_type TEXT NOT NULL
);

CREATE TABLE contact_alias_person_contact (
  alias_id BIGINT NOT NULL,
  person_contact_id BIGINT NOT NULL,
  PRIMARY KEY (alias_id, person_contact_id),
  FOREIGN KEY (alias_id) REFERENCES contact_alias(id) ON UPDATE CASCADE,
  FOREIGN KEY (person_contact_id) REFERENCES person_contact(id) ON UPDATE CASCADE
);

-- migrate:down
DROP TABLE contact_alias;
DROP TABLE contact_alias_person_contact;
