CREATE TABLE product.product_master (
  id TEXT PRIMARY KEY,
  default_pallet_quantity TEXT,
  lot_number TEXT
);

CREATE FUNCTION product.product_master_species(IN a product.product_master)
    RETURNS product.product_species
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_species b WHERE b.id = SUBSTRING(a.id, 1, 2);
$BODY$;

CREATE FUNCTION product.product_master_variety(IN a product.product_master)
    RETURNS product.product_variety
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_variety b WHERE b.id = SUBSTRING(a.id, 1, 4);
$BODY$;

CREATE FUNCTION product.product_master_sizes(IN a product.product_master)
    RETURNS SETOF product.product_size
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_size b
    WHERE b.jv_code = SUBSTRING(a.id, 5, 3)
    AND (
      (b.species_id = SUBSTRING(a.id, 1, 2)
      AND (b.variety_id = SUBSTRING(a.id, 1, 4) OR b.variety_id IS NULL))
    OR
      ((b.species_id = SUBSTRING(a.id, 1, 2)) OR b.species_id IS NULL)
    );
$BODY$;

CREATE FUNCTION product.product_master_pack_type(IN a product.product_master)
    RETURNS product.pack_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_master b
  WHERE b.jv_pack_code = SUBSTRING(a.id, 8, 4);
$BODY$;

CREATE FUNCTION product.product_master_search_text(IN a product.product_master)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		a.id,
		a.lot_number,
		a.default_pallet_quantity
	) FROM product.product_master;
$BODY$;

CREATE FUNCTION product.bulk_upsert_product_master(
  product_masters product.product_master[]
)
RETURNS setof product.product_master
AS $$
  DECLARE
    pm product.product_master;
    vals product.product_master;
  BEGIN
    FOREACH pm IN ARRAY product_masters LOOP
      INSERT INTO product.product_master(
        id,
				default_pallet_quantity,
				lot_number
      )
        VALUES (
          pm.id,
					pm.default_pallet_quantity,
					pm.lot_number
        )
      ON CONFLICT (id) DO UPDATE SET
			  default_pallet_quantity=EXCLUDED.default_pallet_quantity,
			  lot_number=EXCLUDED.lot_number
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
