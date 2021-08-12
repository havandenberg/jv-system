CREATE TABLE sales.price_entry (
    id BIGSERIAL PRIMARY KEY,
    size_id BIGINT NOT NULL REFERENCES sales.price_size(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    entry_description TEXT NOT NULL,
    content TEXT NOT NULL,
    highlight BOOLEAN NOT NULL
);

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
