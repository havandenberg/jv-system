CREATE TABLE sales.agenda_item (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    item_date DATE NOT NULL,
    sort_order INT NOT NULL
);

CREATE FUNCTION sales.bulk_upsert_agenda_item(
  items sales.agenda_item[]
)
RETURNS setof sales.agenda_item
AS $$
  DECLARE
    i sales.agenda_item;
    vals sales.agenda_item;
  BEGIN
    FOREACH i IN ARRAY items LOOP
      INSERT INTO sales.agenda_item(
        id,
        content,
        item_date,
        sort_order
      )
        VALUES (
          COALESCE(i.id, (select nextval('sales.agenda_item_id_seq'))),
          i.content,
          i.item_date,
          i.sort_order
        )
      ON CONFLICT (id) DO UPDATE SET
        content=EXCLUDED.content,
        item_date=EXCLUDED.item_date,
        sort_order=EXCLUDED.sort_order
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
