-- Food Rescue Listings Table
CREATE TABLE IF NOT EXISTS food_rescue_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid,
  product TEXT,
  quantity NUMERIC,
  unit TEXT,
  location TEXT,
  urgency TEXT,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE food_rescue_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY farmer_insert_rescue ON food_rescue_listings FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY farmer_update_rescue ON food_rescue_listings FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY farmer_delete_rescue ON food_rescue_listings FOR DELETE USING (auth.uid() = farmer_id);
CREATE POLICY all_select_rescue ON food_rescue_listings FOR SELECT USING (true);

-- Rescue Matches Table
CREATE TABLE IF NOT EXISTS rescue_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES food_rescue_listings(id),
  recipient_id uuid,
  status TEXT DEFAULT 'pending',
  pickup_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE rescue_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY recipient_insert_match ON rescue_matches FOR INSERT WITH CHECK (auth.uid() = recipient_id);
CREATE POLICY recipient_update_match ON rescue_matches FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY all_select_match ON rescue_matches FOR SELECT USING (true);
