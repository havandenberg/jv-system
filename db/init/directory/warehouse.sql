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

CREATE FUNCTION directory.warehouse_vendor(IN w directory.warehouse)
    RETURNS directory.vendor
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.vendor v WHERE v.id = w.id
$BODY$;

CREATE FUNCTION directory.warehouse_search_text(IN w directory.warehouse)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		w.id,
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

CREATE FUNCTION directory.warehouse_distinct_values()
  RETURNS SETOF TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT DISTINCT CONCAT(warehouse_name, ' (', id, ')') from directory.warehouse;
$BODY$;

CREATE FUNCTION directory.bulk_upsert_warehouse(
  warehouses directory.warehouse[]
)
RETURNS setof directory.warehouse
AS $$
  DECLARE
    w directory.warehouse;
    vals directory.warehouse;
  BEGIN
    FOREACH w IN ARRAY warehouses LOOP
      INSERT INTO directory.warehouse(
        id,
				warehouse_name,
				address_1,
				address_2,
				address_3,
				city,
				postal_state,
				country_id,
				zip_code,
				phone,
				out_queue,
				state_tax_code,
				county_tax_code,
				city_tax_code,
				misc_tax_code
      )
        VALUES (
          w.id,
		  		w.warehouse_name,
					w.address_1,
					w.address_2,
					w.address_3,
					w.city,
					w.postal_state,
					w.country_id,
					w.zip_code,
					w.phone,
					w.out_queue,
					w.state_tax_code,
					w.county_tax_code,
					w.city_tax_code,
					w.misc_tax_code
        )
      ON CONFLICT (id) DO UPDATE SET
				warehouse_name=EXCLUDED.warehouse_name,
				address_1=EXCLUDED.address_1,
				address_2=EXCLUDED.address_2,
				address_3=EXCLUDED.address_3,
				city=EXCLUDED.city,
				postal_state=EXCLUDED.postal_state,
				country_id=EXCLUDED.country_id,
				zip_code=EXCLUDED.zip_code,
				phone=EXCLUDED.phone,
				out_queue=EXCLUDED.out_queue,
				state_tax_code=EXCLUDED.state_tax_code,
				county_tax_code=EXCLUDED.county_tax_code,
				city_tax_code=EXCLUDED.city_tax_code,
				misc_tax_code=EXCLUDED.misc_tax_code
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION directory.bulk_delete_warehouse(IN ids_to_delete TEXT[])
  RETURNS setof TEXT
AS $$
  DELETE FROM directory.warehouse
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
