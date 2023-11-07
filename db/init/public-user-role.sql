CREATE TABLE public.user_role (
	role_name TEXT NOT NULL,
	user_id BIGINT
		REFERENCES public.user(id)
		ON DELETE CASCADE,
	UNIQUE (user_id, role_name)
);
