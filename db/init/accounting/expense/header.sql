CREATE TABLE accounting.expense_header (
  id BIGSERIAL PRIMARY KEY,
  vendor_id TEXT,
  voucher_id TEXT,
  invoice_id TEXT,
  is_estimated BOOLEAN,
  paid_code TEXT,
  receivable_cut BOOLEAN,
  ap_hide BOOLEAN,
  is_prorate BOOLEAN,
  expense_amount NUMERIC,
  check_number NUMERIC,
  entry_date DATE,
  expense_code TEXT,
  truck_load_id TEXT,
  vessel_code TEXT,
  customs_entry_code TEXT,
  notes TEXT
);

CREATE FUNCTION accounting.expense_header_vendor(IN e accounting.expense_header)
    RETURNS directory.vendor
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.vendor v WHERE v.id = e.vendor_id;
$BODY$;

CREATE FUNCTION accounting.expense_header_truck_load(IN e accounting.expense_header)
    RETURNS operations.truck_load
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.truck_load tl
  WHERE tl.load_id = e.truck_load_id
    AND tl.vendor_id = e.vendor_id
    LIMIT 1;
$BODY$;

CREATE FUNCTION accounting.expense_header_vessel(IN e accounting.expense_header)
    RETURNS product.vessel
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = e.vessel_code LIMIT 1;
$BODY$;

CREATE FUNCTION accounting.expense_header_items(IN e accounting.expense_header)
    RETURNS setof accounting.expense_item
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM accounting.expense_item ei
  WHERE ei.voucher_id = e.voucher_id
    AND ei.vendor_id = e.vendor_id;
$BODY$;

CREATE FUNCTION accounting.expense_header_search_text(IN e accounting.expense_header)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		e.vendor_id,
		e.voucher_id,
		e.invoice_id,
    e.notes
	) FROM accounting.expense_header eh WHERE eh.id = e.id;
$BODY$;

CREATE FUNCTION accounting.bulk_upsert_expense_header(
  expense_headers accounting.expense_header[]
)
RETURNS setof accounting.expense_header
AS $$
  DECLARE
    eh accounting.expense_header;
    vals accounting.expense_header;
  BEGIN
    FOREACH eh IN ARRAY expense_headers LOOP
      INSERT INTO accounting.expense_header(
        id,
        vendor_id,
        voucher_id,
        invoice_id,
        is_estimated,
        paid_code,
        receivable_cut,
        ap_hide,
        is_prorate,
        expense_amount,
        check_number,
        entry_date,
        expense_code,
        truck_load_id,
        vessel_code,
        customs_entry_code,
        notes
      )
        VALUES (
          COALESCE(eh.id, (select nextval('accounting.expense_header_id_seq'))),
          eh.vendor_id,
          eh.voucher_id,
          eh.invoice_id,
          eh.is_estimated,
          eh.paid_code,
          eh.receivable_cut,
          eh.ap_hide,
          eh.is_prorate,
          eh.expense_amount,
          eh.check_number,
          eh.entry_date,
          eh.expense_code,
          eh.truck_load_id,
          eh.vessel_code,
          eh.customs_entry_code,
          eh.notes
        )
      ON CONFLICT (id) DO UPDATE SET
        vendor_id=EXCLUDED.vendor_id,
        voucher_id=EXCLUDED.voucher_id,
        invoice_id=EXCLUDED.invoice_id,
        is_estimated=EXCLUDED.is_estimated,
        paid_code=EXCLUDED.paid_code,
        receivable_cut=EXCLUDED.receivable_cut,
        ap_hide=EXCLUDED.ap_hide,
        is_prorate=EXCLUDED.is_prorate,
        expense_amount=EXCLUDED.expense_amount,
        check_number=EXCLUDED.check_number,
        entry_date=EXCLUDED.entry_date,
        expense_code=EXCLUDED.expense_code,
        truck_load_id=EXCLUDED.truck_load_id,
        vessel_code=EXCLUDED.vessel_code,
        customs_entry_code=EXCLUDED.customs_entry_code,
        notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION accounting.bulk_delete_expense_header(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM accounting.expense_header
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
