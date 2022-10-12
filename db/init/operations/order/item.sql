CREATE TABLE operations.order_item (
  id BIGSERIAL PRIMARY KEY,
  item_status TEXT,
  order_id NUMERIC,
  back_order_id NUMERIC,
  line_id NUMERIC,
  pallet_count NUMERIC,
  unit_sell_price NUMERIC,
  delivery_charge NUMERIC,
  is_bundle BOOLEAN,
  box_count NUMERIC,
  product_id TEXT,
  location_id TEXT,
  vessel_code TEXT,
  jv_lot_number TEXT,
  shipper_id TEXT,
  notes TEXT
);

CREATE INDEX ON operations.order_item (order_id, back_order_id);

CREATE FUNCTION operations.order_item_order(IN o operations.order_item)
    RETURNS operations.order_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.order_master om
  WHERE om.order_id = o.order_id
    AND om.back_order_id = o.back_order_id
  LIMIT 1;
$BODY$;

CREATE FUNCTION operations.order_item_inventory_item(IN o operations.order_item)
    RETURNS product.inventory_item
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.inventory_item i
  WHERE i.product_id = o.product_id
    AND i.location_id = o.location_id
    AND i.vessel_code = o.vessel_code
    AND i.jv_lot_number = o.jv_lot_number
    AND i.shipper_id = o.shipper_id
  LIMIT 1;
$BODY$;

CREATE FUNCTION operations.order_item_vessel(IN o operations.order_item)
    RETURNS product.vessel
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = o.vessel_code LIMIT 1
$BODY$;

CREATE FUNCTION operations.order_item_search_text(IN o operations.order_item)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT CONCAT (
		o.order_id,
		o.back_order_id,
    o.notes
	) FROM operations.order_item oi WHERE oi.id = o.id;
$BODY$;

CREATE FUNCTION operations.bulk_upsert_order_item(
  order_items operations.order_item[]
)
RETURNS setof operations.order_item
AS $$
  DECLARE
    oi operations.order_item;
    vals operations.order_item;
  BEGIN
    FOREACH oi IN ARRAY order_items LOOP
      INSERT INTO operations.order_item(
        id,
        item_status,
        order_id,
        back_order_id,
        line_id,
        pallet_count,
        unit_sell_price,
        delivery_charge,
        is_bundle,
        box_count,
        product_id,
        location_id,
        vessel_code,
        jv_lot_number,
        shipper_id,
        notes
      )
        VALUES (
          COALESCE(oi.id, (select nextval('operations.order_item_id_seq'))),
          oi.item_status,
          oi.order_id,
          oi.back_order_id,
          oi.line_id,
          oi.pallet_count,
          oi.unit_sell_price,
          oi.delivery_charge,
          oi.is_bundle,
          oi.box_count,
          oi.product_id,
          oi.location_id,
          oi.vessel_code,
          oi.jv_lot_number,
          oi.shipper_id,
          oi.notes
        )
      ON CONFLICT (id) DO UPDATE SET
			  item_status=EXCLUDED.item_status,
			  order_id=EXCLUDED.order_id,
			  back_order_id=EXCLUDED.back_order_id,
			  line_id=EXCLUDED.line_id,
			  pallet_count=EXCLUDED.pallet_count,
			  unit_sell_price=EXCLUDED.unit_sell_price,
			  delivery_charge=EXCLUDED.delivery_charge,
			  is_bundle=EXCLUDED.is_bundle,
			  box_count=EXCLUDED.box_count,
			  product_id=EXCLUDED.product_id,
			  location_id=EXCLUDED.location_id,
			  vessel_code=EXCLUDED.vessel_code,
			  jv_lot_number=EXCLUDED.jv_lot_number,
			  shipper_id=EXCLUDED.shipper_id,
			  notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION operations.bulk_delete_order_item(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM operations.order_item
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
