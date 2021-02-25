CREATE TYPE chile_departure_inspection AS (
	lot_number text,
	inspection_date date,
	packing_date date,
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
