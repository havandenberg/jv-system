CREATE TABLE operations.repack_header (
  id BIGSERIAL PRIMARY KEY,
  repack_code TEXT,
  run_number TEXT,
  wh_bags_out NUMERIC,
  wh_weight_in NUMERIC,
  wh_weight_out NUMERIC,
  wh_boxes_in NUMERIC,
  wh_boxes_out NUMERIC,
  repack_date DATE,
  repack_style_id TEXT,
  warehouse_id TEXT,
  entry_user_code TEXT,
  notes TEXT
);

CREATE INDEX ON operations.repack_header (repack_code, run_number, repack_date, warehouse_id);

CREATE FUNCTION operations.repack_header_warehouse(IN r operations.repack_header)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = r.warehouse_id;
$BODY$;

CREATE FUNCTION operations.repack_header_count(IN r operations.repack_header)
    RETURNS INT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT COUNT(*) FROM operations.repack_header rh
    WHERE rh.repack_code = r.repack_code;
$BODY$;

CREATE FUNCTION operations.repack_header_entry_user(IN r operations.repack_header)
    RETURNS public.user
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM public.user u WHERE u.user_code = r.entry_user_code;
$BODY$;

CREATE FUNCTION operations.repack_header_repack_style(IN r operations.repack_header)
    RETURNS product.repack_style
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.repack_style s WHERE s.id = r.repack_style_id;
$BODY$;

CREATE FUNCTION operations.repack_header_items(IN r operations.repack_header)
    RETURNS setof operations.repack_item
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.repack_item ri
  WHERE ri.repack_code = r.repack_code
    AND ri.run_number = r.run_number;
$BODY$;

CREATE FUNCTION operations.repack_header_boxes_in(IN r operations.repack_header)
    RETURNS NUMERIC
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT SUM(boxes_in) FROM operations.repack_header_items(r);
$BODY$;

CREATE FUNCTION operations.repack_header_boxes_out(IN r operations.repack_header)
    RETURNS NUMERIC
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT SUM(boxes_out) FROM operations.repack_header_items(r);
$BODY$;

CREATE FUNCTION operations.repack_header_weight_in(IN r operations.repack_header)
    RETURNS NUMERIC
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT SUM(ri.boxes_out * (
      SELECT net_weight_box FROM product.product_master_pack_type(pm)
    )) FROM operations.repack_header_items(r) AS ri
    LEFT JOIN product.pallet p ON p.pallet_id = ri.pallet_id
    LEFT JOIN product.product_master pm ON pm.id = p.product_id;
$BODY$;

CREATE FUNCTION operations.repack_header_weight_out(IN r operations.repack_header)
    RETURNS NUMERIC
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT SUM(ri.boxes_out * rs.pack_out_weight) FROM operations.repack_header_items(r) AS ri
    LEFT JOIN product.repack_style rs ON rs.id = r.repack_style_id;
$BODY$;

CREATE FUNCTION operations.repack_header_search_text(IN r operations.repack_header)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		r.repack_code,
		r.repack_style_id,
    r.notes
	) FROM operations.repack_header rh WHERE rh.id = r.id;
$BODY$;

CREATE FUNCTION operations.bulk_upsert_repack_header(
  repack_headers operations.repack_header[]
)
RETURNS setof operations.repack_header
AS $$
  DECLARE
    rh operations.repack_header;
    vals operations.repack_header;
  BEGIN
    FOREACH rh IN ARRAY repack_headers LOOP
      INSERT INTO operations.repack_header(
        id,
        repack_code,
        run_number,
        wh_bags_out,
        wh_weight_in,
        wh_weight_out,
        wh_boxes_in,
        wh_boxes_out,
        repack_date,
        repack_style_id,
        warehouse_id,
        entry_user_code,
        notes
      )
        VALUES (
          COALESCE(rh.id, nextval('operations.repack_header_id_seq')),
          rh.repack_code,
          rh.run_number,
          rh.wh_bags_out,
          rh.wh_weight_in,
          rh.wh_weight_out,
          rh.wh_boxes_in,
          rh.wh_boxes_out,
          rh.repack_date,
          rh.repack_style_id,
          rh.warehouse_id,
          rh.entry_user_code,
          rh.notes
        )
      ON CONFLICT (id) DO UPDATE SET
        repack_code=EXCLUDED.repack_code,
        run_number=EXCLUDED.run_number,
        wh_bags_out=EXCLUDED.wh_bags_out,
        wh_weight_in=EXCLUDED.wh_weight_in,
        wh_weight_out=EXCLUDED.wh_weight_out,
        wh_boxes_in=EXCLUDED.wh_boxes_in,
        wh_boxes_out=EXCLUDED.wh_boxes_out,
        repack_date=EXCLUDED.repack_date,
        repack_style_id=EXCLUDED.repack_style_id,
        warehouse_id=EXCLUDED.warehouse_id,
        entry_user_code=EXCLUDED.entry_user_code,
        notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION operations.bulk_delete_repack_header(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM operations.repack_header
  WHERE id=ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
