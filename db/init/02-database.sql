
CREATE FUNCTION public.peru_departure_inspection_search_text(IN inspection peru_departure_inspection)
    RETURNS text
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		CAST(inspection.avg_bunches_per_box AS text),
		CAST(inspection.avg_net_weight AS text),
		inspection.bag_type,
		CAST(inspection.bags_per_box AS text),
		inspection.brand,
		CAST(inspection.brix_avg AS text),
		CAST(inspection.brix_max AS text),
		CAST(inspection.brix_min AS text),
		inspection.exporter,
		inspection.destination,
		CAST(inspection.departure_week AS text),
		inspection.container_id,
		CAST(inspection.condition_score AS text),
		inspection.comments,
		inspection.category,
		CAST(inspection.inspection_date AS text),
		CAST(inspection.packing_date AS text),
		inspection.packing_house,
		inspection.packing_material,
		inspection.presentation,
		CAST(inspection.quality_score AS text),
		inspection.variety
	) FROM peru_departure_inspection
$BODY$;
