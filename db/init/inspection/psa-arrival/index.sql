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
  WHERE p.exporter_id = r.exporter_id
  AND p.arrival_code = r.arrival_code
$BODY$;
COMMENT ON FUNCTION inspection.psa_arrival_report_pictures(r inspection.psa_arrival_report) IS E'@filterable';

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
		r.exporter_name,
    array_to_string(array_agg(gp.pallet_id), ''),
    array_to_string(array_agg(gp.commodity), ''),
    array_to_string(array_agg(gp.variety), ''),
    array_to_string(array_agg(gp.container_id), ''),
    array_to_string(array_agg(gp.label_code), ''),
    array_to_string(array_agg(gp.upc), ''),
    array_to_string(array_agg(gp.plu), ''),
    array_to_string(array_agg(gp.insp_location), ''),
    array_to_string(array_agg(cp.pallet_id), ''),
    array_to_string(array_agg(cp.commodity), ''),
    array_to_string(array_agg(cp.variety), ''),
    array_to_string(array_agg(cp.container_id), ''),
    array_to_string(array_agg(cp.label_code), ''),
    array_to_string(array_agg(cp.upc), ''),
    array_to_string(array_agg(cp.plu), ''),
    array_to_string(array_agg(cp.insp_location), ''),
    array_to_string(array_agg(sfp.pallet_id), ''),
    array_to_string(array_agg(sfp.commodity), ''),
    array_to_string(array_agg(sfp.variety), ''),
    array_to_string(array_agg(sfp.container_id), ''),
    array_to_string(array_agg(sfp.label_code), ''),
    array_to_string(array_agg(sfp.upc), ''),
    array_to_string(array_agg(sfp.plu), ''),
    array_to_string(array_agg(sfp.insp_location), ''),
    array_to_string(array_agg(pp.pallet_id), ''),
    array_to_string(array_agg(pp.commodity), ''),
    array_to_string(array_agg(pp.variety), ''),
    array_to_string(array_agg(pp.container_id), ''),
    array_to_string(array_agg(pp.label_code), ''),
    array_to_string(array_agg(pp.upc), ''),
    array_to_string(array_agg(pp.plu), ''),
    array_to_string(array_agg(pp.insp_location), ''),
    array_to_string(array_agg(psp.pallet_id), ''),
    array_to_string(array_agg(psp.commodity), ''),
    array_to_string(array_agg(psp.variety), ''),
    array_to_string(array_agg(psp.container_id), ''),
    array_to_string(array_agg(psp.label_code), ''),
    array_to_string(array_agg(psp.upc), ''),
    array_to_string(array_agg(psp.plu), ''),
    array_to_string(array_agg(psp.insp_location), ''),
    array_to_string(array_agg(prp.pallet_id), ''),
    array_to_string(array_agg(prp.commodity), ''),
    array_to_string(array_agg(prp.variety), ''),
    array_to_string(array_agg(prp.container_id), ''),
    array_to_string(array_agg(prp.label_code), ''),
    array_to_string(array_agg(prp.upc), ''),
    array_to_string(array_agg(prp.plu), ''),
    array_to_string(array_agg(prp.insp_location), ''),
    array_to_string(array_agg(lp.pallet_id), ''),
    array_to_string(array_agg(lp.commodity), ''),
    array_to_string(array_agg(lp.variety), ''),
    array_to_string(array_agg(lp.container_id), ''),
    array_to_string(array_agg(lp.label_code), ''),
    array_to_string(array_agg(lp.upc), ''),
    array_to_string(array_agg(lp.plu), ''),
    array_to_string(array_agg(lp.insp_location), ''),
    array_to_string(array_agg(chp.pallet_id), ''),
    array_to_string(array_agg(chp.commodity), ''),
    array_to_string(array_agg(chp.variety), ''),
    array_to_string(array_agg(chp.container_id), ''),
    array_to_string(array_agg(chp.label_code), ''),
    array_to_string(array_agg(chp.upc), ''),
    array_to_string(array_agg(chp.plu), ''),
    array_to_string(array_agg(chp.insp_location), ''),
    array_to_string(array_agg(ap.pallet_id), ''),
    array_to_string(array_agg(ap.commodity), ''),
    array_to_string(array_agg(ap.variety), ''),
    array_to_string(array_agg(ap.container_id), ''),
    array_to_string(array_agg(ap.label_code), ''),
    array_to_string(array_agg(ap.upc), ''),
    array_to_string(array_agg(ap.plu), ''),
    array_to_string(array_agg(ap.insp_location), '')
	) FROM inspection.psa_arrival_report par
	LEFT JOIN inspection.psa_grape_pallet gp
    ON gp.arrival = CONCAT_WS(' ', par.arrival_code, par.arrival_name)
    AND gp.exporter_name = par.exporter_name
	LEFT JOIN inspection.psa_citrus_pallet cp
    ON cp.arrival = CONCAT_WS(' ', par.arrival_code, par.arrival_name)
    AND cp.exporter_name = par.exporter_name
	LEFT JOIN inspection.psa_stone_fruit_pallet sfp
    ON sfp.arrival = CONCAT_WS(' ', par.arrival_code, par.arrival_name)
    AND sfp.exporter_name = par.exporter_name
	LEFT JOIN inspection.psa_pomegranate_pallet pp
    ON pp.arrival = CONCAT_WS(' ', par.arrival_code, par.arrival_name)
    AND pp.exporter_name = par.exporter_name
	LEFT JOIN inspection.psa_persimmon_pallet psp
    ON psp.arrival = CONCAT_WS(' ', par.arrival_code, par.arrival_name)
    AND psp.exporter_name = par.exporter_name
	LEFT JOIN inspection.psa_pear_pallet prp
    ON prp.arrival = CONCAT_WS(' ', par.arrival_code, par.arrival_name)
    AND prp.exporter_name = par.exporter_name
	LEFT JOIN inspection.psa_lemon_pallet lp
    ON lp.arrival = CONCAT_WS(' ', par.arrival_code, par.arrival_name)
    AND lp.exporter_name = par.exporter_name
	LEFT JOIN inspection.psa_cherry_pallet chp
    ON chp.arrival = CONCAT_WS(' ', par.arrival_code, par.arrival_name)
    AND chp.exporter_name = par.exporter_name
	LEFT JOIN inspection.psa_apple_pallet ap
    ON ap.arrival = CONCAT_WS(' ', par.arrival_code, par.arrival_name)
    AND ap.exporter_name = par.exporter_name
	WHERE r.id = par.id
$BODY$;

CREATE SEQUENCE pallet_ids;

CREATE OR REPLACE FUNCTION inspection.psa_arrival_report_commodity_list(IN r inspection.psa_arrival_report)
	RETURNS TEXT[]
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT (
    (SELECT ARRAY_AGG(DISTINCT gp.commodity) FROM inspection.psa_grape_pallet gp
    WHERE gp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND gp.exporter_name = r.exporter_name) ||
    (SELECT ARRAY_AGG(DISTINCT cp.commodity) FROM inspection.psa_citrus_pallet cp
    WHERE cp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND cp.exporter_name = r.exporter_name) ||
    (SELECT ARRAY_AGG(DISTINCT sfp.commodity) FROM inspection.psa_stone_fruit_pallet sfp
    WHERE sfp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND sfp.exporter_name = r.exporter_name) ||
    (SELECT ARRAY_AGG(DISTINCT pp.commodity) FROM inspection.psa_pomegranate_pallet pp
    WHERE pp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND pp.exporter_name = r.exporter_name) ||
    (SELECT ARRAY_AGG(DISTINCT psp.commodity) FROM inspection.psa_persimmon_pallet psp
    WHERE psp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND psp.exporter_name = r.exporter_name) ||
    (SELECT ARRAY_AGG(DISTINCT prp.commodity) FROM inspection.psa_pear_pallet prp
    WHERE prp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND prp.exporter_name = r.exporter_name) ||
    (SELECT ARRAY_AGG(DISTINCT lp.commodity) FROM inspection.psa_lemon_pallet lp
    WHERE lp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND lp.exporter_name = r.exporter_name) ||
    (SELECT ARRAY_AGG(DISTINCT chp.commodity) FROM inspection.psa_cherry_pallet chp
    WHERE chp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND chp.exporter_name = r.exporter_name) ||
    (SELECT ARRAY_AGG(DISTINCT ap.commodity) FROM inspection.psa_apple_pallet ap
    WHERE ap.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND ap.exporter_name = r.exporter_name)
  );
$BODY$;

CREATE OR REPLACE FUNCTION inspection.psa_arrival_report_variety_list(IN r inspection.psa_arrival_report, IN com TEXT)
	RETURNS TEXT[]
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT (
    (SELECT ARRAY_AGG(DISTINCT gp.variety) FROM inspection.psa_grape_pallet gp
    WHERE gp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND gp.exporter_name = r.exporter_name
    AND gp.commodity = CASE
      WHEN com = ''
      THEN (SELECT gpp.commodity FROM inspection.psa_grape_pallet gpp
        WHERE gpp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
        AND gpp.exporter_name = r.exporter_name
        ORDER BY gpp.commodity ASC
        LIMIT 1)
      ELSE com
      END
    ) ||
    (SELECT ARRAY_AGG(DISTINCT cp.variety) FROM inspection.psa_citrus_pallet cp
    WHERE cp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND cp.exporter_name = r.exporter_name
    AND cp.commodity = CASE
      WHEN com = ''
      THEN (SELECT cpp.commodity FROM inspection.psa_citrus_pallet cpp
        WHERE cpp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
        AND cpp.exporter_name = r.exporter_name
        ORDER BY cpp.commodity ASC
        LIMIT 1)
      ELSE com
      END
    ) ||
    (SELECT ARRAY_AGG(DISTINCT sfp.variety) FROM inspection.psa_stone_fruit_pallet sfp
    WHERE sfp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND sfp.exporter_name = r.exporter_name
    AND sfp.commodity = CASE
      WHEN com = ''
      THEN (SELECT sfpp.commodity FROM inspection.psa_stone_fruit_pallet sfpp
        WHERE sfpp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
        AND sfpp.exporter_name = r.exporter_name
        ORDER BY sfpp.commodity ASC
        LIMIT 1)
      ELSE com
      END
    ) ||
    (SELECT ARRAY_AGG(DISTINCT pp.variety) FROM inspection.psa_pomegranate_pallet pp
    WHERE pp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND pp.exporter_name = r.exporter_name
    AND pp.commodity = CASE
      WHEN com = ''
      THEN (SELECT ppp.commodity FROM inspection.psa_pomegranate_pallet ppp
        WHERE ppp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
        AND ppp.exporter_name = r.exporter_name
        ORDER BY ppp.commodity ASC
        LIMIT 1)
      ELSE com
      END
    ) ||
    (SELECT ARRAY_AGG(DISTINCT psp.variety) FROM inspection.psa_persimmon_pallet psp
    WHERE psp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND psp.exporter_name = r.exporter_name
    AND psp.commodity = CASE
      WHEN com = ''
      THEN (SELECT pspp.commodity FROM inspection.psa_persimmon_pallet pspp
        WHERE pspp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
        AND pspp.exporter_name = r.exporter_name
        ORDER BY pspp.commodity ASC
        LIMIT 1)
      ELSE com
      END
    ) ||
    (SELECT ARRAY_AGG(DISTINCT prp.variety) FROM inspection.psa_pear_pallet prp
    WHERE prp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND prp.exporter_name = r.exporter_name
    AND prp.commodity = CASE
      WHEN com = ''
      THEN (SELECT prpp.commodity FROM inspection.psa_pear_pallet prpp
        WHERE prpp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
        AND prpp.exporter_name = r.exporter_name
        ORDER BY prpp.commodity ASC
        LIMIT 1)
      ELSE com
      END
    ) ||
    (SELECT ARRAY_AGG(DISTINCT lp.variety) FROM inspection.psa_lemon_pallet lp
    WHERE lp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND lp.exporter_name = r.exporter_name
    AND lp.commodity = CASE
      WHEN com = ''
      THEN (SELECT lpp.commodity FROM inspection.psa_lemon_pallet lpp
        WHERE lpp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
        AND lpp.exporter_name = r.exporter_name
        ORDER BY lpp.commodity ASC
        LIMIT 1)
      ELSE com
      END
    ) ||
    (SELECT ARRAY_AGG(DISTINCT chp.variety) FROM inspection.psa_cherry_pallet chp
    WHERE chp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND chp.exporter_name = r.exporter_name
    AND chp.commodity = CASE
      WHEN com = ''
      THEN (SELECT chpp.commodity FROM inspection.psa_cherry_pallet chpp
        WHERE chpp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
        AND chpp.exporter_name = r.exporter_name
        ORDER BY chpp.commodity ASC
        LIMIT 1)
      ELSE com
      END
    ) ||
    (SELECT ARRAY_AGG(DISTINCT ap.variety) FROM inspection.psa_apple_pallet ap
    WHERE ap.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND ap.exporter_name = r.exporter_name
    AND ap.commodity = CASE
      WHEN com = ''
      THEN (SELECT app.commodity FROM inspection.psa_apple_pallet app
        WHERE app.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
        AND app.exporter_name = r.exporter_name
        ORDER BY app.commodity ASC
        LIMIT 1)
      ELSE com
      END
    )
  );
$BODY$;

CREATE OR REPLACE FUNCTION inspection.psa_arrival_report_avg_quality(IN r inspection.psa_arrival_report)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT COALESCE (
    (SELECT ROUND(AVG(gp.overall_quality), 1) FROM inspection.psa_grape_pallet gp
    WHERE gp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND gp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(cp.overall_quality), 1) FROM inspection.psa_citrus_pallet cp
    WHERE cp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND cp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(sfp.overall_quality), 1) FROM inspection.psa_stone_fruit_pallet sfp
    WHERE sfp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND sfp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(pp.overall_quality), 1) FROM inspection.psa_pomegranate_pallet pp
    WHERE pp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND pp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(psp.overall_quality), 1) FROM inspection.psa_persimmon_pallet psp
    WHERE psp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND psp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(prp.overall_quality), 1) FROM inspection.psa_pear_pallet prp
    WHERE prp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND prp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(lp.overall_quality), 1) FROM inspection.psa_lemon_pallet lp
    WHERE lp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND lp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(chp.overall_quality), 1) FROM inspection.psa_cherry_pallet chp
    WHERE chp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND chp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(ap.overall_quality), 1) FROM inspection.psa_apple_pallet ap
    WHERE ap.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND ap.exporter_name = r.exporter_name)
  );
$BODY$;
COMMENT ON FUNCTION inspection.psa_arrival_report_avg_quality(r inspection.psa_arrival_report) IS E'@sortable';

CREATE OR REPLACE FUNCTION inspection.psa_arrival_report_avg_condition(IN r inspection.psa_arrival_report)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT COALESCE (
    (SELECT ROUND(AVG(gp.overall_condition), 1) FROM inspection.psa_grape_pallet gp
    WHERE gp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND gp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(cp.overall_condition), 1) FROM inspection.psa_citrus_pallet cp
    WHERE cp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND cp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(sfp.overall_condition), 1) FROM inspection.psa_stone_fruit_pallet sfp
    WHERE sfp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND sfp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(pp.overall_condition), 1) FROM inspection.psa_pomegranate_pallet pp
    WHERE pp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND pp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(psp.overall_condition), 1) FROM inspection.psa_persimmon_pallet psp
    WHERE psp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND psp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(prp.overall_condition), 1) FROM inspection.psa_pear_pallet prp
    WHERE prp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND prp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(lp.overall_condition), 1) FROM inspection.psa_lemon_pallet lp
    WHERE lp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND lp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(chp.overall_condition), 1) FROM inspection.psa_cherry_pallet chp
    WHERE chp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND chp.exporter_name = r.exporter_name),
    (SELECT ROUND(AVG(ap.overall_condition), 1) FROM inspection.psa_apple_pallet ap
    WHERE ap.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND ap.exporter_name = r.exporter_name)
  );
$BODY$;
COMMENT ON FUNCTION inspection.psa_arrival_report_avg_condition(r inspection.psa_arrival_report) IS E'@sortable';

CREATE OR REPLACE FUNCTION inspection.psa_arrival_report_avg_quality_by_variety(IN r inspection.psa_arrival_report, IN vari TEXT)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT COALESCE (
    (SELECT ROUND(AVG(gp.overall_quality), 1) FROM inspection.psa_grape_pallet gp
    WHERE gp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND gp.exporter_name = r.exporter_name
    AND (vari = '' OR gp.variety = vari)),
    (SELECT ROUND(AVG(cp.overall_quality), 1) FROM inspection.psa_citrus_pallet cp
    WHERE cp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND cp.exporter_name = r.exporter_name
    AND (vari = '' OR cp.variety = vari)),
    (SELECT ROUND(AVG(sfp.overall_quality), 1) FROM inspection.psa_stone_fruit_pallet sfp
    WHERE sfp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND sfp.exporter_name = r.exporter_name
    AND (vari = '' OR sfp.variety = vari)),
    (SELECT ROUND(AVG(pp.overall_quality), 1) FROM inspection.psa_pomegranate_pallet pp
    WHERE pp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND pp.exporter_name = r.exporter_name
    AND (vari = '' OR pp.variety = vari)),
    (SELECT ROUND(AVG(psp.overall_quality), 1) FROM inspection.psa_persimmon_pallet psp
    WHERE psp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND psp.exporter_name = r.exporter_name
    AND (vari = '' OR psp.variety = vari)),
    (SELECT ROUND(AVG(prp.overall_quality), 1) FROM inspection.psa_pear_pallet prp
    WHERE prp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND prp.exporter_name = r.exporter_name
    AND (vari = '' OR prp.variety = vari)),
    (SELECT ROUND(AVG(lp.overall_quality), 1) FROM inspection.psa_lemon_pallet lp
    WHERE lp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND lp.exporter_name = r.exporter_name
    AND (vari = '' OR lp.variety = vari)),
    (SELECT ROUND(AVG(chp.overall_quality), 1) FROM inspection.psa_cherry_pallet chp
    WHERE chp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND chp.exporter_name = r.exporter_name
    AND (vari = '' OR chp.variety = vari)),
    (SELECT ROUND(AVG(ap.overall_quality), 1) FROM inspection.psa_apple_pallet ap
    WHERE ap.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND ap.exporter_name = r.exporter_name
    AND (vari = '' OR ap.variety = vari))
  );
$BODY$;

CREATE OR REPLACE FUNCTION inspection.psa_arrival_report_avg_condition_by_variety(IN r inspection.psa_arrival_report, IN vari TEXT)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT COALESCE (
    (SELECT ROUND(AVG(gp.overall_condition), 1) FROM inspection.psa_grape_pallet gp
    WHERE gp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND gp.exporter_name = r.exporter_name
    AND (vari = '' OR gp.variety = vari)),
    (SELECT ROUND(AVG(cp.overall_condition), 1) FROM inspection.psa_citrus_pallet cp
    WHERE cp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND cp.exporter_name = r.exporter_name
    AND (vari = '' OR cp.variety = vari)),
    (SELECT ROUND(AVG(sfp.overall_condition), 1) FROM inspection.psa_stone_fruit_pallet sfp
    WHERE sfp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND sfp.exporter_name = r.exporter_name
    AND (vari = '' OR sfp.variety = vari)),
    (SELECT ROUND(AVG(pp.overall_condition), 1) FROM inspection.psa_pomegranate_pallet pp
    WHERE pp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND pp.exporter_name = r.exporter_name
    AND (vari = '' OR pp.variety = vari)),
    (SELECT ROUND(AVG(psp.overall_condition), 1) FROM inspection.psa_persimmon_pallet psp
    WHERE psp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND psp.exporter_name = r.exporter_name
    AND (vari = '' OR psp.variety = vari)),
    (SELECT ROUND(AVG(prp.overall_condition), 1) FROM inspection.psa_pear_pallet prp
    WHERE prp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND prp.exporter_name = r.exporter_name
    AND (vari = '' OR prp.variety = vari)),
    (SELECT ROUND(AVG(lp.overall_condition), 1) FROM inspection.psa_lemon_pallet lp
    WHERE lp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND lp.exporter_name = r.exporter_name
    AND (vari = '' OR lp.variety = vari)),
    (SELECT ROUND(AVG(chp.overall_condition), 1) FROM inspection.psa_cherry_pallet chp
    WHERE chp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND chp.exporter_name = r.exporter_name
    AND (vari = '' OR chp.variety = vari)),
    (SELECT ROUND(AVG(ap.overall_condition), 1) FROM inspection.psa_apple_pallet ap
    WHERE ap.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND ap.exporter_name = r.exporter_name
    AND (vari = '' OR ap.variety = vari))
  );
$BODY$;

CREATE OR REPLACE FUNCTION inspection.psa_arrival_report_avg_net_weight(IN r inspection.psa_arrival_report, IN vari TEXT)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT COALESCE (
    (SELECT ROUND(AVG(gp.weight::NUMERIC), 1) FROM inspection.psa_grape_pallet gp
    WHERE gp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND gp.exporter_name = r.exporter_name
	  AND gp.weight ~ '^[0-9\.]+$'
    AND (vari = '' OR gp.variety = vari)),
    (SELECT ROUND(AVG(cp.weight::NUMERIC), 1) FROM inspection.psa_citrus_pallet cp
    WHERE cp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND cp.exporter_name = r.exporter_name
	  AND cp.weight ~ '^[0-9\.]+$'
    AND (vari = '' OR cp.variety = vari)),
    (SELECT ROUND(AVG(sfp.weight::NUMERIC), 1) FROM inspection.psa_stone_fruit_pallet sfp
    WHERE sfp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND sfp.exporter_name = r.exporter_name
	  AND sfp.weight ~ '^[0-9\.]+$'
    AND (vari = '' OR sfp.variety = vari)),
    (SELECT ROUND(AVG(pp.weight::NUMERIC), 1) FROM inspection.psa_pomegranate_pallet pp
    WHERE pp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND pp.exporter_name = r.exporter_name
	  AND pp.weight ~ '^[0-9\.]+$'
    AND (vari = '' OR pp.variety = vari)),
    (SELECT ROUND(AVG(psp.weight::NUMERIC), 1) FROM inspection.psa_persimmon_pallet psp
    WHERE psp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND psp.exporter_name = r.exporter_name
	  AND psp.weight ~ '^[0-9\.]+$'
    AND (vari = '' OR psp.variety = vari)),
    (SELECT ROUND(AVG(prp.weight::NUMERIC), 1) FROM inspection.psa_pear_pallet prp
    WHERE prp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND prp.exporter_name = r.exporter_name
	  AND prp.weight ~ '^[0-9\.]+$'
    AND (vari = '' OR prp.variety = vari)),
    (SELECT ROUND(AVG(lp.weight::NUMERIC), 1) FROM inspection.psa_lemon_pallet lp
    WHERE lp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND lp.exporter_name = r.exporter_name
	  AND lp.weight ~ '^[0-9\.]+$'
    AND (vari = '' OR lp.variety = vari)),
    (SELECT ROUND(AVG(chp.weight::NUMERIC), 1) FROM inspection.psa_cherry_pallet chp
    WHERE chp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND chp.exporter_name = r.exporter_name
	  AND chp.weight ~ '^[0-9\.]+$'
    AND (vari = '' OR chp.variety = vari)),
    (SELECT ROUND(AVG(ap.weight::NUMERIC), 1) FROM inspection.psa_apple_pallet ap
    WHERE ap.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
    AND ap.exporter_name = r.exporter_name
	  AND ap.weight ~ '^[0-9\.]+$'
    AND (vari = '' OR ap.variety = vari))
  );
$BODY$;

CREATE OR REPLACE FUNCTION inspection.psa_arrival_report_avg_brix(IN r inspection.psa_arrival_report, IN vari TEXT)
	RETURNS NUMERIC
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT COALESCE (
    (SELECT ROUND(AVG(cp.brix :: NUMERIC), 1) FROM inspection.psa_citrus_pallet cp
    WHERE cp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	  AND cp.exporter_name = r.exporter_name
	  AND cp.brix ~ '^[0-9\.]+$'
    AND (vari = '' OR cp.variety = vari)),
    (SELECT ROUND(AVG(sfp.brix :: NUMERIC), 1) FROM inspection.psa_stone_fruit_pallet sfp
    WHERE sfp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	  AND sfp.exporter_name = r.exporter_name
	  AND sfp.brix ~ '^[0-9\.]+$'
    AND (vari = '' OR sfp.variety = vari)),
    (SELECT ROUND(AVG(psp.brix :: NUMERIC), 1) FROM inspection.psa_persimmon_pallet psp
    WHERE psp.arrival = CONCAT_WS(' ', r.arrival_code, r.arrival_name)
	  AND psp.exporter_name = r.exporter_name
	  AND psp.brix ~ '^[0-9\.]+$'
    AND (vari = '' OR psp.variety = vari))
  );
$BODY$;
