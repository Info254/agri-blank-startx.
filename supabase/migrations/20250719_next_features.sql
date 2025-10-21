-- Batch Tracking System
CREATE TABLE IF NOT EXISTS batch_tracking (
  batch_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES agents(id),
  product_type TEXT,
  quantity INT,
  origin TEXT,
  destination TEXT,
  status TEXT DEFAULT 'created',
  events JSONB,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE batch_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY farmer_create_batch ON batch_tracking FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY farmer_update_batch ON batch_tracking FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY partner_view_batch ON batch_tracking FOR SELECT USING (true);

-- Carbon Credit & Circular Economy Forum
CREATE TABLE IF NOT EXISTS carbon_forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  title TEXT,
  content TEXT,
  type TEXT,
  event_date DATE,
  org_link TEXT,
  success_story TEXT,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE carbon_forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_create_forum_post ON carbon_forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_update_forum_post ON carbon_forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY user_delete_forum_post ON carbon_forum_posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY all_view_forum_post ON carbon_forum_posts FOR SELECT USING (true);

-- Networking & Partnership Features
CREATE TABLE IF NOT EXISTS network_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  date DATE,
  location TEXT,
  type TEXT,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE network_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_create_network_event ON network_events FOR INSERT WITH CHECK (true);
CREATE POLICY user_update_network_event ON network_events FOR UPDATE USING (true);
CREATE POLICY all_view_network_event ON network_events FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS partnerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org1_id uuid,
  org2_id uuid,
  type TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_create_partnership ON partnerships FOR INSERT WITH CHECK (auth.uid() = org1_id OR auth.uid() = org2_id);
CREATE POLICY org_update_partnership ON partnerships FOR UPDATE USING (auth.uid() = org1_id OR auth.uid() = org2_id);
CREATE POLICY all_view_partnership ON partnerships FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS business_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business1_id uuid,
  business2_id uuid,
  match_type TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE business_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY business_create_match ON business_matches FOR INSERT WITH CHECK (auth.uid() = business1_id OR auth.uid() = business2_id);
CREATE POLICY business_update_match ON business_matches FOR UPDATE USING (auth.uid() = business1_id OR auth.uid() = business2_id);
CREATE POLICY all_view_business_match ON business_matches FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS mentorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid,
  mentee_id uuid,
  topic TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_create_mentorship ON mentorships FOR INSERT WITH CHECK (auth.uid() = mentor_id OR auth.uid() = mentee_id);
CREATE POLICY user_update_mentorship ON mentorships FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);
CREATE POLICY all_view_mentorship ON mentorships FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS research_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid,
  topic TEXT,
  details TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE research_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_create_research_request ON research_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY user_update_research_request ON research_requests FOR UPDATE USING (auth.uid() = requester_id);
CREATE POLICY all_view_research_request ON research_requests FOR SELECT USING (true);
