CREATE TABLE inspection.psa_grape_pallet (
	id BIGINT DEFAULT nextval('pallet_ids') PRIMARY KEY,
	location TEXT,
	arrival TEXT,
	importer_name TEXT,
	exporter_name TEXT,
	commodity TEXT,
	product_code TEXT,
	variety TEXT,
	insp_date DATE,
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
	grade TEXT,
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
	auto_opening TEXT,
	bunches TEXT,
	size_min TEXT,
	size_max TEXT,
	size_most TEXT,
	undersize_bunches_count TEXT,
	auto_undersize_berries_bunches TEXT,
	undersize_berries_pct TEXT,
	color_min TEXT,
	color_max TEXT,
	color_most TEXT,
	color_consistency TEXT,
	auto_color_consistency TEXT,
	sunburn_bunches TEXT,
	auto_sunburn_bunches TEXT,
	sunburn_pct TEXT,
	sunburn_bunches_deg TEXT,
	bunch_conformation TEXT,
	auto_bunch_conformation TEXT,
	straggly_bunches TEXT,
	straggly_pct TEXT,
	small_bunches TEXT,
	russet_marks_bunches TEXT,
	russet_marks_pct TEXT,
	auto_russet_marks_pct TEXT,
	dust_pct TEXT,
	auto_dust_pct TEXT,
	residues_pct TEXT,
	auto_residues_pct TEXT,
	tight_bunches TEXT,
	auto_tight_bunches TEXT,
	bruising_bunches TEXT,
	auto_bruising_bunches TEXT,
	bruising_pct TEXT,
	bruising_deg TEXT,
	stem_dehydration_pct TEXT,
	auto_stem_dehydration_pct TEXT,
	stem_dehydration_deg TEXT,
	berry_condition TEXT,
	auto_berry_condition TEXT,
	h2o_berries TEXT,
	auto_h2o_berries TEXT,
	so2_damage_pct TEXT,
	auto_so2_damage_pct	 TEXT,
	so2_damage_deg TEXT,
	weak_bunches TEXT,
	auto_weak_bunches TEXT,
	splits_hairline_pct TEXT,
	auto_splits_hairline_pct TEXT,
	splits_wet_crush_pct TEXT,
	auto_splits_wet_crush_pct TEXT,
	splits_dry_pct TEXT,
	auto_splits_dry_pct TEXT,
	int_disc TEXT,
	auto_int_disc TEXT,
	int_disc_deg TEXT,
	decay_mold_berries TEXT,
	auto_decay_mold_berries TEXT,
	decay_slipskin_berries TEXT,
	auto_decay_slipskin_berries TEXT,
	decay_nest_berries TEXT,
	auto_decay_nest_berries TEXT,
	decay_nest_deg TEXT,
	shatter_pct TEXT,
	auto_shatter_pct TEXT,
	brix_min TEXT,
	brix_max TEXT,
	brix_most TEXT,
	overall_quality NUMERIC,
	auto_overall_quality TEXT,
	overall_condition NUMERIC,
	auto_overall_condition TEXT,
	comment1 TEXT,
	comment2 TEXT,
	inspection_type TEXT,
	short_insp TEXT,
	fixed_weight TEXT
);

CREATE FUNCTION inspection.batch_create_psa_grape_pallet(
  new_pallets inspection.psa_grape_pallet[]
)
RETURNS setof inspection.psa_grape_pallet
AS $$
  DECLARE
    p inspection.psa_grape_pallet;
    vals inspection.psa_grape_pallet;
  BEGIN
    FOREACH p IN ARRAY new_pallets LOOP
      INSERT INTO inspection.psa_grape_pallet(location, arrival, importer_name, exporter_name, commodity, product_code, variety, insp_date, quantity, hatch, deck, container_id, fumigation, label_code, insp_location, importer_code, lot_code, insp_lot, pallet_id, grower_code, insp_grower_code, pack_date, insp_pack_date, size, insp_size, pack_code, pack_description, secondary_description, grade, insp_pack_code, count, plu, plu_pct, country_of_origin, upc, weight, underweight_min, underweight_max, weighed_units, underweight_units, underweight_pct, pulp_temp, opening, auto_opening, bunches, size_min, size_max, size_most, undersize_bunches_count, auto_undersize_berries_bunches, undersize_berries_pct, color_min, color_max, color_most, color_consistency, auto_color_consistency, sunburn_bunches, auto_sunburn_bunches, sunburn_pct, sunburn_bunches_deg, bunch_conformation, auto_bunch_conformation, straggly_bunches, straggly_pct, small_bunches, russet_marks_bunches, russet_marks_pct, auto_russet_marks_pct, dust_pct, auto_dust_pct, residues_pct, auto_residues_pct, tight_bunches, auto_tight_bunches, bruising_bunches, auto_bruising_bunches, bruising_pct, bruising_deg, stem_dehydration_pct, auto_stem_dehydration_pct, stem_dehydration_deg, berry_condition, auto_berry_condition, h2o_berries, auto_h2o_berries, so2_damage_pct, auto_so2_damage_pct, so2_damage_deg, weak_bunches, auto_weak_bunches, splits_hairline_pct, auto_splits_hairline_pct, splits_wet_crush_pct, auto_splits_wet_crush_pct, splits_dry_pct, auto_splits_dry_pct, int_disc, auto_int_disc, int_disc_deg, decay_mold_berries, auto_decay_mold_berries, decay_slipskin_berries, auto_decay_slipskin_berries, decay_nest_berries, auto_decay_nest_berries, decay_nest_deg, shatter_pct, auto_shatter_pct, brix_min, brix_max, brix_most, overall_quality, auto_overall_quality, overall_condition, auto_overall_condition, comment1, comment2, inspection_type, short_insp, fixed_weight)
        VALUES (p.location, p.arrival, p.importer_name, p.exporter_name, p.commodity, p.product_code, p.variety, p.insp_date, p.quantity, p.hatch, p.deck, p.container_id, p.fumigation, p.label_code, p.insp_location, p.importer_code, p.lot_code, p.insp_lot, p.pallet_id, p.grower_code, p.insp_grower_code, p.pack_date, p.insp_pack_date, p.size, p.insp_size, p.pack_code, p.pack_description, p.secondary_description, p.grade, p.insp_pack_code, p.count, p.plu, p.plu_pct, p.country_of_origin, p.upc, p.weight, p.underweight_min, p.underweight_max, p.weighed_units, p.underweight_units, p.underweight_pct, p.pulp_temp, p.opening, p.auto_opening, p.bunches, p.size_min, p.size_max, p.size_most, p.undersize_bunches_count, p.auto_undersize_berries_bunches, p.undersize_berries_pct, p.color_min, p.color_max, p.color_most, p.color_consistency, p.auto_color_consistency, p.sunburn_bunches, p.auto_sunburn_bunches, p.sunburn_pct, p.sunburn_bunches_deg, p.bunch_conformation, p.auto_bunch_conformation, p.straggly_bunches, p.straggly_pct, p.small_bunches, p.russet_marks_bunches, p.russet_marks_pct, p.auto_russet_marks_pct, p.dust_pct, p.auto_dust_pct, p.residues_pct, p.auto_residues_pct, p.tight_bunches, p.auto_tight_bunches, p.bruising_bunches, p.auto_bruising_bunches, p.bruising_pct, p.bruising_deg, p.stem_dehydration_pct, p.auto_stem_dehydration_pct, p.stem_dehydration_deg, p.berry_condition, p.auto_berry_condition, p.h2o_berries, p.auto_h2o_berries, p.so2_damage_pct, p.auto_so2_damage_pct, p.so2_damage_deg, p.weak_bunches, p.auto_weak_bunches, p.splits_hairline_pct, p.auto_splits_hairline_pct, p.splits_wet_crush_pct, p.auto_splits_wet_crush_pct, p.splits_dry_pct, p.auto_splits_dry_pct, p.int_disc, p.auto_int_disc, p.int_disc_deg, p.decay_mold_berries, p.auto_decay_mold_berries, p.decay_slipskin_berries, p.auto_decay_slipskin_berries, p.decay_nest_berries, p.auto_decay_nest_berries, p.decay_nest_deg, p.shatter_pct, p.auto_shatter_pct, p.brix_min, p.brix_max, p.brix_most, p.overall_quality, p.auto_overall_quality, p.overall_condition, p.auto_overall_condition, p.comment1, p.comment2, p.inspection_type, p.short_insp, p.fixed_weight)
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION inspection.psa_arrival_report_grape_pallets(IN r inspection.psa_arrival_report)
	RETURNS SETOF inspection.psa_grape_pallet
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT * FROM inspection.psa_grape_pallet gp
	WHERE gp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name) AND gp.exporter_name = r.exporter_name
$BODY$;

CREATE FUNCTION inspection.psa_arrival_report_avg_grape_bunches_per_box(IN r inspection.psa_arrival_report, In vari TEXT)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT ROUND(AVG(gp.bunches::NUMERIC), 1) FROM inspection.psa_grape_pallet gp
	WHERE gp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	AND gp.exporter_name = r.exporter_name
	AND gp.bunches ~ '^[0-9\.]+$'
	AND (vari = '' OR gp.variety = vari)
$BODY$;

CREATE FUNCTION inspection.psa_arrival_report_avg_grape_brix_max(IN r inspection.psa_arrival_report, In vari TEXT)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT ROUND(AVG(gp.brix_max::NUMERIC), 1) FROM inspection.psa_grape_pallet gp
	WHERE gp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	AND gp.exporter_name = r.exporter_name
	AND gp.brix_max ~ '^[0-9\.]+$'
	AND (vari = '' OR gp.variety = vari)
$BODY$;

CREATE FUNCTION inspection.psa_arrival_report_avg_grape_brix_min(IN r inspection.psa_arrival_report, In vari TEXT)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT ROUND(AVG(gp.brix_min::NUMERIC), 1) FROM inspection.psa_grape_pallet gp
	WHERE gp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	AND gp.exporter_name = r.exporter_name
	AND gp.brix_min ~ '^[0-9\.]+$'
	AND (vari = '' OR gp.variety = vari)
$BODY$;

CREATE FUNCTION inspection.psa_arrival_report_avg_grape_brix_most(IN r inspection.psa_arrival_report, In vari TEXT)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT ROUND(AVG(gp.brix_most::NUMERIC), 1) FROM inspection.psa_grape_pallet gp
	WHERE gp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	AND gp.exporter_name = r.exporter_name
	AND gp.brix_most ~ '^[0-9\.]+$'
	AND (vari = '' OR gp.variety = vari)
$BODY$;

CREATE FUNCTION inspection.psa_grape_pallet_pictures(IN gp inspection.psa_grape_pallet)
	RETURNS SETOF inspection.psa_arrival_picture
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM inspection.psa_arrival_picture AS p
  WHERE gp.pallet_id = p.pallet_id AND gp.arrival LIKE '%' || p.arrival_code || '%'
$BODY$;
