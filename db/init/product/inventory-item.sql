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
  warehouse_id TEXT,
  is_pre BOOLEAN
);

CREATE INDEX ON product.inventory_item (product_id, location_id, vessel_code, jv_lot_number, shipper_id, is_pre);

CREATE FUNCTION product.inventory_item_vessel(IN i product.inventory_item)
    RETURNS product.vessel
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = i.vessel_code AND v.is_pre = i.is_pre ORDER BY v.discharge_date DESC LIMIT 1
$BODY$;

CREATE FUNCTION product.inventory_item_vessel_inv_flag(IN i product.inventory_item)
    RETURNS BOOLEAN
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT inv_flag FROM product.vessel v WHERE v.vessel_code = i.vessel_code AND v.is_pre = i.is_pre ORDER BY v.discharge_date DESC
$BODY$;

CREATE FUNCTION product.inventory_item_vessel_discharge_date(IN i product.inventory_item)
    RETURNS DATE
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT discharge_date FROM product.vessel v WHERE v.vessel_code = i.vessel_code AND v.is_pre = i.is_pre ORDER BY v.discharge_date DESC
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

CREATE FUNCTION product.inventory_item_sizes(IN a product.inventory_item)
    RETURNS SETOF product.product_size
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  (SELECT * FROM product.product_size b
    WHERE b.jv_code = SUBSTRING(a.product_id, 5, 3)
    AND (b.species_id = SUBSTRING(a.product_id, 1, 2)
      AND b.variety_id = SUBSTRING(a.product_id, 1, 4)
      AND b.shipper_id = a.shipper_id
    )) UNION
  (SELECT * FROM product.product_size b
    WHERE b.jv_code = SUBSTRING(a.product_id, 5, 3)
    AND (b.species_id = SUBSTRING(a.product_id, 1, 2)
      AND b.variety_id = ''
      AND b.shipper_id = a.shipper_id
    )) UNION
  (SELECT * FROM product.product_size b
    WHERE b.jv_code = SUBSTRING(a.product_id, 5, 3)
    AND (b.species_id = SUBSTRING(a.product_id, 1, 2)
      AND b.variety_id = ''
      AND b.shipper_id = ''
    )) UNION
  (SELECT * FROM product.product_size b
    WHERE b.jv_code = SUBSTRING(a.product_id, 5, 3)
    AND (b.species_id = ''
      AND b.variety_id = ''
      AND b.shipper_id = ''
    ))
  ORDER BY jv_code, shipper_id, species_id, variety_id;
$BODY$;

CREATE FUNCTION product.inventory_item_pack_type(IN a product.inventory_item)
    RETURNS product.pack_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_master b
    WHERE b.jv_pack_code = SUBSTRING(a.product_id, 8, 4)
    AND b.shipper_id = a.shipper_id;
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
  SELECT * FROM directory.country c WHERE c.id = i.country_id OR c.cmb_id = i.country_id
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

CREATE FUNCTION product.bulk_upsert_inventory_item(
  inventory_items product.inventory_item[]
)
RETURNS setof product.inventory_item
AS $$
  DECLARE
    i product.inventory_item;
    vals product.inventory_item;
  BEGIN
    FOREACH i IN ARRAY inventory_items LOOP
      INSERT INTO product.inventory_item(
        id,
        product_id,
        location_id,
        vessel_code,
        jv_lot_number,
        shipper_id,
        pallets_received,
        pallets_committed,
        pallets_on_hand,
        pallets_available,
        pallets_shipped,
        pallets_transferred_in,
        pallets_transferred_out,
        plu,
        country_id,
        special_lot_number,
        coast,
        storage_rank,
        warehouse_id,
        is_pre
      )
        VALUES (
          COALESCE(i.id, (select nextval('product.inventory_item_id_seq'))),
					i.product_id,
					i.location_id,
					i.vessel_code,
					i.jv_lot_number,
					i.shipper_id,
					i.pallets_received,
					i.pallets_committed,
					i.pallets_on_hand,
					i.pallets_available,
					i.pallets_shipped,
					i.pallets_transferred_in,
					i.pallets_transferred_out,
					i.plu,
					i.country_id,
					i.special_lot_number,
					i.coast,
          i.storage_rank,
					i.warehouse_id,
          i.is_pre
        )
      ON CONFLICT (id) DO UPDATE SET
			  product_id=EXCLUDED.product_id,
			  location_id=EXCLUDED.location_id,
			  vessel_code=EXCLUDED.vessel_code,
			  jv_lot_number=EXCLUDED.jv_lot_number,
			  shipper_id=EXCLUDED.shipper_id,
			  pallets_received=EXCLUDED.pallets_received,
			  pallets_committed=EXCLUDED.pallets_committed,
			  pallets_on_hand=EXCLUDED.pallets_on_hand,
			  pallets_available=EXCLUDED.pallets_available,
			  pallets_shipped=EXCLUDED.pallets_shipped,
			  pallets_transferred_in=EXCLUDED.pallets_transferred_in,
			  pallets_transferred_out=EXCLUDED.pallets_transferred_out,
			  plu=EXCLUDED.plu,
			  country_id=EXCLUDED.country_id,
			  special_lot_number=EXCLUDED.special_lot_number,
			  coast=EXCLUDED.coast,
			  storage_rank=EXCLUDED.storage_rank,
			  warehouse_id=EXCLUDED.warehouse_id,
        is_pre=EXCLUDED.is_pre
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_delete_inventory_item(IN ids_to_delete BIGINT[])
  RETURNS setof BIGINT
AS $$
  DELETE FROM product.inventory_item
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
