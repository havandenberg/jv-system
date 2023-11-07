CREATE TABLE accounting.check_header (
  id BIGSERIAL PRIMARY KEY,
  is_reconciled BOOLEAN,
  check_status TEXT NOT NULL,
  check_number TEXT NOT NULL,
  vendor_id TEXT NOT NULL,
  remit_to_code NUMERIC,
  invoice_amount NUMERIC NOT NULL,
  discount_amount NUMERIC NOT NULL,
  check_amount NUMERIC NOT NULL,
  check_date DATE,
  bank_id TEXT NOT NULL,
  invoice_id TEXT NOT NULL,
  is_void BOOLEAN,
  entry_date DATE
);

CREATE FUNCTION accounting.check_header_vendor(IN c accounting.check_header)
  RETURNS directory.vendor
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT * FROM directory.vendor v WHERE v.id = c.vendor_id;
$BODY$;

CREATE FUNCTION accounting.check_header_search_text(IN c accounting.check_header)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		c.check_number
	) FROM accounting.check_header ch WHERE ch.id = c.id;
$BODY$;

CREATE FUNCTION accounting.bulk_upsert_check_header(
  check_headers accounting.check_header[]
)
RETURNS setof accounting.check_header
AS $$
  DECLARE
    ch accounting.check_header;
    vals accounting.check_header;
  BEGIN
    FOREACH ch IN ARRAY check_headers LOOP
      INSERT INTO accounting.check_header(
        id,
        is_reconciled,
        check_status,
        check_number,
        vendor_id,
        remit_to_code,
        invoice_amount,
        discount_amount,
        check_amount,
        check_date,
        bank_id,
        invoice_id,
        is_void,
        entry_date
      )
        VALUES (
          COALESCE(ch.id, (select nextval('accounting.check_header_id_seq'))),
          ch.is_reconciled,
          ch.check_status,
          ch.check_number,
          ch.vendor_id,
          ch.remit_to_code,
          ch.invoice_amount,
          ch.discount_amount,
          ch.check_amount,
          ch.check_date,
          ch.bank_id,
          ch.invoice_id,
          ch.is_void,
          ch.entry_date
        )
      ON CONFLICT (id) DO UPDATE SET
        is_reconciled=EXCLUDED.is_reconciled,
        check_status=EXCLUDED.check_status,
        check_number=EXCLUDED.check_number,
        vendor_id=EXCLUDED.vendor_id,
        remit_to_code=EXCLUDED.remit_to_code,
        invoice_amount=EXCLUDED.invoice_amount,
        discount_amount=EXCLUDED.discount_amount,
        check_amount=EXCLUDED.check_amount,
        check_date=EXCLUDED.check_date,
        bank_id=EXCLUDED.bank_id,
        invoice_id=EXCLUDED.invoice_id,
        is_void=EXCLUDED.is_void,
        entry_date=EXCLUDED.entry_date
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION accounting.bulk_delete_check_header(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM accounting.check_header
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
