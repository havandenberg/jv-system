CREATE TABLE directory.customer_volume_discount (
  id BIGSERIAL PRIMARY KEY,
	customer_id TEXT,
	volume_discount_code TEXT,
	amount NUMERIC
);

CREATE INDEX ON directory.customer_volume_discount (customer_id);

CREATE FUNCTION directory.customer_volume_discount_customer(IN cvd directory.customer_volume_discount)
  RETURNS directory.customer
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT * FROM directory.customer c WHERE c.id = cvd.customer_id;
$BODY$;

CREATE FUNCTION directory.bulk_upsert_customer_volume_discount(
  customer_volume_discounts directory.customer_volume_discount[]
)
RETURNS setof directory.customer_volume_discount
AS $$
  DECLARE
    cvd directory.customer_volume_discount;
    vals directory.customer_volume_discount;
  BEGIN
    FOREACH cvd IN ARRAY customer_volume_discounts LOOP
      INSERT INTO directory.customer_volume_discount(
        id,
        customer_id,
        volume_discount_code,
        amount
      )
        VALUES (
          COALESCE(cvd.id, (select nextval('directory.customer_volume_discount_id_seq'))),
          cvd.customer_id,
          cvd.volume_discount_code,
          cvd.amount
        )
      ON CONFLICT (id) DO UPDATE SET
        customer_id=EXCLUDED.customer_id,
        volume_discount_code=EXCLUDED.volume_discount_code,
        amount=EXCLUDED.amount
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION directory.bulk_delete_customer_volume_discount(IN ids_to_delete BIGINT[])
  RETURNS setof BIGINT
AS $$
  DELETE FROM directory.customer_volume_discount
  WHERE id = ANY(ids_to_delete) RETURNING (id);
$$ LANGUAGE sql VOLATILE STRICT SECURITY DEFINER;
