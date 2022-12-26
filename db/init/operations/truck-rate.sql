CREATE TABLE operations.truck_rate (
  id BIGSERIAL PRIMARY KEY,
  location_description TEXT,
  vendor_id TEXT,
  postal_state TEXT,
  is_default BOOLEAN,
  full_load_rate NUMERIC,
  pallet_rate_1 NUMERIC,
  pallet_rate_2 NUMERIC,
  pallet_rate_3 NUMERIC,
  pallet_rate_4 NUMERIC,
  pallet_rate_5 NUMERIC,
  pallet_rate_6 NUMERIC,
  pallet_rate_7 NUMERIC,
  pallet_rate_8 NUMERIC,
  pallet_rate_9 NUMERIC,
  pallet_rate_10 NUMERIC,
  pallet_rate_11 NUMERIC,
  pallet_rate_12 NUMERIC,
  pallet_rate_13 NUMERIC,
  pallet_rate_14 NUMERIC,
  pallet_rate_15 NUMERIC,
  notes TEXT
);

CREATE FUNCTION operations.truck_rate_vendor(IN tr operations.truck_rate)
    RETURNS directory.vendor
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.vendor v
    WHERE v.id = tr.vendor_id;
$BODY$;

CREATE TABLE operations.truck_rate_customer (
  truck_rate_id BIGINT NOT NULL,
  customer_id TEXT NOT NULL,
  PRIMARY KEY (truck_rate_id, customer_id),
  FOREIGN KEY (truck_rate_id) REFERENCES operations.truck_rate(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES directory.customer(id) ON UPDATE CASCADE ON DELETE CASCADE
);
