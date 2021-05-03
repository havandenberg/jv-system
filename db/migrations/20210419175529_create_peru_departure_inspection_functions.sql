-- migrate:up
CREATE FUNCTION inspection.peru_departure_inspection_search_text(IN i inspection.peru_departure_inspection)
    RETURNS text
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		CAST(i.avg_bunches_per_box AS text),
		CAST(i.avg_net_weight AS text),
		i.bag_type,
		CAST(i.bags_per_box AS text),
		i.brand,
		CAST(i.brix_avg AS text),
		CAST(i.brix_max AS text),
		CAST(i.brix_min AS text),
		i.exporter,
		i.destination,
		CAST(i.departure_week AS text),
		i.container_id,
		CAST(i.condition_score AS text),
		i.comments,
		i.category,
		CAST(i.i_date AS text),
		CAST(i.packing_date AS text),
		i.packing_house,
		i.packing_material,
		i.presentation,
		CAST(i.quality_score AS text),
		i.variety
	) FROM inspection.peru_departure_inspection
$BODY$;

-- migrate:down
DROP FUNCTION inspection.peru_departure_inspection_search_text;
