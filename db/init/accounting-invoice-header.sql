CREATE TABLE accounting.invoice_header (
  id BIGSERIAL PRIMARY KEY,
  order_status TEXT,
  order_id NUMERIC,
  back_order_id NUMERIC,
  truck_load_id TEXT,
  ship_warehouse_id TEXT,
  invoice_id TEXT,
  billing_customer_id TEXT,
  sales_user_code TEXT,
  customer_po TEXT,
  invoice_date DATE,
  shipping_customer_id TEXT,
  order_date DATE,
  entry_date DATE,
  actual_ship_date DATE,
  expected_ship_date DATE,
  amount_owed NUMERIC,
  paid_code TEXT,
  load_location TEXT,
  vendor_id TEXT,
  load_status TEXT,
  fob BOOLEAN,
  register_number TEXT,
  delivery_zone TEXT,
  notes TEXT
);

CREATE INDEX ON accounting.invoice_header (order_id, back_order_id, invoice_id, billing_customer_id, sales_user_code, actual_ship_date, truck_load_id);

CREATE FUNCTION accounting.invoice_header_ship_warehouse(IN i accounting.invoice_header)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = i.ship_warehouse_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_billing_customer(IN i accounting.invoice_header)
    RETURNS directory.customer
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.customer c WHERE c.id = i.billing_customer_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_shipping_customer(IN i accounting.invoice_header)
    RETURNS directory.customer
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.customer c WHERE c.id = i.shipping_customer_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_vendor(IN i accounting.invoice_header)
    RETURNS directory.vendor
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.vendor v WHERE v.id = i.vendor_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_sales_user(IN i accounting.invoice_header)
    RETURNS public.user
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM public.user u WHERE
    CASE WHEN i.sales_user_code = 'CP' THEN u.user_code = 'BS'
      ELSE u.user_code = i.sales_user_code
      END;
$BODY$;

CREATE FUNCTION accounting.invoice_header_items(IN i accounting.invoice_header)
    RETURNS setof accounting.invoice_item
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM accounting.invoice_item ii
  WHERE ii.order_id = i.order_id
    AND ii.back_order_id = i.back_order_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_item_histories(IN i accounting.invoice_header)
    RETURNS SETOF accounting.invoice_item_history
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM accounting.invoice_item_history h
    WHERE h.order_id = i.order_id AND h.back_order_id = i.back_order_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_payments(IN i accounting.invoice_header)
    RETURNS setof accounting.customer_payment
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM accounting.customer_payment p
    WHERE p.invoice_id = i.invoice_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_flag(IN i accounting.invoice_header)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT CONCAT(ii.flag) FROM accounting.invoice_item ii
    WHERE ii.order_id = i.order_id
      AND ii.back_order_id = i.back_order_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_total_amount(IN i accounting.invoice_header)
    RETURNS NUMERIC
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT SUM((ii.unit_sell_price + ii.delivery_charge - ii.volume_discount_amount) * ii.picked_qty) FROM accounting.invoice_item ii
  LEFT JOIN product.pallet p ON p.pallet_id = ii.pallet_id
  LEFT JOIN product.vessel v ON v.vessel_code = p.vessel_code
  LEFT JOIN directory.shipper s ON s.id = p.shipper_id
    WHERE ii.order_id = i.order_id
      AND ii.back_order_id = i.back_order_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_net_amount_due(IN i accounting.invoice_header)
    RETURNS NUMERIC
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT (
    SELECT accounting.invoice_header_total_amount(i)::NUMERIC
  ) + COALESCE(SUM(p.net_amount_due), 0) + i.amount_owed FROM accounting.customer_payment p
    WHERE (p.invoice_id = i.invoice_id
      OR p.invoice_id LIKE '%' || SUBSTRING(i.invoice_id, 2))
      AND p.net_amount_due < 0;
$BODY$;

CREATE FUNCTION accounting.invoice_header_total_amounts_by_vessel_and_shipper(IN i accounting.invoice_header)
    RETURNS SETOF TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT CONCAT(v.vessel_code, ',', s.id, ',', SUM((ii.unit_sell_price + ii.delivery_charge - ii.volume_discount_amount) * ii.picked_qty), ',', SUM(ii.credit_amount)) FROM accounting.invoice_item ii
  LEFT JOIN product.pallet p ON p.pallet_id = ii.pallet_id
  LEFT JOIN product.vessel v ON v.vessel_code = p.vessel_code AND v.is_pre = FALSE
  LEFT JOIN directory.shipper s ON s.id = p.shipper_id
    WHERE ii.order_id = i.order_id
      AND ii.back_order_id = i.back_order_id
    GROUP BY v.vessel_code, s.id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_split_invoices(IN i accounting.invoice_header)
    RETURNS SETOF accounting.invoice_header
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM accounting.invoice_header ih
    WHERE ih.truck_load_id LIKE 'A' || SUBSTRING(i.truck_load_id, 2, 4)
      AND ih.truck_load_id != i.truck_load_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_rejected_invoices(IN i accounting.invoice_header)
    RETURNS SETOF accounting.invoice_header
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM accounting.invoice_header ih
    WHERE ih.truck_load_id LIKE '%R%'
      AND ih.truck_load_id LIKE '%' || SUBSTRING(i.truck_load_id, 2, 4) || '%'
      AND ih.truck_load_id != i.truck_load_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_original_invoice(IN i accounting.invoice_header)
    RETURNS accounting.invoice_header
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM accounting.invoice_header ih
    WHERE ih.truck_load_id LIKE '0' || SUBSTRING(i.truck_load_id, 2, 4)
      AND ih.truck_load_id != i.truck_load_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_condition_code(IN i accounting.invoice_header)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT COALESCE(ii.condition_code) FROM accounting.invoice_item ii
    WHERE ii.order_id = i.order_id
      AND ii.back_order_id = i.back_order_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_credit_code(IN i accounting.invoice_header)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT COALESCE(ii.credit_code) FROM accounting.invoice_item ii
    WHERE ii.order_id = i.order_id
      AND ii.back_order_id = i.back_order_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_truck_load(IN i accounting.invoice_header)
    RETURNS operations.truck_load
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.truck_load tl
  WHERE tl.load_id = i.truck_load_id
    AND tl.warehouse_id = i.ship_warehouse_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_repack_queues(IN i accounting.invoice_header)
    RETURNS SETOF operations.repack_queue
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.repack_queue rq
    WHERE rq.order_id = i.order_id;
$BODY$;

CREATE FUNCTION accounting.invoice_header_search_text(IN o accounting.invoice_header)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		o.invoice_id,
		o.order_id,
		o.back_order_id,
    o.notes
	) FROM accounting.invoice_header ih WHERE ih.id = o.id;
$BODY$;

CREATE FUNCTION accounting.bulk_upsert_invoice_header(
  invoice_headers accounting.invoice_header[]
)
RETURNS setof accounting.invoice_header
AS $$
  DECLARE
    ih accounting.invoice_header;
    vals accounting.invoice_header;
  BEGIN
    FOREACH ih IN ARRAY invoice_headers LOOP
      INSERT INTO accounting.invoice_header(
        id,
        order_status,
        order_id,
        back_order_id,
        truck_load_id,
        ship_warehouse_id,
        invoice_id,
        billing_customer_id,
        sales_user_code,
        customer_po,
        invoice_date,
        shipping_customer_id,
        order_date,
        entry_date,
        actual_ship_date,
        expected_ship_date,
        amount_owed,
        paid_code,
        load_location,
        vendor_id,
        load_status,
        fob,
        register_number,
        delivery_zone,
        notes
      )
        VALUES (
          COALESCE(ih.id, (select nextval('accounting.invoice_header_id_seq'))),
          ih.order_status,
          ih.order_id,
          ih.back_order_id,
          ih.truck_load_id,
          ih.ship_warehouse_id,
          ih.invoice_id,
          ih.billing_customer_id,
          ih.sales_user_code,
          ih.customer_po,
          ih.invoice_date,
          ih.shipping_customer_id,
          ih.order_date,
          ih.entry_date,
          ih.actual_ship_date,
          ih.expected_ship_date,
          ih.amount_owed,
          ih.paid_code,
          ih.load_location,
          ih.vendor_id,
          ih.load_status,
          ih.fob,
          ih.register_number,
          ih.delivery_zone,
          ih.notes
        )
      ON CONFLICT (id) DO UPDATE SET
			  order_status=EXCLUDED.order_status,
			  order_id=EXCLUDED.order_id,
			  back_order_id=EXCLUDED.back_order_id,
			  truck_load_id=EXCLUDED.truck_load_id,
			  ship_warehouse_id=EXCLUDED.ship_warehouse_id,
			  invoice_id=EXCLUDED.invoice_id,
			  billing_customer_id=EXCLUDED.billing_customer_id,
			  sales_user_code=EXCLUDED.sales_user_code,
			  customer_po=EXCLUDED.customer_po,
			  invoice_date=EXCLUDED.invoice_date,
			  shipping_customer_id=EXCLUDED.shipping_customer_id,
			  order_date=EXCLUDED.order_date,
			  entry_date=EXCLUDED.entry_date,
			  actual_ship_date=EXCLUDED.actual_ship_date,
			  expected_ship_date=EXCLUDED.expected_ship_date,
			  amount_owed=EXCLUDED.amount_owed,
			  paid_code=EXCLUDED.paid_code,
			  load_location=EXCLUDED.load_location,
			  vendor_id=EXCLUDED.vendor_id,
			  load_status=EXCLUDED.load_status,
			  fob=EXCLUDED.fob,
			  register_number=EXCLUDED.register_number,
			  delivery_zone=EXCLUDED.delivery_zone,
			  notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION accounting.bulk_delete_invoice_header(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM accounting.invoice_header
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
