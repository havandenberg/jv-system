-- migrate:up
CREATE FUNCTION public.distinct_values(schema_name text, table_name text, column_name text) RETURNS SETOF text AS $$
	BEGIN
		RETURN QUERY EXECUTE format('select distinct %I from %I.%I', column_name, schema_name, table_name);
	END;
$$ LANGUAGE plpgsql STABLE;

-- migrate:down
DROP FUNCTION public.distinct_values;
