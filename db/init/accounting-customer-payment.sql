CREATE TABLE accounting.customer_payment (
  id BIGSERIAL PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  check_number TEXT,
  transaction_code TEXT,
  transaction_type TEXT,
  net_amount_due NUMERIC,
  notes TEXT
);

CREATE INDEX ON accounting.customer_payment (invoice_id);

CREATE FUNCTION accounting.customer_payment_invoice_header(IN p accounting.customer_payment)
  RETURNS accounting.invoice_header
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT * FROM accounting.invoice_header i
    WHERE i.invoice_id = p.invoice_id;
$BODY$;

CREATE FUNCTION accounting.bulk_upsert_customer_payment(
  customer_payments accounting.customer_payment[]
)
RETURNS setof accounting.customer_payment
AS $$
  DECLARE
    cp accounting.customer_payment;
    vals accounting.customer_payment;
  BEGIN
    FOREACH cp IN ARRAY customer_payments LOOP
      INSERT INTO accounting.customer_payment(
        id,
        invoice_id,
        check_number,
        transaction_code,
        transaction_type,
        net_amount_due,
        notes
      )
        VALUES (
          COALESCE(cp.id, (select nextval('accounting.customer_payment_id_seq'))),
          cp.invoice_id,
          cp.check_number,
          cp.transaction_code,
          cp.transaction_type,
          cp.net_amount_due,
          cp.notes
        )
      ON CONFLICT (id) DO UPDATE SET
        invoice_id=EXCLUDED.invoice_id,
        check_number=EXCLUDED.check_number,
        transaction_code=EXCLUDED.transaction_code,
        transaction_type=EXCLUDED.transaction_type,
        net_amount_due=EXCLUDED.net_amount_due,
        notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION accounting.bulk_delete_customer_payment(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM accounting.customer_payment
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
