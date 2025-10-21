-- Imperfect/Surplus Produce Listing
CREATE TABLE IF NOT EXISTS imperfect_surplus_produce (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid,
  product_name TEXT,
  condition TEXT CHECK (condition IN ('imperfect', 'surplus', 'overripe', 'spoilt')),
  quantity NUMERIC,
  unit TEXT,
  discounted_price NUMERIC,
  photos TEXT[],
  buyer_type TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE imperfect_surplus_produce ENABLE ROW LEVEL SECURITY;
CREATE POLICY farmer_insert_imperfect ON imperfect_surplus_produce FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY farmer_update_imperfect ON imperfect_surplus_produce FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY farmer_delete_imperfect ON imperfect_surplus_produce FOR DELETE USING (auth.uid() = farmer_id);
CREATE POLICY all_select_imperfect ON imperfect_surplus_produce FOR SELECT USING (true);
