CREATE TABLE public.user (
	id BIGSERIAL PRIMARY KEY,
	pin TEXT UNIQUE,
	person_contact_id BIGINT
		REFERENCES directory.person_contact(id)
		ON DELETE SET NULL
);

CREATE TABLE public.user_message (
	id BIGSERIAL PRIMARY KEY,
	action_link TEXT,
	action_text TEXT,
	details TEXT,
	header TEXT,
	is_read BOOLEAN NOT NULL,
	message_date TIMESTAMP,
	priority NUMERIC,
	user_id BIGINT
		REFERENCES public.user(id)
		ON DELETE CASCADE
);

CREATE FUNCTION public.bulk_create_user_message(
  messages public.user_message[]
)
RETURNS setof public.user_message
AS $$
  DECLARE
    m public.user_message;
    vals public.user_message;
  BEGIN
    FOREACH m IN ARRAY messages LOOP
      INSERT INTO public.user_message(
				id,
        action_link,
        action_text,
        details,
        header,
        is_read,
				message_date,
				priority,
				user_id
      )
        VALUES (
          COALESCE(m.id, (select nextval('public.user_message_id_seq'))),
          m.action_link,
					m.action_text,
					m.details,
					m.header,
					m.is_read,
					m.message_date,
					m.priority,
					m.user_id
        )
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
