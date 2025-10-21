CREATE TABLE IF NOT EXISTS bulk_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid,
  product_type TEXT,
  quantity NUMERIC,
  unit TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE bulk_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS buyer_insert_bulk_order ON bulk_orders;
CREATE POLICY buyer_insert_bulk_order ON bulk_orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
DROP POLICY IF EXISTS buyer_update_bulk_order ON bulk_orders;
CREATE POLICY buyer_update_bulk_order ON bulk_orders FOR UPDATE USING (auth.uid() = buyer_id);
DROP POLICY IF EXISTS buyer_delete_bulk_order ON bulk_orders;
CREATE POLICY buyer_delete_bulk_order ON bulk_orders FOR DELETE USING (auth.uid() = buyer_id);
DROP POLICY IF EXISTS all_select_bulk_order ON bulk_orders;
CREATE POLICY all_select_bulk_order ON bulk_orders FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS processing_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bulk_order_id uuid REFERENCES bulk_orders(id),
  farmer_id uuid,
  offer_price NUMERIC,
  status TEXT DEFAULT 'pending',
  negotiation_log JSONB,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE processing_matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS farmer_insert_match ON processing_matches;
CREATE POLICY farmer_insert_match ON processing_matches FOR INSERT WITH CHECK (auth.uid() = farmer_id);
DROP POLICY IF EXISTS farmer_update_match ON processing_matches;
CREATE POLICY farmer_update_match ON processing_matches FOR UPDATE USING (auth.uid() = farmer_id);
DROP POLICY IF EXISTS all_select_match ON processing_matches;
CREATE POLICY all_select_match ON processing_matches FOR SELECT USING (true);

DROP POLICY IF EXISTS farmer_delete_match ON processing_matches;
CREATE POLICY farmer_delete_match ON processing_matches FOR DELETE USING (auth.uid() = farmer_id);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_bulk_orders_buyer_id ON bulk_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_processing_matches_bulk_order_id ON processing_matches(bulk_order_id);
