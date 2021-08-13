CREATE TABLE directory.user (
	id BIGSERIAL PRIMARY KEY,
	pin TEXT UNIQUE,
	person_contact_id BIGINT
		REFERENCES directory.person_contact(id)
		ON DELETE SET NULL
);