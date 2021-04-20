-- migrate:up
CREATE FUNCTION public.price_product_product_root_id(IN product price_product)
    RETURNS BIGINT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT id FROM price_size WHERE product_id = product.id AND size_name = 'product-root' LIMIT 1;
$BODY$;

-- migrate:down
DROP FUNCTION price_product_product_root_id;
