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
  order_date TIMESTAMP,
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
