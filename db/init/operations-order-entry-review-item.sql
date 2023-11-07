CREATE TABLE operations.order_entry_review_item (
  id BIGSERIAL PRIMARY KEY,
  order_entry_item_id BIGINT NOT NULL REFERENCES operations.order_entry_item(id) ON DELETE CASCADE,
  location_id TEXT,
  vessel_code TEXT,
  shipper_id TEXT,
  species TEXT,
  variety TEXT,
  size TEXT,
  pack_type TEXT,
  plu TEXT,
  country_of_origin TEXT,
  pallet_count NUMERIC,
  box_count NUMERIC,
  pallet_weight NUMERIC,
  label TEXT
);

CREATE FUNCTION operations.order_entry_review_item_vessel(IN o operations.order_entry_review_item)
	RETURNS product.vessel
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = o.vessel_code LIMIT 1;
$BODY$;

CREATE FUNCTION operations.order_entry_review_item_warehouse(IN o operations.order_entry_review_item)
	RETURNS directory.warehouse
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = o.location_id;
$BODY$;

CREATE FUNCTION operations.order_entry_review_item_shipper(IN o operations.order_entry_review_item)
	RETURNS directory.shipper
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = o.shipper_id;
$BODY$;
