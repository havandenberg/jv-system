CREATE TABLE operations.order_entry (
  id BIGSERIAL PRIMARY KEY,
  order_id NUMERIC,
  back_order_id NUMERIC,
  truck_load_id TEXT,
  fob BOOLEAN,
  billing_customer_id TEXT,
  sales_user_code TEXT,
  customer_po TEXT,
  fob_date DATE,
  delivered_date DATE,
  order_date DATE,
  review_user_code TEXT,
  notes TEXT
);

CREATE FUNCTION operations.order_entry_billing_customer(IN o operations.order_entry)
    RETURNS directory.customer
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.customer c WHERE c.id = o.billing_customer_id;
$BODY$;

CREATE FUNCTION operations.order_entry_sales_user(IN o operations.order_entry)
    RETURNS public.user
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM public.user u WHERE u.user_code = o.sales_user_code;
$BODY$;

CREATE FUNCTION operations.order_entry_review_user(IN o operations.order_entry)
    RETURNS public.user
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM public.user u WHERE u.user_code = o.review_user_code;
$BODY$;

CREATE FUNCTION operations.order_entry_search_text(IN o operations.order_entry)
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
	) FROM operations.order_entry om WHERE om.id = o.id;
$BODY$;

CREATE FUNCTION operations.bulk_upsert_order_entry(
  order_entries operations.order_entry[]
)
RETURNS setof operations.order_entry
AS $$
  DECLARE
    om operations.order_entry;
    vals operations.order_entry;
  BEGIN
    FOREACH om IN ARRAY order_entries LOOP
      INSERT INTO operations.order_entry(
        id,
        order_id,
        back_order_id,
        truck_load_id,
        fob,
        billing_customer_id,
        sales_user_code,
        customer_po,
        fob_date,
        delivered_date,
        order_date,
        review_user_code,
        notes
      )
        VALUES (
          COALESCE(om.id, (select nextval('operations.order_entry_id_seq'))),order_id,
          om.back_order_id,
          om.truck_load_id,
          om.fob,
          om.billing_customer_id,
          om.sales_user_code,
          om.customer_po,
          om.fob_date,
          om.delivered_date,
          om.order_date,
          om.review_user_code,
          om.notes
        )
      ON CONFLICT (id) DO UPDATE SET
			  back_order_id=EXCLUDED.back_order_id,
			  truck_load_id=EXCLUDED.truck_load_id,
			  fob=EXCLUDED.fob,
			  billing_customer_id=EXCLUDED.billing_customer_id,
			  sales_user_code=EXCLUDED.sales_user_code,
			  customer_po=EXCLUDED.customer_po,
			  fob_date=EXCLUDED.fob_date,
			  delivered_date=EXCLUDED.delivered_date,
			  order_date=EXCLUDED.order_date,
			  sales_user_code=EXCLUDED.sales_user_code,
			  review_user_code=EXCLUDED.review_user_code,
			  notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
