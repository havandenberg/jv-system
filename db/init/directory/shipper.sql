CREATE TABLE directory.shipper (
	id TEXT PRIMARY KEY,
	shipper_name TEXT NOT NULL,
	country_id TEXT
		REFERENCES directory.country(id)
		ON DELETE SET NULL,
	group_id TEXT,
	logo_src TEXT,
	notes TEXT,
	website TEXT,
	send_projection_request BOOLEAN,
	projection_request_start_date DATE,
	projection_request_end_date DATE,
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

CREATE FUNCTION directory.shipper_distinct_values()
  RETURNS SETOF TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT DISTINCT CONCAT(shipper_name, ' (', id, ')') from directory.shipper;
$BODY$;

CREATE FUNCTION directory.bulk_upsert_shipper(
  shippers directory.shipper[]
)
RETURNS setof directory.shipper
AS $$
  DECLARE
    s directory.shipper;
    vals directory.shipper;
  BEGIN
    FOREACH s IN ARRAY shippers LOOP
      INSERT INTO directory.shipper(
        id,
				shipper_name,
        country_id,
        group_id
      )
        VALUES (
          s.id,
					s.shipper_name,
          s.country_id,
          s.group_id
        )
      ON CONFLICT (id) DO UPDATE SET
				shipper_name=EXCLUDED.shipper_name,
        country_id=EXCLUDED.country_id,
        group_id=EXCLUDED.group_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION directory.bulk_delete_shipper(IN ids_to_delete TEXT[])
  RETURNS setof TEXT
AS $$
  DELETE FROM directory.shipper
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
