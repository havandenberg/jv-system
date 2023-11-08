CREATE OR REPLACE FUNCTION accounting.expense_header_view_items(IN e accounting.expense_header_view)
    RETURNS setof accounting.expense_item_view
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM accounting.expense_item_view ei
  WHERE ei.voucher_id = e.voucher_id
    AND ei.vendor_id = e.vendor_id;
$BODY$;

CREATE OR REPLACE FUNCTION accounting.expense_header_summary_view(IN vessel_code_param TEXT, IN shipper_id_param TEXT)
    RETURNS setof accounting.expense_header_view
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM accounting.expense_header_view eh
    WHERE eh.vessel_code = vessel_code_param
    OR vessel_code_param IN (
      SELECT DISTINCT vessel_code FROM accounting.expense_header_view_items(eh) ei
    );
$BODY$;


