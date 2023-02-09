CREATE TABLE operations.repack_item (
  id BIGSERIAL PRIMARY KEY,
  repack_code TEXT,
  run_number TEXT,
  pallet_id TEXT,
  new_pallet_id TEXT,
  boxes_in NUMERIC,
  boxes_out NUMERIC,
  notes TEXT
);

CREATE INDEX ON operations.repack_item (repack_code, run_number, pallet_id, new_pallet_id);

CREATE FUNCTION operations.repack_item_pallet(IN r operations.repack_item)
    RETURNS product.pallet
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet p WHERE p.pallet_id = r.pallet_id;
$BODY$;

CREATE FUNCTION operations.bulk_upsert_repack_item(
  repack_items operations.repack_item[]
)
RETURNS setof operations.repack_item
AS $$
  DECLARE
    ri operations.repack_item;
    vals operations.repack_item;
  BEGIN
    FOREACH ri IN ARRAY repack_items LOOP
      INSERT INTO operations.repack_item(
        id,
        repack_code,
        run_number,
        pallet_id,
        new_pallet_id,
        boxes_in,
        boxes_out,
        notes
      )
        VALUES (
          COALESCE(ri.id, nextval('operations.repack_item_id_seq')),
          ri.repack_code,
          ri.run_number,
          ri.pallet_id,
          ri.new_pallet_id,
          ri.boxes_in,
          ri.boxes_out,
          ri.notes
        )
      ON CONFLICT (id) DO UPDATE SET
        repack_code=EXCLUDED.repack_code,
        run_number=EXCLUDED.run_number,
        pallet_id=EXCLUDED.pallet_id,
        new_pallet_id=EXCLUDED.new_pallet_id,
        boxes_in=EXCLUDED.boxes_in,
        boxes_out=EXCLUDED.boxes_out,
        notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION operations.bulk_delete_repack_item(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM operations.repack_item
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
