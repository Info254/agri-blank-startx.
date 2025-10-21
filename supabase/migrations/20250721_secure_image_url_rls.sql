-- Enable RLS and add secure policies for image_url columns
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE buy_requests ENABLE ROW LEVEL SECURITY;

-- Products: Only owner can insert/update/delete, all can select
CREATE POLICY product_owner_insert ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY product_owner_update ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY product_owner_delete ON products FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY product_public_select ON products FOR SELECT USING (true);

-- Animals: Only owner can insert/update/delete, all can select
CREATE POLICY animal_owner_insert ON animals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY animal_owner_update ON animals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY animal_owner_delete ON animals FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY animal_public_select ON animals FOR SELECT USING (true);

-- Buy Requests: Only owner can insert/update/delete, all can select
CREATE POLICY buy_request_owner_insert ON buy_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY buy_request_owner_update ON buy_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY buy_request_owner_delete ON buy_requests FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY buy_request_public_select ON buy_requests FOR SELECT USING (true);
