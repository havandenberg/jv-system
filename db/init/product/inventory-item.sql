CREATE TABLE product.inventory_item (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT,
  location_id TEXT,
  vessel_code TEXT,
  jv_lot_number TEXT,
  shipper_id TEXT,
  pallets_received NUMERIC,
  pallets_committed NUMERIC,
  pallets_on_hand NUMERIC,
  pallets_available NUMERIC,
  pallets_shipped NUMERIC,
  pallets_transferred_in NUMERIC,
  pallets_transferred_out NUMERIC,
  plu BOOLEAN,
  country_id TEXT,
  special_lot_number TEXT,
  coast TEXT,
  storage_rank TEXT,
  warehouse_id TEXT
);

CREATE FUNCTION product.inventory_item_vessel(IN i product.inventory_item)
    RETURNS product.vessel
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = i.vessel_code LIMIT 1
$BODY$;

CREATE FUNCTION product.inventory_item_product(IN i product.inventory_item)
    RETURNS product.product_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_master pm WHERE pm.id = i.product_id
$BODY$;

CREATE FUNCTION product.inventory_item_warehouse(IN i product.inventory_item)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = i.location_id
$BODY$;

CREATE FUNCTION product.inventory_item_shipper(IN i product.inventory_item)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = i.shipper_id
$BODY$;

CREATE FUNCTION product.inventory_item_country(IN i product.inventory_item)
    RETURNS directory.country
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.country c WHERE c.id = i.country_id
$BODY$;

CREATE FUNCTION product.inventory_item_pallets(IN i product.inventory_item)
    RETURNS SETOF product.pallet
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet p
  WHERE p.product_id = i.product_id
  AND p.location_id = i.location_id
  AND p.vessel_code = i.vessel_code
  AND p.jv_lot_number = i.jv_lot_number
  AND p.shipper_id = i.shipper_id
$BODY$;
