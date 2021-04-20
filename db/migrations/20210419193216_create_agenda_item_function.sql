-- migrate:up
CREATE FUNCTION bulk_upsert_agenda_item(
  items agenda_item[]
)
RETURNS setof agenda_item
AS $$
  DECLARE
    i agenda_item;
    vals agenda_item;
  BEGIN
    FOREACH i IN ARRAY items LOOP
      INSERT INTO agenda_item(
        id,
        content,
        item_date,
        sort_order
      )
        VALUES (
          COALESCE(i.id, (select nextval('agenda_item_id_seq'))),
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

-- migrate:down
DROP FUNCTION bulk_upsert_agenda_item;
