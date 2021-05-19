-- migrate:up
ALTER TABLE sales.price_entry 
ADD COLUMN highlight BOOLEAN;

UPDATE sales.price_entry
SET highlight = false;

ALTER TABLE sales.price_entry
ALTER COLUMN highlight SET NOT NULL;

-- migrate:down
ALTER TABLE sales.price_entry 
DROP COLUMN highlight;
