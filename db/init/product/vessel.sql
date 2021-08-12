CREATE TABLE product.vessel (
  id BIGSERIAL PRIMARY KEY,
  vessel_code TEXT NOT NULL,
  vessel_name TEXT,
  arrival_port TEXT,
  country_id TEXT,
  departure_date DATE,
  arrival_date DATE,
  discharge_date DATE,
  coast TEXT
);

CREATE FUNCTION product.vessel_country(IN v product.vessel)
    RETURNS directory.country
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.country c WHERE c.id = v.country_id
$BODY$;

CREATE FUNCTION product.vessel_warehouse(IN v product.vessel)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = v.arrival_port
$BODY$;

CREATE FUNCTION product.vessel_arrival_port_distinct_values()
  RETURNS SETOF TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT DISTINCT CONCAT(w.warehouse_name, ' (', v.arrival_port, ')')
  FROM product.vessel v
  LEFT JOIN directory.warehouse w
  ON w.id = v.arrival_port;
$BODY$;

CREATE FUNCTION product.vessel_inventory_items(IN v product.vessel)
    RETURNS SETOF product.inventory_item
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.inventory_item i WHERE i.vessel_code = v.vessel_code
$BODY$;

CREATE FUNCTION product.vessel_pallets(IN v product.vessel)
    RETURNS SETOF product.pallet
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet p WHERE p.vessel_code = v.vessel_code
$BODY$;

CREATE FUNCTION product.vessel_search_text(IN v product.vessel)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		v.vessel_code,
		v.vessel_name,
		v.arrival_port,
		v.country_id,
		c.country_name,
    CAST(v.departure_date AS TEXT),
    CAST(v.arrival_date AS TEXT),
    CAST(v.discharge_date AS TEXT),
    v.coast
	) FROM product.vessel vv FULL JOIN directory.country c ON (v.country_id = c.id) WHERE v.id = vv.id
$BODY$;
