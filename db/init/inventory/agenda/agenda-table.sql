CREATE TABLE agenda_item (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    item_date DATE NOT NULL,
    sort_order INT NOT NULL
);
