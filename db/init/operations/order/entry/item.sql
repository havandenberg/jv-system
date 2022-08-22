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
  label TEXT,
  notes TEXT
);

CREATE FUNCTION operations.order_entry_item_order_entry(IN o operations.order_entry_item)
    RETURNS operations.order_entry
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.order_entry oe
    WHERE oe.id = o.order_entry_id;
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

CREATE FUNCTION operations.bulk_upsert_order_entry_item(
  order_entry_items operations.order_entry_item[]
)
RETURNS setof operations.order_entry_item
AS $$
  DECLARE
    oi operations.order_entry_item;
    vals operations.order_entry_item;
  BEGIN
    FOREACH oi IN ARRAY order_entry_items LOOP
      INSERT INTO operations.order_entry_item(
        id,
        order_entry_id,
        line_id,
        pallet_count,
        unit_sell_price,
        delivery_charge,
        location_id,
        vessel_code,
        shipper_id,
        species,
        variety,
        size,
        pack_type,
        plu,
        label,
        notes
      )
        VALUES (
          COALESCE(oi.id, (select nextval('operations.order_entry_item_id_seq'))),
          oi.order_entry_id,
          oi.line_id,
          oi.pallet_count,
          oi.unit_sell_price,
          oi.delivery_charge,
          oi.location_id,
          oi.vessel_code,
          oi.shipper_id,
          oi.species,
          oi.variety,
          oi.size,
          oi.pack_type,
          oi.plu,
          oi.label,
          oi.notes
        )
      ON CONFLICT (id) DO UPDATE SET
			  order_entry_id=EXCLUDED.order_entry_id,
			  line_id=EXCLUDED.line_id,
			  pallet_count=EXCLUDED.pallet_count,
			  unit_sell_price=EXCLUDED.unit_sell_price,
			  pallet_count=EXCLUDED.pallet_count,
			  delivery_charge=EXCLUDED.delivery_charge,
			  location_id=EXCLUDED.location_id,
			  vessel_code=EXCLUDED.vessel_code,
			  shipper_id=EXCLUDED.shipper_id,
			  species=EXCLUDED.species,
			  variety=EXCLUDED.variety,
			  size=EXCLUDED.size,
			  pack_type=EXCLUDED.pack_type,
			  plu=EXCLUDED.plu,
			  label=EXCLUDED.label,
			  notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
