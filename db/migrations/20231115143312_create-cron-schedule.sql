-- migrate:up
create EXTENSION pg_cron;

CREATE UNIQUE INDEX vendor_view_index
  ON directory.vendor_view (id);

CREATE UNIQUE INDEX expense_header_view_index
  ON accounting.expense_header_view (vendor_id, voucher_id, invoice_id);

CREATE UNIQUE INDEX expense_item_view_index
  ON accounting.expense_item_view (id);

CREATE UNIQUE INDEX pallet_view_index
  ON product.pallet_view (id);

CREATE UNIQUE INDEX vessel_view_index
  ON product.vessel_view(is_pre, vessel_code, arrival_port);

CREATE UNIQUE INDEX shipper_view_index
  ON directory.shipper_view(id);

SELECT cron.schedule('refresh vendor_view', '20 seconds', 'REFRESH MATERIALIZED VIEW CONCURRENTLY directory.vendor_view');
SELECT cron.schedule('refresh expense_header_view', '20 seconds', 'REFRESH MATERIALIZED VIEW CONCURRENTLY accounting.expense_header_view');
SELECT cron.schedule('refresh expense_item_view', '20 seconds', 'REFRESH MATERIALIZED VIEW CONCURRENTLY accounting.expense_item_view');
SELECT cron.schedule('refresh pallet_view', '20 seconds', 'REFRESH MATERIALIZED VIEW CONCURRENTLY product.pallet_view');
SELECT cron.schedule('refresh vessel_view', '20 seconds', 'REFRESH MATERIALIZED VIEW CONCURRENTLY product.vessel_view');
SELECT cron.schedule('refresh shipper_view', '20 seconds', 'REFRESH MATERIALIZED VIEW CONCURRENTLY directory.shipper_view');

SELECT cron.schedule('refresh check_header_view', '20 seconds', 'REFRESH MATERIALIZED VIEW accounting.check_header_view');


-- migrate:down

SELECT cron.unschedule('refresh vendor_view');
SELECT cron.unschedule('refresh vessel_view');
SELECT cron.unschedule('refresh expense_header_view');
SELECT cron.unschedule('refresh expense_item_view');
SELECT cron.unschedule('refresh check_header_view');
SELECT cron.unschedule('refresh shipper_view');
SELECT cron.unschedule('refresh pallet_view');

DROP INDEX directory.vendor_view_index;
DROP INDEX accounting.expense_header_view_index;
DROP INDEX accounting.expense_item_view_index;
DROP INDEX product.pallet_view_index;
DROP INDEX product.vessel_view_index;
DROP INDEX directory.shipper_view_index;

DROP EXTENSION pg_cron;
