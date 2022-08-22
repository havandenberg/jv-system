CREATE TABLE operations.order_pallet (
  id BIGSERIAL PRIMARY KEY,
  pallet_status TEXT,
  order_id NUMERIC,
  back_order_id NUMERIC,
  line_id NUMERIC,
  pallet_id TEXT,
  condition_code TEXT,
  repack_id TEXT,
  credit_code TEXT,
  price_adjustment NUMERIC,
  freight_adjustment NUMERIC,
  notes TEXT
);

CREATE FUNCTION operations.order_pallet_product_pallet(IN o operations.order_pallet)
    RETURNS product.pallet
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet p
    WHERE p.pallet_id = o.pallet_id
    LIMIT 1;
$BODY$;

CREATE FUNCTION operations.order_pallet_order_item(IN o operations.order_pallet)
    RETURNS operations.order_item
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.order_item oi
  WHERE oi.order_id = o.order_id
    AND oi.back_order_id = o.back_order_id
    AND oi.line_id = o.line_id
  LIMIT 1;
$BODY$;

CREATE FUNCTION operations.bulk_upsert_order_pallet(
  order_pallets operations.order_pallet[]
)
RETURNS setof operations.order_pallet
AS $$
  DECLARE
    op operations.order_pallet;
    vals operations.order_pallet;
  BEGIN
    FOREACH op IN ARRAY order_pallets LOOP
      INSERT INTO operations.order_pallet(
        id,
        pallet_status,
        order_id,
        back_order_id,
        line_id,
        pallet_id,
        condition_code,
        repack_id,
        credit_code,
        price_adjustment,
        freight_adjustment,
        notes
      )
        VALUES (
          op.id,
          op.pallet_status,
          op.order_id,
          op.back_order_id,
          op.line_id,
          op.pallet_id,
          op.condition_code,
          op.repack_id,
          op.credit_code,
          op.price_adjustment,
          op.freight_adjustment,
          op.notes
        )
      ON CONFLICT (id) DO UPDATE SET
			  pallet_status=EXCLUDED.pallet_status,
			  order_id=EXCLUDED.order_id,
			  back_order_id=EXCLUDED.back_order_id,
			  line_id=EXCLUDED.line_id,
			  pallet_id=EXCLUDED.pallet_id,
			  condition_code=EXCLUDED.condition_code,
			  repack_id=EXCLUDED.repack_id,
			  credit_code=EXCLUDED.credit_code,
			  price_adjustment=EXCLUDED.price_adjustment,
			  freight_adjustment=EXCLUDED.freight_adjustment,
			  notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION operations.bulk_delete_order_pallet(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM operations.order_pallet
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
