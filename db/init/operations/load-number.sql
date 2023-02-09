CREATE SEQUENCE operations.ec_load_number_id_seq;
CREATE SEQUENCE operations.wc_load_number_id_seq;

CREATE TABLE operations.load_number (
  id BIGINT PRIMARY KEY,
  customer_id TEXT,
  notes TEXT,
  user_id BIGINT REFERENCES public.user(id) ON DELETE SET NULL
);

CREATE FUNCTION operations.load_number_customer(IN ln operations.load_number)
    RETURNS directory.customer
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.customer c WHERE c.id = ln.customer_id
$BODY$;

CREATE FUNCTION operations.load_number_is_used(IN ln operations.load_number)
    RETURNS BOOLEAN
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT (
    SELECT COUNT(*) FROM operations.order_entry om
      WHERE om.truck_load_id = CAST (ln.id AS TEXT)
  ) > 0 OR (
    SELECT COUNT(*) FROM operations.order_master om
      WHERE om.truck_load_id = CAST (ln.id AS TEXT)
  ) > 0 OR (
    SELECT COUNT(*) FROM accounting.invoice_header ih
      WHERE ih.truck_load_id = CAST (ln.id AS TEXT)
  ) > 0;
$BODY$;

CREATE FUNCTION operations.load_number_order_entries(IN ln operations.load_number)
    RETURNS setof operations.order_entry
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.order_entry om
    WHERE om.truck_load_id = CAST (ln.id AS TEXT);
$BODY$;

CREATE FUNCTION operations.load_number_order_master(IN ln operations.load_number)
    RETURNS operations.order_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.order_master om
    WHERE om.truck_load_id = CAST (ln.id AS TEXT);
$BODY$;

CREATE FUNCTION operations.load_number_invoice_headers(IN ln operations.load_number)
    RETURNS SETOF accounting.invoice_header
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM accounting.invoice_header ih
    WHERE ih.truck_load_id = CAST (ln.id AS TEXT);
$BODY$;

CREATE FUNCTION operations.bulk_upsert_load_number(
  load_numbers operations.load_number[],
  coast TEXT
)
RETURNS setof operations.load_number
AS $$
  DECLARE
    ln operations.load_number;
    vals operations.load_number;
  BEGIN
    FOREACH ln IN ARRAY load_numbers LOOP
      INSERT INTO operations.load_number(
        id,
        customer_id,
        notes,
        user_id
      )
        VALUES (
          CASE
            WHEN ln.id = 0
            THEN nextval('operations.' || LOWER(coast) || '_load_number_id_seq')
            ELSE ln.id
          END,
          ln.customer_id,
          ln.notes,
          ln.user_id
        )
      ON CONFLICT (id) DO UPDATE SET
			  id=EXCLUDED.id,
			  customer_id=EXCLUDED.customer_id,
			  notes=EXCLUDED.notes,
			  user_id=EXCLUDED.user_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE TABLE order_number (
  id BIGSERIAL PRIMARY KEY
);

CREATE FUNCTION operations.next_order_number()
    RETURNS BIGINT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT nextval('order_number_id_seq');
$BODY$;
