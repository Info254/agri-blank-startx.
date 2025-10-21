-- Input Pricing Table
CREATE TABLE IF NOT EXISTS input_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid,
  supplier_id uuid,
  price NUMERIC,
  date TIMESTAMP DEFAULT now(),
  verified BOOLEAN DEFAULT false,
  crowdsource_source TEXT
);
ALTER TABLE input_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_insert_input_pricing ON input_pricing FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY user_update_input_pricing ON input_pricing FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY all_select_input_pricing ON input_pricing FOR SELECT USING (true);

-- Input Reviews Table
CREATE TABLE IF NOT EXISTS input_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid,
  user_id uuid,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  date TIMESTAMP DEFAULT now()
);
ALTER TABLE input_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_insert_input_review ON input_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_update_input_review ON input_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY all_select_input_review ON input_reviews FOR SELECT USING (true);

-- Input Verifications Table
CREATE TABLE IF NOT EXISTS input_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid,
  user_id uuid,
  verification_type TEXT,
  status TEXT DEFAULT 'pending',
  date TIMESTAMP DEFAULT now()
);
ALTER TABLE input_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_insert_input_verification ON input_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_update_input_verification ON input_verifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY all_select_input_verification ON input_verifications FOR SELECT USING (true);
