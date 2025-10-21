-- Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid,
  title TEXT,
  description TEXT,
  steps TEXT[],
  images TEXT[],
  tags TEXT[],
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY creator_insert_recipe ON recipes FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY creator_update_recipe ON recipes FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY creator_delete_recipe ON recipes FOR DELETE USING (auth.uid() = creator_id);
CREATE POLICY all_select_recipe ON recipes FOR SELECT USING (true);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid,
  title TEXT,
  type TEXT,
  link TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY creator_insert_resource ON resources FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY creator_update_resource ON resources FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY creator_delete_resource ON resources FOR DELETE USING (auth.uid() = creator_id);
CREATE POLICY all_select_resource ON resources FOR SELECT USING (true);

-- Workshops Table
CREATE TABLE IF NOT EXISTS workshops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid,
  title TEXT,
  date DATE,
  location TEXT,
  registration_link TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
CREATE POLICY creator_insert_workshop ON workshops FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY creator_update_workshop ON workshops FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY creator_delete_workshop ON workshops FOR DELETE USING (auth.uid() = creator_id);
CREATE POLICY all_select_workshop ON workshops FOR SELECT USING (true);
