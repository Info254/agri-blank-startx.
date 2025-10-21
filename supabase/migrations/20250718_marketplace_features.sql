-- Columns 'status' and 'category' already exist in city_market_products. Remove duplicate ALTER TABLE statements.
-- Index idx_city_market_products_category already exists. Remove duplicate CREATE INDEX statement.

-- RLS: Only agents can update status/category of their own products
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'city_market_products' AND policyname = 'agent_update_product_status'
  ) THEN
    EXECUTE 'CREATE POLICY agent_update_product_status ON city_market_products FOR UPDATE USING (auth.uid() = seller_user_id)';
  END IF;
END $$;

-- RLS: Only agents can delete their own products
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'city_market_products' AND policyname = 'agent_delete_product'
  ) THEN
    EXECUTE 'CREATE POLICY agent_delete_product ON city_market_products FOR DELETE USING (auth.uid() = seller_user_id)';
  END IF;
END $$;

-- Recipients table (children's homes, food banks, charities)
CREATE TABLE IF NOT EXISTS recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- e.g., 'children_home', 'food_bank', 'charity'
  location TEXT,
  contact TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Create city_market_donations table with minimal structure first
CREATE TABLE IF NOT EXISTS city_market_donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES city_market_products(id),
  agent_id uuid REFERENCES agents(id),
  donated_at TIMESTAMP DEFAULT now(),
  feedback TEXT,
  feedback_rating INT CHECK (feedback_rating >= 1 AND feedback_rating <= 5)
);

-- Add recipient_type column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'city_market_donations' 
    AND column_name = 'recipient_type'
  ) THEN
    ALTER TABLE city_market_donations 
    ADD COLUMN recipient_type TEXT CHECK (recipient_type IN ('school','CBO','hospital','church','hospice'));
  END IF;
END $$;

-- Add recipient_id column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'city_market_donations' 
    AND column_name = 'recipient_id'
  ) THEN
    ALTER TABLE city_market_donations 
    ADD COLUMN recipient_id uuid;
  END IF;
END $$;

-- Enable RLS on city_market_donations
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'city_market_donations' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE city_market_donations ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Now create all policies after columns exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'city_market_donations' AND policyname = 'agent_public_donate'
  ) THEN
    EXECUTE 'CREATE POLICY agent_public_donate ON city_market_donations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'city_market_donations' AND policyname = 'school_view_donations'
  ) THEN
    EXECUTE 'CREATE POLICY school_view_donations ON city_market_donations FOR SELECT USING (recipient_type = ''school'' AND recipient_id = auth.uid())';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'city_market_donations' AND policyname = 'cbo_view_donations'
  ) THEN
    EXECUTE 'CREATE POLICY cbo_view_donations ON city_market_donations FOR SELECT USING (recipient_type = ''CBO'' AND recipient_id = auth.uid())';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'city_market_donations' AND policyname = 'hospital_view_donations'
  ) THEN
    EXECUTE 'CREATE POLICY hospital_view_donations ON city_market_donations FOR SELECT USING (recipient_type = ''hospital'' AND recipient_id = auth.uid())';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'city_market_donations' AND policyname = 'church_view_donations'
  ) THEN
    EXECUTE 'CREATE POLICY church_view_donations ON city_market_donations FOR SELECT USING (recipient_type = ''church'' AND recipient_id = auth.uid())';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'city_market_donations' AND policyname = 'hospice_view_donations'
  ) THEN
    EXECUTE 'CREATE POLICY hospice_view_donations ON city_market_donations FOR SELECT USING (recipient_type = ''hospice'' AND recipient_id = auth.uid())';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'city_market_donations' AND policyname = 'recipient_feedback_update'
  ) THEN
    EXECUTE 'CREATE POLICY recipient_feedback_update ON city_market_donations FOR UPDATE USING (recipient_id = auth.uid())';
  END IF;
END $$;

-- RLS: Only admins can manage recipients (using Supabase JWT custom claim 'role')
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'recipients' AND policyname = 'admin_manage_recipients'
  ) THEN
    ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;
    EXECUTE 'CREATE POLICY admin_manage_recipients ON recipients FOR ALL USING (auth.jwt() ->> ''role'' = ''admin'')';
  END IF;
END $$;