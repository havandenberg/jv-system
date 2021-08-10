CREATE FUNCTION product.product_size_shipper(IN s product.product_size)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper sh WHERE sh.id = s.shipper_id
$BODY$;

CREATE FUNCTION product.product_size_species(IN s product.product_size)
    RETURNS product.product_species
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_species sp WHERE sp.id = s.species_id
$BODY$;

CREATE FUNCTION product.product_size_variety(IN s product.product_size)
    RETURNS product.product_variety
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_variety v WHERE v.id = s.variety_id
$BODY$;

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

CREATE FUNCTION product.product_master_species(IN a product.product_master)
    RETURNS product.product_species
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_species b WHERE b.id = SUBSTRING(a.id, 1, 2);
$BODY$;

CREATE FUNCTION product.product_master_variety(IN a product.product_master)
    RETURNS product.product_variety
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_variety b WHERE b.id = SUBSTRING(a.id, 1, 4);
$BODY$;

CREATE FUNCTION product.product_master_sizes(IN a product.product_master)
    RETURNS SETOF product.product_size
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_size b
    WHERE b.jv_code = SUBSTRING(a.id, 5, 3)
    AND (
      (b.species_id = SUBSTRING(a.id, 1, 2)
      AND (b.variety_id = SUBSTRING(a.id, 1, 4) OR b.variety_id IS NULL))
    OR
      ((b.species_id = SUBSTRING(a.id, 1, 2)) OR b.species_id IS NULL)
    );
$BODY$;

CREATE FUNCTION product.product_master_pack_type(IN a product.product_master)
    RETURNS product.pack_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_master b
  WHERE b.jv_pack_code = SUBSTRING(a.id, 8, 4);
$BODY$;

CREATE FUNCTION product.product_master_search_text(IN a product.product_master)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		a.id,
		a.lot_number,
		a.default_pallet_quantity
	) FROM product.product_master;
$BODY$;

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

CREATE FUNCTION product.pallet(IN palletId BIGINT)
    RETURNS product.pallet
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet p WHERE p.id = palletId
$BODY$;

CREATE FUNCTION product.pallet_pallet_sections(IN p product.pallet)
    RETURNS SETOF product.pallet_section
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet_section ps WHERE ps.pallet_id = p.pallet_id
$BODY$;

CREATE FUNCTION product.pallet_vessel(IN p product.pallet)
    RETURNS product.vessel
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = p.vessel_code LIMIT 1
$BODY$;

CREATE FUNCTION product.pallet_product(IN p product.pallet)
    RETURNS product.product_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_master pm WHERE pm.id = p.product_id
$BODY$;

CREATE FUNCTION product.pallet_warehouse(IN p product.pallet)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = p.location_id
$BODY$;

CREATE FUNCTION product.pallet_shipper(IN p product.pallet)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pallet_original_location(IN p product.pallet)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = p.original_location_id
$BODY$;

-- CREATE FUNCTION product.pallet_psa_arrival_report(IN p product.pallet)
--     RETURNS inspection.psa_arrival_report
--     LANGUAGE 'sql'
--     STABLE
--     PARALLEL UNSAFE
--     COST 100
-- AS $BODY$
--   SELECT * FROM inspection.psa_arrival_report par
--   WHERE p.arrival_code = par.arrival_code
--     AND ap.exporter_name = par.exporter_name
-- $BODY$;

CREATE FUNCTION product.pallet_search_text(IN p product.pallet)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
	p.pallet_id,
	p.product_id,
	p.room,
	p.section,
	p.row,
	p.jv_lot_number,
	p.order_id,
	p.back_order_id,
	p.volume_discount_code,
	p.filler,
	p.grower_id,
	p.old_pack_code,
	p.hatch,
	p.deck,
	p.bill_of_lading,
	p.container_id,
	p.temperature_recording
	) FROM product.pallet;
$BODY$;

CREATE FUNCTION product.pallet_section_variety(IN p product.pallet_section)
    RETURNS product.product_variety
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_variety v WHERE v.id = p.variety_id
$BODY$;

CREATE FUNCTION product.inventory_item_vessel(IN i product.inventory_item)
    RETURNS product.vessel
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = i.vessel_code LIMIT 1
$BODY$;

CREATE FUNCTION product.inventory_item_product(IN i product.inventory_item)
    RETURNS product.product_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_master pm WHERE pm.id = i.product_id
$BODY$;

CREATE FUNCTION product.inventory_item_warehouse(IN i product.inventory_item)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = i.location_id
$BODY$;

CREATE FUNCTION product.inventory_item_shipper(IN i product.inventory_item)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = i.shipper_id
$BODY$;

CREATE FUNCTION product.inventory_item_country(IN i product.inventory_item)
    RETURNS directory.country
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.country c WHERE c.id = i.country_id
$BODY$;

CREATE FUNCTION product.inventory_item_pallets(IN i product.inventory_item)
    RETURNS SETOF product.pallet
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet p
  WHERE p.product_id = i.product_id
  AND p.location_id = i.location_id
  AND p.vessel_code = i.vessel_code
  AND p.jv_lot_number = i.jv_lot_number
  AND p.shipper_id = i.shipper_id
$BODY$;
