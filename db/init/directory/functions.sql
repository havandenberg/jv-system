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

CREATE FUNCTION directory.person_contact_search_text(IN p directory.person_contact)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
	p.first_name,
	p.last_name,
	p.is_primary,
	p.email,
	p.secondary_email,
	p.home_phone,
	p.cell_phone,
	p.work_phone,
	p.work_extension,
	p.image_src,
	p.is_internal,
	p.roles,
	p.customer_id,
	c.customer_name,
	p.shipper_id,
	s.shipper_name,
	p.warehouse_id,
	w.warehouse_name
	) FROM directory.person_contact pc
	FULL JOIN directory.customer c ON (p.customer_id = c.id)
	FULL JOIN directory.shipper s ON (p.shipper_id = s.id)
	FULL JOIN directory.warehouse w ON (p.warehouse_id = w.id) WHERE p.id = pc.id
$BODY$;

CREATE FUNCTION directory.contact_alias_search_text(IN a directory.contact_alias)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
	a.alias_name,
	a.alias_description,
	a.alias_type
	) FROM directory.contact_alias
$BODY$;

CREATE FUNCTION directory.bulk_add_contacts_to_alias(
  items directory.contact_alias_person_contact[]
)
RETURNS setof directory.contact_alias_person_contact
AS $$
  DECLARE
    c directory.contact_alias_person_contact;
    vals directory.contact_alias_person_contact;
  BEGIN
    FOREACH c IN ARRAY items LOOP
      INSERT INTO directory.contact_alias_person_contact (alias_id, person_contact_id)
			VALUES (c.alias_id, c.person_contact_id)
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION directory.bulk_remove_contact_alias_person_contact(
  items directory.contact_alias_person_contact[]
)
RETURNS setof directory.contact_alias_person_contact
AS $$
  DECLARE
    c directory.contact_alias_person_contact;
    vals directory.contact_alias_person_contact;
  BEGIN
    FOREACH c IN ARRAY items LOOP
      DELETE FROM directory.contact_alias_person_contact
			WHERE alias_id = c.alias_id AND person_contact_id = c.person_contact_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
