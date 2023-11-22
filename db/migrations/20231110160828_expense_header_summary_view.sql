-- migrate:up
CREATE OR REPLACE FUNCTION accounting.expense_header_summary_view(IN vessel_code_param TEXT)
RETURNS setof accounting.expense_header_view
LANGUAGE 'sql' STABLE PARALLEL UNSAFE COST 100
AS $BODY$
with expense_headers as (
    SELECT eh.voucher_id, eh.vendor_id
            FROM accounting.expense_header_view eh
            join accounting.expense_item_view ei using(voucher_id, vendor_id)
            WHERE eh.vessel_code = vessel_code_param or ei.vessel_code = vessel_code_param
            group by voucher_id, vendor_id, eh.vessel_code
)
select expense_header_view.* from accounting.expense_header_view
join expense_headers using(voucher_id, vendor_id);
$BODY$;
-- migrate:down
DROP FUNCTION accounting.expense_header_summary_view(text);