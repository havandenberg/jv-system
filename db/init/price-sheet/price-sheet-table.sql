CREATE TABLE price_category (
    id BIGSERIAL PRIMARY KEY,
    category_name TEXT NOT NULL,
    sort_order INT NOT NULL
);

INSERT INTO price_category (
    category_name,
    sort_order
) VALUES (
    'Citrus',
    0
);

INSERT INTO price_category (
    category_name,
    sort_order
) VALUES (
    'Grapes',
    1
);

CREATE TABLE price_product (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES price_category(id) ON DELETE CASCADE,
    color TEXT NOT NULL,
    product_name TEXT NOT NULL,
    sort_order INT NOT NULL
);

INSERT INTO price_product (
    category_id,
    color,
    product_name,
    sort_order
) VALUES (
    1,
    '#FFC000',
    'Moroccan Clementines - Baggged',
    0
);

INSERT INTO price_product (
    category_id,
    color,
    product_name,
    sort_order
) VALUES (
    1,
    '#FBBF90',
    'Israeili Orri - Gift Box',
    1
);

INSERT INTO price_product (
    category_id,
    color,
    product_name,
    sort_order
) VALUES (
    2,
    '#92D04F',
    'Sweet Globes / Timpsons / Ivory / Arra15',
    0
);

CREATE TABLE price_size (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES price_product(id) ON DELETE CASCADE,
    size_name TEXT NOT NULL
);

INSERT INTO price_size (
    product_id,
    size_name
) VALUES (
    1,
    'product-root'
);

INSERT INTO price_size (
    product_id,
    size_name
) VALUES (
    1,
    '4s & lgr'
);

INSERT INTO price_size (
    product_id,
    size_name
) VALUES (
    2,
    'product-root'
);

INSERT INTO price_size (
    product_id,
    size_name
) VALUES (
    2,
    '20s & lgr'
);

INSERT INTO price_size (
    product_id,
    size_name
) VALUES (
    3,
    'product-root'
);

INSERT INTO price_size (
    product_id,
    size_name
) VALUES (
    3,
    'XXL'
);

INSERT INTO price_size (
    product_id,
    size_name
) VALUES (
    3,
    'XL'
);

INSERT INTO price_size (
    product_id,
    size_name
) VALUES (
    3,
    'LG'
);

INSERT INTO price_size (
    product_id,
    size_name
) VALUES (
    3,
    'ML'
);

CREATE TABLE price_entry (
    id BIGSERIAL PRIMARY KEY,
    size_id BIGINT NOT NULL REFERENCES price_size(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    entry_description TEXT NOT NULL,
    content TEXT NOT NULL
);

INSERT INTO price_entry (
    size_id,
    entry_date,
    entry_description,
    content
) VALUES (
  1,
  '3/22/2021',
  '',
  'Nadorcotts'
);

INSERT INTO price_entry (
    size_id,
    entry_date,
    entry_description,
    content
) VALUES (
  1,
  '3/29/2021',
  '',
  'Nadorcotts'
);

INSERT INTO price_entry (
    size_id,
    entry_date,
    entry_description,
    content
) VALUES (
  1,
  '4/5/2021',
  '',
  'Nadorcotts'
);

INSERT INTO price_entry (
    size_id,
    entry_date,
    entry_description,
    content
) VALUES (
  1,
  '4/12/2021',
  '',
  'Nadorcotts'
);

INSERT INTO price_entry (
    size_id,
    entry_date,
    entry_description,
    content
) VALUES (
  1,
  '4/19/2021',
  '',
  'Nadorcotts'
);

INSERT INTO price_entry (
    size_id,
    entry_date,
    entry_description,
    content
) VALUES (
  1,
  '4/26/2021',
  '',
  'Nadorcotts'
);

INSERT INTO price_entry (
    size_id,
    entry_date,
    entry_description,
    content
) VALUES (
  2,
  '3/22/2021',
  '15 x 2lb Bags (+$1.50) and 30 x 1lb bags (+$4.50)',
  '$26 / 24'
);

INSERT INTO price_entry (
    size_id,
    entry_date,
    entry_description,
    content
) VALUES (
  2,
  '3/29/2021',
  'NEw description',
  '$28 / 26'
);

INSERT INTO price_entry (
    size_id,
    entry_date,
    entry_description,
    content
) VALUES (
  2,
  '4/5/2021',
  'Testing',
  '$30 / 28'
);

INSERT INTO price_entry (
    size_id,
    entry_date,
    entry_description,
    content
) VALUES (
  2,
  '4/12/2021',
  '15 x 2lb Bags (+$1.50) and 30 x 1lb bags (+$4.50)',
  '$32 / 30'
);

INSERT INTO price_entry (
    size_id,
    entry_date,
    entry_description,
    content
) VALUES (
  2,
  '4/19/2021',
  'Yupp',
  '$34 / 32'
);

INSERT INTO price_entry (
    size_id,
    entry_date,
    entry_description,
    content
) VALUES (
  2,
  '4/26/2021',
  'Oh for sure',
  '$36 / 34'
);
