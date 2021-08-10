CREATE TABLE product.product_species (
	id TEXT PRIMARY KEY,
	species_description TEXT,
	secondary_description TEXT,
	fda_product_code TEXT,
	fda_industry_code TEXT,
	default_temperature TEXT
);

CREATE TABLE product.product_variety (
	id TEXT PRIMARY KEY,
	variety_description TEXT,
	secondary_description TEXT,
	customer_letter_sequence TEXT,
	summary_code TEXT,
	variety_group TEXT,
  combine_with TEXT
);

CREATE TABLE product.product_size (
	id BIGSERIAL PRIMARY KEY,
	species_id TEXT,
	variety_id TEXT,
	jv_code TEXT,
	jv_description TEXT,
	shipper_code TEXT,
	shipper_description TEXT,
	combine_with TEXT,
	combine_description TEXT,
	shipper_id TEXT
);

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

CREATE TABLE product.product_master (
  id TEXT PRIMARY KEY,
  default_pallet_quantity TEXT,
  lot_number TEXT
);

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

CREATE TABLE product.pallet_temp_one (
  id BIGSERIAL PRIMARY KEY,
  vessel_code TEXT NOT NULL,
  pallet_id TEXT NOT NULL,
  product_id TEXT,
  current_box_quantity NUMERIC,
  received_box_quantity NUMERIC,
  returned_box_quantity NUMERIC,
  location_id TEXT,
  room TEXT,
  section TEXT,
  row TEXT,
  jv_lot_number TEXT,
  shipper_id TEXT,
  date_transferred_to_storage DATE,
  order_id TEXT,
  back_order_id TEXT,
  shipped BOOLEAN,
  age NUMERIC,
  volume_discount_code TEXT,
  original_location_id TEXT
);

CREATE TABLE product.pallet_temp_two (
  id BIGSERIAL PRIMARY KEY,
  filler TEXT,
  pallet_id TEXT NOT NULL,
  grower_id TEXT,
  old_pack_code TEXT,
  pack_date TEXT,
  hatch TEXT,
  deck TEXT,
  bill_of_lading TEXT,
  container_id TEXT,
  temperature_recording TEXT
);

CREATE TABLE AS product.pallet (
  SELECT * FROM product.pallet_temp_one pone LEFT JOIN product.pallet_temp_two ptwo ON pone.pallet_id = ptwo.pallet_id
);

CREATE TABLE product.pallet_section (
  id BIGSERIAL PRIMARY KEY,
  pallet_id TEXT NOT NULL,
  grower_id TEXT,
  variety_id TEXT,
  size_id TEXT,
  box_quantity NUMERIC,
  pack_date TEXT
);

CREATE TABLE product.inventory_item (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT,
  location_id TEXT,
  vessel_code TEXT,
  jv_lot_number TEXT,
  shipper_id TEXT,
  pallets_received NUMERIC,
  pallets_committed NUMERIC,
  pallets_on_hand NUMERIC,
  pallets_available NUMERIC,
  pallets_shipped NUMERIC,
  pallets_transferred_in NUMERIC,
  pallets_transferred_out NUMERIC,
  plu BOOLEAN,
  country_id TEXT,
  special_lot_number TEXT,
  coast TEXT,
  storage_rank TEXT,
  warehouse_id TEXT
);
