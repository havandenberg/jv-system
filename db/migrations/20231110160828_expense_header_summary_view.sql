-- migrate:up
CREATE FUNCTION accounting.expense_header_summary_view(IN vessel_code_param TEXT) RETURNS setof accounting.expense_header_view
LANGUAGE 'sql' STABLE PARALLEL UNSAFE COST 100 AS $BODY$
SELECT *
FROM accounting.expense_header_view eh
WHERE eh.vessel_code = vessel_code_param
    OR vessel_code_param IN (
        SELECT DISTINCT vessel_code
        FROM accounting.expense_item_view ei
        WHERE ei.voucher_id = eh.voucher_id
            AND ei.vendor_id = eh.vendor_id
    );
$BODY$;
-- migrate:down
DROP FUNCTION accounting.expense_header_summary_view(text);