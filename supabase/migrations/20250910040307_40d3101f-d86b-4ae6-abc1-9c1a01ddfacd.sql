-- Add missing tables for farm tourism, events, weather, organizations

-- Farm tourism hosts table
CREATE TABLE public.farm_tourism_hosts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID NOT NULL,
  farm_name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  coordinates JSONB,
  crops TEXT[] DEFAULT '{}',
  livestock TEXT[] DEFAULT '{}',
  business_type TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  website_url TEXT,
  social_media JSONB,
  amenities TEXT[] DEFAULT '{}',
  pricing JSONB,
  availability JSONB,
  rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  image_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agricultural events table
CREATE TABLE public.agricultural_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  coordinates JSONB,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  entry_fee NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  poster_url TEXT,
  contact_info JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  requirements TEXT,
  what_to_bring TEXT,
  status TEXT DEFAULT 'upcoming',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agricultural organizations table
CREATE TABLE public.agricultural_organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website_url TEXT,
  social_media JSONB,
  services TEXT[] DEFAULT '{}',
  focus_areas TEXT[] DEFAULT '{}',
  target_audience TEXT[] DEFAULT '{}',
  membership_info JSONB,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  established_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Weather forecasts table
CREATE TABLE public.weather_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  forecast_date DATE NOT NULL,
  temperature_min NUMERIC,
  temperature_max NUMERIC,
  humidity NUMERIC,
  rainfall NUMERIC,
  wind_speed NUMERIC,
  wind_direction TEXT,
  weather_condition TEXT NOT NULL,
  weather_description TEXT,
  visibility NUMERIC,
  uv_index NUMERIC,
  pressure NUMERIC,
  agricultural_advisory TEXT,
  planting_recommendation TEXT,
  harvesting_recommendation TEXT,
  pest_disease_alert TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(location, forecast_date)
);

-- Equipment marketplace table
CREATE TABLE public.equipment_marketplace (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  equipment_name TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year_manufactured INTEGER,
  condition TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'KES',
  negotiable BOOLEAN DEFAULT true,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  description TEXT NOT NULL,
  specifications JSONB,
  images TEXT[] DEFAULT '{}',
  availability_status TEXT DEFAULT 'available',
  rental_option BOOLEAN DEFAULT false,
  rental_price_per_day NUMERIC,
  contact_phone TEXT,
  contact_email TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contract farming table
CREATE TABLE public.contract_farming (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL,
  contractor_name TEXT NOT NULL,
  contractor_type TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  variety TEXT,
  required_quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  contract_price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'KES',
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  planting_season TEXT NOT NULL,
  harvest_period TEXT NOT NULL,
  contract_duration TEXT NOT NULL,
  requirements TEXT NOT NULL,
  benefits_offered TEXT NOT NULL,
  support_provided TEXT[] DEFAULT '{}',
  payment_terms TEXT NOT NULL,
  quality_standards TEXT NOT NULL,
  delivery_terms TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  application_deadline DATE NOT NULL,
  status TEXT DEFAULT 'open',
  max_farmers INTEGER,
  current_applications INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE public.farm_tourism_hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agricultural_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agricultural_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_marketplace ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_farming ENABLE ROW LEVEL SECURITY;

-- RLS Policies for farm_tourism_hosts
CREATE POLICY "Anyone can view verified hosts" ON public.farm_tourism_hosts
FOR SELECT USING (is_verified = true OR host_id = auth.uid());

CREATE POLICY "Users can create their own host profiles" ON public.farm_tourism_hosts
FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update their own host profiles" ON public.farm_tourism_hosts
FOR UPDATE USING (auth.uid() = host_id);

-- RLS Policies for agricultural_events
CREATE POLICY "Anyone can view upcoming events" ON public.agricultural_events
FOR SELECT USING (status = 'upcoming' OR organizer_id = auth.uid());

CREATE POLICY "Users can create events" ON public.agricultural_events
FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their events" ON public.agricultural_events
FOR UPDATE USING (auth.uid() = organizer_id);

-- RLS Policies for agricultural_organizations
CREATE POLICY "Anyone can view verified organizations" ON public.agricultural_organizations
FOR SELECT USING (is_verified = true);

CREATE POLICY "Authenticated users can suggest organizations" ON public.agricultural_organizations
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for weather_forecasts
CREATE POLICY "Anyone can view weather forecasts" ON public.weather_forecasts
FOR SELECT USING (true);

CREATE POLICY "System can manage weather forecasts" ON public.weather_forecasts
FOR ALL USING (true);

-- RLS Policies for equipment_marketplace
CREATE POLICY "Anyone can view available equipment" ON public.equipment_marketplace
FOR SELECT USING (availability_status = 'available' OR seller_id = auth.uid());

CREATE POLICY "Users can list equipment" ON public.equipment_marketplace
FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their equipment" ON public.equipment_marketplace
FOR UPDATE USING (auth.uid() = seller_id);

-- RLS Policies for contract_farming
CREATE POLICY "Anyone can view open contracts" ON public.contract_farming
FOR SELECT USING (status = 'open' OR contractor_id = auth.uid());

CREATE POLICY "Users can create contracts" ON public.contract_farming
FOR INSERT WITH CHECK (auth.uid() = contractor_id);

CREATE POLICY "Contractors can update their contracts" ON public.contract_farming
FOR UPDATE USING (auth.uid() = contractor_id);

-- Add triggers for updated_at
CREATE TRIGGER update_farm_tourism_hosts_updated_at
BEFORE UPDATE ON public.farm_tourism_hosts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agricultural_events_updated_at
BEFORE UPDATE ON public.agricultural_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agricultural_organizations_updated_at
BEFORE UPDATE ON public.agricultural_organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weather_forecasts_updated_at
BEFORE UPDATE ON public.weather_forecasts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_marketplace_updated_at
BEFORE UPDATE ON public.equipment_marketplace
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contract_farming_updated_at
BEFORE UPDATE ON public.contract_farming
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();