CREATE TABLE directory.contact_group (
	id BIGSERIAL PRIMARY KEY,
	group_description TEXT NOT NULL,
	group_name TEXT NOT NULL,
  user_id BIGINT
		REFERENCES directory.user(id)
		ON DELETE SET NULL
);

CREATE TABLE directory.contact_group_person_contact (
  group_id BIGINT NOT NULL,
  person_contact_id BIGINT NOT NULL,
  PRIMARY KEY (group_id, person_contact_id),
  FOREIGN KEY (group_id) REFERENCES directory.contact_group(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (person_contact_id) REFERENCES directory.person_contact(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE FUNCTION directory.contact_group_search_text(IN a directory.contact_group)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
	a.group_name,
	a.group_description
	) FROM directory.contact_group
$BODY$;

CREATE FUNCTION directory.bulk_add_contacts_to_group(
  items directory.contact_group_person_contact[]
)
RETURNS setof directory.contact_group_person_contact
AS $$
  DECLARE
    c directory.contact_group_person_contact;
    vals directory.contact_group_person_contact;
  BEGIN
    FOREACH c IN ARRAY items LOOP
      INSERT INTO directory.contact_group_person_contact (group_id, person_contact_id)
			VALUES (c.group_id, c.person_contact_id)
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION directory.bulk_remove_contact_group_person_contact(
  items directory.contact_group_person_contact[]
)
RETURNS setof directory.contact_group_person_contact
AS $$
  DECLARE
    c directory.contact_group_person_contact;
    vals directory.contact_group_person_contact;
  BEGIN
    FOREACH c IN ARRAY items LOOP
      DELETE FROM directory.contact_group_person_contact
			WHERE group_id = c.group_id AND person_contact_id = c.person_contact_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
