CREATE TABLE operations.repack_queue (
  id BIGSERIAL PRIMARY KEY,
  order_id NUMERIC,
  repack_code TEXT,
  repack_date DATE,
  repack_style_id TEXT,
  warehouse_id TEXT,
  pallet_count NUMERIC,
  ship_date DATE,
  del_date DATE,
  order_notes TEXT,
  notes TEXT
);

CREATE INDEX ON operations.repack_queue (repack_code, repack_date, warehouse_id, repack_style_id);

CREATE FUNCTION operations.new_repack_queues()
  RETURNS SETOF TEXT
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT
    CONCAT(
      COALESCE(rq.order_id, oi.order_id), '|',
      COALESCE(rq.repack_style_id, oi.special_lot_number), '|',
      COALESCE(rq.warehouse_id, array_to_string(array_agg(DISTINCT oi.location_id), ',')), '|',
      COALESCE(rq.ship_date, om.actual_ship_date), '|',
      COALESCE(rq.del_date, om.expected_ship_date), '|',
      COALESCE(rq.pallet_count, SUM(oi.pallet_count::INT))
    )
  FROM operations.order_item oi
    LEFT JOIN operations.order_master om ON om.order_id = oi.order_id AND om.back_order_id = oi.back_order_id
    LEFT JOIN operations.repack_queue rq ON rq.order_id = oi.order_id AND rq.repack_style_id IN (
      SELECT DISTINCT repack_style_id FROM product.common_pack_type pt WHERE pt.pack_type_description = oi.special_lot_number
    )
      WHERE oi.special_lot_number != '' AND rq.id IS NULL
      GROUP BY oi.order_id, oi.special_lot_number, om.actual_ship_date, om.expected_ship_date, rq.id
      ORDER BY oi.order_id, oi.special_lot_number
$BODY$;

CREATE FUNCTION operations.repack_queue_repack_headers(IN r operations.repack_queue)
    RETURNS SETOF operations.repack_header
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.repack_header rh
    WHERE rh.repack_code = r.repack_code AND rh.repack_date = r.repack_date;
$BODY$;

CREATE FUNCTION operations.repack_queue_orders(IN r operations.repack_queue)
    RETURNS SETOF operations.order_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.order_master om
    WHERE om.order_id = r.order_id;
$BODY$;

CREATE FUNCTION operations.repack_queue_invoices(IN r operations.repack_queue)
    RETURNS SETOF accounting.invoice_header
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM accounting.invoice_header ih
    WHERE ih.order_id = r.order_id;
$BODY$;

CREATE FUNCTION operations.repack_queue_warehouse(IN r operations.repack_queue)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = r.warehouse_id;
$BODY$;

CREATE FUNCTION operations.repack_queue_repack_style(IN r operations.repack_queue)
    RETURNS product.repack_style
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.repack_style s WHERE s.id = r.repack_style_id;
$BODY$;

CREATE FUNCTION operations.repack_queue_search_text(IN r operations.repack_queue)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		r.repack_code,
		r.repack_style_id,
		r.order_id,
    r.order_notes,
    r.notes
	) FROM operations.repack_queue rq WHERE rq.id = r.id;
$BODY$;

CREATE FUNCTION operations.bulk_upsert_repack_queue(
  repack_queues operations.repack_queue[]
)
RETURNS setof operations.repack_queue
AS $$
  DECLARE
    rq operations.repack_queue;
    vals operations.repack_queue;
  BEGIN
    FOREACH rq IN ARRAY repack_queues LOOP
      INSERT INTO operations.repack_queue(
        id,
        order_id,
        repack_code,
        repack_date,
        repack_style_id,
        warehouse_id,
        pallet_count,
        ship_date,
        del_date,
        order_notes,
        notes
      )
        VALUES (
          COALESCE(rq.id, nextval('operations.repack_queue_id_seq')),
          rq.order_id,
          rq.repack_code,
          rq.repack_date,
          rq.repack_style_id,
          rq.warehouse_id,
          rq.pallet_count,
          rq.ship_date,
          rq.del_date,
          rq.order_notes,
          rq.notes
        )
      ON CONFLICT (id) DO UPDATE SET
        order_id=EXCLUDED.order_id,
        repack_code=EXCLUDED.repack_code,
        repack_date=EXCLUDED.repack_date,
        repack_style_id=EXCLUDED.repack_style_id,
        warehouse_id=EXCLUDED.warehouse_id,
        pallet_count=EXCLUDED.pallet_count,
        ship_date=EXCLUDED.ship_date,
        del_date=EXCLUDED.del_date,
        order_notes=EXCLUDED.order_notes,
        notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION operations.bulk_delete_repack_queue(IN ids_to_delete BIGINT[])
  RETURNS setof TEXT
AS $$
  DELETE FROM operations.repack_queue
  WHERE id=ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
