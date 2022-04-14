CREATE TABLE product.common_category (
	id BIGSERIAL PRIMARY KEY,
  category_name TEXT,
  category_description TEXT,
  ui_color TEXT
);

CREATE TABLE product.common_species (
	id BIGSERIAL PRIMARY KEY,
  species_name TEXT,
  species_description TEXT,
  ui_color TEXT,
  common_category_id BIGINT
    REFERENCES product.common_category(id),
  product_species_id TEXT
    REFERENCES product.product_species(id)
);

CREATE TABLE product.common_species_product_species (
  id BIGSERIAL PRIMARY KEY,
  common_species_id BIGINT
    REFERENCES product.common_species(id),
  product_species_id TEXT
    REFERENCES product.product_species(id)
);

CREATE TABLE product.common_variety (
	id BIGSERIAL PRIMARY KEY,
  variety_name TEXT,
  variety_description TEXT,
  ui_color TEXT,
  common_species_id BIGINT
    REFERENCES product.common_species(id),
  product_variety_id TEXT
    REFERENCES product.product_variety(id)
);

CREATE TABLE product.common_variety_product_variety (
  id BIGSERIAL PRIMARY KEY,
  common_variety_id BIGINT
    REFERENCES product.common_variety(id),
  product_variety_id TEXT
    REFERENCES product.product_variety(id)
);

CREATE TABLE product.common_size (
	id BIGSERIAL PRIMARY KEY,
  size_name TEXT,
  size_description TEXT,
  common_species_id BIGINT
    REFERENCES product.common_species(id),
  product_size_id BIGINT
    REFERENCES product.product_size(id)
);

CREATE TABLE product.common_size_product_size (
  id BIGSERIAL PRIMARY KEY,
  common_size_id BIGINT
    REFERENCES product.common_size(id),
  product_size_id BIGINT
    REFERENCES product.product_size(id)
);

CREATE TABLE product.common_pack_type (
	id BIGSERIAL PRIMARY KEY,
  pack_type_name TEXT,
  pack_type_description TEXT,
  common_species_id BIGINT
    REFERENCES product.common_species(id),
  pack_master_id BIGINT
    REFERENCES product.pack_master(id)
);

CREATE TABLE product.common_pack_type_pack_master (
  id BIGSERIAL PRIMARY KEY,
  common_pack_type_id BIGINT
    REFERENCES product.common_pack_type(id),
  pack_master_id BIGINT
    REFERENCES product.pack_master(id)
);

CREATE TABLE product.common_species_tag (
	tag_text TEXT,
  common_species_id BIGINT
    REFERENCES product.common_species(id),
  PRIMARY KEY (tag_text, common_species_id)
);

CREATE TABLE product.common_variety_tag (
	tag_text TEXT,
  common_variety_id BIGINT
    REFERENCES product.common_variety(id),
  PRIMARY KEY (tag_text, common_variety_id)
);

CREATE TABLE product.common_size_tag (
	tag_text TEXT,
  common_size_id BIGINT
    REFERENCES product.common_size(id),
  PRIMARY KEY (tag_text, common_size_id)
);

CREATE TABLE product.common_pack_type_tag (
	tag_text TEXT,
  common_pack_type_id BIGINT
    REFERENCES product.common_pack_type(id),
  PRIMARY KEY (tag_text, common_pack_type_id)
);

CREATE FUNCTION product.common_category_search_text(IN s product.common_category)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT CONCAT (
		c.id,
		c.category_name,
		c.category_description
	) FROM product.common_category c
$BODY$;

CREATE FUNCTION product.common_species_search_text(IN s product.common_species)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT CONCAT (
		s.id,
		s.species_name,
		s.species_description,
    c.id,
    c.category_name,
    c.category_description
	) FROM product.common_species sp 
    LEFT JOIN product.common_category c
      ON c.id = sp.common_category_id
  WHERE s.id = sp.id;
$BODY$;
