-- Group Purchasing for Inputs
CREATE TABLE IF NOT EXISTS input_group_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_type TEXT NOT NULL,
  quantity INT NOT NULL,
  farmer_id uuid REFERENCES agents(id),
  status TEXT DEFAULT 'open',
  supplier_id uuid REFERENCES agents(id),
  delivery_date DATE,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE input_group_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY farmer_create_group_order ON input_group_orders FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY supplier_update_group_order ON input_group_orders FOR UPDATE USING (auth.uid() = supplier_id);

-- Input Pricing and Supplier Reviews
CREATE TABLE IF NOT EXISTS input_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  region TEXT,
  reported_by uuid REFERENCES agents(id),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE input_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY farmer_report_price ON input_prices FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY admin_verify_price ON input_prices FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE TABLE IF NOT EXISTS input_supplier_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES agents(id),
  rating INT,
  review TEXT,
  photo_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE input_supplier_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY farmer_review_supplier ON input_supplier_reviews FOR INSERT WITH CHECK (auth.uid() = supplier_id);
CREATE POLICY admin_verify_review ON input_supplier_reviews FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Reverse Auctions for Bulk Orders
CREATE TABLE IF NOT EXISTS bulk_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid REFERENCES agents(id),
  produce_type TEXT NOT NULL,
  quantity INT NOT NULL,
  quality TEXT,
  delivery_date DATE,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE bulk_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY buyer_create_bulk_order ON bulk_orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY buyer_update_bulk_order ON bulk_orders FOR UPDATE USING (auth.uid() = buyer_id);

CREATE TABLE IF NOT EXISTS bulk_order_bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES bulk_orders(id),
  farmer_id uuid REFERENCES agents(id),
  price NUMERIC NOT NULL,
  quality_offer TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE bulk_order_bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY farmer_bid_bulk_order ON bulk_order_bids FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY buyer_accept_bid ON bulk_order_bids FOR UPDATE USING (EXISTS (SELECT 1 FROM bulk_orders WHERE id = order_id AND buyer_id = auth.uid()));

-- F2C Subscription Boxes
CREATE TABLE IF NOT EXISTS subscription_boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id uuid,
  farmer_id uuid REFERENCES agents(id),
  box_type TEXT,
  frequency TEXT,
  next_delivery DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE subscription_boxes ENABLE ROW LEVEL SECURITY;
CREATE POLICY consumer_subscribe_box ON subscription_boxes FOR INSERT WITH CHECK (auth.uid() = consumer_id);
CREATE POLICY consumer_update_box ON subscription_boxes FOR UPDATE USING (auth.uid() = consumer_id);
CREATE POLICY farmer_update_box ON subscription_boxes FOR UPDATE USING (auth.uid() = farmer_id);

CREATE TABLE IF NOT EXISTS subscription_box_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id uuid REFERENCES subscription_boxes(id),
  delivery_date DATE,
  delivered BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE subscription_box_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY farmer_mark_delivery ON subscription_box_deliveries FOR UPDATE USING (EXISTS (SELECT 1 FROM subscription_boxes WHERE id = box_id AND farmer_id = auth.uid()));
