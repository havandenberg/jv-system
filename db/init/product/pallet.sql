CREATE TABLE product.pallet (
  id BIGSERIAL PRIMARY KEY,
  vessel_code TEXT NOT NULL,
  pallet_id TEXT NOT NULL,
  product_id TEXT,
  current_box_quantity NUMERIC,
  received_box_quantity NUMERIC,
  returned_box_quantity NUMERIC,
  location_id TEXT,
  room TEXT,
  section TEXT,
  row TEXT,
  jv_lot_number TEXT,
  shipper_id TEXT,
  date_transferred_to_storage TEXT,
  order_id TEXT,
  back_order_id TEXT,
  shipped BOOLEAN,
  age NUMERIC,
  volume_discount_code TEXT,
  original_location_id TEXT,
  filler TEXT,
  grower_id TEXT,
  old_pack_code TEXT,
  pack_date TEXT,
  hatch TEXT,
  deck TEXT,
  bill_of_lading TEXT,
  container_id TEXT,
  temperature_recording TEXT
);

CREATE INDEX ON product.pallet (pallet_id, shipper_id, vessel_code);

CREATE TABLE product.pallet_section (
  id BIGSERIAL PRIMARY KEY,
  pallet_id TEXT NOT NULL,
  grower_id TEXT,
  variety_id TEXT,
  size_id TEXT,
  box_quantity NUMERIC,
  pack_date TEXT
);

CREATE FUNCTION product.pallet_pallet_sections(IN p product.pallet)
    RETURNS SETOF product.pallet_section
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet_section ps WHERE ps.pallet_id = p.pallet_id
$BODY$;

CREATE FUNCTION product.pallet_vessel(IN p product.pallet)
    RETURNS product.vessel
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.vessel v WHERE v.vessel_code = p.vessel_code AND v.is_pre = FALSE LIMIT 1
$BODY$;

CREATE FUNCTION product.pallet_product(IN p product.pallet)
    RETURNS product.product_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_master pm WHERE pm.id = p.product_id
$BODY$;

CREATE FUNCTION product.pallet_sizes(IN a product.pallet)
    RETURNS SETOF product.product_size
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  (SELECT * FROM product.product_size b
    WHERE b.jv_code = SUBSTRING(a.product_id, 5, 3)
    AND (b.species_id = SUBSTRING(a.product_id, 1, 2)
      AND b.variety_id = SUBSTRING(a.product_id, 1, 4)
      AND b.shipper_id = a.shipper_id
    )) UNION
  (SELECT * FROM product.product_size b
    WHERE b.jv_code = SUBSTRING(a.product_id, 5, 3)
    AND (b.species_id = SUBSTRING(a.product_id, 1, 2)
      AND b.variety_id = ''
      AND b.shipper_id = a.shipper_id
    )) UNION
  (SELECT * FROM product.product_size b
    WHERE b.jv_code = SUBSTRING(a.product_id, 5, 3)
    AND (b.species_id = SUBSTRING(a.product_id, 1, 2)
      AND b.variety_id = ''
      AND b.shipper_id = ''
    )) UNION
  (SELECT * FROM product.product_size b
    WHERE b.jv_code = SUBSTRING(a.product_id, 5, 3)
    AND (b.species_id = ''
      AND b.variety_id = ''
      AND b.shipper_id = ''
    ))
  ORDER BY jv_code, shipper_id DESC, species_id DESC, variety_id DESC;
$BODY$;

CREATE FUNCTION product.pallet_pack_type(IN a product.pallet)
    RETURNS product.pack_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_master b
    WHERE b.jv_pack_code = SUBSTRING(a.product_id, 8, 4)
    AND b.shipper_id = a.shipper_id;
$BODY$;

CREATE FUNCTION product.pallet_warehouse(IN p product.pallet)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = p.location_id
$BODY$;

CREATE FUNCTION product.pallet_shipper(IN p product.pallet)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pallet_original_location(IN p product.pallet)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = p.original_location_id
$BODY$;

CREATE FUNCTION product.pallet_order_master(IN p product.pallet)
    RETURNS operations.order_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.order_master o
    WHERE CAST (o.order_id AS TEXT) = p.order_id
    AND CAST (o.back_order_id AS TEXT) = p.back_order_id
$BODY$;

CREATE FUNCTION product.pallet_invoice_headers(IN p product.pallet)
    RETURNS setof accounting.invoice_header
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT i.* FROM accounting.invoice_item ii
    JOIN accounting.invoice_header i ON ii.order_id = i.order_id
      AND ii.back_order_id = i.back_order_id
    WHERE p.pallet_id = ii.pallet_id
$BODY$;

CREATE FUNCTION product.pallet_search_text(IN p product.pallet)
    RETURNS TEXT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
	p.pallet_id,
	p.product_id,
	p.room,
	p.section,
	p.row,
	p.jv_lot_number,
	p.order_id,
	p.back_order_id,
	p.volume_discount_code,
	p.filler,
	p.grower_id,
	p.old_pack_code,
	p.hatch,
	p.deck,
	p.bill_of_lading,
	p.container_id,
	p.temperature_recording
	) FROM product.pallet;
$BODY$;

CREATE FUNCTION product.pallet_section_variety(IN p product.pallet_section)
    RETURNS product.product_variety
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_variety v WHERE v.id = p.variety_id
$BODY$;

CREATE FUNCTION product.pallet_psa_arrival_report(IN p product.pallet)
    RETURNS inspection.psa_arrival_report
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT
    par.*
  FROM inspection.psa_arrival_report par
  JOIN inspection.psa_arrival_picture pap
    ON pap.exporter_id = par.exporter_id
    AND pap.arrival_code = par.arrival_code
  WHERE pap.pallet_id = p.pallet_id LIMIT 1
$BODY$;

CREATE FUNCTION product.bulk_upsert_pallet(
  pallets product.pallet[]
)
RETURNS setof product.pallet
AS $$
  DECLARE
    p product.pallet;
    vals product.pallet;
  BEGIN
    FOREACH p IN ARRAY pallets LOOP
      INSERT INTO product.pallet(
        id,
        vessel_code,
        pallet_id,
        product_id,
        current_box_quantity,
        received_box_quantity,
        returned_box_quantity,
        location_id,
        room,
        section,
        row,
        jv_lot_number,
        shipper_id,
        date_transferred_to_storage,
        order_id,
        back_order_id,
        shipped,
        age,
        volume_discount_code,
        original_location_id,
        filler,
        grower_id,
        old_pack_code,
        pack_date,
        hatch,
        deck,
        bill_of_lading,
        container_id,
        temperature_recording
      )
        VALUES (
          COALESCE(p.id, (select nextval('product.pallet_id_seq'))),
          p.vessel_code,
          p.pallet_id,
          p.product_id,
          p.current_box_quantity,
          p.received_box_quantity,
          p.returned_box_quantity,
          p.location_id,
          p.room,
          p.section,
          p.row,
          p.jv_lot_number,
          p.shipper_id,
          p.date_transferred_to_storage,
          p.order_id,
          p.back_order_id,
          p.shipped,
          p.age,
          p.volume_discount_code,
          p.original_location_id,
          p.filler,
          p.grower_id,
          p.old_pack_code,
          p.pack_date,
          p.hatch,
          p.deck,
          p.bill_of_lading,
          p.container_id,
          p.temperature_recording
        )
      ON CONFLICT (id) DO UPDATE SET
        vessel_code=EXCLUDED.vessel_code,
        pallet_id=EXCLUDED.pallet_id,
        product_id=EXCLUDED.product_id,
        current_box_quantity=EXCLUDED.current_box_quantity,
        received_box_quantity=EXCLUDED.received_box_quantity,
        returned_box_quantity=EXCLUDED.returned_box_quantity,
        location_id=EXCLUDED.location_id,
        room=EXCLUDED.room,
        section=EXCLUDED.section,
        row=EXCLUDED.row,
        jv_lot_number=EXCLUDED.jv_lot_number,
        shipper_id=EXCLUDED.shipper_id,
        date_transferred_to_storage=EXCLUDED.date_transferred_to_storage,
        order_id=EXCLUDED.order_id,
        back_order_id=EXCLUDED.back_order_id,
        shipped=EXCLUDED.shipped,
        age=EXCLUDED.age,
        volume_discount_code=EXCLUDED.volume_discount_code,
        original_location_id=EXCLUDED.original_location_id,
        filler=EXCLUDED.filler,
        grower_id=EXCLUDED.grower_id,
        old_pack_code=EXCLUDED.old_pack_code,
        pack_date=EXCLUDED.pack_date,
        hatch=EXCLUDED.hatch,
        deck=EXCLUDED.deck,
        bill_of_lading=EXCLUDED.bill_of_lading,
        container_id=EXCLUDED.container_id,
        temperature_recording=EXCLUDED.temperature_recording
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pallet_section(
  pallet_sections product.pallet_section[]
)
RETURNS setof product.pallet_section
AS $$
  DECLARE
    ps product.pallet_section;
    vals product.pallet_section;
  BEGIN
    FOREACH ps IN ARRAY pallet_sections LOOP
      INSERT INTO product.pallet_section(
        id,
        pallet_id,
        grower_id,
        variety_id,
        size_id,
        box_quantity,
        pack_date
      )
        VALUES (
          COALESCE(ps.id, (select nextval('product.pallet_section_id_seq'))),
          ps.pallet_id,
          ps.grower_id,
          ps.variety_id,
          ps.size_id,
          ps.box_quantity,
          ps.pack_date
        )
      ON CONFLICT (id) DO UPDATE SET
        pallet_id=EXCLUDED.pallet_id,
        grower_id=EXCLUDED.grower_id,
        variety_id=EXCLUDED.variety_id,
        size_id=EXCLUDED.size_id,
        box_quantity=EXCLUDED.box_quantity,
        pack_date=EXCLUDED.pack_date
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_delete_pallet(IN ids_to_delete BIGINT[])
  RETURNS setof BIGINT
AS $$
  DELETE FROM product.pallet
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;

CREATE FUNCTION product.bulk_delete_pallet_section(IN ids_to_delete BIGINT[])
  RETURNS setof BIGINT
AS $$
  DELETE FROM product.pallet_section
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
