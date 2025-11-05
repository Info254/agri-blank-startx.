-- Create Community Post Reposts table (only if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'community_post_reposts') THEN
    CREATE TABLE public.community_post_reposts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      original_post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
      reposted_by UUID REFERENCES auth.users(id),
      repost_caption TEXT,
      reposted_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE public.community_post_reposts ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Anyone can view reposts"
      ON public.community_post_reposts FOR SELECT
      USING (true);

    CREATE POLICY "Users can create reposts"
      ON public.community_post_reposts FOR INSERT
      WITH CHECK (auth.uid() = reposted_by);

    CREATE POLICY "Users can manage own reposts"
      ON public.community_post_reposts FOR ALL
      USING (auth.uid() = reposted_by);

    CREATE INDEX idx_community_post_reposts_original ON public.community_post_reposts(original_post_id);
  END IF;
END $$;

-- Create API Access Logs table (only if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'api_access_logs') THEN
    CREATE TABLE public.api_access_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id),
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      request_count INTEGER DEFAULT 1,
      response_time_ms INTEGER,
      status_code INTEGER,
      ip_address INET,
      user_agent TEXT,
      timestamp TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE public.api_access_logs ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view own logs"
      ON public.api_access_logs FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "System can insert logs"
      ON public.api_access_logs FOR INSERT
      WITH CHECK (true);

    CREATE INDEX idx_api_logs_user_id ON public.api_access_logs(user_id);
    CREATE INDEX idx_api_logs_timestamp ON public.api_access_logs(timestamp);
  END IF;
END $$;