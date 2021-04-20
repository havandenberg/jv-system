-- migrate:up
ALTER TABLE price_entry 
ADD COLUMN highlight BOOLEAN;

UPDATE price_entry
SET highlight = false;

ALTER TABLE price_entry
ALTER COLUMN highlight SET NOT NULL;

-- migrate:down
ALTER TABLE price_entry 
DROP COLUMN highlight;
