CREATE TABLE sales.price_product (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES sales.price_category(id) ON DELETE CASCADE,
    color TEXT NOT NULL,
    product_name TEXT NOT NULL,
    sort_order INT NOT NULL
);

CREATE FUNCTION sales.bulk_upsert_price_product(
  products sales.price_product[]
)
RETURNS setof sales.price_product
AS $$
  DECLARE
    p sales.price_product;
    vals sales.price_product;
  BEGIN
    FOREACH p IN ARRAY products LOOP
      INSERT INTO sales.price_product(
        id,
        category_id,
        color,
        product_name,
        sort_order
      )
        VALUES (
          COALESCE(p.id, (select nextval('sales.price_product_id_seq'))),
          p.category_id,
          p.color,
          p.product_name,
          p.sort_order
        )
      ON CONFLICT (id) DO UPDATE SET
        category_id=EXCLUDED.category_id,
        color=EXCLUDED.color,
        product_name=EXCLUDED.product_name,
        sort_order=EXCLUDED.sort_order
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION sales.price_product_product_root_id(IN product sales.price_product)
    RETURNS BIGINT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT id FROM sales.price_size WHERE product_id = product.id AND size_name = 'product-root' LIMIT 1;
$BODY$;

CREATE FUNCTION sales.delete_price_product_entries(selected_product_id BIGINT, selected_date DATE)
    RETURNS setof BIGINT
AS $$
  DELETE FROM sales.price_entry
  WHERE id IN (
    SELECT e.id FROM sales.price_entry AS e
    JOIN sales.price_size AS s ON s.id = e.size_id
    JOIN sales.price_product AS p ON p.id = s.product_id
    WHERE p.id = selected_product_id AND e.entry_date >= selected_date
  ) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
