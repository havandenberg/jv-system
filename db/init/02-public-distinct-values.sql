CREATE FUNCTION public.distinct_values(schema_name text, table_name text, column_name text) RETURNS SETOF text AS $$
	BEGIN
		RETURN QUERY EXECUTE format('select distinct CAST(%I AS TEXT) from %I.%I', column_name, schema_name, table_name);
	END;
$$ LANGUAGE plpgsql STABLE;
