-- Add image_url columns to all relevant tables
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE animals ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE buy_requests ADD COLUMN IF NOT EXISTS image_url TEXT;
