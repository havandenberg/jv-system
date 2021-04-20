-- migrate:up
CREATE FUNCTION bulk_upsert_price_category(
  categories price_category[]
)
RETURNS setof price_category
AS $$
  DECLARE
    c price_category;
    vals price_category;
  BEGIN
    FOREACH c IN ARRAY categories LOOP
      INSERT INTO price_category(
        id,
        category_name,
        sort_order
      )
        VALUES (
          COALESCE(c.id, (select nextval('price_category_id_seq'))),
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

CREATE FUNCTION bulk_upsert_price_product(
  products price_product[]
)
RETURNS setof price_product
AS $$
  DECLARE
    p price_product;
    vals price_product;
  BEGIN
    FOREACH p IN ARRAY products LOOP
      INSERT INTO price_product(
        id,
        category_id,
        color,
        product_name,
        sort_order
      )
        VALUES (
          COALESCE(p.id, (select nextval('price_product_id_seq'))),
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

CREATE FUNCTION bulk_upsert_price_size(
  sizes price_size[]
)
RETURNS setof price_size
AS $$
  DECLARE
    s price_size;
    vals price_size;
  BEGIN
    FOREACH s IN ARRAY sizes LOOP
      INSERT INTO price_size(
        id,
        product_id,
        size_name
      )
        VALUES (
          COALESCE(s.id, (select nextval('price_size_id_seq'))),
          s.product_id,
          s.size_name
        )
      ON CONFLICT (id) DO UPDATE SET
        product_id=EXCLUDED.product_id,
        size_name=EXCLUDED.size_name
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION bulk_upsert_price_entry(
  entries price_entry[]
)
RETURNS setof price_entry
AS $$
  DECLARE
    e price_entry;
    vals price_entry;
  BEGIN
    FOREACH e IN ARRAY entries LOOP
      INSERT INTO price_entry(
        id,
        size_id,
        entry_date, 
        entry_description,
        content,
        highlight
      )
        VALUES (
          COALESCE(e.id, (select nextval('price_entry_id_seq'))),
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

-- migrate:down
DROP FUNCTION bulk_upsert_price_category;
DROP FUNCTION bulk_upsert_price_product;
DROP FUNCTION bulk_upsert_price_size;
DROP FUNCTION bulk_upsert_price_entry;
