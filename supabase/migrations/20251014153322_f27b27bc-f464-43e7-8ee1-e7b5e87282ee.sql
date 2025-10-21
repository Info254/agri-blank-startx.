-- Add is_active column to training_events if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'training_events' 
    AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.training_events ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

-- Add missing columns to training_events for comprehensive features
ALTER TABLE public.training_events 
  ADD COLUMN IF NOT EXISTS topics text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS target_audience text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS contact_info text,
  ADD COLUMN IF NOT EXISTS registration_deadline timestamp with time zone,
  ADD COLUMN IF NOT EXISTS is_online boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS meeting_link text,
  ADD COLUMN IF NOT EXISTS materials_provided boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS certificate_provided boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS county text,
  ADD COLUMN IF NOT EXISTS cost numeric DEFAULT 0;

-- Create function to auto-delete old training events
CREATE OR REPLACE FUNCTION public.cleanup_old_training_events()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Mark events as inactive 3 days after end date
  UPDATE public.training_events
  SET is_active = false
  WHERE end_date < (CURRENT_DATE - INTERVAL '3 days')
  AND is_active = true;
END;
$function$;

-- Create tables for community post social features
CREATE TABLE IF NOT EXISTS public.community_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.community_post_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL,
  reason text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for likes
CREATE POLICY "Users can like posts" ON public.community_post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts" ON public.community_post_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view likes" ON public.community_post_likes
  FOR SELECT USING (true);

-- RLS policies for reports
CREATE POLICY "Users can report posts" ON public.community_post_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their reports" ON public.community_post_reports
  FOR SELECT USING (auth.uid() = reporter_id);