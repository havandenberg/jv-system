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

CREATE FUNCTION sales.bulk_upsert_price_entry(
  entries sales.price_entry[]
)
RETURNS setof sales.price_entry
AS $$
  DECLARE
    e sales.price_entry;
    vals sales.price_entry;
  BEGIN
    FOREACH e IN ARRAY entries LOOP
      INSERT INTO sales.price_entry(
        id,
        size_id,
        entry_date, 
        entry_description,
        content,
        highlight
      )
        VALUES (
          COALESCE(e.id, (select nextval('sales.price_entry_id_seq'))),
          e.size_id,
          e.entry_date,
          e.entry_description,
          e.content,
          e.highlight
        )
      ON CONFLICT (id) DO UPDATE SET
        size_id=EXCLUDED.size_id,
        entry_date=EXCLUDED.entry_date,
        entry_description=EXCLUDED.entry_description,
        content=EXCLUDED.content,
        highlight=EXCLUDED.highlight
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION sales.price_product_product_root_id(IN product sales.price_product)
    RETURNS setof BIGINT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT id FROM sales.price_size WHERE product_id = product.id AND size_name = 'product-root' LIMIT 1;
$BODY$;

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
