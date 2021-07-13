CREATE TABLE inspection.psa_cherry_pallet (
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
  size_min TEXT,
  size_max TEXT,
  size_most TEXT,
  color TEXT,
  scars_marks_pieces TEXT,
  scars_marks_pct TEXT,
  scars_marks_deg TEXT,
  misshapen_pieces TEXT,
  misshapen_pct TEXT,
  stemless_pieces TEXT,
  stemless_pct TEXT,
  splits_pieces TEXT,
  splits_pct TEXT,
  splits_deg TEXT,
  firmness TEXT,
  pitting_bruising_pieces TEXT,
  pitting_bruising_pct TEXT,
  pitting_bruising_deg TEXT,
  stem_dehydration_pieces TEXT,
  stem_dehydration_pct TEXT,
  stem_dehydration_deg TEXT,
  dehydration_pieces TEXT,
  dehydration_pct TEXT,
  dehydration_deg TEXT,
  decay_pieces TEXT,
  decay_pct TEXT,
  decay_deg TEXT,
  mold_pieces TEXT,
  mold_pct TEXT,
  overall_quality NUMERIC,
  overall_condition NUMERIC,
  comment1 TEXT,
  comment2 TEXT,
  inspection_type TEXT,
  short_insp TEXT,
  fixed_weight TEXT
);

CREATE FUNCTION inspection.batch_create_psa_cherry_pallet(
  new_pallets inspection.psa_cherry_pallet[]
)
RETURNS setof inspection.psa_cherry_pallet
AS $$
  DECLARE
    p inspection.psa_cherry_pallet;
    vals inspection.psa_cherry_pallet;
  BEGIN
    FOREACH p IN ARRAY new_pallets LOOP
      INSERT INTO inspection.psa_cherry_pallet(location, arrival, importer_name, exporter_name, commodity, product_code, variety, insp_date, quantity, hatch, deck, container_id, fumigation, label_code, insp_location, importer_code, lot_code, insp_lot, pallet_id, grower_code, insp_grower_code, pack_date, insp_pack_date, size, insp_size, pack_code, pack_description, secondary_description, insp_pack_code, count, plu, plu_pct, country_of_origin, upc, weight, underweight_min, underweight_max, weighed_units, underweight_units, underweight_pct, pulp_temp, opening, size_min, size_max, size_most, color, scars_marks_pieces, scars_marks_pct, scars_marks_deg, misshapen_pieces, misshapen_pct, stemless_pieces, stemless_pct, splits_pieces, splits_pct, splits_deg, firmness, pitting_bruising_pieces, pitting_bruising_pct, pitting_bruising_deg, stem_dehydration_pieces, stem_dehydration_pct, stem_dehydration_deg, dehydration_pieces, dehydration_pct, dehydration_deg, decay_pieces, decay_pct, decay_deg, mold_pieces, mold_pct, overall_quality, overall_condition, comment1, comment2, inspection_type, short_insp, fixed_weight)
        VALUES (p.location, p.arrival, p.importer_name, p.exporter_name, p.commodity, p.product_code, p.variety, p.insp_date, p.quantity, p.hatch, p.deck, p.container_id, p.fumigation, p.label_code, p.insp_location, p.importer_code, p.lot_code, p.insp_lot, p.pallet_id, p.grower_code, p.insp_grower_code, p.pack_date, p.insp_pack_date, p.size, p.insp_size, p.pack_code, p.pack_description, p.secondary_description, p.insp_pack_code, p.count, p.plu, p.plu_pct, p.country_of_origin, p.upc, p.weight, p.underweight_min, p.underweight_max, p.weighed_units, p.underweight_units, p.underweight_pct, p.pulp_temp, p.opening, p.size_min, p.size_max, p.size_most, p.color, p.scars_marks_pieces, p.scars_marks_pct, p.scars_marks_deg, p.misshapen_pieces, p.misshapen_pct, p.stemless_pieces, p.stemless_pct, p.splits_pieces, p.splits_pct, p.splits_deg, p.firmness, p.pitting_bruising_pieces, p.pitting_bruising_pct, p.pitting_bruising_deg, p.stem_dehydration_pieces, p.stem_dehydration_pct, p.stem_dehydration_deg, p.dehydration_pieces, p.dehydration_pct, p.dehydration_deg, p.decay_pieces, p.decay_pct, p.decay_deg, p.mold_pieces, p.mold_pct, p.overall_quality, p.overall_condition, p.comment1, p.comment2, p.inspection_type, p.short_insp, p.fixed_weight)
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION inspection.psa_arrival_report_cherry_pallets(IN r inspection.psa_arrival_report)
	RETURNS SETOF inspection.psa_cherry_pallet
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	SELECT * FROM inspection.psa_cherry_pallet chp
	WHERE chp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name) AND chp.exporter_name = r.exporter_name
$BODY$;
COMMENT ON FUNCTION inspection.psa_arrival_report_cherry_pallets(r inspection.psa_arrival_report) IS E'@sortable';

CREATE FUNCTION inspection.psa_cherry_pallet_pictures(IN chp inspection.psa_cherry_pallet)
	RETURNS SETOF inspection.psa_arrival_picture
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM inspection.psa_arrival_picture AS p
  WHERE chp.pallet_id = p.pallet_id AND chp.arrival LIKE '%' || p.arrival_code || '%'
$BODY$;
