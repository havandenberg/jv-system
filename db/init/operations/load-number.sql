CREATE TABLE load_number (
  id BIGSERIAL PRIMARY KEY,
  customer_id TEXT,
  user_id BIGINT REFERENCES public.user(id) ON DELETE SET NULL,
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

CREATE FUNCTION operations.load_number_has_order_entries(IN ln operations.load_number)
    RETURNS BOOLEAN
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT (
    SELECT COUNT(*) FROM operations.order_entry om
      WHERE om.truck_load_id = CAST (ln.id AS TEXT)
  ) > 0;
$BODY$;

CREATE FUNCTION operations.bulk_upsert_load_number(
  load_numbers operations.load_number[]
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
        user_id
      )
        VALUES (
          COALESCE(ln.id, (select nextval('operations.load_number_id_seq'))),
          ln.customer_id,
          ln.user_id
        )
      ON CONFLICT (id) DO UPDATE SET
			  id=EXCLUDED.id,
			  customer_id=EXCLUDED.customer_id,
			  user_id=EXCLUDED.user_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
