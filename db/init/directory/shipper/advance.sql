CREATE TABLE directory.shipper_advance (
  id BIGSERIAL PRIMARY KEY,
  shipper_id TEXT NOT NULL REFERENCES directory.shipper(id),
  species_id TEXT NOT NULL REFERENCES product.product_species(id),
  advance_amount NUMERIC NOT NULL,
);

CREATE INDEX ON directory.shipper_advance (shipper_id);
