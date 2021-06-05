CREATE TABLE inspection.psa_arrival_report (
	id BIGINT PRIMARY KEY,
  report_date DATE,
  location_name TEXT,
  arrival_code TEXT,
  arrival_name TEXT,
  exporter_id BIGINT,
  exporter_name TEXT
);

CREATE TABLE inspection.psa_arrival_picture (
  id BIGINT PRIMARY KEY,
  picture_date DATE,
  arrival_code TEXT,
  picture_description TEXT,
  exporter_id BIGINT,
  pallet_id TEXT,
  product_code TEXT,
  variety_name TEXT
);

CREATE FUNCTION inspection.psa_arrival_report_pictures(IN r inspection.psa_arrival_report)
	RETURNS setof inspection.psa_arrival_picture
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM inspection.psa_arrival_picture AS p
  WHERE p.picture_date = r.report_date AND p.exporter_id = r.exporter_id AND p.arrival_code = r.arrival_code
$BODY$;

CREATE FUNCTION inspection.psa_arrival_report_search_text(IN r inspection.psa_arrival_report)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		r.id,
		CAST(r.report_date AS TEXT),
		r.location_name,
		r.arrival_code,
		r.arrival_name,
		CAST(r.exporter_id AS TEXT),
		r.exporter_name
	) FROM inspection.psa_arrival_report
$BODY$;
