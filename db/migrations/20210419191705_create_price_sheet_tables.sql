-- migrate:up
CREATE TABLE sales.price_category (
    id BIGSERIAL PRIMARY KEY,
    category_name TEXT NOT NULL,
    sort_order INT NOT NULL
);

CREATE TABLE sales.price_product (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES sales.price_category(id) ON DELETE CASCADE,
    color TEXT NOT NULL,
    product_name TEXT NOT NULL,
    sort_order INT NOT NULL
);

CREATE TABLE sales.price_size (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES sales.price_product(id) ON DELETE CASCADE,
    size_name TEXT NOT NULL
);

CREATE TABLE sales.price_entry (
    id BIGSERIAL PRIMARY KEY,
    size_id BIGINT NOT NULL REFERENCES sales.price_size(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    entry_description TEXT NOT NULL,
    content TEXT NOT NULL
);

-- migrate:down
DROP TABLE sales.price_category;
DROP TABLE sales.price_product;
DROP TABLE sales.price_size;
DROP TABLE sales.price_entry;
