CREATE TABLE accounting.vessel_control (
  id BIGSERIAL PRIMARY KEY,
  vessel_code TEXT NOT NULL,
  shipper_id TEXT NOT NULL,
  approval_1 BOOLEAN,
  approval_2 BOOLEAN,
  date_sent DATE,
  is_liquidated BOOLEAN,
  notes_1 TEXT,
  notes_2 TEXT
);

CREATE INDEX ON accounting.vessel_control (vessel_code, shipper_id, is_liquidated);

CREATE FUNCTION accounting.all_vessel_controls()
  RETURNS setof accounting.vessel_control
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT COALESCE(vc.id, CONCAT(v.id, s.id)::BIGINT), v.vessel_code, s.id, vc.approval_1, vc.approval_2, vc.date_sent, vc.is_liquidated, vc.notes_1, vc.notes_2 FROM product.vessel v
    LEFT JOIN product.pallet p ON p.vessel_code = v.vessel_code
    LEFT JOIN directory.shipper s ON s.id = p.shipper_id
    LEFT JOIN accounting.vessel_control vc ON vc.vessel_code = v.vessel_code AND vc.shipper_id = s.id
      WHERE v.vessel_code NOT LIKE '9%' AND v.is_pre = FALSE AND v.vessel_code NOT IN ('CCC', 'EXC', 'E23')
      GROUP BY v.id, s.id, vc.id
      ORDER BY v.discharge_date + COALESCE(s.vessel_control_days_until_due, 45)::INTEGER DESC, v.vessel_code, s.shipper_name
$BODY$;

CREATE FUNCTION accounting.vessel_control_vessel(IN vc accounting.vessel_control)
  RETURNS product.vessel
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = vc.vessel_code AND v.is_pre = FALSE ORDER BY v.discharge_date DESC LIMIT 1
$BODY$;

CREATE FUNCTION accounting.vessel_control_pallets(IN vc accounting.vessel_control)
  RETURNS setof product.pallet
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT * FROM product.pallet p
    WHERE (SELECT v.vessel_code FROM product.vessel v WHERE v.vessel_code = p.vessel_code ORDER BY v.discharge_date DESC LIMIT 1) = vc.vessel_code
    AND p.shipper_id = vc.shipper_id;
$BODY$;

CREATE FUNCTION accounting.vessel_control_pallets_shipped(IN vc accounting.vessel_control)
  RETURNS NUMERIC
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT COUNT(*) FROM accounting.vessel_control_pallets(vc) p WHERE p.shipped = TRUE;
$BODY$;

CREATE FUNCTION accounting.vessel_control_due_date(IN vc accounting.vessel_control)
  RETURNS DATE
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT v.discharge_date + COALESCE(s.vessel_control_days_until_due, 45)::INTEGER
    FROM product.vessel v
    JOIN directory.shipper s
    ON s.id = vc.shipper_id
    WHERE v.vessel_code = vc.vessel_code ORDER BY v.discharge_date DESC
$BODY$;

CREATE FUNCTION accounting.vessel_control_shipper(IN vc accounting.vessel_control)
  RETURNS directory.shipper
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = vc.shipper_id
$BODY$;

CREATE FUNCTION accounting.vessel_control_unpaids(IN vc accounting.vessel_control)
  RETURNS setof accounting.unpaid
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT * FROM accounting.unpaid u
    WHERE u.vessel_code = vc.vessel_code
      AND u.shipper_id = vc.shipper_id
$BODY$;

CREATE FUNCTION accounting.vessel_control_wires(IN vc accounting.vessel_control)
  RETURNS setof accounting.wire_request
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT * FROM accounting.wire_request w
    WHERE vc.vessel_code IN (
        SELECT vessel_code FROM accounting.wire_request_ocean_freight_item i WHERE i.wire_request_id = w.id)
      AND vc.shipper_id IN (
        SELECT shipper_id FROM accounting.wire_request_ocean_freight_item i WHERE i.wire_request_id = w.id)
  UNION
  SELECT * FROM accounting.wire_request w
    WHERE vc.vessel_code IN (
        SELECT vessel_code FROM accounting.wire_request_shipper_advance_item i WHERE i.wire_request_id = w.id)
      AND vc.shipper_id = w.vendor_id
  UNION
  SELECT * FROM accounting.wire_request w
    WHERE vc.vessel_code IN (
        SELECT vessel_code FROM accounting.wire_request_shipper_advance_item i WHERE i.wire_request_id = w.id)
      AND vc.shipper_id = w.vendor_id
$BODY$;

CREATE FUNCTION directory.bulk_upsert_vessel_control(
  vessel_controls accounting.vessel_control[]
)
RETURNS setof accounting.vessel_control
AS $$
  DECLARE
    vc accounting.vessel_control;
    vals accounting.vessel_control;
  BEGIN
    FOREACH vc IN ARRAY vessel_controls LOOP
      INSERT INTO accounting.vessel_control(
        id,
        vessel_code,
        shipper_id,
        approval_1,
        approval_2,
        date_sent,
        is_liquidated,
        notes_1,
        notes_2
      )
        VALUES (
          COALESCE(vc.id, (select nextval('accounting.vessel_control_id_seq'))),
          vc.vessel_code,
          vc.shipper_id,
          vc.approval_1,
          vc.approval_2,
          vc.date_sent,
          vc.is_liquidated,
          vc.notes_1,
          vc.notes_2
        )
      ON CONFLICT (id) DO UPDATE SET
				vessel_code=EXCLUDED.vessel_code,
        shipper_id=EXCLUDED.shipper_id,
        approval_1=EXCLUDED.approval_1,
        approval_2=EXCLUDED.approval_2,
        date_sent=EXCLUDED.date_sent,
        is_liquidated=EXCLUDED.is_liquidated,
        notes_1=EXCLUDED.notes_1,
        notes_2=EXCLUDED.notes_2
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
