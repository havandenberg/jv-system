CREATE TABLE operations.order_comment (
  id BIGSERIAL PRIMARY KEY,
  order_id NUMERIC,
  back_order_id NUMERIC,
  line_id NUMERIC,
  print_code TEXT,
  notes TEXT
);

CREATE FUNCTION operations.bulk_upsert_order_comment(
  order_comments operations.order_comment[]
)
RETURNS setof operations.order_comment
AS $$
  DECLARE
    oc operations.order_comment;
    vals operations.order_comment;
  BEGIN
    FOREACH oc IN ARRAY order_comments LOOP
      INSERT INTO operations.order_comment(
        id,
        order_id,
        back_order_id,
        line_id,
        print_code,
        notes
      )
        VALUES (
          COALESCE(oc.id, (select nextval('operations.order_comment_id_seq'))),
          oc.order_id,
          oc.back_order_id,
          oc.line_id,
          oc.print_code,
          oc.notes
        )
      ON CONFLICT (id) DO UPDATE SET
			  order_id=EXCLUDED.order_id,
			  back_order_id=EXCLUDED.back_order_id,
			  line_id=EXCLUDED.line_id,
        print_code=EXCLUDED.print_code,
			  notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION operations.bulk_delete_order_comment(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM operations.order_comment
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
