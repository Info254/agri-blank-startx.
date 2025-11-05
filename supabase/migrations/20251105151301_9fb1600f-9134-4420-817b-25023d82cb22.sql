-- Add missing tables from comprehensive migration

-- Export Opportunities (if not exists)
CREATE TABLE IF NOT EXISTS public.export_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_title TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  commodity TEXT NOT NULL,
  volume NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  certifications_required TEXT[] DEFAULT '{}',
  deadline DATE NOT NULL,
  contact_info JSONB,
  price_range TEXT,
  payment_terms TEXT,
  delivery_terms TEXT,
  specifications TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.export_opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view open export opportunities" ON public.export_opportunities;
CREATE POLICY "Anyone can view open export opportunities"
  ON public.export_opportunities FOR SELECT
  USING (status = 'open');

DROP POLICY IF EXISTS "Authenticated users can create export opportunities" ON public.export_opportunities;
CREATE POLICY "Authenticated users can create export opportunities"
  ON public.export_opportunities FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Community Post Shares (if not exists)
CREATE TABLE IF NOT EXISTS public.community_post_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  share_platform TEXT CHECK (share_platform IN ('whatsapp', 'facebook', 'twitter', 'sms', 'email', 'internal'))
);

ALTER TABLE public.community_post_shares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create shares" ON public.community_post_shares;
CREATE POLICY "Anyone can create shares"
  ON public.community_post_shares FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can view shares" ON public.community_post_shares;
CREATE POLICY "Anyone can view shares"
  ON public.community_post_shares FOR SELECT
  USING (true);

-- Reward Points (if not exists)
CREATE TABLE IF NOT EXISTS public.reward_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  points INTEGER DEFAULT 0,
  activity_type TEXT NOT NULL,
  description TEXT,
  points_earned INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reward_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own reward points" ON public.reward_points;
CREATE POLICY "Users can view own reward points"
  ON public.reward_points FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create reward points" ON public.reward_points;
CREATE POLICY "System can create reward points"
  ON public.reward_points FOR INSERT
  WITH CHECK (true);

-- Jobs Table (if not exists)
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT NOT NULL,
  job_category TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  salary_range TEXT,
  employment_type TEXT CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'casual', 'internship')),
  requirements TEXT[] DEFAULT '{}',
  responsibilities TEXT[] DEFAULT '{}',
  application_deadline DATE,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can create jobs" ON public.jobs;
CREATE POLICY "Authenticated users can create jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_export_opportunities_status ON public.export_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(job_category);
CREATE INDEX IF NOT EXISTS idx_reward_points_user ON public.reward_points(user_id);