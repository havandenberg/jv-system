CREATE FUNCTION batch_create_chile_departure_inspection_pallet(
  new_pallets chile_departure_inspection_pallet[]
)
RETURNS setof chile_departure_inspection_pallet
AS $$
  DECLARE
    p chile_departure_inspection_pallet;
    vals chile_departure_inspection_pallet;
  BEGIN
    FOREACH p IN ARRAY new_pallets LOOP
      INSERT INTO chile_departure_inspection_pallet(id, lot_id, lot_number, location_name, shipper, inspection_date, product_name, packing_type, product_type, pallet_count, supervisor, pallet_number, boxes_count, net_weight, grower, size, variety, packing_date, label, temperature, open_appearance, color, stem, texture, bunches_count, brix, diameter_min, diameter_max, straggly_tight_pct, surface_disc_pct, russet_scars_pct, sunburn_pct, undersized_bunches_pct, other_defects_pct, stem_dehy_pct, glassy_weak_pct, decay_pct, split_crushed_pct, dry_split_pct, wet_sticky_pct, waterberries_pct, shatter_pct, total_quality_defects_pct, total_condition_defects_pct, quality_score, condition_score, score_name, report_link, images_link)
        VALUES (p.id, p.lot_id, p.lot_number, p.location_name, p.shipper, p.inspection_date, p.product_name, p.packing_type, p.product_type, p.pallet_count, p.supervisor, p.pallet_number, p.boxes_count, p.net_weight, p.grower, p.size, p.variety, p.packing_date, p.label, p.temperature, p.open_appearance, p.color, p.stem, p.texture, p.bunches_count, p.brix, p.diameter_min, p.diameter_max, p.straggly_tight_pct, p.surface_disc_pct, p.russet_scars_pct, p.sunburn_pct, p.undersized_bunches_pct, p.other_defects_pct, p.stem_dehy_pct, p.glassy_weak_pct, p.decay_pct, p.split_crushed_pct, p.dry_split_pct, p.wet_sticky_pct, p.waterberries_pct, p.shatter_pct, p.total_quality_defects_pct, p.total_condition_defects_pct, p.quality_score, p.condition_score, p.score_name, p.report_link, p.images_link)
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
