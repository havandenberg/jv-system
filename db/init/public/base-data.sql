CREATE FUNCTION public.base_data()
    RETURNS VOID
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT NULL;
$BODY$;
