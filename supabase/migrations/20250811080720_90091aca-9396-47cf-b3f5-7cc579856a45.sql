-- Align schema to existing code and finish marketplace integrations

-- 1) Profiles: add missing columns used by UI
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS contact_number text,
  ADD COLUMN IF NOT EXISTS county text,
  ADD COLUMN IF NOT EXISTS farm_size numeric,
  ADD COLUMN IF NOT EXISTS farm_type text,
  ADD COLUMN IF NOT EXISTS experience_years integer,
  ADD COLUMN IF NOT EXISTS specialization text[],
  ADD COLUMN IF NOT EXISTS avatar_url text;

-- 2) Storage buckets for avatars and animal images
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-pictures','profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('animal-images','animal-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile-pictures
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Avatar images are publicly accessible'
  ) THEN
    CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'profile-pictures');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload their own avatar'
  ) THEN
    CREATE POLICY "Users can upload their own avatar"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update their own avatar'
  ) THEN
    CREATE POLICY "Users can update their own avatar"
    ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- Storage policies for animal-images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Animal images are publicly accessible'
  ) THEN
    CREATE POLICY "Animal images are publicly accessible"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'animal-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload their animal images'
  ) THEN
    CREATE POLICY "Users can upload their animal images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'animal-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update their animal images'
  ) THEN
    CREATE POLICY "Users can update their animal images"
    ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'animal-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- 3) Partners and Partner Events tables
CREATE TABLE IF NOT EXISTS public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  website text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Policies for partners
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='Partners are viewable by everyone'
  ) THEN
    CREATE POLICY "Partners are viewable by everyone" ON public.partners FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='Users can insert their own partner profile'
  ) THEN
    CREATE POLICY "Users can insert their own partner profile" ON public.partners FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='Users can update their own partner profile'
  ) THEN
    CREATE POLICY "Users can update their own partner profile" ON public.partners FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.partner_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  event_date timestamptz,
  location text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_partner FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE
);

ALTER TABLE public.partner_events ENABLE ROW LEVEL SECURITY;

-- Policies for partner_events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partner_events' AND policyname='Partner events are viewable by everyone'
  ) THEN
    CREATE POLICY "Partner events are viewable by everyone" ON public.partner_events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partner_events' AND policyname='Partners can create their own events'
  ) THEN
    CREATE POLICY "Partners can create their own events" ON public.partner_events FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.partners p
        WHERE p.id = partner_id AND p.user_id = auth.uid()
      )
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partner_events' AND policyname='Partners can update their own events'
  ) THEN
    CREATE POLICY "Partners can update their own events" ON public.partner_events FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM public.partners p
        WHERE p.id = partner_id AND p.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- 4) Barter listings: add columns expected by code
ALTER TABLE public.barter_listings
  ADD COLUMN IF NOT EXISTS commodity text,
  ADD COLUMN IF NOT EXISTS unit text,
  ADD COLUMN IF NOT EXISTS image_urls text[],
  ADD COLUMN IF NOT EXISTS county text,
  ADD COLUMN IF NOT EXISTS seeking_commodities text[],
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- 5) Animals table for AnimalManagement component
CREATE TABLE IF NOT EXISTS public.animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  birth_date date,
  acquisition_date date,
  status text DEFAULT 'active',
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='animals' AND policyname='Users can view their own animals'
  ) THEN
    CREATE POLICY "Users can view their own animals" ON public.animals FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='animals' AND policyname='Users can insert their own animals'
  ) THEN
    CREATE POLICY "Users can insert their own animals" ON public.animals FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='animals' AND policyname='Users can update their own animals'
  ) THEN
    CREATE POLICY "Users can update their own animals" ON public.animals FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='animals' AND policyname='Users can delete their own animals'
  ) THEN
    CREATE POLICY "Users can delete their own animals" ON public.animals FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 6) Processing matches for bulk orders, with negotiation log
CREATE TABLE IF NOT EXISTS public.processing_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bulk_order_id uuid NOT NULL,
  supplier_id uuid,
  offer_price numeric,
  status text DEFAULT 'pending',
  negotiation_log jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.processing_matches ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='processing_matches' AND policyname='Anyone can view processing matches'
  ) THEN
    CREATE POLICY "Anyone can view processing matches" ON public.processing_matches FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='processing_matches' AND policyname='Authenticated users can insert processing matches'
  ) THEN
    CREATE POLICY "Authenticated users can insert processing matches" ON public.processing_matches FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='processing_matches' AND policyname='Authenticated users can update processing matches'
  ) THEN
    CREATE POLICY "Authenticated users can update processing matches" ON public.processing_matches FOR UPDATE USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- 7) Market tables used by Assistant data hook
CREATE TABLE IF NOT EXISTS public.market_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id text NOT NULL,
  market_name text NOT NULL,
  county text NOT NULL,
  commodity_name text NOT NULL,
  price numeric NOT NULL,
  unit text NOT NULL,
  date_recorded date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='market_prices' AND policyname='Anyone can view market prices'
  ) THEN
    CREATE POLICY "Anyone can view market prices" ON public.market_prices FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='market_prices' AND policyname='Authenticated users can insert market prices'
  ) THEN
    CREATE POLICY "Authenticated users can insert market prices" ON public.market_prices FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.market_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_name text NOT NULL,
  county text NOT NULL,
  current_price numeric,
  forecast_price numeric,
  confidence_level numeric,
  period text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.market_forecasts ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='market_forecasts' AND policyname='Anyone can view market forecasts'
  ) THEN
    CREATE POLICY "Anyone can view market forecasts" ON public.market_forecasts FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='market_forecasts' AND policyname='Authenticated users can insert market forecasts'
  ) THEN
    CREATE POLICY "Authenticated users can insert market forecasts" ON public.market_forecasts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.transporters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  counties text[],
  contact_info text,
  has_refrigeration boolean,
  vehicle_type text,
  load_capacity text,
  rates text,
  service_type text,
  capacity text,
  available_times text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transporters ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transporters' AND policyname='Anyone can view transporters'
  ) THEN
    CREATE POLICY "Anyone can view transporters" ON public.transporters FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='transporters' AND policyname='Authenticated users can insert transporters'
  ) THEN
    CREATE POLICY "Authenticated users can insert transporters" ON public.transporters FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;