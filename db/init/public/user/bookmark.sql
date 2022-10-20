CREATE TABLE public.user_bookmark (
  id BIGSERIAL PRIMARY KEY,
  category TEXT,
  link_url TEXT,
  link_description TEXT,
  sort_order INT NOT NULL,
  user_id BIGINT
    REFERENCES public.user(id)
    ON DELETE CASCADE
);

CREATE FUNCTION public.bulk_upsert_user_bookmark(
  user_bookmarks public.user_bookmark[]
)
RETURNS setof public.user_bookmark
AS $$
  DECLARE
    ql public.user_bookmark;
    vals public.user_bookmark;
  BEGIN
    FOREACH ql IN ARRAY user_bookmarks LOOP
      INSERT INTO public.user_bookmark(
        id,
        category,
        link_url,
        link_description,
        sort_order,
        user_id
      )
        VALUES (
          COALESCE(ql.id, (select nextval('public.user_bookmark_id_seq'))),
          ql.category,
          ql.link_url,
          ql.link_description,
          ql.sort_order,
          ql.user_id
        )
      ON CONFLICT (id) DO UPDATE SET
        category=EXCLUDED.category,
        link_url=EXCLUDED.link_url,
        link_description=EXCLUDED.link_description,
        sort_order=EXCLUDED.sort_order,
        user_id=EXCLUDED.user_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
