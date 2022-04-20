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
  shipper_id TEXT
		REFERENCES directory.shipper(id)
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
  plu TEXT,
  customer_id TEXT
		REFERENCES directory.customer(id)
		ON DELETE SET NULL
);

CREATE TABLE product.customer_program_entry (
	id BIGSERIAL PRIMARY KEY,
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
				plu,
        shipper_id
      )
        VALUES (
          COALESCE(p.id, (select nextval('product.shipper_program_id_seq'))),
					p.arrival_port,
          p.common_species_id,
          p.common_variety_id,
          p.common_size_id,
          p.common_pack_type_id,
					p.plu,
          p.shipper_id
        )
      ON CONFLICT (id) DO UPDATE SET
				arrival_port=EXCLUDED.arrival_port,
        common_species_id=EXCLUDED.common_species_id,
        common_variety_id=EXCLUDED.common_variety_id,
        common_size_id=EXCLUDED.common_size_id,
        common_pack_type_id=EXCLUDED.common_pack_type_id,
        plu=EXCLUDED.plu,
        shipper_id=EXCLUDED.shipper_id
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
					p.plu,
          p.customer_id
        )
      ON CONFLICT (id) DO UPDATE SET
				arrival_port=EXCLUDED.arrival_port,
        common_species_id=EXCLUDED.common_species_id,
        common_variety_id=EXCLUDED.common_variety_id,
        common_size_id=EXCLUDED.common_size_id,
        common_pack_type_id=EXCLUDED.common_pack_type_id,
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
				notes,
        program_date,
        pallet_count,
        customer_program_id
      )
        VALUES (
          COALESCE(e.id, (select nextval('product.customer_program_entry_id_seq'))),
				  e.notes,
          e.program_date,
          e.pallet_count,
          e.customer_program_id
        )
      ON CONFLICT (id) DO UPDATE SET
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
