CREATE TABLE product.pack_atmosphere (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, ma_code),
	shipper_id TEXT,
  ma_code TEXT,
  ma_description TEXT
);

CREATE TABLE product.pack_box_style (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, box_style),
	shipper_id TEXT,
  box_style TEXT,
  box_description TEXT,
  combine_with TEXT,
  combine_description TEXT
);

CREATE TABLE product.pack_box_type (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, box_type),
	shipper_id TEXT,
  box_type TEXT,
  box_description TEXT
);

CREATE TABLE product.pack_destination (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, destination_code),
	shipper_id TEXT,
  destination_code TEXT,
  destination_description TEXT
);

CREATE TABLE product.pack_grade (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, grade_code),
	shipper_id TEXT,
  grade_code TEXT,
  grade_description TEXT
);

CREATE TABLE product.pack_hold (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, hold_code),
	shipper_id TEXT,
  hold_code TEXT,
  hold_description TEXT
);

CREATE TABLE product.pack_label (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, label_code),
  label_code TEXT,
  label_name TEXT,
	shipper_id TEXT,
  shipper_name TEXT
);

CREATE TABLE product.pack_liner (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, liner_code),
	shipper_id TEXT,
  liner_code TEXT,
  liner_description TEXT
);

CREATE TABLE product.pack_out (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, out_code),
	shipper_id TEXT,
  out_code TEXT,
  out_description TEXT,
  combine_with TEXT
);

CREATE TABLE product.pack_pallet_type (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, pallet_type),
	shipper_id TEXT,
  pallet_type TEXT,
  pallet_type_description TEXT,
  combine_with TEXT
);

CREATE TABLE product.pack_production (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, production_code),
	shipper_id TEXT,
  production_code TEXT,
  production_description TEXT,
  combine_with TEXT
);

CREATE TABLE product.pack_special (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, customer_code),
	shipper_id TEXT,
  customer_code TEXT,
	customer_id TEXT,
  customer_name TEXT
);

CREATE TABLE product.pack_style (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, pack_style),
	shipper_id TEXT,
  pack_style TEXT,
  style_description TEXT,
  combine_with TEXT
);

CREATE TABLE product.pack_tree_ripe (
	id BIGSERIAL PRIMARY KEY,
  UNIQUE (shipper_id, tree_ripe),
	shipper_id TEXT,
  tree_ripe TEXT,
  tree_ripe_description TEXT
);

CREATE TABLE product.pack_master (
	id BIGSERIAL PRIMARY KEY,
	shipper_id TEXT,
	label_code_id TEXT,
	customer_code_id TEXT,
	box_type_id TEXT,
	box_style_id TEXT,
	pack_style_id TEXT,
	out_code_id TEXT,
	out_quantity TEXT,
	out_weight TEXT,
	production_code_id TEXT,
	tree_ripe_id TEXT,
	grade_code_id TEXT,
	ma_code_id TEXT,
  liner_code_id TEXT,
  net_weight_contents NUMERIC,
  net_weight_box NUMERIC,
  box_length NUMERIC,
  box_width NUMERIC,
  box_height NUMERIC,
  pallet_type_id TEXT,
  default_pallet_quantity NUMERIC,
  plu_upc_code TEXT,
  destination_code_id TEXT,
  old_pack_code TEXT,
  old_label_code TEXT,
  jv_pack_code TEXT,
  pack_description TEXT,
  variety_id TEXT,
  species_id TEXT,
  hold_code_id TEXT
);

CREATE FUNCTION product.pack_master_search_text(IN p product.pack_master)
    RETURNS text
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		p.id,
		p.pack_description
	) FROM product.pack_master pp WHERE p.id = pp.id
$BODY$;

CREATE FUNCTION product.pack_atmosphere_shipper(IN p product.pack_atmosphere)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_box_style_shipper(IN p product.pack_box_style)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_box_type_shipper(IN p product.pack_box_type)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_destination_shipper(IN p product.pack_destination)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_grade_shipper(IN p product.pack_grade)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_hold_shipper(IN p product.pack_hold)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_label_shipper(IN p product.pack_label)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_liner_shipper(IN p product.pack_liner)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_out_shipper(IN p product.pack_out)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_pallet_type_shipper(IN p product.pack_pallet_type)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_production_shipper(IN p product.pack_production)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_special_shipper(IN p product.pack_special)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_special_customer(IN p product.pack_special)
    RETURNS directory.customer
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.customer c WHERE c.id = p.customer_id
$BODY$;

CREATE FUNCTION product.pack_style_shipper(IN p product.pack_style)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_tree_ripe_shipper(IN p product.pack_tree_ripe)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper s WHERE s.id = p.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_shipper(IN a product.pack_master)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper b WHERE b.id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_label(IN a product.pack_master)
    RETURNS product.pack_label
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_label b
  WHERE b.label_code = a.label_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_customer_special(IN a product.pack_master)
    RETURNS product.pack_special
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_special b
  WHERE b.customer_code = a.customer_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_box_type(IN a product.pack_master)
    RETURNS product.pack_box_type
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_box_type b
  WHERE b.box_type = a.box_type_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_box_style(IN a product.pack_master)
    RETURNS product.pack_box_style
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_box_style b
  WHERE b.box_style = a.box_style_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_pack_style(IN a product.pack_master)
    RETURNS product.pack_style
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_style b
  WHERE b.pack_style = a.pack_style_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_out(IN a product.pack_master)
    RETURNS product.pack_out
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_out b
  WHERE b.out_code = a.out_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_production(IN a product.pack_master)
    RETURNS product.pack_production
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_production b
  WHERE b.production_code = a.production_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_tree_ripe(IN a product.pack_master)
    RETURNS product.pack_tree_ripe
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_tree_ripe b
  WHERE b.tree_ripe = a.tree_ripe_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_grade(IN a product.pack_master)
    RETURNS product.pack_grade
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_grade b
  WHERE b.grade_code = a.grade_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_atmosphere(IN a product.pack_master)
    RETURNS product.pack_atmosphere
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_atmosphere b
  WHERE b.ma_code = a.ma_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_liner(IN a product.pack_master)
    RETURNS product.pack_liner
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_liner b
  WHERE b.liner_code = a.liner_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_pallet_type(IN a product.pack_master)
    RETURNS product.pack_pallet_type
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_pallet_type b
  WHERE b.pallet_type = a.pallet_type_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_destination(IN a product.pack_master)
    RETURNS product.pack_destination
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_destination b
  WHERE b.destination_code = a.destination_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.pack_master_variety(IN a product.pack_master)
    RETURNS product.product_variety
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_variety b WHERE b.id = a.variety_id
$BODY$;

CREATE FUNCTION product.pack_master_species(IN a product.pack_master)
    RETURNS product.product_species
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_species b WHERE b.id = a.species_id
$BODY$;

CREATE FUNCTION product.pack_master_hold(IN a product.pack_master)
    RETURNS product.pack_hold
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.pack_hold b
  WHERE b.hold_code = a.hold_code_id AND b.shipper_id = a.shipper_id
$BODY$;

CREATE FUNCTION product.bulk_upsert_pack_atmosphere(
  pack_atmospheres product.pack_atmosphere[]
)
RETURNS setof product.pack_atmosphere
AS $$
  DECLARE
    pa product.pack_atmosphere;
    vals product.pack_atmosphere;
  BEGIN
    FOREACH pa IN ARRAY pack_atmospheres LOOP
      INSERT INTO product.pack_atmosphere(
        id,
		    shipper_id,
        ma_code,
        ma_description
      )
        VALUES (
          COALESCE(pa.id, (select nextval('product.pack_atmosphere_id_seq'))),
		      pa.shipper_id,
          pa.ma_code,
          pa.ma_description
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  ma_code=EXCLUDED.ma_code,
			  ma_description=EXCLUDED.ma_description
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_box_style(
  pack_box_styles product.pack_box_style[]
)
RETURNS setof product.pack_box_style
AS $$
  DECLARE
    pbs product.pack_box_style;
    vals product.pack_box_style;
  BEGIN
    FOREACH pbs IN ARRAY pack_box_styles LOOP
      INSERT INTO product.pack_box_style(
        id,
		    shipper_id,
        box_style,
        box_description,
        combine_with,
        combine_description
      )
        VALUES (
          COALESCE(pbs.id, (select nextval('product.pack_box_style_id_seq'))),
		      pbs.shipper_id,
          pbs.box_style,
          pbs.box_description,
          pbs.combine_with,
          pbs.combine_description
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  box_style=EXCLUDED.box_style,
			  box_description=EXCLUDED.box_description,
			  combine_with=EXCLUDED.combine_with,
			  combine_description=EXCLUDED.combine_description
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_box_type(
  pack_box_types product.pack_box_type[]
)
RETURNS setof product.pack_box_type
AS $$
  DECLARE
    pbt product.pack_box_type;
    vals product.pack_box_type;
  BEGIN
    FOREACH pbt IN ARRAY pack_box_types LOOP
      INSERT INTO product.pack_box_type(
        id,
		    shipper_id,
        box_type,
        box_description
      )
        VALUES (
          COALESCE(pbt.id, (select nextval('product.pack_box_type_id_seq'))),
		      pbt.shipper_id,
          pbt.box_type,
          pbt.box_description
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  box_type=EXCLUDED.box_type,
			  box_description=EXCLUDED.box_description
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_destination(
  pack_destinations product.pack_destination[]
)
RETURNS setof product.pack_destination
AS $$
  DECLARE
    pd product.pack_destination;
    vals product.pack_destination;
  BEGIN
    FOREACH pd IN ARRAY pack_destinations LOOP
      INSERT INTO product.pack_destination(
        id,
		    shipper_id,
        destination_code,
        destination_description
      )
        VALUES (
          COALESCE(pd.id, (select nextval('product.pack_destination_id_seq'))),
		      pd.shipper_id,
          pd.destination_code,
          pd.destination_description
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  destination_code=EXCLUDED.destination_code,
			  destination_description=EXCLUDED.destination_description
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_grade(
  pack_grades product.pack_grade[]
)
RETURNS setof product.pack_grade
AS $$
  DECLARE
    pg product.pack_grade;
    vals product.pack_grade;
  BEGIN
    FOREACH pg IN ARRAY pack_grades LOOP
      INSERT INTO product.pack_grade(
        id,
		    shipper_id,
        grade_code,
        grade_description
      )
        VALUES (
          COALESCE(pg.id, (select nextval('product.pack_grade_id_seq'))),
		      pg.shipper_id,
          pg.grade_code,
          pg.grade_description
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  grade_code=EXCLUDED.grade_code,
			  grade_description=EXCLUDED.grade_description
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_hold(
  pack_holds product.pack_hold[]
)
RETURNS setof product.pack_hold
AS $$
  DECLARE
    ph product.pack_hold;
    vals product.pack_hold;
  BEGIN
    FOREACH ph IN ARRAY pack_holds LOOP
      INSERT INTO product.pack_hold(
        id,
		    shipper_id,
        hold_code,
        hold_description
      )
        VALUES (
          COALESCE(ph.id, (select nextval('product.pack_hold_id_seq'))),
		      ph.shipper_id,
          ph.hold_code,
          ph.hold_description
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  hold_code=EXCLUDED.hold_code,
			  hold_description=EXCLUDED.hold_description
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_label(
  pack_labels product.pack_label[]
)
RETURNS setof product.pack_label
AS $$
  DECLARE
    pl product.pack_label;
    vals product.pack_label;
  BEGIN
    FOREACH pl IN ARRAY pack_labels LOOP
      INSERT INTO product.pack_label(
        id,
        label_code,
        label_name,
		    shipper_id,
        shipper_name
      )
        VALUES (
          COALESCE(pl.id, (select nextval('product.pack_label_id_seq'))),
          pl.label_code,
          pl.label_name,
		      pl.shipper_id,
          pl.shipper_name
        )
      ON CONFLICT (id) DO UPDATE SET
			  label_code=EXCLUDED.label_code,
			  label_name=EXCLUDED.label_name,
			  shipper_id=EXCLUDED.shipper_id,
			  shipper_name=EXCLUDED.shipper_name
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_liner(
  pack_liners product.pack_liner[]
)
RETURNS setof product.pack_liner
AS $$
  DECLARE
    pl product.pack_liner;
    vals product.pack_liner;
  BEGIN
    FOREACH pl IN ARRAY pack_liners LOOP
      INSERT INTO product.pack_liner(
        id,
		    shipper_id,
        liner_code,
        liner_description
      )
        VALUES (
          COALESCE(pl.id, (select nextval('product.pack_liner_id_seq'))),
		      pl.shipper_id,
          pl.liner_code,
          pl.liner_description
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  liner_code=EXCLUDED.liner_code,
			  liner_description=EXCLUDED.liner_description
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_out(
  pack_outs product.pack_out[]
)
RETURNS setof product.pack_out
AS $$
  DECLARE
    po product.pack_out;
    vals product.pack_out;
  BEGIN
    FOREACH po IN ARRAY pack_outs LOOP
      INSERT INTO product.pack_out(
        id,
        shipper_id,
        out_code,
        out_description,
        combine_with
      )
        VALUES (
          COALESCE(po.id, (select nextval('product.pack_out_id_seq'))),
          po.shipper_id,
          po.out_code,
          po.out_description,
          po.combine_with
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  out_code=EXCLUDED.out_code,
			  out_description=EXCLUDED.out_description,
			  combine_with=EXCLUDED.combine_with
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_pallet_type(
  pack_pallet_types product.pack_pallet_type[]
)
RETURNS setof product.pack_pallet_type
AS $$
  DECLARE
    ppt product.pack_pallet_type;
    vals product.pack_pallet_type;
  BEGIN
    FOREACH ppt IN ARRAY pack_pallet_types LOOP
      INSERT INTO product.pack_pallet_type(
        id,
        shipper_id,
        pallet_type,
        pallet_type_description,
        combine_with
      )
        VALUES (
          COALESCE(ppt.id, (select nextval('product.pack_pallet_type_id_seq'))),
          ppt.shipper_id,
          ppt.pallet_type,
          ppt.pallet_type_description,
          ppt.combine_with
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  pallet_type=EXCLUDED.pallet_type,
			  pallet_type_description=EXCLUDED.pallet_type_description,
			  combine_with=EXCLUDED.combine_with
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_production(
  pack_productions product.pack_production[]
)
RETURNS setof product.pack_production
AS $$
  DECLARE
    pp product.pack_production;
    vals product.pack_production;
  BEGIN
    FOREACH pp IN ARRAY pack_productions LOOP
      INSERT INTO product.pack_production(
        id,
        shipper_id,
        production_code,
        production_description,
        combine_with
      )
        VALUES (
          COALESCE(pp.id, (select nextval('product.pack_production_id_seq'))),
          pp.shipper_id,
          pp.production_code,
          pp.production_description,
          pp.combine_with
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  production_code=EXCLUDED.production_code,
			  production_description=EXCLUDED.production_description,
			  combine_with=EXCLUDED.combine_with
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_special(
  pack_specials product.pack_special[]
)
RETURNS setof product.pack_special
AS $$
  DECLARE
    ps product.pack_special;
    vals product.pack_special;
  BEGIN
    FOREACH ps IN ARRAY pack_specials LOOP
      INSERT INTO product.pack_special(
        id,
        shipper_id,
        customer_code,
        customer_id,
        customer_name
      )
        VALUES (
          COALESCE(ps.id, (select nextval('product.pack_special_id_seq'))),
          ps.shipper_id,
          ps.customer_code,
          ps.customer_id,
          ps.customer_name
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  customer_code=EXCLUDED.customer_code,
			  customer_id=EXCLUDED.customer_id,
			  customer_name=EXCLUDED.customer_name
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_style(
  pack_styles product.pack_style[]
)
RETURNS setof product.pack_style
AS $$
  DECLARE
    ps product.pack_style;
    vals product.pack_style;
  BEGIN
    FOREACH ps IN ARRAY pack_styles LOOP
      INSERT INTO product.pack_style(
        id,
        shipper_id,
        pack_style,
        style_description,
        combine_with
      )
        VALUES (
          COALESCE(ps.id, (select nextval('product.pack_style_id_seq'))),
          ps.shipper_id,
          ps.pack_style,
          ps.style_description,
          ps.combine_with
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  pack_style=EXCLUDED.pack_style,
			  style_description=EXCLUDED.style_description,
			  combine_with=EXCLUDED.combine_with
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_tree_ripe(
  pack_tree_ripes product.pack_tree_ripe[]
)
RETURNS setof product.pack_tree_ripe
AS $$
  DECLARE
    ptr product.pack_tree_ripe;
    vals product.pack_tree_ripe;
  BEGIN
    FOREACH ptr IN ARRAY pack_tree_ripes LOOP
      INSERT INTO product.pack_tree_ripe(
        id,
        shipper_id,
        tree_ripe,
        tree_ripe_description
      )
        VALUES (
          COALESCE(ptr.id, (select nextval('product.pack_tree_ripe_id_seq'))),
          ptr.shipper_id,
          ptr.tree_ripe,
          ptr.tree_ripe_description
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  tree_ripe=EXCLUDED.tree_ripe,
			  tree_ripe_description=EXCLUDED.tree_ripe_description
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;

CREATE FUNCTION product.bulk_upsert_pack_master(
  pack_masters product.pack_master[]
)
RETURNS setof product.pack_master
AS $$
  DECLARE
    pm product.pack_master;
    vals product.pack_master;
  BEGIN
    FOREACH pm IN ARRAY pack_masters LOOP
      INSERT INTO product.pack_master(
        id,
        shipper_id,
        label_code_id,
        customer_code_id,
        box_type_id,
        box_style_id,
        pack_style_id,
        out_code_id,
        out_quantity,
        out_weight,
        production_code_id,
        tree_ripe_id,
        grade_code_id,
        ma_code_id,
        liner_code_id,
        net_weight_contents,
        net_weight_box,
        box_length,
        box_width,
        box_height,
        pallet_type_id,
        default_pallet_quantity,
        plu_upc_code,
        destination_code_id,
        old_pack_code,
        old_label_code,
        jv_pack_code,
        pack_description,
        variety_id,
        species_id,
        hold_code_id
      )
        VALUES (
          COALESCE(pm.id, (select nextval('product.pack_master_id_seq'))),
          pm.shipper_id,
          pm.label_code_id,
          pm.customer_code_id,
          pm.box_type_id,
          pm.box_style_id,
          pm.pack_style_id,
          pm.out_code_id,
          pm.out_quantity,
          pm.out_weight,
          pm.production_code_id,
          pm.tree_ripe_id,
          pm.grade_code_id,
          pm.ma_code_id,
          pm.liner_code_id,
          pm.net_weight_contents,
          pm.net_weight_box,
          pm.box_length,
          pm.box_width,
          pm.box_height,
          pm.pallet_type_id,
          pm.default_pallet_quantity,
          pm.plu_upc_code,
          pm.destination_code_id,
          pm.old_pack_code,
          pm.old_label_code,
          pm.jv_pack_code,
          pm.pack_description,
          pm.variety_id,
          pm.species_id,
          pm.hold_code_id
        )
      ON CONFLICT (id) DO UPDATE SET
			  shipper_id=EXCLUDED.shipper_id,
			  label_code_id=EXCLUDED.label_code_id,
			  customer_code_id=EXCLUDED.customer_code_id,
			  box_type_id=EXCLUDED.box_type_id,
			  box_style_id=EXCLUDED.box_style_id,
			  pack_style_id=EXCLUDED.pack_style_id,
			  out_code_id=EXCLUDED.out_code_id,
			  out_quantity=EXCLUDED.out_quantity,
			  out_weight=EXCLUDED.out_weight,
			  production_code_id=EXCLUDED.production_code_id,
			  tree_ripe_id=EXCLUDED.tree_ripe_id,
			  grade_code_id=EXCLUDED.grade_code_id,
			  ma_code_id=EXCLUDED.ma_code_id,
			  liner_code_id=EXCLUDED.liner_code_id,
			  net_weight_contents=EXCLUDED.net_weight_contents,
			  net_weight_box=EXCLUDED.net_weight_box,
			  box_length=EXCLUDED.box_length,
			  box_width=EXCLUDED.box_width,
			  box_height=EXCLUDED.box_height,
			  pallet_type_id=EXCLUDED.pallet_type_id,
			  default_pallet_quantity=EXCLUDED.default_pallet_quantity,
			  plu_upc_code=EXCLUDED.plu_upc_code,
			  destination_code_id=EXCLUDED.destination_code_id,
			  old_pack_code=EXCLUDED.old_pack_code,
			  old_label_code=EXCLUDED.old_label_code,
			  jv_pack_code=EXCLUDED.jv_pack_code,
			  pack_description=EXCLUDED.pack_description,
			  variety_id=EXCLUDED.variety_id,
			  species_id=EXCLUDED.species_id,
			  hold_code_id=EXCLUDED.hold_code_id
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$ LANGUAGE plpgsql VOLATILE STRICT SET search_path FROM CURRENT;
