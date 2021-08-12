CREATE TABLE product.pallet_temp_one (
  id BIGSERIAL PRIMARY KEY,
  vessel_code TEXT NOT NULL,
  pallet_id TEXT NOT NULL,
  product_id TEXT,
  current_box_quantity NUMERIC,
  received_box_quantity NUMERIC,
  returned_box_quantity NUMERIC,
  location_id TEXT,
  room TEXT,
  section TEXT,
  row TEXT,
  jv_lot_number TEXT,
  shipper_id TEXT,
  date_transferred_to_storage DATE,
  order_id TEXT,
  back_order_id TEXT,
  shipped BOOLEAN,
  age NUMERIC,
  volume_discount_code TEXT,
  original_location_id TEXT
);

CREATE TABLE product.pallet_temp_two (
  id BIGSERIAL PRIMARY KEY,
  filler TEXT,
  pallet_id TEXT NOT NULL,
  grower_id TEXT,
  old_pack_code TEXT,
  pack_date TEXT,
  hatch TEXT,
  deck TEXT,
  bill_of_lading TEXT,
  container_id TEXT,
  temperature_recording TEXT
);

CREATE TABLE AS product.pallet (
  SELECT * FROM product.pallet_temp_one pone LEFT JOIN product.pallet_temp_two ptwo ON pone.pallet_id = ptwo.pallet_id
);

CREATE TABLE product.pallet_section (
  id BIGSERIAL PRIMARY KEY,
  pallet_id TEXT NOT NULL,
  grower_id TEXT,
  variety_id TEXT,
  size_id TEXT,
  box_quantity NUMERIC,
  pack_date TEXT
);

CREATE FUNCTION product.pallet(IN palletId BIGINT)
    RETURNS product.pallet
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet p WHERE p.id = palletId
$BODY$;

CREATE FUNCTION product.pallet_pallet_sections(IN p product.pallet)
    RETURNS SETOF product.pallet_section
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet_section ps WHERE ps.pallet_id = p.pallet_id
$BODY$;

CREATE FUNCTION product.pallet_vessel(IN p product.pallet)
    RETURNS product.vessel
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = p.vessel_code LIMIT 1
$BODY$;

CREATE FUNCTION product.pallet_product(IN p product.pallet)
    RETURNS product.product_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_master pm WHERE pm.id = p.product_id
$BODY$;

CREATE FUNCTION product.pallet_warehouse(IN p product.pallet)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = p.location_id
$BODY$;

CREATE FUNCTION product.pallet_shipper(IN p product.pallet)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pallet_original_location(IN p product.pallet)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = p.original_location_id
$BODY$;

CREATE FUNCTION product.pallet_search_text(IN p product.pallet)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
	p.pallet_id,
	p.product_id,
	p.room,
	p.section,
	p.row,
	p.jv_lot_number,
	p.order_id,
	p.back_order_id,
	p.volume_discount_code,
	p.filler,
	p.grower_id,
	p.old_pack_code,
	p.hatch,
	p.deck,
	p.bill_of_lading,
	p.container_id,
	p.temperature_recording
	) FROM product.pallet;
$BODY$;

CREATE FUNCTION product.pallet_section_variety(IN p product.pallet_section)
    RETURNS product.product_variety
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_variety v WHERE v.id = p.variety_id
$BODY$;

CREATE FUNCTION product.pallet_psa_arrival_report(IN p product.pallet)
    RETURNS inspection.psa_arrival_report
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM inspection.psa_arrival_report par
  WHERE p.arrival_code = par.arrival_code
    AND ap.exporter_name = par.exporter_name
$BODY$;
