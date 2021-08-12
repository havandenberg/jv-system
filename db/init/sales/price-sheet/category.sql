CREATE TABLE sales.price_category (
    id BIGSERIAL PRIMARY KEY,
    category_name TEXT NOT NULL,
    sort_order INT NOT NULL
);

CREATE FUNCTION sales.bulk_upsert_price_category(
  categories sales.price_category[]
)
RETURNS setof sales.price_category
AS $$
  DECLARE
    c sales.price_category;
    vals sales.price_category;
  BEGIN
    FOREACH c IN ARRAY categories LOOP
      INSERT INTO sales.price_category(
        id,
        category_name,
        sort_order
      )
        VALUES (
          COALESCE(c.id, (select nextval('sales.price_category_id_seq'))),
          c.category_name,
          c.sort_order
        )
      ON CONFLICT (id) DO UPDATE SET
        category_name=EXCLUDED.category_name,
        sort_order=EXCLUDED.sort_order
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION sales.delete_price_category_entries(selected_category_id BIGINT, selected_date DATE)
    RETURNS setof BIGINT
AS $$
  DELETE FROM sales.price_entry
  WHERE id IN (
    SELECT e.id FROM sales.price_entry AS e
    JOIN sales.price_size AS s ON s.id = e.size_id
    JOIN sales.price_product AS p ON p.id = s.product_id
    JOIN sales.price_category AS c ON c.id = p.category_id
    WHERE c.id = selected_category_id AND e.entry_date >= selected_date
  ) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
