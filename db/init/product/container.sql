CREATE TABLE product.container (
  id BIGSERIAL PRIMARY KEY,
  vessel_code TEXT NOT NULL,
  container_id TEXT,
  vendor_id TEXT,
  warehouse_id TEXT,
  container_description TEXT,
  release_date DATE,
  release_confirmed BOOLEAN,
  discharge_date DATE,
  discharge_confirmed BOOLEAN,
  sent_confirmed BOOLEAN,
  is_available BOOLEAN,
  is_new BOOLEAN,
  is_schedule BOOLEAN,
  notes1 TEXT,
  notes2 TEXT,
  notes3 TEXT
);

CREATE INDEX ON product.container (vessel_code, container_id);

CREATE TABLE product.container_treatment (
  id BIGSERIAL PRIMARY KEY,
  container_id BIGINT NOT NULL REFERENCES product.container(id) ON DELETE CASCADE,
  treatment_date DATE,
  treatment_confirmed BOOLEAN,
  treatment_result TEXT,
  treatment_type TEXT NOT NULL,
  treatment_notes TEXT
);

CREATE INDEX ON product.container_treatment (container_id);

CREATE FUNCTION product.container_warehouse(IN c product.container)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = c.warehouse_id;
$BODY$;

CREATE FUNCTION product.container_vendor(IN c product.container)
    RETURNS directory.vendor
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.vendor v WHERE v.id = c.vendor_id;
$BODY$;

CREATE FUNCTION product.container_vessel(IN c product.container)
    RETURNS product.vessel
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = c.vessel_code AND v.is_pre = false
    ORDER BY v.departure_date DESC LIMIT 1;
$BODY$;

CREATE FUNCTION product.container_pallets(IN c product.container)
    RETURNS SETOF product.pallet
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet p WHERE p.container_id = c.container_id AND p.vessel_code = c.vessel_code;
$BODY$;

CREATE FUNCTION product.container_is_vessel_available(IN c product.container)
    RETURNS BOOLEAN
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT is_available FROM product.container_vessel(c);
$BODY$;

CREATE FUNCTION product.container_search_text(IN c product.container)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		c.container_id,
		c.notes1,
		c.notes2,
		c.notes3
	) FROM product.container c;
$BODY$;

CREATE FUNCTION product.generate_new_containers()
  RETURNS setof product.container
AS $$
  DECLARE
    c RECORD;
    vals product.container;
  BEGIN
    FOR c IN
      SELECT DISTINCT p.container_id, p.vessel_code, v.discharge_date, array_to_string(array_agg(DISTINCT s.species_description), ', ') as species_description, array_to_string(array_agg(DISTINCT var.variety_description), ', ') as variety_description FROM product.pallet p
        JOIN product.vessel v ON v.vessel_code = p.vessel_code AND v.is_pre = false
        JOIN product.product_species s ON s.id = SUBSTRING(p.product_id, 1, 2)
        JOIN product.product_variety var ON var.id = SUBSTRING(p.product_id, 1, 4)
      WHERE container_id NOT IN (SELECT DISTINCT container_id FROM product.container)
        AND container_id != ''
        AND p.vessel_code != 'CCC'
      GROUP BY p.container_id, p.vessel_code, v.discharge_date
    LOOP
      INSERT INTO product.container(
        id,
        vessel_code,
        container_id,
        vendor_id,
        warehouse_id,
        container_description,
        release_date,
        release_confirmed,
        discharge_date,
        discharge_confirmed,
        sent_confirmed,
        is_available,
        is_new,
        is_schedule,
        notes1,
        notes2,
        notes3
      )
        VALUES (
          (select nextval('product.container_id_seq')),
          c.vessel_code,
          c.container_id,
          null,
          null,
          CASE WHEN c.species_description = 'Grapes' THEN c.variety_description ELSE c.species_description END,
          null,
          false,
          c.discharge_date,
          false,
          false,
          false,
          true,
          true,
          null,
          null,
          null
        )
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
