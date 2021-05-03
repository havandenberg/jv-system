-- migrate:up
ALTER TABLE directory.price_entry 
ADD COLUMN highlight BOOLEAN;

UPDATE directory.price_entry
SET highlight = false;

ALTER TABLE directory.price_entry
ALTER COLUMN highlight SET NOT NULL;

-- migrate:down
ALTER TABLE directory.price_entry 
DROP COLUMN highlight;
