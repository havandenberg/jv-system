CREATE TABLE product.product_master (
  id TEXT PRIMARY KEY,
  default_pallet_quantity TEXT,
  lot_number TEXT
);

CREATE FUNCTION product.product_master_search_text(IN a product.product_master)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		a.id,
		a.lot_number,
		a.default_pallet_quantity
	) FROM product.product_master;
$BODY$;
