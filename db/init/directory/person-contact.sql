CREATE TABLE directory.person_contact (
	id BIGSERIAL PRIMARY KEY,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	is_primary BOOLEAN NOT NULL,
	email TEXT,
	secondary_email TEXT,
	home_phone TEXT,
	cell_phone TEXT,
	work_phone TEXT,
	work_extension TEXT,
	image_src TEXT,
	is_internal BOOLEAN NOT NULL,
	roles TEXT
);

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
	p.email,
	p.secondary_email,
	p.home_phone,
	p.cell_phone,
	p.work_phone,
	p.work_extension,
	p.image_src,
	p.roles,
	array_to_string(array_agg(c.customer_name), ''),
	array_to_string(array_agg(s.shipper_name), ''),
	array_to_string(array_agg(w.warehouse_name), ''),
	array_to_string(array_agg(c.id), ''),
	array_to_string(array_agg(s.id), ''),
	array_to_string(array_agg(w.id), '')
	) FROM directory.person_contact pc
	LEFT JOIN directory.customer_person_contact AS cpc
        ON pc.id = cpc.person_contact_id
    LEFT JOIN directory.customer AS c
        ON cpc.customer_id = c.id
    LEFT JOIN directory.shipper_person_contact AS spc
        ON pc.id = spc.person_contact_id
    LEFT JOIN directory.shipper AS s
        ON spc.shipper_id = s.id
    LEFT JOIN directory.warehouse_person_contact AS wpc
        ON pc.id = wpc.person_contact_id
    LEFT JOIN directory.warehouse AS w
        ON wpc.warehouse_id = w.id
	WHERE p.id = pc.id
$BODY$;

CREATE FUNCTION directory.person_contact_user(IN p directory.person_contact)
    RETURNS public.user
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT * FROM public.user u WHERE u.person_contact_id = p.id
$BODY$;
