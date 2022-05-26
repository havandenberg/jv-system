CREATE TABLE product.shipper_program (
	id BIGSERIAL PRIMARY KEY,
	arrival_port TEXT,
  common_species_id BIGINT
		REFERENCES product.common_species(id)
		ON DELETE SET NULL,
  common_variety_id BIGINT
		REFERENCES product.common_variety(id)
		ON DELETE SET NULL,
  common_size_id BIGINT
		REFERENCES product.common_size(id)
		ON DELETE SET NULL,
  common_pack_type_id BIGINT
		REFERENCES product.common_pack_type(id)
		ON DELETE SET NULL,
  plu TEXT,
	notes TEXT,
  shipper_id TEXT
		REFERENCES directory.shipper(id)
		ON DELETE SET NULL,
  customer_id TEXT
		REFERENCES directory.customer(id)
		ON DELETE SET NULL
);

CREATE TABLE product.shipper_program_entry (
	id BIGSERIAL PRIMARY KEY,
  notes TEXT,
  program_date DATE,
  pallet_count NUMERIC,
	shipper_program_id BIGINT
		REFERENCES product.shipper_program(id)
		ON DELETE CASCADE
);

CREATE TABLE product.customer_program (
	id BIGSERIAL PRIMARY KEY,
	arrival_port TEXT,
  common_species_id BIGINT
		REFERENCES product.common_species(id)
		ON DELETE SET NULL,
  common_variety_id BIGINT
		REFERENCES product.common_variety(id)
		ON DELETE SET NULL,
  common_size_id BIGINT
		REFERENCES product.common_size(id)
		ON DELETE SET NULL,
  common_pack_type_id BIGINT
		REFERENCES product.common_pack_type(id)
		ON DELETE SET NULL,
	notes TEXT,
  plu TEXT,
  customer_id TEXT
		REFERENCES directory.customer(id)
		ON DELETE SET NULL
);

CREATE TABLE product.customer_program_entry (
	id BIGSERIAL PRIMARY KEY,
	is_ad_week BOOLEAN,
	notes TEXT,
	program_date DATE,
	pallet_count NUMERIC,
	customer_program_id BIGINT
		REFERENCES product.customer_program(id)
		ON DELETE CASCADE
);

CREATE TABLE product.shipper_program_entry_customer_program_entry (
	id BIGSERIAL PRIMARY KEY,
	pallet_count NUMERIC,
	customer_program_entry_id BIGINT
		REFERENCES product.customer_program_entry(id)
		ON DELETE CASCADE,
	shipper_program_entry_id BIGINT
		REFERENCES product.shipper_program_entry(id)
		ON DELETE CASCADE
);

CREATE FUNCTION product.bulk_upsert_shipper_program(
  programs product.shipper_program[]
)
RETURNS setof product.shipper_program
AS $$
  DECLARE
    p product.shipper_program;
    vals product.shipper_program;
  BEGIN
    FOREACH p IN ARRAY programs LOOP
      INSERT INTO product.shipper_program(
        id,
				arrival_port,
        common_species_id,
        common_variety_id,
        common_size_id,
        common_pack_type_id,
        notes,
				plu,
        shipper_id,
        customer_id
      )
        VALUES (
          COALESCE(p.id, (select nextval('product.shipper_program_id_seq'))),
					p.arrival_port,
          p.common_species_id,
          p.common_variety_id,
          p.common_size_id,
          p.common_pack_type_id,
          p.notes,
					p.plu,
          p.shipper_id,
          p.customer_id
        )
      ON CONFLICT (id) DO UPDATE SET
				arrival_port=EXCLUDED.arrival_port,
        common_species_id=EXCLUDED.common_species_id,
        common_variety_id=EXCLUDED.common_variety_id,
        common_size_id=EXCLUDED.common_size_id,
        common_pack_type_id=EXCLUDED.common_pack_type_id,
        notes=EXCLUDED.notes,
        plu=EXCLUDED.plu,
        shipper_id=EXCLUDED.shipper_id,
        customer_id=EXCLUDED.customer_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_shipper_program_entry(
  entries product.shipper_program_entry[]
)
RETURNS setof product.shipper_program_entry
AS $$
  DECLARE
    e product.shipper_program_entry;
    vals product.shipper_program_entry;
  BEGIN
    FOREACH e IN ARRAY entries LOOP
      INSERT INTO product.shipper_program_entry(
        id,
				notes,
        program_date,
        pallet_count,
        shipper_program_id
      )
        VALUES (
          COALESCE(e.id, (select nextval('product.shipper_program_entry_id_seq'))),
				  e.notes,
          e.program_date,
          e.pallet_count,
          e.shipper_program_id
        )
      ON CONFLICT (id) DO UPDATE SET
				notes=EXCLUDED.notes,
        program_date=EXCLUDED.program_date,
        pallet_count=EXCLUDED.pallet_count,
        shipper_program_id=EXCLUDED.shipper_program_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_delete_shipper_program(
  ids_to_delete BIGINT[]
)
RETURNS setof BIGINT
AS $$
  DECLARE
    pid BIGINT;
    vals BIGINT;
  BEGIN
    FOREACH pid IN ARRAY ids_to_delete LOOP
      DELETE FROM product.shipper_program
			WHERE id = pid
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_customer_program(
  programs product.customer_program[]
)
RETURNS setof product.customer_program
AS $$
  DECLARE
    p product.customer_program;
    vals product.customer_program;
  BEGIN
    FOREACH p IN ARRAY programs LOOP
      INSERT INTO product.customer_program(
        id,
				arrival_port,
        common_species_id,
        common_variety_id,
        common_size_id,
        common_pack_type_id,
        notes,
				plu,
        customer_id
      )
        VALUES (
          COALESCE(p.id, (select nextval('product.customer_program_id_seq'))),
					p.arrival_port,
          p.common_species_id,
          p.common_variety_id,
          p.common_size_id,
          p.common_pack_type_id,
          p.notes,
					p.plu,
          p.customer_id
        )
      ON CONFLICT (id) DO UPDATE SET
				arrival_port=EXCLUDED.arrival_port,
        common_species_id=EXCLUDED.common_species_id,
        common_variety_id=EXCLUDED.common_variety_id,
        common_size_id=EXCLUDED.common_size_id,
        common_pack_type_id=EXCLUDED.common_pack_type_id,
        notes=EXCLUDED.notes,
        plu=EXCLUDED.plu,
        customer_id=EXCLUDED.customer_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_customer_program_entry(
  entries product.customer_program_entry[]
)
RETURNS setof product.customer_program_entry
AS $$
  DECLARE
    e product.customer_program_entry;
    vals product.customer_program_entry;
  BEGIN
    FOREACH e IN ARRAY entries LOOP
      INSERT INTO product.customer_program_entry(
        id,
        is_ad_week,
				notes,
        program_date,
        pallet_count,
        customer_program_id
      )
        VALUES (
          COALESCE(e.id, (select nextval('product.customer_program_entry_id_seq'))),
				  e.is_ad_week,
				  e.notes,
          e.program_date,
          e.pallet_count,
          e.customer_program_id
        )
      ON CONFLICT (id) DO UPDATE SET
				is_ad_week=EXCLUDED.is_ad_week,
				notes=EXCLUDED.notes,
        program_date=EXCLUDED.program_date,
        pallet_count=EXCLUDED.pallet_count,
        customer_program_id=EXCLUDED.customer_program_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_delete_customer_program(
  ids_to_delete BIGINT[]
)
RETURNS setof BIGINT
AS $$
  DECLARE
    pid BIGINT;
    vals BIGINT;
  BEGIN
    FOREACH pid IN ARRAY ids_to_delete LOOP
      DELETE FROM product.customer_program
			WHERE id = pid
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_shipper_program_entry_customer_program_entry(
  allocations product.shipper_program_entry_customer_program_entry[]
)
RETURNS setof product.shipper_program_entry_customer_program_entry
AS $$
  DECLARE
    a product.shipper_program_entry_customer_program_entry;
    vals product.shipper_program_entry_customer_program_entry;
  BEGIN
    FOREACH a IN ARRAY allocations LOOP
      INSERT INTO product.shipper_program_entry_customer_program_entry(
        id,
        pallet_count,
        customer_program_entry_id,
        shipper_program_entry_id
      )
        VALUES (
          COALESCE(a.id, (select nextval('product.shipper_program_entry_customer_program_entry_id_seq'))),
          a.pallet_count,
          a.customer_program_entry_id,
          a.shipper_program_entry_id
        )
      ON CONFLICT (id) DO UPDATE SET
        pallet_count=EXCLUDED.pallet_count,
        customer_program_entry_id=EXCLUDED.customer_program_entry_id,
        shipper_program_entry_id=EXCLUDED.shipper_program_entry_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_delete_shipper_program_entry_customer_program_entry(
  ids_to_delete BIGINT[]
)
RETURNS setof BIGINT
AS $$
  DECLARE
    aid BIGINT;
    vals BIGINT;
  BEGIN
    FOREACH aid IN ARRAY ids_to_delete LOOP
      DELETE FROM product.shipper_program_entry_customer_program_entry
			WHERE id = aid
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.shipper_program_entry_search_text(IN e product.shipper_program_entry)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT CONCAT (
		e.id,
		CAST(e.program_date AS TEXT),
		e.pallet_count,
		e.notes,
    sh.id,
    sh.shipper_name,
    csp.id,
    csp.species_name,
    cv.id,
    cv.variety_name,
    csi.id,
    csi.size_name,
    cpt.id,
    cpt.pack_type_name,
    sp.id,
    sp.arrival_port,
    sp.plu,
    cu.id,
    cu.customer_name
	) FROM product.shipper_program_entry spe
    LEFT JOIN product.shipper_program sp
      ON spe.shipper_program_id = sp.id
    LEFT JOIN directory.shipper sh
      ON sp.shipper_id = sh.id
    LEFT JOIN directory.customer cu
      ON sp.customer_id = cu.id
    LEFT JOIN product.common_species csp
      ON csp.id = sp.common_species_id
    LEFT JOIN product.common_variety cv
      ON cv.id = sp.common_variety_id
    LEFT JOIN product.common_size csi
      ON csi.id = sp.common_size_id
    LEFT JOIN product.common_pack_type cpt
      ON cpt.id = sp.common_pack_type_id
	WHERE e.id = spe.id
$BODY$;

CREATE FUNCTION product.customer_program_entry_search_text(IN e product.customer_program_entry)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT CONCAT (
		e.id,
		CAST(e.program_date AS TEXT),
		e.pallet_count,
		e.notes,
    cu.id,
    cu.customer_name,
    csp.id,
    csp.species_name,
    cv.id,
    cv.variety_name,
    csi.id,
    csi.size_name,
    cpt.id,
    cpt.pack_type_name,
    cp.id,
    cp.arrival_port,
    cp.plu
	) FROM product.customer_program_entry cpe
    LEFT JOIN product.customer_program cp
      ON cpe.customer_program_id = cp.id
    LEFT JOIN directory.customer cu
      ON cp.customer_id = cu.id
    LEFT JOIN product.common_species csp
      ON csp.id = cp.common_species_id
    LEFT JOIN product.common_variety cv
      ON cv.id = cp.common_variety_id
    LEFT JOIN product.common_size csi
      ON csi.id = cp.common_size_id
    LEFT JOIN product.common_pack_type cpt
      ON cpt.id = cp.common_pack_type_id
	WHERE e.id = cpe.id
$BODY$;
