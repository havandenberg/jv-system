SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: directory; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA directory;


--
-- Name: inspection; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA inspection;


--
-- Name: postgraphile_watch; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA postgraphile_watch;


--
-- Name: sales; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA sales;


--
-- Name: company_primary_contact; Type: TYPE; Schema: directory; Owner: -
--

CREATE TYPE directory.company_primary_contact AS (
	contact_name text,
	email text
);


--
-- Name: chile_departure_inspection; Type: TYPE; Schema: inspection; Owner: -
--

CREATE TYPE inspection.chile_departure_inspection AS (
	lot_number text,
	inspection_date date,
	packing_date text,
	shipper text,
	variety text,
	quality_score numeric,
	condition_score numeric,
	avg_net_weight numeric,
	avg_bunches_count numeric,
	brix_avg numeric,
	brix_min numeric,
	brix_max numeric,
	search_text text
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: company; Type: TABLE; Schema: directory; Owner: -
--

CREATE TABLE directory.company (
    id text NOT NULL,
    company_name text NOT NULL,
    company_type text NOT NULL,
    logo_src text NOT NULL,
    notes text NOT NULL,
    website text NOT NULL
);


--
-- Name: company_primary_contact(directory.company); Type: FUNCTION; Schema: directory; Owner: -
--

CREATE FUNCTION directory.company_primary_contact(c directory.company) RETURNS directory.company_primary_contact
    LANGUAGE sql STABLE
    AS $$
SELECT CONCAT (
		first_name,
		' ',
		last_name
	) as contact_name, email FROM directory.person_contact WHERE company_id = c.id AND is_primary = true
$$;


--
-- Name: company_search_text(directory.company); Type: FUNCTION; Schema: directory; Owner: -
--

CREATE FUNCTION directory.company_search_text(c directory.company) RETURNS text
    LANGUAGE sql STABLE
    AS $$
SELECT CONCAT (
		c.company_name,
		c.company_type,
		c.notes,
		c.website
	) FROM directory.company
$$;


--
-- Name: office; Type: TABLE; Schema: directory; Owner: -
--

CREATE TABLE directory.office (
    id text NOT NULL,
    company_id text,
    office_name text NOT NULL,
    office_description text NOT NULL,
    email text NOT NULL,
    secondary_email text NOT NULL,
    phone text NOT NULL,
    secondary_phone text NOT NULL,
    address_1 text NOT NULL,
    address_2 text NOT NULL,
    city text NOT NULL,
    postal_state text NOT NULL,
    zip_code text NOT NULL
);


--
-- Name: office_search_text(directory.office); Type: FUNCTION; Schema: directory; Owner: -
--

CREATE FUNCTION directory.office_search_text(o directory.office) RETURNS text
    LANGUAGE sql STABLE
    AS $$
SELECT CONCAT (
		o.office_name,
		o.office_description,
		o.email,
		o.secondary_email,
		o.phone,
		o.secondary_phone,
		o.address_1,
		o.address_2,
		o.city,
		o.postal_state,
		o.zip_code,
		c.company_name
	) FROM directory.office oo FULL JOIN directory.company c ON (o.company_id = c.id) WHERE o.id = oo.id
$$;


--
-- Name: person_contact; Type: TABLE; Schema: directory; Owner: -
--

CREATE TABLE directory.person_contact (
    id bigint NOT NULL,
    company_id text,
    first_name text NOT NULL,
    last_name text NOT NULL,
    is_primary boolean NOT NULL,
    email text NOT NULL,
    secondary_email text NOT NULL,
    home_phone text NOT NULL,
    cell_phone text NOT NULL,
    work_phone text NOT NULL,
    work_extension text NOT NULL,
    image_src text NOT NULL,
    preferred_method text NOT NULL,
    roles text NOT NULL
);


--
-- Name: person_contact_search_text(directory.person_contact); Type: FUNCTION; Schema: directory; Owner: -
--

CREATE FUNCTION directory.person_contact_search_text(person directory.person_contact) RETURNS text
    LANGUAGE sql STABLE
    AS $$
SELECT CONCAT (
		person.first_name,
		person.last_name,
		person.email,
		person.secondary_email,
		person.home_phone,
		person.cell_phone,
		person.work_phone,
		person.work_extension,
		person.preferred_method,
		person.roles
	) FROM directory.person_contact
$$;


--
-- Name: chile_departure_inspection_pallet; Type: TABLE; Schema: inspection; Owner: -
--

CREATE TABLE inspection.chile_departure_inspection_pallet (
    id text NOT NULL,
    lot_id text NOT NULL,
    lot_number text NOT NULL,
    location_name text NOT NULL,
    shipper text NOT NULL,
    inspection_date date NOT NULL,
    product_name text NOT NULL,
    packing_type text NOT NULL,
    product_type text NOT NULL,
    pallet_count numeric NOT NULL,
    supervisor text NOT NULL,
    pallet_number text NOT NULL,
    boxes_count numeric NOT NULL,
    net_weight numeric NOT NULL,
    grower text NOT NULL,
    size text NOT NULL,
    variety text NOT NULL,
    packing_date date NOT NULL,
    label text NOT NULL,
    temperature text NOT NULL,
    open_appearance text NOT NULL,
    color text NOT NULL,
    stem text NOT NULL,
    texture text NOT NULL,
    bunches_count numeric NOT NULL,
    brix numeric NOT NULL,
    diameter_min numeric NOT NULL,
    diameter_max numeric NOT NULL,
    straggly_tight_pct numeric NOT NULL,
    surface_disc_pct numeric NOT NULL,
    russet_scars_pct numeric NOT NULL,
    sunburn_pct numeric NOT NULL,
    undersized_bunches_pct numeric NOT NULL,
    other_defects_pct numeric NOT NULL,
    stem_dehy_pct numeric NOT NULL,
    glassy_weak_pct numeric NOT NULL,
    decay_pct numeric NOT NULL,
    split_crushed_pct numeric NOT NULL,
    dry_split_pct numeric NOT NULL,
    wet_sticky_pct numeric NOT NULL,
    waterberries_pct numeric NOT NULL,
    shatter_pct numeric NOT NULL,
    total_quality_defects_pct numeric NOT NULL,
    total_condition_defects_pct numeric NOT NULL,
    quality_score numeric NOT NULL,
    condition_score numeric NOT NULL,
    score_name text NOT NULL,
    report_link text NOT NULL,
    images_link text NOT NULL
);


--
-- Name: batch_create_chile_departure_inspection_pallet(inspection.chile_departure_inspection_pallet[]); Type: FUNCTION; Schema: inspection; Owner: -
--

CREATE FUNCTION inspection.batch_create_chile_departure_inspection_pallet(new_pallets inspection.chile_departure_inspection_pallet[]) RETURNS SETOF inspection.chile_departure_inspection_pallet
    LANGUAGE plpgsql STRICT
    SET search_path TO '$user', 'public'
    AS $$
  DECLARE
    p chile_departure_inspection_pallet;
	vals chile_departure_inspection_pallet;
  BEGIN
    FOREACH p IN ARRAY new_pallets LOOP
      INSERT INTO chile_departure_inspection_pallet(id, lot_id, lot_number, location_name, shipper, inspection_date, product_name, packing_type, product_type, pallet_count, supervisor, pallet_number, boxes_count, net_weight, grower, size, variety, packing_date, label, temperature, open_appearance, color, stem, texture, bunches_count, brix, diameter_min, diameter_max, straggly_tight_pct, surface_disc_pct, russet_scars_pct, sunburn_pct, undersized_bunches_pct, other_defects_pct, stem_dehy_pct, glassy_weak_pct, decay_pct, split_crushed_pct, dry_split_pct, wet_sticky_pct, waterberries_pct, shatter_pct, total_quality_defects_pct, total_condition_defects_pct, quality_score, condition_score, score_name, report_link, images_link)
        VALUES (p.id, p.lot_id, p.lot_number, p.location_name, p.shipper, p.inspection_date, p.product_name, p.packing_type, p.product_type, p.pallet_count, p.supervisor, p.pallet_number, p.boxes_count, p.net_weight, p.grower, p.size, p.variety, p.packing_date, p.label, p.temperature, p.open_appearance, p.color, p.stem, p.texture, p.bunches_count, p.brix, p.diameter_min, p.diameter_max, p.straggly_tight_pct, p.surface_disc_pct, p.russet_scars_pct, p.sunburn_pct, p.undersized_bunches_pct, p.other_defects_pct, p.stem_dehy_pct, p.glassy_weak_pct, p.decay_pct, p.split_crushed_pct, p.dry_split_pct, p.wet_sticky_pct, p.waterberries_pct, p.shatter_pct, p.total_quality_defects_pct, p.total_condition_defects_pct, p.quality_score, p.condition_score, p.score_name, p.report_link, p.images_link)
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$;


--
-- Name: chile_departure_inspections(text, text); Type: FUNCTION; Schema: inspection; Owner: -
--

CREATE FUNCTION inspection.chile_departure_inspections(order_by text, sort_order text) RETURNS SETOF inspection.chile_departure_inspection
    LANGUAGE plpgsql STABLE
    AS $$
	BEGIN
		RETURN QUERY EXECUTE format('
			SELECT
				lot_number,
				inspection_date,
				STRING_AGG(CAST(packing_date AS text), '',''),
				shipper,
				variety,
				ROUND(AVG(quality_score)) AS quality_score,
				ROUND(AVG(condition_score)) AS condition_score,
				ROUND(AVG(net_weight / 1000), 2) AS avg_net_weight,
				ROUND(AVG(bunches_count)) AS avg_bunches_count,
				ROUND(AVG(brix), 1) AS brix_avg,
				ROUND(MIN(brix), 1) AS brix_min,
				ROUND(MAX(brix), 1) AS brix_max,
				STRING_AGG( CONCAT (
					id,
					lot_id,
					lot_number,
					location_name,
					shipper,
					CAST(inspection_date AS text),
					product_name,
					packing_type,
					product_type,
					CAST(pallet_count AS text),
					supervisor,
					pallet_number,
					grower,
					size,
					variety,
					CAST(packing_date AS text),
					label,
					temperature,
					open_appearance,
					color,
					stem,
					texture,
					CAST(quality_score AS text),
					CAST(condition_score AS text),
					score_name
				), '''') AS search_text
		FROM chile_departure_inspection_pallet
		GROUP BY lot_number, inspection_date, shipper, variety
		ORDER BY %I %s', order_by, sort_order);
	END;
$$;


--
-- Name: peru_departure_inspection; Type: TABLE; Schema: inspection; Owner: -
--

CREATE TABLE inspection.peru_departure_inspection (
    avg_bunches_per_box numeric NOT NULL,
    avg_net_weight numeric NOT NULL,
    bags_per_box numeric NOT NULL,
    bag_type text,
    brand text NOT NULL,
    brix_avg numeric NOT NULL,
    brix_max numeric NOT NULL,
    brix_min numeric NOT NULL,
    category text NOT NULL,
    comments text NOT NULL,
    condition_score numeric NOT NULL,
    container_id text NOT NULL,
    departure_week text NOT NULL,
    destination text NOT NULL,
    exporter text NOT NULL,
    inspection_date date NOT NULL,
    packing_date date NOT NULL,
    packing_house text NOT NULL,
    packing_material text NOT NULL,
    presentation text NOT NULL,
    quality_score numeric NOT NULL,
    variety text NOT NULL
);


--
-- Name: peru_departure_inspection_search_text(inspection.peru_departure_inspection); Type: FUNCTION; Schema: inspection; Owner: -
--

CREATE FUNCTION inspection.peru_departure_inspection_search_text(inspection inspection.peru_departure_inspection) RETURNS text
    LANGUAGE sql STABLE
    AS $$
SELECT CONCAT (
		CAST(inspection.avg_bunches_per_box AS text),
		CAST(inspection.avg_net_weight AS text),
		inspection.bag_type,
		CAST(inspection.bags_per_box AS text),
		inspection.brand,
		CAST(inspection.brix_avg AS text),
		CAST(inspection.brix_max AS text),
		CAST(inspection.brix_min AS text),
		inspection.exporter,
		inspection.destination,
		CAST(inspection.departure_week AS text),
		inspection.container_id,
		CAST(inspection.condition_score AS text),
		inspection.comments,
		inspection.category,
		CAST(inspection.inspection_date AS text),
		CAST(inspection.packing_date AS text),
		inspection.packing_house,
		inspection.packing_material,
		inspection.presentation,
		CAST(inspection.quality_score AS text),
		inspection.variety
	) FROM inspection.peru_departure_inspection
$$;


--
-- Name: notify_watchers_ddl(); Type: FUNCTION; Schema: postgraphile_watch; Owner: -
--

CREATE FUNCTION postgraphile_watch.notify_watchers_ddl() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'ddl',
      'payload',
      (select json_agg(json_build_object('schema', schema_name, 'command', command_tag)) from pg_event_trigger_ddl_commands() as x)
    )::text
  );
end;
$$;


--
-- Name: notify_watchers_drop(); Type: FUNCTION; Schema: postgraphile_watch; Owner: -
--

CREATE FUNCTION postgraphile_watch.notify_watchers_drop() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'drop',
      'payload',
      (select json_agg(distinct x.schema_name) from pg_event_trigger_dropped_objects() as x)
    )::text
  );
end;
$$;


--
-- Name: distinct_values(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.distinct_values(table_name text, column_name text) RETURNS SETOF text
    LANGUAGE plpgsql STABLE
    AS $$
	BEGIN
		RETURN QUERY EXECUTE format('select distinct %I from %I', column_name, table_name);
	END;
$$;


--
-- Name: agenda_item; Type: TABLE; Schema: sales; Owner: -
--

CREATE TABLE sales.agenda_item (
    id bigint NOT NULL,
    content text NOT NULL,
    item_date date NOT NULL,
    sort_order integer NOT NULL
);


--
-- Name: bulk_upsert_agenda_item(sales.agenda_item[]); Type: FUNCTION; Schema: sales; Owner: -
--

CREATE FUNCTION sales.bulk_upsert_agenda_item(items sales.agenda_item[]) RETURNS SETOF sales.agenda_item
    LANGUAGE plpgsql STRICT
    SET search_path TO '$user', 'public'
    AS $$
  DECLARE
    i agenda_item;
    vals agenda_item;
  BEGIN
    FOREACH i IN ARRAY items LOOP
      INSERT INTO agenda_item(
        id,
        content,
        item_date,
        sort_order
      )
        VALUES (
          COALESCE(i.id, (select nextval('agenda_item_id_seq'))),
          i.content,
          i.item_date,
          i.sort_order
        )
      ON CONFLICT (id) DO UPDATE SET
        content=EXCLUDED.content,
        item_date=EXCLUDED.item_date,
        sort_order=EXCLUDED.sort_order
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$;


--
-- Name: price_category; Type: TABLE; Schema: sales; Owner: -
--

CREATE TABLE sales.price_category (
    id bigint NOT NULL,
    category_name text NOT NULL,
    sort_order integer NOT NULL
);


--
-- Name: bulk_upsert_price_category(sales.price_category[]); Type: FUNCTION; Schema: sales; Owner: -
--

CREATE FUNCTION sales.bulk_upsert_price_category(categories sales.price_category[]) RETURNS SETOF sales.price_category
    LANGUAGE plpgsql STRICT
    SET search_path TO '$user', 'public'
    AS $$
  DECLARE
    c price_category;
    vals price_category;
  BEGIN
    FOREACH c IN ARRAY categories LOOP
      INSERT INTO price_category(
        id,
        category_name,
        sort_order
      )
        VALUES (
          COALESCE(c.id, (select nextval('price_category_id_seq'))),
          c.category_name,
          c.sort_order
        )
      ON CONFLICT (id) DO UPDATE SET
        category_name=EXCLUDED.category_name,
        sort_order=EXCLUDED.sort_order
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$;


--
-- Name: price_entry; Type: TABLE; Schema: sales; Owner: -
--

CREATE TABLE sales.price_entry (
    id bigint NOT NULL,
    size_id bigint NOT NULL,
    entry_date date NOT NULL,
    entry_description text NOT NULL,
    content text NOT NULL,
    highlight boolean NOT NULL
);


--
-- Name: bulk_upsert_price_entry(sales.price_entry[]); Type: FUNCTION; Schema: sales; Owner: -
--

CREATE FUNCTION sales.bulk_upsert_price_entry(entries sales.price_entry[]) RETURNS SETOF sales.price_entry
    LANGUAGE plpgsql STRICT
    SET search_path TO '$user', 'public'
    AS $$
  DECLARE
    e price_entry;
    vals price_entry;
  BEGIN
    FOREACH e IN ARRAY entries LOOP
      INSERT INTO price_entry(
        id,
        size_id,
        entry_date,
        entry_description,
        content,
        highlight
      )
        VALUES (
          COALESCE(e.id, (select nextval('price_entry_id_seq'))),
          e.size_id,
          e.entry_date,
          e.entry_description,
          e.content,
          e.highlight
        )
      ON CONFLICT (id) DO UPDATE SET
        size_id=EXCLUDED.size_id,
        entry_date=EXCLUDED.entry_date,
        entry_description=EXCLUDED.entry_description,
        content=EXCLUDED.content,
        highlight=EXCLUDED.highlight
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$;


--
-- Name: price_product; Type: TABLE; Schema: sales; Owner: -
--

CREATE TABLE sales.price_product (
    id bigint NOT NULL,
    category_id bigint NOT NULL,
    color text NOT NULL,
    product_name text NOT NULL,
    sort_order integer NOT NULL
);


--
-- Name: bulk_upsert_price_product(sales.price_product[]); Type: FUNCTION; Schema: sales; Owner: -
--

CREATE FUNCTION sales.bulk_upsert_price_product(products sales.price_product[]) RETURNS SETOF sales.price_product
    LANGUAGE plpgsql STRICT
    SET search_path TO '$user', 'public'
    AS $$
  DECLARE
    p price_product;
    vals price_product;
  BEGIN
    FOREACH p IN ARRAY products LOOP
      INSERT INTO price_product(
        id,
        category_id,
        color,
        product_name,
        sort_order
      )
        VALUES (
          COALESCE(p.id, (select nextval('price_product_id_seq'))),
          p.category_id,
          p.color,
          p.product_name,
          p.sort_order
        )
      ON CONFLICT (id) DO UPDATE SET
        category_id=EXCLUDED.category_id,
        color=EXCLUDED.color,
        product_name=EXCLUDED.product_name,
        sort_order=EXCLUDED.sort_order
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$;


--
-- Name: price_size; Type: TABLE; Schema: sales; Owner: -
--

CREATE TABLE sales.price_size (
    id bigint NOT NULL,
    product_id bigint NOT NULL,
    size_name text NOT NULL
);


--
-- Name: bulk_upsert_price_size(sales.price_size[]); Type: FUNCTION; Schema: sales; Owner: -
--

CREATE FUNCTION sales.bulk_upsert_price_size(sizes sales.price_size[]) RETURNS SETOF sales.price_size
    LANGUAGE plpgsql STRICT
    SET search_path TO '$user', 'public'
    AS $$
  DECLARE
    s price_size;
    vals price_size;
  BEGIN
    FOREACH s IN ARRAY sizes LOOP
      INSERT INTO price_size(
        id,
        product_id,
        size_name
      )
        VALUES (
          COALESCE(s.id, (select nextval('price_size_id_seq'))),
          s.product_id,
          s.size_name
        )
      ON CONFLICT (id) DO UPDATE SET
        product_id=EXCLUDED.product_id,
        size_name=EXCLUDED.size_name
    	RETURNING * INTO vals;
    	RETURN NEXT vals;
	END LOOP;
	RETURN;
  END;
$$;


--
-- Name: price_product_product_root_id(sales.price_product); Type: FUNCTION; Schema: sales; Owner: -
--

CREATE FUNCTION sales.price_product_product_root_id(product sales.price_product) RETURNS bigint
    LANGUAGE sql STABLE
    AS $$
SELECT id FROM sales.price_size WHERE product_id = product.id AND size_name = 'product-root' LIMIT 1;
$$;


--
-- Name: contact_alias; Type: TABLE; Schema: directory; Owner: -
--

CREATE TABLE directory.contact_alias (
    id bigint NOT NULL,
    alias_description text NOT NULL,
    alias_name text NOT NULL,
    alias_type text NOT NULL
);


--
-- Name: contact_alias_id_seq; Type: SEQUENCE; Schema: directory; Owner: -
--

CREATE SEQUENCE directory.contact_alias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_alias_id_seq; Type: SEQUENCE OWNED BY; Schema: directory; Owner: -
--

ALTER SEQUENCE directory.contact_alias_id_seq OWNED BY directory.contact_alias.id;


--
-- Name: contact_alias_person_contact; Type: TABLE; Schema: directory; Owner: -
--

CREATE TABLE directory.contact_alias_person_contact (
    alias_id bigint NOT NULL,
    person_contact_id bigint NOT NULL
);


--
-- Name: person_contact_id_seq; Type: SEQUENCE; Schema: directory; Owner: -
--

CREATE SEQUENCE directory.person_contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: person_contact_id_seq; Type: SEQUENCE OWNED BY; Schema: directory; Owner: -
--

ALTER SEQUENCE directory.person_contact_id_seq OWNED BY directory.person_contact.id;


--
-- Name: peru_departure_inspection_pallet; Type: TABLE; Schema: inspection; Owner: -
--

CREATE TABLE inspection.peru_departure_inspection_pallet (
    id bigint NOT NULL,
    pallet_id text NOT NULL,
    container_id text NOT NULL,
    size text NOT NULL,
    net_weight numeric NOT NULL,
    opening_score numeric NOT NULL,
    color_score numeric NOT NULL,
    stem_score numeric NOT NULL,
    texture_score numeric NOT NULL,
    bunches_per_box numeric NOT NULL,
    brix numeric NOT NULL,
    quality_score numeric NOT NULL,
    condition_score numeric NOT NULL,
    straggly_tight_pct numeric NOT NULL,
    surface_disc_pct numeric NOT NULL,
    russet_scars_pct numeric NOT NULL,
    sunburn_pct numeric NOT NULL,
    undersized_bunches_pct numeric NOT NULL,
    other_defects_pct numeric NOT NULL,
    total_quality_defects_pct numeric NOT NULL,
    stem_dehy_pct numeric NOT NULL,
    glassy_weak_pct numeric NOT NULL,
    decay_pct numeric NOT NULL,
    split_crushed_pct numeric NOT NULL,
    dry_split_pct numeric NOT NULL,
    wet_sticky_pct numeric NOT NULL,
    waterberries_pct numeric NOT NULL,
    shatter_pct numeric NOT NULL,
    total_condition_defects_pct numeric NOT NULL,
    total_defects_pct numeric NOT NULL
);


--
-- Name: peru_departure_inspection_pallet_id_seq; Type: SEQUENCE; Schema: inspection; Owner: -
--

CREATE SEQUENCE inspection.peru_departure_inspection_pallet_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: peru_departure_inspection_pallet_id_seq; Type: SEQUENCE OWNED BY; Schema: inspection; Owner: -
--

ALTER SEQUENCE inspection.peru_departure_inspection_pallet_id_seq OWNED BY inspection.peru_departure_inspection_pallet.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: agenda_item_id_seq; Type: SEQUENCE; Schema: sales; Owner: -
--

CREATE SEQUENCE sales.agenda_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: agenda_item_id_seq; Type: SEQUENCE OWNED BY; Schema: sales; Owner: -
--

ALTER SEQUENCE sales.agenda_item_id_seq OWNED BY sales.agenda_item.id;


--
-- Name: price_category_id_seq; Type: SEQUENCE; Schema: sales; Owner: -
--

CREATE SEQUENCE sales.price_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: price_category_id_seq; Type: SEQUENCE OWNED BY; Schema: sales; Owner: -
--

ALTER SEQUENCE sales.price_category_id_seq OWNED BY sales.price_category.id;


--
-- Name: price_entry_id_seq; Type: SEQUENCE; Schema: sales; Owner: -
--

CREATE SEQUENCE sales.price_entry_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: price_entry_id_seq; Type: SEQUENCE OWNED BY; Schema: sales; Owner: -
--

ALTER SEQUENCE sales.price_entry_id_seq OWNED BY sales.price_entry.id;


--
-- Name: price_product_id_seq; Type: SEQUENCE; Schema: sales; Owner: -
--

CREATE SEQUENCE sales.price_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: price_product_id_seq; Type: SEQUENCE OWNED BY; Schema: sales; Owner: -
--

ALTER SEQUENCE sales.price_product_id_seq OWNED BY sales.price_product.id;


--
-- Name: price_size_id_seq; Type: SEQUENCE; Schema: sales; Owner: -
--

CREATE SEQUENCE sales.price_size_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: price_size_id_seq; Type: SEQUENCE OWNED BY; Schema: sales; Owner: -
--

ALTER SEQUENCE sales.price_size_id_seq OWNED BY sales.price_size.id;


--
-- Name: contact_alias id; Type: DEFAULT; Schema: directory; Owner: -
--

ALTER TABLE ONLY directory.contact_alias ALTER COLUMN id SET DEFAULT nextval('directory.contact_alias_id_seq'::regclass);


--
-- Name: person_contact id; Type: DEFAULT; Schema: directory; Owner: -
--

ALTER TABLE ONLY directory.person_contact ALTER COLUMN id SET DEFAULT nextval('directory.person_contact_id_seq'::regclass);


--
-- Name: peru_departure_inspection_pallet id; Type: DEFAULT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.peru_departure_inspection_pallet ALTER COLUMN id SET DEFAULT nextval('inspection.peru_departure_inspection_pallet_id_seq'::regclass);


--
-- Name: agenda_item id; Type: DEFAULT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.agenda_item ALTER COLUMN id SET DEFAULT nextval('sales.agenda_item_id_seq'::regclass);


--
-- Name: price_category id; Type: DEFAULT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.price_category ALTER COLUMN id SET DEFAULT nextval('sales.price_category_id_seq'::regclass);


--
-- Name: price_entry id; Type: DEFAULT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.price_entry ALTER COLUMN id SET DEFAULT nextval('sales.price_entry_id_seq'::regclass);


--
-- Name: price_product id; Type: DEFAULT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.price_product ALTER COLUMN id SET DEFAULT nextval('sales.price_product_id_seq'::regclass);


--
-- Name: price_size id; Type: DEFAULT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.price_size ALTER COLUMN id SET DEFAULT nextval('sales.price_size_id_seq'::regclass);


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: directory; Owner: -
--

ALTER TABLE ONLY directory.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: contact_alias_person_contact contact_alias_person_contact_pkey; Type: CONSTRAINT; Schema: directory; Owner: -
--

ALTER TABLE ONLY directory.contact_alias_person_contact
    ADD CONSTRAINT contact_alias_person_contact_pkey PRIMARY KEY (alias_id, person_contact_id);


--
-- Name: contact_alias contact_alias_pkey; Type: CONSTRAINT; Schema: directory; Owner: -
--

ALTER TABLE ONLY directory.contact_alias
    ADD CONSTRAINT contact_alias_pkey PRIMARY KEY (id);


--
-- Name: office office_pkey; Type: CONSTRAINT; Schema: directory; Owner: -
--

ALTER TABLE ONLY directory.office
    ADD CONSTRAINT office_pkey PRIMARY KEY (id);


--
-- Name: person_contact person_contact_pkey; Type: CONSTRAINT; Schema: directory; Owner: -
--

ALTER TABLE ONLY directory.person_contact
    ADD CONSTRAINT person_contact_pkey PRIMARY KEY (id);


--
-- Name: chile_departure_inspection_pallet chile_departure_inspection_pallet_pkey; Type: CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.chile_departure_inspection_pallet
    ADD CONSTRAINT chile_departure_inspection_pallet_pkey PRIMARY KEY (id);


--
-- Name: peru_departure_inspection_pallet peru_departure_inspection_pallet_pkey; Type: CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.peru_departure_inspection_pallet
    ADD CONSTRAINT peru_departure_inspection_pallet_pkey PRIMARY KEY (id);


--
-- Name: peru_departure_inspection peru_departure_inspection_pkey; Type: CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.peru_departure_inspection
    ADD CONSTRAINT peru_departure_inspection_pkey PRIMARY KEY (container_id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: agenda_item agenda_item_pkey; Type: CONSTRAINT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.agenda_item
    ADD CONSTRAINT agenda_item_pkey PRIMARY KEY (id);


--
-- Name: price_category price_category_pkey; Type: CONSTRAINT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.price_category
    ADD CONSTRAINT price_category_pkey PRIMARY KEY (id);


--
-- Name: price_entry price_entry_pkey; Type: CONSTRAINT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.price_entry
    ADD CONSTRAINT price_entry_pkey PRIMARY KEY (id);


--
-- Name: price_product price_product_pkey; Type: CONSTRAINT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.price_product
    ADD CONSTRAINT price_product_pkey PRIMARY KEY (id);


--
-- Name: price_size price_size_pkey; Type: CONSTRAINT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.price_size
    ADD CONSTRAINT price_size_pkey PRIMARY KEY (id);


--
-- Name: contact_alias_person_contact contact_alias_person_contact_alias_id_fkey; Type: FK CONSTRAINT; Schema: directory; Owner: -
--

ALTER TABLE ONLY directory.contact_alias_person_contact
    ADD CONSTRAINT contact_alias_person_contact_alias_id_fkey FOREIGN KEY (alias_id) REFERENCES directory.contact_alias(id) ON UPDATE CASCADE;


--
-- Name: contact_alias_person_contact contact_alias_person_contact_person_contact_id_fkey; Type: FK CONSTRAINT; Schema: directory; Owner: -
--

ALTER TABLE ONLY directory.contact_alias_person_contact
    ADD CONSTRAINT contact_alias_person_contact_person_contact_id_fkey FOREIGN KEY (person_contact_id) REFERENCES directory.person_contact(id) ON UPDATE CASCADE;


--
-- Name: office office_company_id_fkey; Type: FK CONSTRAINT; Schema: directory; Owner: -
--

ALTER TABLE ONLY directory.office
    ADD CONSTRAINT office_company_id_fkey FOREIGN KEY (company_id) REFERENCES directory.company(id) ON DELETE SET NULL;


--
-- Name: person_contact person_contact_company_id_fkey; Type: FK CONSTRAINT; Schema: directory; Owner: -
--

ALTER TABLE ONLY directory.person_contact
    ADD CONSTRAINT person_contact_company_id_fkey FOREIGN KEY (company_id) REFERENCES directory.company(id) ON DELETE SET NULL;


--
-- Name: peru_departure_inspection_pallet fk_container; Type: FK CONSTRAINT; Schema: inspection; Owner: -
--

ALTER TABLE ONLY inspection.peru_departure_inspection_pallet
    ADD CONSTRAINT fk_container FOREIGN KEY (container_id) REFERENCES inspection.peru_departure_inspection(container_id) ON DELETE CASCADE;


--
-- Name: price_entry price_entry_size_id_fkey; Type: FK CONSTRAINT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.price_entry
    ADD CONSTRAINT price_entry_size_id_fkey FOREIGN KEY (size_id) REFERENCES sales.price_size(id) ON DELETE CASCADE;


--
-- Name: price_product price_product_category_id_fkey; Type: FK CONSTRAINT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.price_product
    ADD CONSTRAINT price_product_category_id_fkey FOREIGN KEY (category_id) REFERENCES sales.price_category(id) ON DELETE CASCADE;


--
-- Name: price_size price_size_product_id_fkey; Type: FK CONSTRAINT; Schema: sales; Owner: -
--

ALTER TABLE ONLY sales.price_size
    ADD CONSTRAINT price_size_product_id_fkey FOREIGN KEY (product_id) REFERENCES sales.price_product(id) ON DELETE CASCADE;


--
-- Name: postgraphile_watch_ddl; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_ddl();


--
-- Name: postgraphile_watch_drop; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_drop();


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20210419174856'),
    ('20210419175031'),
    ('20210419175529'),
    ('20210419175640'),
    ('20210419175752'),
    ('20210419190827'),
    ('20210419191523'),
    ('20210419191705'),
    ('20210419192743'),
    ('20210419193117'),
    ('20210419193216'),
    ('20210419193315'),
    ('20210419202840'),
    ('20210420160101');
