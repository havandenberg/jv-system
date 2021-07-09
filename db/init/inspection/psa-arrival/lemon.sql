CREATE TABLE inspection.psa_lemon_pallet (
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
  grade TEXT,
  insp_grade TEXT,
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
  diameter_min_mm TEXT,
  diameter_min_inches TEXT,
  diameter_max_mm TEXT,
  diameter_max_inches TEXT,
  diameter_most_mm TEXT,
  diameter_most_inches TEXT,
  scars_pieces TEXT,
  scars_pct TEXT,
  scars_deg TEXT,
  green_haze_pieces TEXT,
  green_haze_pct TEXT,
  green_haze_deg TEXT,
  oil_spots_pieces TEXT,
  oil_spots_pct TEXT,
  oil_spots_deg TEXT,
  cut_count TEXT,
  dry_pulp_pieces TEXT,
  dry_pulp_pct TEXT,
  dry_pulp_deg TEXT,
  skin_damage_pieces TEXT,
  skin_damage_pct TEXT,
  skin_damage_deg TEXT,
  peteca_pieces TEXT,
  peteca_pct TEXT,
  peteca_deg TEXT,
  decay_pieces TEXT,
  decay_pct TEXT,
  decay_deg TEXT,
  mold_pieces TEXT,
  mold_pct TEXT,
  spores_pieces TEXT,
  spores_pct TEXT,
  overall_quality NUMERIC,
  overall_condition NUMERIC,
  comment1 TEXT,
  comment2 TEXT,
  inspection_type TEXT,
  short_insp TEXT,
  fixed_weight TEXT
);

CREATE OR REPLACE FUNCTION inspection.batch_create_psa_lemon_pallet(
  new_pallets inspection.psa_lemon_pallet[]
)
RETURNS setof inspection.psa_lemon_pallet
AS $$
  DECLARE
    p inspection.psa_lemon_pallet;
    vals inspection.psa_lemon_pallet;
  BEGIN
    FOREACH p IN ARRAY new_pallets LOOP
      INSERT INTO inspection.psa_lemon_pallet(location, arrival, importer_name, exporter_name, commodity, product_code, variety, insp_date, quantity, hatch, deck, container_id, fumigation, label_code, insp_location, importer_code, lot_code, insp_lot, pallet_id, grower_code, insp_grower_code, pack_date, insp_pack_date, size, insp_size, pack_code, pack_description, secondary_description, insp_pack_code, grade, insp_grade, count, plu, plu_pct, country_of_origin, upc, weight, underweight_min, underweight_max, weighed_units, underweight_units, underweight_pct, pulp_temp, opening, color, diameter_min_mm, diameter_min_inches, diameter_max_mm, diameter_max_inches, diameter_most_mm, diameter_most_inches, scars_pieces, scars_pct, scars_deg, green_haze_pieces, green_haze_pct, green_haze_deg, oil_spots_pieces, oil_spots_pct, oil_spots_deg, cut_count, dry_pulp_pieces, dry_pulp_pct, dry_pulp_deg, skin_damage_pieces, skin_damage_pct, skin_damage_deg, peteca_pieces, peteca_pct, peteca_deg, decay_pieces, decay_pct, decay_deg, mold_pieces, mold_pct, spores_pieces, spores_pct, overall_quality, overall_condition, comment1, comment2, inspection_type, short_insp, fixed_weight)
        VALUES (p.location, p.arrival, p.importer_name, p.exporter_name, p.commodity, p.product_code, p.variety, p.insp_date, p.quantity, p.hatch, p.deck, p.container_id, p.fumigation, p.label_code, p.insp_location, p.importer_code, p.lot_code, p.insp_lot, p.pallet_id, p.grower_code, p.insp_grower_code, p.pack_date, p.insp_pack_date, p.size, p.insp_size, p.pack_code, p.pack_description, p.secondary_description, p.insp_pack_code, p.grade, p.insp_grade, p.count, p.plu, p.plu_pct, p.country_of_origin, p.upc, p.weight, p.underweight_min, p.underweight_max, p.weighed_units, p.underweight_units, p.underweight_pct, p.pulp_temp, p.opening, p.color, p.diameter_min_mm, p.diameter_min_inches, p.diameter_max_mm, p.diameter_max_inches, p.diameter_most_mm, p.diameter_most_inches, p.scars_pieces, p.scars_pct, p.scars_deg, p.green_haze_pieces, p.green_haze_pct, p.green_haze_deg, p.oil_spots_pieces, p.oil_spots_pct, p.oil_spots_deg, p.cut_count, p.dry_pulp_pieces, p.dry_pulp_pct, p.dry_pulp_deg, p.skin_damage_pieces, p.skin_damage_pct, p.skin_damage_deg, p.peteca_pieces, p.peteca_pct, p.peteca_deg, p.decay_pieces, p.decay_pct, p.decay_deg, p.mold_pieces, p.mold_pct, p.spores_pieces, p.spores_pct, p.overall_quality, p.overall_condition, p.comment1, p.comment2, p.inspection_type, p.short_insp, p.fixed_weight)
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION inspection.psa_arrival_report_lemon_pallets(IN r inspection.psa_arrival_report)
	RETURNS SETOF inspection.psa_lemon_pallet
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT * FROM inspection.psa_lemon_pallet lp
	WHERE lp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name) AND lp.exporter_name = r.exporter_name
$BODY$;

CREATE FUNCTION inspection.psa_arrival_report_avg_lemon_diameter_min_mm(IN r inspection.psa_arrival_report, In vari TEXT) RETURNS NUMERIC LANGUAGE 'sql' STABLE PARALLEL UNSAFE COST 100 AS $BODY$
SELECT
	ROUND(AVG(lp.diameter_min_mm :: NUMERIC), 1)
FROM
	inspection.psa_lemon_pallet lp
WHERE
	lp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	AND lp.exporter_name = r.exporter_name
	AND lp.diameter_min_mm ~ '^[0-9\.]+$'
	AND (vari = '' OR lp.variety = vari) $BODY$;

CREATE FUNCTION inspection.psa_arrival_report_avg_lemon_diameter_max_mm(IN r inspection.psa_arrival_report, In vari TEXT) RETURNS NUMERIC LANGUAGE 'sql' STABLE PARALLEL UNSAFE COST 100 AS $BODY$
SELECT
	ROUND(AVG(lp.diameter_max_mm :: NUMERIC), 1)
FROM
	inspection.psa_lemon_pallet lp
WHERE
	lp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	AND lp.exporter_name = r.exporter_name
	AND lp.diameter_max_mm ~ '^[0-9\.]+$'
	AND (vari = '' OR lp.variety = vari) $BODY$;

CREATE FUNCTION inspection.psa_arrival_report_avg_lemon_diameter_most_mm(IN r inspection.psa_arrival_report, In vari TEXT) RETURNS NUMERIC LANGUAGE 'sql' STABLE PARALLEL UNSAFE COST 100 AS $BODY$
SELECT
	ROUND(AVG(lp.diameter_most_mm :: NUMERIC), 1)
FROM
	inspection.psa_lemon_pallet lp
WHERE
	lp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	AND lp.exporter_name = r.exporter_name
	AND lp.diameter_most_mm ~ '^[0-9\.]+$'
	AND (vari = '' OR lp.variety = vari) $BODY$;

CREATE FUNCTION inspection.psa_lemon_pallet_pictures(IN lp inspection.psa_lemon_pallet)
	RETURNS SETOF inspection.psa_arrival_picture
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM inspection.psa_arrival_picture AS p
  WHERE lp.pallet_id = p.pallet_id AND lp.arrival LIKE '%' || p.arrival_code || '%'
$BODY$;
