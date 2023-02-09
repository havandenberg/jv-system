CREATE TABLE accounting.invoice_item (
  id BIGSERIAL PRIMARY KEY,
  pallet_status TEXT,
  order_id NUMERIC,
  back_order_id NUMERIC,
  line_id NUMERIC,
  sequence_id NUMERIC,
  picked_qty NUMERIC,
  credited_qty NUMERIC,
  pallet_id TEXT NOT NULL,
  condition_code TEXT,
  credit_code TEXT,
  unit_sell_price NUMERIC,
  price_adjustment NUMERIC,
  delivery_charge NUMERIC,
  freight_adjustment NUMERIC,
  credit_amount NUMERIC,
  brokerage_amount NUMERIC,
  mia_adjustment NUMERIC,
  volume_discount_amount NUMERIC,
  layer_mult BOOLEAN,
  flag TEXT,
  notes TEXT
);

CREATE INDEX ON accounting.invoice_item (order_id, back_order_id, pallet_id);

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
        credited_qty,
        pallet_id,
        condition_code,
        credit_code,
        unit_sell_price,
        price_adjustment,
        delivery_charge,
        freight_adjustment,
        credit_amount,
        brokerage_amount,
        volume_discount_amount,
        mia_adjustment,
        layer_mult,
        flag,
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
          ii.credited_qty,
          ii.pallet_id,
          ii.condition_code,
          ii.credit_code,
          ii.unit_sell_price,
          ii.price_adjustment,
          ii.delivery_charge,
          ii.freight_adjustment,
          ii.credit_amount,
          ii.brokerage_amount,
          ii.volume_discount_amount,
          ii.mia_adjustment,
          ii.layer_mult,
          ii.flag,
          ii.notes
        )
      ON CONFLICT (id) DO UPDATE SET
        pallet_status=EXCLUDED.pallet_status,
        order_id=EXCLUDED.order_id,
        back_order_id=EXCLUDED.back_order_id,
        line_id=EXCLUDED.line_id,
        sequence_id=EXCLUDED.sequence_id,
        picked_qty=EXCLUDED.picked_qty,
        credited_qty=EXCLUDED.credited_qty,
        pallet_id=EXCLUDED.pallet_id,
        condition_code=EXCLUDED.condition_code,
        credit_code=EXCLUDED.credit_code,
        unit_sell_price=EXCLUDED.unit_sell_price,
        price_adjustment=EXCLUDED.price_adjustment,
        delivery_charge=EXCLUDED.delivery_charge,
        freight_adjustment=EXCLUDED.freight_adjustment,
        credit_amount=EXCLUDED.credit_amount,
        brokerage_amount=EXCLUDED.brokerage_amount,
        volume_discount_amount=EXCLUDED.volume_discount_amount,
        mia_adjustment=EXCLUDED.mia_adjustment,
        layer_mult=EXCLUDED.layer_mult,
        flag=EXCLUDED.flag,
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
