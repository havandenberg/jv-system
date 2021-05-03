-- migrate:up
CREATE TABLE sales.agenda_item (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    item_date DATE NOT NULL,
    sort_order INT NOT NULL
);

-- migrate:down
DROP TABLE sales.agenda_item;
