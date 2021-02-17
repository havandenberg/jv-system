CREATE FUNCTION distinct_values(table_name text, column_name text) RETURNS SETOF text AS $$
	BEGIN
		RETURN QUERY EXECUTE format('select distinct %I from %I', column_name, table_name);
	END;
$$ LANGUAGE plpgsql STABLE;
