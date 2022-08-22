CREATE TABLE operations.order_master (
  id BIGSERIAL PRIMARY KEY,
  order_status TEXT,
  paid_code BOOLEAN,
  load_status TEXT,
  order_id NUMERIC,
  back_order_id NUMERIC,
  ship_warehouse_id TEXT,
  truck_load_id TEXT,
  fob BOOLEAN,
  billing_customer_id TEXT,
  sales_user_code TEXT,
  customer_po TEXT,
  expected_ship_date DATE,
  order_date DATE,
  entry_date DATE,
  actual_ship_date DATE,
  invoice_date DATE,
  shipping_customer_id TEXT,
  entry_user_code TEXT,
  register_number TEXT,
  delivery_zone TEXT,
  amount_owed NUMERIC,
  load_location TEXT,
  vendor_id TEXT,
  invoice_id TEXT,
  notes TEXT
);

CREATE FUNCTION operations.order_master_ship_warehouse(IN o operations.order_master)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = o.ship_warehouse_id;
$BODY$;

CREATE FUNCTION operations.order_master_billing_customer(IN o operations.order_master)
    RETURNS directory.customer
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.customer c WHERE c.id = o.billing_customer_id;
$BODY$;

CREATE FUNCTION operations.order_master_shipping_customer(IN o operations.order_master)
    RETURNS directory.customer
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.customer c WHERE c.id = o.shipping_customer_id;
$BODY$;

CREATE FUNCTION operations.order_master_sales_user(IN o operations.order_master)
    RETURNS public.user
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM public.user u WHERE u.user_code = o.sales_user_code;
$BODY$;

CREATE FUNCTION operations.order_master_entry_user(IN o operations.order_master)
    RETURNS public.user
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM public.user u WHERE u.user_code = o.entry_user_code;
$BODY$;

CREATE FUNCTION operations.order_master_items(IN o operations.order_master)
    RETURNS setof operations.order_item
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.order_item oi
  WHERE oi.order_id = o.order_id
    AND oi.back_order_id = o.back_order_id;
$BODY$;

CREATE FUNCTION operations.order_master_truck_load(IN o operations.order_master)
    RETURNS operations.truck_load
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.truck_load tl
  WHERE tl.load_id = o.truck_load_id
    AND tl.vendor_id = o.vendor_id
    AND tl.warehouse_id = o.ship_warehouse_id;
$BODY$;

CREATE FUNCTION operations.order_master_search_text(IN o operations.order_master)
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
	) FROM operations.order_master om WHERE om.id = o.id;
$BODY$;

CREATE FUNCTION operations.bulk_upsert_order_master(
  order_masters operations.order_master[]
)
RETURNS setof operations.order_master
AS $$
  DECLARE
    om operations.order_master;
    vals operations.order_master;
  BEGIN
    FOREACH om IN ARRAY order_masters LOOP
      INSERT INTO operations.order_master(
        id,
        order_status,
        paid_code,
        load_status,
        order_id,
        back_order_id,
        ship_warehouse_id,
        truck_load_id,
        fob,
        billing_customer_id,
        sales_user_code,
        customer_po,
        expected_ship_date,
        order_date,
        entry_date,
        actual_ship_date,
        invoice_date,
        shipping_customer_id,
        entry_user_code,
        register_number,
        delivery_zone,
        amount_owed,
        load_location,
        vendor_id,
        invoice_id,
        notes
      )
        VALUES (
          COALESCE(om.id, (select nextval('operations.order_master_id_seq'))),
          om.order_status,
          om.paid_code,
          om.load_status,
          om.order_id,
          om.back_order_id,
          om.ship_warehouse_id,
          om.truck_load_id,
          om.fob,
          om.billing_customer_id,
          om.sales_user_code,
          om.customer_po,
          om.expected_ship_date,
          om.order_date,
          om.entry_date,
          om.actual_ship_date,
          om.invoice_date,
          om.shipping_customer_id,
          om.entry_user_code,
          om.register_number,
          om.delivery_zone,
          om.amount_owed,
          om.load_location,
          om.vendor_id,
          om.invoice_id,
          om.notes
        )
      ON CONFLICT (id) DO UPDATE SET
			  order_status=EXCLUDED.order_status,
			  paid_code=EXCLUDED.paid_code,
			  load_status=EXCLUDED.load_status,
			  order_id=EXCLUDED.order_id,
			  back_order_id=EXCLUDED.back_order_id,
			  ship_warehouse_id=EXCLUDED.ship_warehouse_id,
			  truck_load_id=EXCLUDED.truck_load_id,
			  fob=EXCLUDED.fob,
			  billing_customer_id=EXCLUDED.billing_customer_id,
			  sales_user_code=EXCLUDED.sales_user_code,
			  customer_po=EXCLUDED.customer_po,
			  expected_ship_date=EXCLUDED.expected_ship_date,
			  order_date=EXCLUDED.order_date,
			  entry_date=EXCLUDED.entry_date,
			  actual_ship_date=EXCLUDED.actual_ship_date,
			  invoice_date=EXCLUDED.invoice_date,
			  shipping_customer_id=EXCLUDED.shipping_customer_id,
			  entry_user_code=EXCLUDED.entry_user_code,
			  register_number=EXCLUDED.register_number,
			  delivery_zone=EXCLUDED.delivery_zone,
			  amount_owed=EXCLUDED.amount_owed,
			  load_location=EXCLUDED.load_location,
			  vendor_id=EXCLUDED.vendor_id,
			  invoice_id=EXCLUDED.invoice_id,
			  notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION operations.bulk_delete_order_master(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM operations.order_master
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
