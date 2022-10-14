CREATE TABLE directory.vendor (
	id TEXT PRIMARY KEY,
	vendor_name TEXT NOT NULL,
	address_1 TEXT,
	address_2 TEXT,
	city TEXT,
	postal_state TEXT,
	zip_code TEXT,
	country_id TEXT,
	phone TEXT,
	attention TEXT,
	vendor_type TEXT,
	ledger_code TEXT,
	bank_code TEXT,
  has_1099 BOOLEAN,
  id_1099 TEXT,
  is_temp BOOLEAN,
	notes TEXT
);

CREATE FUNCTION directory.vendor_country(IN v directory.vendor)
    RETURNS directory.country
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.country c WHERE c.id = v.country_id OR c.cmb_id = v.country_id
$BODY$;

CREATE FUNCTION directory.vendor_shipper(IN v directory.vendor)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = v.id
$BODY$;

CREATE FUNCTION directory.vendor_customer(IN v directory.vendor)
    RETURNS directory.customer
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.customer c WHERE c.id = v.id
$BODY$;

CREATE FUNCTION directory.vendor_warehouse(IN v directory.vendor)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = v.id
$BODY$;

CREATE TABLE directory.vendor_person_contact (
  vendor_id TEXT NOT NULL,
  person_contact_id BIGINT NOT NULL,
  PRIMARY KEY (vendor_id, person_contact_id),
  FOREIGN KEY (vendor_id) REFERENCES directory.vendor(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (person_contact_id) REFERENCES directory.person_contact(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE FUNCTION directory.vendor_search_text(IN v directory.vendor)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		v.id,
		v.vendor_name,
    v.address_1,
    v.address_2,
    v.city,
    v.postal_state,
    v.zip_code,
    v.country_id,
    v.phone,
    v.attention,
    v.vendor_type,
    v.ledger_code,
    v.bank_code,
    v.has_1099,
    v.id_1099,
    v.is_temp,
    v.notes
	) FROM directory.vendor vv WHERE v.id = vv.id
$BODY$;

CREATE FUNCTION directory.vendor_distinct_values(IN vendor_type_param TEXT)
  RETURNS SETOF TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT DISTINCT CONCAT(vendor_name, ' (', id, ')') FROM directory.vendor v
    WHERE vendor_type_param = v.vendor_type;
$BODY$;

CREATE FUNCTION directory.bulk_upsert_vendor(
  vendors directory.vendor[]
)
RETURNS setof directory.vendor
AS $$
  DECLARE
    v directory.vendor;
    vals directory.vendor;
  BEGIN
    FOREACH v IN ARRAY vendors LOOP
      INSERT INTO directory.vendor(
        id,
		    vendor_name,
        address_1,
        address_2,
        city,
        postal_state,
        zip_code,
        country_id,
        phone,
        attention,
        vendor_type,
        ledger_code,
        bank_code,
        has_1099,
        id_1099,
        is_temp,
        notes
      )
        VALUES (
          v.id,
          v.vendor_name,
          v.address_1,
          v.address_2,
          v.city,
          v.postal_state,
          v.zip_code,
          v.country_id,
          v.phone,
          v.attention,
          v.vendor_type,
          v.ledger_code,
          v.bank_code,
          v.has_1099,
          v.id_1099,
          v.is_temp,
          v.notes
        )
      ON CONFLICT (id) DO UPDATE SET
				vendor_name=EXCLUDED.vendor_name,
        address_1=EXCLUDED.address_1,
        address_2=EXCLUDED.address_2,
        city=EXCLUDED.city,
        postal_state=EXCLUDED.postal_state,
        zip_code=EXCLUDED.zip_code,
        country_id=EXCLUDED.country_id,
        phone=EXCLUDED.phone,
        attention=EXCLUDED.attention,
        vendor_type=EXCLUDED.vendor_type,
        ledger_code=EXCLUDED.ledger_code,
        bank_code=EXCLUDED.bank_code,
        has_1099=EXCLUDED.has_1099,
        id_1099=EXCLUDED.id_1099,
        is_temp=EXCLUDED.is_temp,
        notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION directory.bulk_delete_vendor(IN ids_to_delete TEXT[])
  RETURNS setof TEXT
AS $$
  DELETE FROM directory.vendor
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
