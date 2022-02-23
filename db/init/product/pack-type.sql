CREATE TABLE product.pack_atmosphere (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, ma_code),
	shipper_id TEXT,
  ma_code TEXT,
  ma_description TEXT
);

CREATE TABLE product.pack_box_style (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, box_style),
	shipper_id TEXT,
  box_style TEXT,
  box_description TEXT,
  combine_with TEXT,
  combine_description TEXT
);

CREATE TABLE product.pack_box_type (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, box_type),
	shipper_id TEXT,
  box_type TEXT,
  box_description TEXT
);

CREATE TABLE product.pack_destination (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, destination_code),
	shipper_id TEXT,
  destination_code TEXT,
  destination_description TEXT
);

CREATE TABLE product.pack_grade (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, grade_code),
	shipper_id TEXT,
  grade_code TEXT,
  grade_description TEXT
);

CREATE TABLE product.pack_hold (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, hold_code),
	shipper_id TEXT,
  hold_code TEXT,
  hold_description TEXT
);

CREATE TABLE product.pack_label (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, label_code),
  label_code TEXT,
  label_name TEXT,
	shipper_id TEXT,
  shipper_name TEXT
);

CREATE TABLE product.pack_liner (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, liner_code),
	shipper_id TEXT,
  liner_code TEXT,
  liner_description TEXT
);

CREATE TABLE product.pack_out (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, out_code),
	shipper_id TEXT,
  out_code TEXT,
  out_description TEXT,
  combine_with TEXT
);

CREATE TABLE product.pack_pallet_type (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, pallet_type),
	shipper_id TEXT,
  pallet_type TEXT,
  pallet_type_description TEXT,
  combine_with TEXT
);

CREATE TABLE product.pack_production (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, production_code),
	shipper_id TEXT,
  production_code TEXT,
  production_description TEXT,
  combine_with TEXT
);

CREATE TABLE product.pack_special (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, customer_code),
	shipper_id TEXT,
  customer_code TEXT,
	customer_id TEXT,
  customer_name TEXT
);

CREATE TABLE product.pack_style (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, pack_style),
	shipper_id TEXT,
  pack_style TEXT,
  style_description TEXT,
  combine_with TEXT
);

CREATE TABLE product.pack_tree_ripe (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, tree_ripe),
	shipper_id TEXT,
  tree_ripe TEXT,
  tree_ripe_description TEXT
);

CREATE TABLE product.pack_master (
	id BIGSERIAL PRIMARY KEY,
	shipper_id TEXT,
	label_code_id TEXT,
	customer_code_id TEXT,
	box_type_id TEXT,
	box_style_id TEXT,
	pack_style_id TEXT,
	out_code_id TEXT,
	out_quantity TEXT,
	out_weight TEXT,
	production_code_id TEXT,
	tree_ripe_id TEXT,
	grade_code_id TEXT,
	ma_code_id TEXT,
  liner_code_id TEXT,
  net_weight_contents NUMERIC,
  net_weight_box NUMERIC,
  box_length NUMERIC,
  box_width NUMERIC,
  box_height NUMERIC,
  pallet_type_id TEXT,
  default_pallet_quantity NUMERIC,
  plu_upc_code TEXT,
  destination_code_id TEXT,
  old_pack_code TEXT,
  old_label_code TEXT,
  jv_pack_code TEXT,
  pack_description TEXT,
  variety_id TEXT,
  species_id TEXT,
  hold_code_id TEXT
);

CREATE FUNCTION product.pack_atmosphere_shipper(IN p product.pack_atmosphere)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_box_style_shipper(IN p product.pack_box_style)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_box_type_shipper(IN p product.pack_box_type)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_destination_shipper(IN p product.pack_destination)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_grade_shipper(IN p product.pack_grade)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_hold_shipper(IN p product.pack_hold)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_label_shipper(IN p product.pack_label)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_liner_shipper(IN p product.pack_liner)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_out_shipper(IN p product.pack_out)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_pallet_type_shipper(IN p product.pack_pallet_type)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_production_shipper(IN p product.pack_production)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_special_shipper(IN p product.pack_special)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_special_customer(IN p product.pack_special)
    RETURNS directory.customer
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.customer c WHERE c.id = p.customer_id
$BODY$;

CREATE FUNCTION product.pack_style_shipper(IN p product.pack_style)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_tree_ripe_shipper(IN p product.pack_tree_ripe)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_shipper(IN a product.pack_master)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper b WHERE b.id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_label(IN a product.pack_master)
    RETURNS product.pack_label
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_label b
  WHERE b.label_code = a.label_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_customer_special(IN a product.pack_master)
    RETURNS product.pack_special
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_special b
  WHERE b.customer_code = a.customer_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_box_type(IN a product.pack_master)
    RETURNS product.pack_box_type
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_box_type b
  WHERE b.box_type = a.box_type_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_box_style(IN a product.pack_master)
    RETURNS product.pack_box_style
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_box_style b
  WHERE b.box_style = a.box_style_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_pack_style(IN a product.pack_master)
    RETURNS product.pack_style
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_style b
  WHERE b.pack_style = a.pack_style_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_out(IN a product.pack_master)
    RETURNS product.pack_out
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_out b
  WHERE b.out_code = a.out_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_production(IN a product.pack_master)
    RETURNS product.pack_production
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_production b
  WHERE b.production_code = a.production_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_tree_ripe(IN a product.pack_master)
    RETURNS product.pack_tree_ripe
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_tree_ripe b
  WHERE b.tree_ripe = a.tree_ripe_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_grade(IN a product.pack_master)
    RETURNS product.pack_grade
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_grade b
  WHERE b.grade_code = a.grade_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_atmosphere(IN a product.pack_master)
    RETURNS product.pack_atmosphere
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_atmosphere b
  WHERE b.ma_code = a.ma_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_liner(IN a product.pack_master)
    RETURNS product.pack_liner
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_liner b
  WHERE b.liner_code = a.liner_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_pallet_type(IN a product.pack_master)
    RETURNS product.pack_pallet_type
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_pallet_type b
  WHERE b.pallet_type = a.pallet_type_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_destination(IN a product.pack_master)
    RETURNS product.pack_destination
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_destination b
  WHERE b.destination_code = a.destination_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_variety(IN a product.pack_master)
    RETURNS product.product_variety
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_variety b WHERE b.id = a.variety_id
$BODY$;

CREATE FUNCTION product.pack_master_species(IN a product.pack_master)
    RETURNS product.product_species
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_species b WHERE b.id = a.species_id
$BODY$;

CREATE FUNCTION product.pack_master_hold(IN a product.pack_master)
    RETURNS product.pack_hold
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_hold b
  WHERE b.hold_code = a.hold_code_id AND b.shipper_id = a.shipper_id
$BODY$;
