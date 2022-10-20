CREATE TABLE public.user (
	id BIGSERIAL PRIMARY KEY,
	default_coast TEXT,
	pin TEXT UNIQUE,
	person_contact_id BIGINT
		REFERENCES directory.person_contact(id)
		ON DELETE SET NULL,
	user_code TEXT
);
