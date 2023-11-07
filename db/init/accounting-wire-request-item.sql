CREATE TABLE accounting.wire_request_ocean_freight_item (
  id BIGSERIAL PRIMARY KEY,
  wire_request_id BIGINT NOT NULL REFERENCES accounting.wire_request(id),
  bill_of_lading TEXT NOT NULL,
  vessel_code TEXT NOT NULL,
  shipper_id TEXT NOT NULL,
  pallet_count NUMERIC NOT NULL,
  freight_amount NUMERIC NOT NULL,
  received_date DATE NOT NULL
);

CREATE INDEX ON accounting.wire_request_ocean_freight_item (vessel_code, shipper_id);

CREATE FUNCTION accounting.wire_request_ocean_freight_item_vessel(IN w accounting.wire_request_ocean_freight_item)
    RETURNS product.vessel
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = w.vessel_code AND v.is_pre = false
    ORDER BY v.departure_date DESC LIMIT 1;
$BODY$;

CREATE FUNCTION accounting.wire_request_ocean_freight_item_shipper(IN w accounting.wire_request_ocean_freight_item)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = w.shipper_id
$BODY$;

CREATE TABLE accounting.wire_request_shipper_advance_item (
  id BIGSERIAL PRIMARY KEY,
  wire_request_id BIGINT NOT NULL REFERENCES accounting.wire_request(id),
  bill_of_lading TEXT NOT NULL,
  vessel_code TEXT NOT NULL,
  species_id TEXT NOT NULL,
  box_amount NUMERIC NOT NULL
);

CREATE INDEX ON accounting.wire_request_shipper_advance_item (vessel_code);

CREATE FUNCTION accounting.wire_request_shipper_advance_item_vessel(IN w accounting.wire_request_shipper_advance_item)
    RETURNS product.vessel
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = w.vessel_code AND v.is_pre = false
    ORDER BY v.departure_date DESC LIMIT 1;
$BODY$;

CREATE FUNCTION accounting.wire_request_shipper_advance_item_species(IN w accounting.wire_request_shipper_advance_item)
    RETURNS product.product_species
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_species s WHERE s.id = w.species_id;
$BODY$;

CREATE TABLE accounting.wire_request_account_of_sale_item (
  id BIGSERIAL PRIMARY KEY,
  wire_request_id BIGINT NOT NULL REFERENCES accounting.wire_request(id),
  bill_of_lading TEXT NOT NULL,
  vessel_code TEXT NOT NULL
);

CREATE INDEX ON accounting.wire_request_account_of_sale_item (vessel_code);

CREATE FUNCTION accounting.wire_request_account_of_sale_item_vessel(IN w accounting.wire_request_account_of_sale_item)
    RETURNS product.vessel
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = w.vessel_code AND v.is_pre = false
    ORDER BY v.departure_date DESC LIMIT 1;
$BODY$;

CREATE TABLE accounting.wire_request_misc_item (
  id BIGSERIAL PRIMARY KEY,
  wire_request_id BIGINT NOT NULL REFERENCES accounting.wire_request(id),
  item_description TEXT NOT NULL,
  item_amount NUMERIC NOT NULL
);
