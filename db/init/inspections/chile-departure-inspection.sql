CREATE TABLE inspection.chile_departure_inspection_pallet (
	id TEXT PRIMARY KEY,
	lot_id TEXT NOT NULL,
	lot_number TEXT NOT NULL,
	location_name TEXT NOT NULL,
	shipper TEXT NOT NULL,
	inspection_date DATE NOT NULL,
	product_name TEXT NOT NULL,
	packing_type TEXT NOT NULL,
	product_type TEXT NOT NULL,
	pallet_count NUMERIC NOT NULL,
	supervisor TEXT NOT NULL,
	pallet_number TEXT NOT NULL,
	boxes_count NUMERIC NOT NULL,
	net_weight NUMERIC NOT NULL,
	grower TEXT NOT NULL,
	size TEXT NOT NULL,
	variety TEXT NOT NULL,
	packing_date date NOT NULL,
	label TEXT NOT NULL,
	temperature TEXT NOT NULL,
	open_appearance TEXT NOT NULL,
	color TEXT NOT NULL,
	stem TEXT NOT NULL,
	texture TEXT NOT NULL,
	bunches_count NUMERIC NOT NULL,
	brix NUMERIC NOT NULL,
	diameter_min NUMERIC NOT NULL,
	diameter_max NUMERIC NOT NULL,
	straggly_tight_pct NUMERIC NOT NULL,
	surface_disc_pct NUMERIC NOT NULL,
	russet_scars_pct NUMERIC NOT NULL,
	sunburn_pct NUMERIC NOT NULL,
	undersized_bunches_pct NUMERIC NOT NULL,
	other_defects_pct NUMERIC NOT NULL,
	stem_dehy_pct NUMERIC NOT NULL,
	glassy_weak_pct NUMERIC NOT NULL,
	decay_pct NUMERIC NOT NULL,
	split_crushed_pct NUMERIC NOT NULL,
	dry_split_pct NUMERIC NOT NULL,
	wet_sticky_pct NUMERIC NOT NULL,
	waterberries_pct NUMERIC NOT NULL,
	shatter_pct NUMERIC NOT NULL,
	total_quality_defects_pct NUMERIC NOT NULL,
	total_condition_defects_pct NUMERIC NOT NULL,
	quality_score NUMERIC NOT NULL,
	condition_score NUMERIC NOT NULL,
	score_name TEXT NOT NULL,
	report_link TEXT NOT NULL,
	images_link TEXT NOT NULL
);

CREATE TYPE inspection.chile_departure_inspection AS (
	lot_number text,
	inspection_date date,
	packing_date text,
	shipper text,
	variety text,
	quality_score numeric,
	condition_score numeric,
	avg_net_weight numeric,
	avg_bunches_count numeric,
	brix_avg numeric,
	brix_min numeric,
	brix_max numeric,
	search_text text
);

CREATE FUNCTION inspection.batch_create_chile_departure_inspection_pallet(
  new_pallets inspection.chile_departure_inspection_pallet[]
)
RETURNS setof inspection.chile_departure_inspection_pallet
AS $$
  DECLARE
    p inspection.chile_departure_inspection_pallet;
    vals inspection.chile_departure_inspection_pallet;
  BEGIN
    FOREACH p IN ARRAY new_pallets LOOP
      INSERT INTO inspection.chile_departure_inspection_pallet(id, lot_id, lot_number, location_name, shipper, inspection_date, product_name, packing_type, product_type, pallet_count, supervisor, pallet_number, boxes_count, net_weight, grower, size, variety, packing_date, label, temperature, open_appearance, color, stem, texture, bunches_count, brix, diameter_min, diameter_max, straggly_tight_pct, surface_disc_pct, russet_scars_pct, sunburn_pct, undersized_bunches_pct, other_defects_pct, stem_dehy_pct, glassy_weak_pct, decay_pct, split_crushed_pct, dry_split_pct, wet_sticky_pct, waterberries_pct, shatter_pct, total_quality_defects_pct, total_condition_defects_pct, quality_score, condition_score, score_name, report_link, images_link)
        VALUES (p.id, p.lot_id, p.lot_number, p.location_name, p.shipper, p.inspection_date, p.product_name, p.packing_type, p.product_type, p.pallet_count, p.supervisor, p.pallet_number, p.boxes_count, p.net_weight, p.grower, p.size, p.variety, p.packing_date, p.label, p.temperature, p.open_appearance, p.color, p.stem, p.texture, p.bunches_count, p.brix, p.diameter_min, p.diameter_max, p.straggly_tight_pct, p.surface_disc_pct, p.russet_scars_pct, p.sunburn_pct, p.undersized_bunches_pct, p.other_defects_pct, p.stem_dehy_pct, p.glassy_weak_pct, p.decay_pct, p.split_crushed_pct, p.dry_split_pct, p.wet_sticky_pct, p.waterberries_pct, p.shatter_pct, p.total_quality_defects_pct, p.total_condition_defects_pct, p.quality_score, p.condition_score, p.score_name, p.report_link, p.images_link)
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION inspection.chile_departure_inspections(order_by TEXT, sort_order TEXT)
	RETURNS setof inspection.chile_departure_inspection
	LANGUAGE plpgsql STABLE
	AS
$$
	BEGIN
		RETURN QUERY EXECUTE format('
			SELECT
				lot_number,
				inspection_date,
				STRING_AGG(CAST(packing_date AS text), '',''),
				shipper,
				variety,
				ROUND(AVG(quality_score)) AS quality_score,
				ROUND(AVG(condition_score)) AS condition_score,
				ROUND(AVG(net_weight / 1000), 2) AS avg_net_weight,
				ROUND(AVG(bunches_count)) AS avg_bunches_count,
				ROUND(AVG(brix), 1) AS brix_avg,
				ROUND(MIN(brix), 1) AS brix_min,
				ROUND(MAX(brix), 1) AS brix_max,
				STRING_AGG( CONCAT (
					id,
					lot_id,
					lot_number,
					location_name,
					shipper,
					CAST(inspection_date AS text),
					product_name,
					packing_type,
					product_type,
					CAST(pallet_count AS text),
					supervisor,
					pallet_number,
					grower,
					size,
					variety,
					CAST(packing_date AS text),
					label,
					temperature,
					open_appearance,
					color,
					stem,
					texture,
					CAST(quality_score AS text),
					CAST(condition_score AS text),
					score_name
				), '''') AS search_text
		FROM inspection.chile_departure_inspection_pallet
		GROUP BY lot_number, inspection_date, shipper, variety
		ORDER BY %I %s', order_by, sort_order);
	END;
$$;
