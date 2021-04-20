-- migrate:up
CREATE TABLE price_category (
    id BIGSERIAL PRIMARY KEY,
    category_name TEXT NOT NULL,
    sort_order INT NOT NULL
);

CREATE TABLE price_product (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES price_category(id) ON DELETE CASCADE,
    color TEXT NOT NULL,
    product_name TEXT NOT NULL,
    sort_order INT NOT NULL
);

CREATE TABLE price_size (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES price_product(id) ON DELETE CASCADE,
    size_name TEXT NOT NULL
);

CREATE TABLE price_entry (
    id BIGSERIAL PRIMARY KEY,
    size_id BIGINT NOT NULL REFERENCES price_size(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    entry_description TEXT NOT NULL,
    content TEXT NOT NULL
);

-- migrate:down
DROP TABLE price_category;
DROP TABLE price_product;
DROP TABLE price_size;
DROP TABLE price_entry;
