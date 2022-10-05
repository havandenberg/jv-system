CREATE TABLE operations.truck_load (
  id BIGSERIAL PRIMARY KEY,
  load_id TEXT,
  load_status TEXT,
  vendor_id TEXT,
  fob BOOLEAN,
  ship_date DATE,
  ryan_number TEXT,
  trucker_name TEXT,
  expeditor_name TEXT,
  time_started TIMESTAMP,
  time_completed TIMESTAMP,
  time_in TIMESTAMP,
  time_out TIMESTAMP,
  time_confirmed TIMESTAMP,
  warehouse_id TEXT,
  change_flag BOOLEAN,
  license_plate TEXT,
  in_use BOOLEAN,
  cartage TEXT,
  cartage_vendor_id TEXT,
  temperature TEXT,
  load_lock TEXT,
  notes TEXT
);

CREATE FUNCTION operations.truck_load_order_masters(IN t operations.truck_load)
    RETURNS setof operations.order_master
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM operations.order_master om
    WHERE om.truck_load_id = t.load_id
    AND om.vendor_id = t.vendor_id
    AND om.ship_warehouse_id = t.warehouse_id;
$BODY$;

CREATE FUNCTION operations.truck_load_count(IN t operations.truck_load)
    RETURNS INT
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT COUNT(*) FROM operations.truck_load tl
    WHERE tl.load_id = t.load_id;
$BODY$;

CREATE FUNCTION operations.truck_load_pallets(IN t operations.truck_load)
    RETURNS setof product.pallet
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT p.* FROM accounting.invoice_header ih
    INNER JOIN accounting.invoice_item ii
        ON  ih.order_id = ii.order_id
        AND ih.back_order_id = ii.back_order_id
    INNER JOIN product.pallet p
        ON ii.pallet_id = p.pallet_id
  WHERE truck_load_id = t.load_id;
$BODY$;

CREATE FUNCTION operations.truck_load_warehouse(IN t operations.truck_load)
    RETURNS directory.warehouse
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.warehouse w WHERE w.id = t.warehouse_id
$BODY$;

CREATE FUNCTION operations.truck_load_vendor(IN t operations.truck_load)
    RETURNS directory.vendor
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.vendor v
    WHERE v.id = t.vendor_id;
$BODY$;

CREATE FUNCTION operations.truck_load_search_text(IN t operations.truck_load)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT CONCAT (
		t.load_id,
		t.vendor_id,
		t.ryan_number,
		t.trucker_name,
		t.expeditor_name,
		t.warehouse_id,
		t.license_plate,
		t.cartage_vendor_id,
		t.temperature,
    t.notes
	) FROM operations.truck_load tl WHERE tl.id = t.id;
$BODY$;

CREATE FUNCTION operations.bulk_upsert_truck_load(
  truck_loads operations.truck_load[]
)
RETURNS setof operations.truck_load
AS $$
  DECLARE
    tl operations.truck_load;
    vals operations.truck_load;
  BEGIN
    FOREACH tl IN ARRAY truck_loads LOOP
      INSERT INTO operations.truck_load(
        id,
        load_id,
        load_status,
        vendor_id,
        fob,
        ship_date,
        ryan_number,
        trucker_name,
        expeditor_name,
        time_started,
        time_completed,
        time_in,
        time_out,
        time_confirmed,
        warehouse_id,
        change_flag,
        license_plate,
        in_use,
        cartage,
        cartage_vendor_id,
        temperature,
        load_lock,
        notes
      )
        VALUES (
          COALESCE(tl.id, (select nextval('operations.truck_load_id_seq'))),
          tl.load_id,
          tl.load_status,
          tl.vendor_id,
          tl.fob,
          tl.ship_date,
          tl.ryan_number,
          tl.trucker_name,
          tl.expeditor_name,
          tl.time_started,
          tl.time_completed,
          tl.time_in,
          tl.time_out,
          tl.time_confirmed,
          tl.warehouse_id,
          tl.change_flag,
          tl.license_plate,
          tl.in_use,
          tl.cartage,
          tl.cartage_vendor_id,
          tl.temperature,
          tl.load_lock,
          tl.notes
        )
      ON CONFLICT (id) DO UPDATE SET
			  load_id=EXCLUDED.load_id,
			  load_status=EXCLUDED.load_status,
			  vendor_id=EXCLUDED.vendor_id,
			  fob=EXCLUDED.fob,
			  ship_date=EXCLUDED.ship_date,
			  ryan_number=EXCLUDED.ryan_number,
			  trucker_name=EXCLUDED.trucker_name,
			  expeditor_name=EXCLUDED.expeditor_name,
			  time_started=EXCLUDED.time_started,
			  time_completed=EXCLUDED.time_completed,
			  time_in=EXCLUDED.time_in,
			  time_out=EXCLUDED.time_out,
			  time_confirmed=EXCLUDED.time_confirmed,
			  warehouse_id=EXCLUDED.warehouse_id,
			  change_flag=EXCLUDED.change_flag,
			  license_plate=EXCLUDED.license_plate,
			  in_use=EXCLUDED.in_use,
			  cartage=EXCLUDED.cartage,
			  cartage_vendor_id=EXCLUDED.cartage_vendor_id,
			  temperature=EXCLUDED.temperature,
			  load_lock=EXCLUDED.load_lock,
			  notes=EXCLUDED.notes
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION operations.bulk_delete_truck_load(IN ids_to_delete NUMERIC[])
  RETURNS setof TEXT
AS $$
  DELETE FROM operations.truck_load
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
