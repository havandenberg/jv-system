CREATE TABLE sales.price_size (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES sales.price_product(id) ON DELETE CASCADE,
    size_name TEXT NOT NULL,
    sort_order INT NOT NULL
);

CREATE FUNCTION sales.bulk_upsert_price_size(
  sizes sales.price_size[]
)
RETURNS setof sales.price_size
AS $$
  DECLARE
    s sales.price_size;
    vals sales.price_size;
  BEGIN
    FOREACH s IN ARRAY sizes LOOP
      INSERT INTO sales.price_size(
        id,
        product_id,
        size_name,
        sort_order
      )
        VALUES (
          COALESCE(s.id, (select nextval('sales.price_size_id_seq'))),
          s.product_id,
          s.size_name,
          s.sort_order
        )
      ON CONFLICT (id) DO UPDATE SET
        product_id=EXCLUDED.product_id,
        size_name=EXCLUDED.size_name,
        sort_order=EXCLUDED.sort_order
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION sales.delete_price_size_entries(selected_size_id BIGINT, selected_date DATE)
    RETURNS setof BIGINT
AS $$
  DELETE FROM sales.price_entry
  WHERE id IN (
    SELECT e.id FROM sales.price_entry AS e
    JOIN sales.price_size AS s ON s.id = e.size_id
    WHERE s.id = selected_size_id AND e.entry_date >= selected_date
  ) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
