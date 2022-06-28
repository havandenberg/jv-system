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

CREATE TABLE directory.customer_person_contact (
  customer_id TEXT NOT NULL,
  person_contact_id BIGINT NOT NULL,
  PRIMARY KEY (customer_id, person_contact_id),
  FOREIGN KEY (customer_id) REFERENCES directory.customer(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (person_contact_id) REFERENCES directory.person_contact(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE FUNCTION directory.customer_search_text(IN cu directory.customer)
    RETURNS text
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		cu.id,
		cu.customer_name,
		cu.phone,
		cu.address_1,
		cu.address_2,
		cu.city,
		cu.postal_state,
		cu.zip_code,
		cu.country_id,
		c.country_name,
		cu.notes,
		cu.website
	) FROM directory.customer ccu FULL JOIN directory.country c ON (cu.country_id = c.id) WHERE cu.id = ccu.id
$BODY$;

CREATE FUNCTION directory.customer_distinct_values(column_name text, condition_name text, condition_value text) RETURNS SETOF text AS $$
	BEGIN
		RETURN QUERY EXECUTE format('select distinct %I from directory.customer where %I = %s', column_name, condition_name, condition_value);
	END;
$$ LANGUAGE plpgsql STABLE;

CREATE FUNCTION directory.bulk_upsert_customer(
  customers directory.customer[]
)
RETURNS setof directory.customer
AS $$
  DECLARE
    cu directory.customer;
    vals directory.customer;
  BEGIN
    FOREACH cu IN ARRAY customers LOOP
      INSERT INTO directory.customer(
        id,
				customer_name,
				address_1,
				address_2,
				city,
				postal_state,
				zip_code,
				country_id,
				phone,
				active
      )
        VALUES (
          cu.id,
					cu.customer_name,
					cu.address_1,
					cu.address_2,
					cu.city,
					cu.postal_state,
					cu.zip_code,
					cu.country_id,
					cu.phone,
					cu.active
        )
      ON CONFLICT (id) DO UPDATE SET
				customer_name=EXCLUDED.customer_name,
        address_1=EXCLUDED.address_1,
        address_2=EXCLUDED.address_2,
        city=EXCLUDED.city,
        postal_state=EXCLUDED.postal_state,
        zip_code=EXCLUDED.zip_code,
        country_id=EXCLUDED.country_id,
        phone=EXCLUDED.phone,
				active=EXCLUDED.active
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION directory.bulk_delete_customer(IN ids_to_delete TEXT[])
  RETURNS setof TEXT
AS $$
  DELETE FROM directory.customer
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
