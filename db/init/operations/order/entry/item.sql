CREATE TABLE operations.order_entry_item (
  id BIGSERIAL PRIMARY KEY,
  order_entry_id BIGINT NOT NULL REFERENCES operations.order_entry(id) ON DELETE CASCADE,
  line_id NUMERIC,
  pallet_count NUMERIC,
  unit_sell_price NUMERIC,
  delivery_charge NUMERIC,
  location_id TEXT,
  vessel_code TEXT,
  shipper_id TEXT,
  species TEXT,
  variety TEXT,
  size TEXT,
  pack_type TEXT,
  plu TEXT,
  country_of_origin TEXT,
  label TEXT,
  box_count NUMERIC,
  pallet_weight NUMERIC,
  notes TEXT
);

CREATE FUNCTION operations.order_entry_item_vessel(IN o operations.order_entry_item)
	RETURNS product.vessel
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = o.vessel_code LIMIT 1;
$BODY$;

CREATE FUNCTION operations.order_entry_item_warehouse(IN o operations.order_entry_item)
	RETURNS directory.warehouse
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = o.location_id;
$BODY$;

CREATE FUNCTION operations.order_entry_item_shipper(IN o operations.order_entry_item)
	RETURNS directory.shipper
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = o.shipper_id;
$BODY$;

CREATE FUNCTION operations.order_entry_item_search_text(IN o operations.order_entry_item)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT CONCAT (
		o.species,
		o.variety,
		o.size,
		o.pack_type,
		o.plu,
    o.notes
	) FROM operations.order_entry_item oi WHERE oi.id = o.order_entry_id;
$BODY$;
