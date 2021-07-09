CREATE TABLE inspection.psa_persimmon_pallet (
	id BIGINT DEFAULT nextval('pallet_ids') PRIMARY KEY,
	location TEXT,
  arrival TEXT,
  importer_name TEXT,
  exporter_name TEXT,
  commodity TEXT,
  product_code TEXT,
  variety TEXT,
  insp_date TEXT,
  quantity NUMERIC,
  hatch TEXT,
  deck TEXT,
  container_id TEXT,
  fumigation TEXT,
  label_code TEXT,
  insp_location TEXT,
  importer_code TEXT,
  lot_code TEXT,
  insp_lot TEXT,
  pallet_id TEXT,
  grower_code TEXT,
  insp_grower_code TEXT,
  pack_date TEXT,
  insp_pack_date TEXT,
  size TEXT,
  insp_size TEXT,
  pack_code TEXT,
  pack_description TEXT,
  secondary_description TEXT,
  insp_pack_code TEXT,
  count TEXT,
  plu TEXT,
  plu_pct TEXT,
  country_of_origin TEXT,
  upc TEXT,
  weight TEXT,
  underweight_min TEXT,
  underweight_max TEXT,
  weighed_units TEXT,
  underweight_units TEXT,
  underweight_pct TEXT,
  pulp_temp TEXT,
  opening TEXT,
  color TEXT,
  scars_marks_pieces TEXT,
  scars_marks_pct TEXT,
  scars_marks_deg TEXT,
  green_color_pieces TEXT,
  green_color TEXT,
  green_color_deg TEXT,
  cuts_splits_pieces TEXT,
  cuts_splits_pct TEXT,
  cuts_splits_deg TEXT,
  bruising_pieces TEXT,
  bruising_pct TEXT,
  bruising_deg TEXT,
  dehydration_pieces TEXT,
  dehydration_pct TEXT,
  dehydration_deg TEXT,
  cut_count TEXT,
  seeds_pieces TEXT,
  seeds_pct TEXT,
  internal_damage_pieces TEXT,
  internal_damage_per TEXT,
  internal_damage_deg TEXT,
  decay_pieces TEXT,
  decay_pct TEXT,
  decay_deg TEXT,
  mold_pieces TEXT,
  mold_pct TEXT,
  brix TEXT,
  pressure1 TEXT,
  pressure2 TEXT,
  pressure3 TEXT,
  pressure4 TEXT,
  pressure5 TEXT,
  pressure6 TEXT,
  pressures_min TEXT,
  pressures_max TEXT,
  pressures_avg TEXT,
  overall_quality NUMERIC,
  overall_condition NUMERIC,
  comment1 TEXT,
  comment2 TEXT,
  inspection_type TEXT,
  short_insp TEXT,
  fixed_weight TEXT
);

CREATE FUNCTION inspection.batch_create_psa_persimmon_pallet(
  new_pallets inspection.psa_persimmon_pallet[]
)
RETURNS setof inspection.psa_persimmon_pallet
AS $$
  DECLARE
    p inspection.psa_persimmon_pallet;
    vals inspection.psa_persimmon_pallet;
  BEGIN
    FOREACH p IN ARRAY new_pallets LOOP
      INSERT INTO inspection.psa_persimmon_pallet(location, arrival, importer_name, exporter_name, commodity, product_code, variety, insp_date, quantity, hatch, deck, container_id, fumigation, label_code, insp_location, importer_code, lot_code, insp_lot, pallet_id, grower_code, insp_grower_code, pack_date, insp_pack_date, size, insp_size, pack_code, pack_description, secondary_description, insp_pack_code, count, plu, plu_pct, country_of_origin, upc, weight, underweight_min, underweight_max, weighed_units, underweight_units, underweight_pct, pulp_temp, opening, color, scars_marks_pieces, scars_marks_pct, scars_marks_deg, green_color_pieces, green_color, green_color_deg, cuts_splits_pieces, cuts_splits_pct, cuts_splits_deg, bruising_pieces, bruising_pct, bruising_deg, dehydration_pieces, dehydration_pct, dehydration_deg, cut_count, seeds_pieces, seeds_pct, internal_damage_pieces, internal_damage_per, internal_damage_deg, decay_pieces, decay_pct, decay_deg, mold_pieces, mold_pct, brix, pressure1, pressure2, pressure3, pressure4, pressure5, pressure6, pressures_min, pressures_max, pressures_avg, overall_quality, overall_condition, comment1, comment2, inspection_type, short_insp, fixed_weight)
        VALUES (p.location, p.arrival, p.importer_name, p.exporter_name, p.commodity, p.product_code, p.variety, p.insp_date, p.quantity, p.hatch, p.deck, p.container_id, p.fumigation, p.label_code, p.insp_location, p.importer_code, p.lot_code, p.insp_lot, p.pallet_id, p.grower_code, p.insp_grower_code, p.pack_date, p.insp_pack_date, p.size, p.insp_size, p.pack_code, p.pack_description, p.secondary_description, p.insp_pack_code, p.count, p.plu, p.plu_pct, p.country_of_origin, p.upc, p.weight, p.underweight_min, p.underweight_max, p.weighed_units, p.underweight_units, p.underweight_pct, p.pulp_temp, p.opening, p.color, p.scars_marks_pieces, p.scars_marks_pct, p.scars_marks_deg, p.green_color_pieces, p.green_color, p.green_color_deg, p.cuts_splits_pieces, p.cuts_splits_pct, p.cuts_splits_deg, p.bruising_pieces, p.bruising_pct, p.bruising_deg, p.dehydration_pieces, p.dehydration_pct, p.dehydration_deg, p.cut_count, p.seeds_pieces, p.seeds_pct, p.internal_damage_pieces, p.internal_damage_per, p.internal_damage_deg, p.decay_pieces, p.decay_pct, p.decay_deg, p.mold_pieces, p.mold_pct, p.brix, p.pressure1, p.pressure2, p.pressure3, p.pressure4, p.pressure5, p.pressure6, p.pressures_min, p.pressures_max, p.pressures_avg, p.overall_quality, p.overall_condition, p.comment1, p.comment2, p.inspection_type, p.short_insp, p.fixed_weight)
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION inspection.psa_arrival_report_persimmon_pallets(IN r inspection.psa_arrival_report)
	RETURNS SETOF inspection.psa_persimmon_pallet
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT * FROM inspection.psa_persimmon_pallet psp
	WHERE psp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name) AND psp.exporter_name = r.exporter_name
$BODY$;

CREATE FUNCTION inspection.psa_arrival_report_avg_persimmon_pressures_max(IN r inspection.psa_arrival_report, In vari TEXT)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT ROUND(AVG(psp.pressures_max::NUMERIC), 1) FROM inspection.psa_persimmon_pallet psp
	WHERE psp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	AND psp.exporter_name = r.exporter_name
	AND psp.pressures_max ~ '^[0-9\.]+$'
	AND (vari = '' OR psp.variety = vari)
$BODY$;

CREATE FUNCTION inspection.psa_arrival_report_avg_persimmon_pressures_min(IN r inspection.psa_arrival_report, In vari TEXT)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT ROUND(AVG(psp.pressures_min::NUMERIC), 1) FROM inspection.psa_persimmon_pallet psp
	WHERE psp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	AND psp.exporter_name = r.exporter_name
	AND psp.pressures_min ~ '^[0-9\.]+$'
	AND (vari = '' OR psp.variety = vari)
$BODY$;

CREATE FUNCTION inspection.psa_arrival_report_avg_persimmon_pressures_avg(IN r inspection.psa_arrival_report, In vari TEXT)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT ROUND(AVG(psp.pressures_avg::NUMERIC), 1) FROM inspection.psa_persimmon_pallet psp
	WHERE psp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	AND psp.exporter_name = r.exporter_name
	AND psp.pressures_avg ~ '^[0-9\.]+$'
	AND (vari = '' OR psp.variety = vari)
$BODY$;

CREATE FUNCTION inspection.psa_persimmon_pallet_pictures(IN psp inspection.psa_persimmon_pallet)
	RETURNS SETOF inspection.psa_arrival_picture
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM inspection.psa_arrival_picture AS p
  WHERE psp.pallet_id = p.pallet_id AND psp.arrival LIKE '%' || p.arrival_code || '%'
$BODY$;
