CREATE TABLE accounting.expense_item (
  id BIGSERIAL PRIMARY KEY,
  vendor_id TEXT,
  voucher_id TEXT,
  sequence_id NUMERIC,
  quantity NUMERIC,
  unit_price NUMERIC,
  item_amount NUMERIC,
  bill_of_lading_id TEXT,
  product_code TEXT,
  pallet_id TEXT,
  shipper_id TEXT,
  notes TEXT
);

CREATE FUNCTION accounting.expense_item_pallet(IN e accounting.expense_item)
    RETURNS product.pallet
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pallet p
    WHERE p.pallet_id = e.pallet_id
    LIMIT 1;
$BODY$;

CREATE FUNCTION accounting.expense_item_common_species(IN e accounting.expense_item)
    RETURNS product.common_species
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.common_species s
    WHERE s.product_species_id = SUBSTRING(e.product_code, 1, 2)
    LIMIT 1;
$BODY$;

CREATE FUNCTION accounting.expense_item_common_variety(IN e accounting.expense_item)
    RETURNS product.common_variety
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.common_variety v
    WHERE v.product_variety_id = SUBSTRING(e.product_code, 1, 4);
$BODY$;

CREATE FUNCTION accounting.expense_item_shipper(IN e accounting.expense_item)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = e.shipper_id;
$BODY$;

CREATE FUNCTION accounting.bulk_upsert_expense_item(
  expense_items accounting.expense_item[]
)
RETURNS setof accounting.expense_item
AS $$
  DECLARE
    ei accounting.expense_item;
    vals accounting.expense_item;
  BEGIN
    FOREACH ei IN ARRAY expense_items LOOP
      INSERT INTO accounting.expense_item(
        id,
        vendor_id,
        voucher_id,
        sequence_id,
        quantity,
        unit_price,
        item_amount,
        bill_of_lading_id,
        product_code,
        pallet_id,
        shipper_id,
        notes
      )
        VALUES (
          COALESCE(ei.id, (select nextval('accounting.expense_item_id_seq'))),
          ei.vendor_id,
          ei.voucher_id,
          ei.sequence_id,
          ei.quantity,
          ei.unit_price,
          ei.item_amount,
          ei.bill_of_lading_id,
          ei.product_code,
          ei.pallet_id,
          ei.shipper_id,
          ei.notes
        )
      ON CONFLICT (id) DO UPDATE SET
        vendor_id=EXCLUDED.vendor_id,
        voucher_id=EXCLUDED.voucher_id,
        sequence_id=EXCLUDED.sequence_id,
        quantity=EXCLUDED.quantity,
        unit_price=EXCLUDED.unit_price,
        item_amount=EXCLUDED.item_amount,
        bill_of_lading_id=EXCLUDED.bill_of_lading_id,
        product_code=EXCLUDED.product_code,
        pallet_id=EXCLUDED.pallet_id,
        shipper_id=EXCLUDED.shipper_id,
        notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION accounting.bulk_delete_expense_item(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM accounting.expense_item
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
