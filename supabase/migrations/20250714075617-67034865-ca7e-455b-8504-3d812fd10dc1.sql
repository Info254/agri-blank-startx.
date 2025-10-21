-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  contact_number TEXT,
  county TEXT,
  bio TEXT,
  farm_size NUMERIC,
  farm_type TEXT,
  experience_years INTEGER,
  specialization TEXT[],
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create updated_at trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create P2P lenders table
CREATE TABLE IF NOT EXISTS public.p2p_lenders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lender_name TEXT NOT NULL,
  lender_type TEXT NOT NULL DEFAULT 'individual',
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  county TEXT NOT NULL,
  sub_county TEXT,
  loan_types JSONB NOT NULL DEFAULT '[]',
  minimum_loan_amount NUMERIC NOT NULL,
  maximum_loan_amount NUMERIC NOT NULL,
  interest_rate_range TEXT NOT NULL,
  loan_term_months_min INTEGER DEFAULT 1,
  loan_term_months_max INTEGER DEFAULT 60,
  collateral_requirements TEXT[],
  service_counties TEXT[] NOT NULL,
  total_loans_disbursed NUMERIC DEFAULT 0,
  active_borrowers INTEGER DEFAULT 0,
  default_rate_percent NUMERIC DEFAULT 0,
  platform_rating NUMERIC DEFAULT 0.0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on p2p_lenders
ALTER TABLE public.p2p_lenders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for p2p_lenders
CREATE POLICY "Anyone can view active P2P lenders" 
ON public.p2p_lenders 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can create their P2P lender profile" 
ON public.p2p_lenders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their P2P lender profile" 
ON public.p2p_lenders 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create updated_at trigger for p2p_lenders
CREATE TRIGGER update_p2p_lenders_updated_at
  BEFORE UPDATE ON public.p2p_lenders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create warehouses table
CREATE TABLE IF NOT EXISTS public.warehouses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  warehouse_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  county TEXT NOT NULL,
  sub_county TEXT,
  storage_capacity_tons NUMERIC NOT NULL,
  available_capacity_tons NUMERIC,
  storage_types TEXT[] NOT NULL,
  has_refrigeration BOOLEAN DEFAULT false,
  has_pest_control BOOLEAN DEFAULT false,
  has_security BOOLEAN DEFAULT false,
  certifications TEXT[],
  pricing_per_ton_per_month NUMERIC,
  minimum_storage_period_days INTEGER DEFAULT 30,
  coordinates JSONB,
  operating_hours TEXT,
  services_offered TEXT[],
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 0.0,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on warehouses
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for warehouses
CREATE POLICY "Anyone can view active warehouses" 
ON public.warehouses 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can create their warehouse profile" 
ON public.warehouses 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their warehouse profile" 
ON public.warehouses 
FOR UPDATE 
USING (auth.uid() = owner_id);

-- Create updated_at trigger for warehouses
CREATE TRIGGER update_warehouses_updated_at
  BEFORE UPDATE ON public.warehouses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_county ON public.profiles(county);
CREATE INDEX IF NOT EXISTS idx_profiles_farm_type ON public.profiles(farm_type);
CREATE INDEX IF NOT EXISTS idx_p2p_lenders_county ON public.p2p_lenders(county);
CREATE INDEX IF NOT EXISTS idx_p2p_lenders_loan_amounts ON public.p2p_lenders(minimum_loan_amount, maximum_loan_amount);
CREATE INDEX IF NOT EXISTS idx_warehouses_county ON public.warehouses(county);
CREATE INDEX IF NOT EXISTS idx_warehouses_capacity ON public.warehouses(storage_capacity_tons);
CREATE INDEX IF NOT EXISTS idx_transporters_service_type ON public.transporters(service_type);
CREATE INDEX IF NOT EXISTS idx_aggregators_county ON public.aggregators(county);
CREATE INDEX IF NOT EXISTS idx_processors_county ON public.processors(county);
CREATE INDEX IF NOT EXISTS idx_micro_creditors_county ON public.micro_creditors(county);