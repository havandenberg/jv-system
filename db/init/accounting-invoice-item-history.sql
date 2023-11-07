CREATE TABLE accounting.invoice_item_history (
  id BIGSERIAL PRIMARY KEY,
  order_id NUMERIC,
  back_order_id NUMERIC,
  line_id NUMERIC,
  sequence_id NUMERIC,
  pallet_id TEXT NOT NULL,
  picked_qty NUMERIC,
  condition_code TEXT,
  credit_code TEXT,
  unit_sell_price NUMERIC,
  price_adjustment NUMERIC,
  delivery_charge NUMERIC,
  freight_adjustment NUMERIC,
  brokerage_amount NUMERIC,
  mia_adjustment NUMERIC,
  volume_discount_amount NUMERIC,
  updated_at TIMESTAMP
);

CREATE INDEX ON accounting.invoice_item_history (order_id, back_order_id, pallet_id);

CREATE FUNCTION accounting.invoice_item_history_pallet(IN i accounting.invoice_item_history)
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

CREATE FUNCTION accounting.bulk_upsert_invoice_item_history(
  invoice_item_histories accounting.invoice_item_history[]
)
RETURNS setof accounting.invoice_item_history
AS $$
  DECLARE
    ii accounting.invoice_item_history;
    vals accounting.invoice_item_history;
  BEGIN
    FOREACH ii IN ARRAY invoice_item_histories LOOP
      INSERT INTO accounting.invoice_item_history(
        id,
        order_id,
        back_order_id,
        line_id,
        sequence_id,
        pallet_id,
        picked_qty,
        condition_code,
        credit_code,
        unit_sell_price,
        price_adjustment,
        delivery_charge,
        freight_adjustment,
        brokerage_amount,
        mia_adjustment,
        volume_discount_amount,
        updated_at
      )
        VALUES (
          COALESCE(ii.id, (select nextval('accounting.invoice_item_history_id_seq'))),
          ii.order_id,
          ii.back_order_id,
          ii.line_id,
          ii.sequence_id,
          ii.pallet_id,
          ii.picked_qty,
          ii.condition_code,
          ii.credit_code,
          ii.unit_sell_price,
          ii.price_adjustment,
          ii.delivery_charge,
          ii.freight_adjustment,
          ii.brokerage_amount,
          ii.mia_adjustment,
          ii.volume_discount_amount,
          ii.updated_at
        )
      ON CONFLICT (id) DO UPDATE SET
        order_id = ii.order_id,
        back_order_id = ii.back_order_id,
        line_id = ii.line_id,
        sequence_id = ii.sequence_id,
        pallet_id = ii.pallet_id,
        picked_qty = ii.picked_qty,
        condition_code = ii.condition_code,
        credit_code = ii.credit_code,
        unit_sell_price = ii.unit_sell_price,
        price_adjustment = ii.price_adjustment,
        delivery_charge = ii.delivery_charge,
        freight_adjustment = ii.freight_adjustment,
        brokerage_amount = ii.brokerage_amount,
        mia_adjustment = ii.mia_adjustment,
        volume_discount_amount = ii.volume_discount_amount,
        updated_at = ii.updated_at
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION accounting.bulk_delete_invoice_item_history(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM accounting.invoice_item_history
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
