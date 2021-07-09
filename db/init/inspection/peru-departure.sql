CREATE TABLE inspection.peru_departure_inspection (
	container_id TEXT NOT NULL PRIMARY KEY,
	avg_bunches_per_box NUMERIC NOT NULL,
	avg_net_weight NUMERIC NOT NULL,
	bags_per_box NUMERIC NOT NULL,
	bag_type TEXT,
	brand TEXT NOT NULL,
	brix_avg NUMERIC NOT NULL,
	brix_max NUMERIC NOT NULL,
	brix_min NUMERIC NOT NULL,
	category TEXT NOT NULL,
	comments TEXT NOT NULL,
	condition_score NUMERIC NOT NULL,
	departure_week TEXT NOT NULL,
	destination TEXT NOT NULL,
	exporter TEXT NOT NULL,
	inspection_date DATE NOT NULL,
	packing_date DATE NOT NULL,
	packing_house TEXT NOT NULL,
	packing_material TEXT NOT NULL,
	presentation TEXT NOT NULL,
	quality_score NUMERIC NOT NULL,
	variety TEXT NOT NULL
);

CREATE TABLE inspection.peru_departure_inspection_pallet (
	id BIGSERIAL PRIMARY KEY,
	pallet_id TEXT NOT NULL,
	container_id TEXT NOT NULL,
	size TEXT NOT NULL,
	net_weight NUMERIC NOT NULL,
	opening_score NUMERIC NOT NULL,
	color_score NUMERIC NOT NULL,
	stem_score NUMERIC NOT NULL,
	texture_score NUMERIC NOT NULL,
	bunches_per_box NUMERIC NOT NULL,
	brix NUMERIC NOT NULL,
	quality_score NUMERIC NOT NULL,
	condition_score NUMERIC NOT NULL,
	straggly_tight_pct NUMERIC NOT NULL,
	surface_disc_pct NUMERIC NOT NULL,
	russet_scars_pct NUMERIC NOT NULL,
	sunburn_pct NUMERIC NOT NULL,
	undersized_bunches_pct NUMERIC NOT NULL,
	other_defects_pct NUMERIC NOT NULL,
	total_quality_defects_pct NUMERIC NOT NULL,
	stem_dehy_pct NUMERIC NOT NULL,
	glassy_weak_pct NUMERIC NOT NULL,
	decay_pct NUMERIC NOT NULL,
	split_crushed_pct NUMERIC NOT NULL,
	dry_split_pct NUMERIC NOT NULL,
	wet_sticky_pct NUMERIC NOT NULL,
	waterberries_pct NUMERIC NOT NULL,
	shatter_pct NUMERIC NOT NULL,
	total_condition_defects_pct NUMERIC NOT NULL,
	total_defects_pct NUMERIC NOT NULL,
	CONSTRAINT fk_container
		FOREIGN KEY(container_id)
		REFERENCES inspection.peru_departure_inspection(container_id)
		ON DELETE CASCADE
);

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
		CAST(i.inspection_date AS text),
		CAST(i.packing_date AS text),
		i.packing_house,
		i.packing_material,
		i.presentation,
		CAST(i.quality_score AS text),
		i.variety
	) FROM inspection.peru_departure_inspection
$BODY$;
