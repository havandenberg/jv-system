CREATE TABLE accounting.invoice_item (
  id BIGSERIAL PRIMARY KEY,
  pallet_status TEXT,
  order_id NUMERIC,
  back_order_id NUMERIC,
  line_id NUMERIC,
  sequence_id NUMERIC,
  picked_qty NUMERIC,
  pallet_id TEXT,
  condition_code TEXT,
  repack_id TEXT,
  credit_code TEXT,
  unit_sell_price NUMERIC,
  price_adjustment NUMERIC,
  delivery_charge NUMERIC,
  freight_adjustment NUMERIC,
  credit_amount NUMERIC,
  brokerage_amount NUMERIC,
  layer_mult BOOLEAN,
  alert_status BOOLEAN,
  return_status BOOLEAN,
  rejection_status BOOLEAN,
  notes TEXT
);

CREATE INDEX ON accounting.invoice_item (order_id, back_order_id);

CREATE FUNCTION accounting.invoice_item_pallet(IN i accounting.invoice_item)
    RETURNS product.pallet
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet p
    WHERE p.pallet_id = i.pallet_id
    LIMIT 1;
$BODY$;

CREATE FUNCTION accounting.bulk_upsert_invoice_item(
  invoice_items accounting.invoice_item[]
)
RETURNS setof accounting.invoice_item
AS $$
  DECLARE
    ii accounting.invoice_item;
    vals accounting.invoice_item;
  BEGIN
    FOREACH ii IN ARRAY invoice_items LOOP
      INSERT INTO accounting.invoice_item(
        id,
        pallet_status,
        order_id,
        back_order_id,
        line_id,
        sequence_id,
        picked_qty,
        pallet_id,
        condition_code,
        repack_id,
        credit_code,
        unit_sell_price,
        price_adjustment,
        delivery_charge,
        freight_adjustment,
        credit_amount,
        brokerage_amount,
        layer_mult,
        alert_status,
        return_status,
        rejection_status,
        notes
      )
        VALUES (
          COALESCE(ii.id, (select nextval('accounting.invoice_item_id_seq'))),
          ii.pallet_status,
          ii.order_id,
          ii.back_order_id,
          ii.line_id,
          ii.sequence_id,
          ii.picked_qty,
          ii.pallet_id,
          ii.condition_code,
          ii.repack_id,
          ii.credit_code,
          ii.unit_sell_price,
          ii.price_adjustment,
          ii.delivery_charge,
          ii.freight_adjustment,
          ii.credit_amount,
          ii.brokerage_amount,
          ii.layer_mult,
          ii.alert_status,
          ii.return_status,
          ii.rejection_status,
          ii.notes
        )
      ON CONFLICT (id) DO UPDATE SET
        pallet_status=EXCLUDED.pallet_status,
        order_id=EXCLUDED.order_id,
        back_order_id=EXCLUDED.back_order_id,
        line_id=EXCLUDED.line_id,
        sequence_id=EXCLUDED.sequence_id,
        picked_qty=EXCLUDED.picked_qty,
        pallet_id=EXCLUDED.pallet_id,
        condition_code=EXCLUDED.condition_code,
        repack_id=EXCLUDED.repack_id,
        credit_code=EXCLUDED.credit_code,
        unit_sell_price=EXCLUDED.unit_sell_price,
        price_adjustment=EXCLUDED.price_adjustment,
        delivery_charge=EXCLUDED.delivery_charge,
        freight_adjustment=EXCLUDED.freight_adjustment,
        credit_amount=EXCLUDED.credit_amount,
        brokerage_amount=EXCLUDED.brokerage_amount,
        layer_mult=EXCLUDED.layer_mult,
        alert_status=EXCLUDED.alert_status,
        return_status=EXCLUDED.return_status,
        rejection_status=EXCLUDED.rejection_status,
        notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION accounting.bulk_delete_invoice_item(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM accounting.invoice_item
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
