CREATE TABLE accounting.unpaid (
  id BIGSERIAL PRIMARY KEY,
  vessel_code TEXT NOT NULL,
  shipper_id TEXT NOT NULL,
  invoice_id NUMERIC NOT NULL,
  is_urgent BOOLEAN,
  is_approved BOOLEAN,
  notes TEXT
);

CREATE INDEX ON accounting.unpaid (vessel_code, shipper_id, invoice_id);

CREATE FUNCTION accounting.unpaid_vessel(IN u accounting.unpaid)
  RETURNS product.vessel
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = u.vessel_code ORDER BY v.discharge_date DESC LIMIT 1
$BODY$;

CREATE FUNCTION accounting.unpaid_shipper(IN u accounting.unpaid)
  RETURNS directory.shipper
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = u.shipper_id
$BODY$;

CREATE FUNCTION accounting.unpaid_invoice(IN u accounting.unpaid)
  RETURNS accounting.invoice_header
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT * FROM accounting.invoice_header i WHERE i.invoice_id = u.invoice_id
$BODY$;

CREATE FUNCTION accounting.unpaid_vessel_control(IN u accounting.unpaid)
  RETURNS accounting.vessel_control
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT * FROM accounting.vessel_control vc
    WHERE u.vessel_code = vc.vessel_code
      AND u.shipper_id = vc.shipper_id
      LIMIT 1
$BODY$;

CREATE FUNCTION directory.bulk_upsert_unpaid(
  unpaids accounting.unpaid[]
)
RETURNS setof accounting.unpaid
AS $$
  DECLARE
    u accounting.unpaid;
    vals accounting.unpaid;
  BEGIN
    FOREACH u IN ARRAY unpaids LOOP
      INSERT INTO accounting.unpaid(
        id,
        vessel_code,
        shipper_id,
        invoice_id,
        is_urgent,
        is_approved,
        notes
      )
        VALUES (
          COALESCE(u.id, (select nextval('accounting.unpaid_id_seq'))),
          u.vessel_code,
          u.shipper_id,
          u.invoice_id,
          u.is_urgent,
          u.is_approved,
          u.notes
        )
      ON CONFLICT (id) DO UPDATE SET
        vessel_code=EXCLUDED.vessel_code,
        shipper_id=EXCLUDED.shipper_id,
        invoice_id=EXCLUDED.invoice_id,
        is_urgent=EXCLUDED.is_urgent,
        is_approved=EXCLUDED.is_approved,
        notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
