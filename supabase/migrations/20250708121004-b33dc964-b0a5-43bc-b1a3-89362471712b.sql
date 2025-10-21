
-- Create warehouses table for storage facilities
CREATE TABLE public.warehouses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  coordinates JSONB,
  capacity_tons NUMERIC NOT NULL,
  available_capacity_tons NUMERIC NOT NULL DEFAULT 0,
  storage_type TEXT[] DEFAULT '{}',
  temperature_controlled BOOLEAN DEFAULT false,
  security_features TEXT[] DEFAULT '{}',
  pricing_per_ton_per_month NUMERIC,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  description TEXT,
  facilities TEXT[] DEFAULT '{}',
  operating_hours TEXT,
  certifications TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 0.0,
  total_bookings INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create logistics_providers table for transporters
CREATE TABLE public.logistics_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  provider_name TEXT NOT NULL,
  provider_type TEXT NOT NULL, -- 'transporter', 'logistics_company', 'freight_forwarder'
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  location TEXT NOT NULL,
  counties_served TEXT[] NOT NULL DEFAULT '{}',
  vehicle_types TEXT[] DEFAULT '{}',
  fleet_size INTEGER DEFAULT 1,
  max_capacity_tons NUMERIC,
  services_offered TEXT[] DEFAULT '{}',
  specializations TEXT[] DEFAULT '{}',
  has_refrigeration BOOLEAN DEFAULT false,
  has_gps_tracking BOOLEAN DEFAULT false,
  insurance_coverage TEXT,
  license_number TEXT,
  pricing_model TEXT, -- 'per_km', 'per_ton', 'fixed_rate'
  base_rate NUMERIC,
  experience_years INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0.0,
  total_deliveries INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery_requests table to track logistics activities
CREATE TABLE public.delivery_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users NOT NULL,
  provider_id UUID REFERENCES public.logistics_providers,
  pickup_location TEXT NOT NULL,
  pickup_county TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  delivery_county TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  cargo_weight_tons NUMERIC NOT NULL,
  pickup_date DATE NOT NULL,
  delivery_date DATE,
  special_requirements TEXT[] DEFAULT '{}',
  estimated_cost NUMERIC,
  actual_cost NUMERIC,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'in_transit', 'delivered', 'cancelled'
  tracking_number TEXT,
  notes TEXT,
  requester_rating INTEGER,
  provider_rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_requests ENABLE ROW LEVEL SECURITY;

-- Warehouses policies
CREATE POLICY "Anyone can view active warehouses" 
  ON public.warehouses 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Owners can create warehouses" 
  ON public.warehouses 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their warehouses" 
  ON public.warehouses 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their warehouses" 
  ON public.warehouses 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- Logistics providers policies
CREATE POLICY "Anyone can view active logistics providers" 
  ON public.logistics_providers 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Users can create logistics provider profiles" 
  ON public.logistics_providers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their logistics provider profiles" 
  ON public.logistics_providers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their logistics provider profiles" 
  ON public.logistics_providers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Delivery requests policies
CREATE POLICY "Users can view their own delivery requests" 
  ON public.delivery_requests 
  FOR SELECT 
  USING (auth.uid() = requester_id OR auth.uid() IN (
    SELECT user_id FROM public.logistics_providers WHERE id = provider_id
  ));

CREATE POLICY "Users can create delivery requests" 
  ON public.delivery_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Requesters and providers can update delivery requests" 
  ON public.delivery_requests 
  FOR UPDATE 
  USING (auth.uid() = requester_id OR auth.uid() IN (
    SELECT user_id FROM public.logistics_providers WHERE id = provider_id
  ));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_warehouses
  BEFORE UPDATE ON public.warehouses
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_logistics_providers
  BEFORE UPDATE ON public.logistics_providers
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_delivery_requests
  BEFORE UPDATE ON public.delivery_requests
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

-- Insert sample data for testing (this will replace the hardcoded placeholders)
INSERT INTO public.warehouses (owner_id, name, location, county, capacity_tons, available_capacity_tons, storage_type, temperature_controlled, contact_phone, pricing_per_ton_per_month, description) VALUES
(gen_random_uuid(), 'Nakuru Central Storage', 'Nakuru Town', 'Nakuru', 500, 350, '{"dry_storage", "cold_storage"}', true, '+254712345678', 150, 'Modern storage facility with temperature control'),
(gen_random_uuid(), 'Kiambu Farmers Warehouse', 'Kiambu Town', 'Kiambu', 300, 200, '{"dry_storage"}', false, '+254723456789', 120, 'Community warehouse for local farmers'),
(gen_random_uuid(), 'Mombasa Port Storage', 'Mombasa Port', 'Mombasa', 1000, 800, '{"dry_storage", "cold_storage", "hazmat"}', true, '+254734567890', 200, 'Port-adjacent storage for export goods');

INSERT INTO public.logistics_providers (user_id, provider_name, provider_type, contact_person, contact_phone, contact_email, location, counties_served, vehicle_types, fleet_size, max_capacity_tons, services_offered, has_refrigeration) VALUES
(gen_random_uuid(), 'Kenya Agri Transport', 'transporter', 'John Kamau', '+254712345678', 'john@agrtransport.ke', 'Nairobi', '{"Nairobi", "Kiambu", "Nakuru"}', '{"truck", "pickup"}', 5, 20, '{"door_to_door", "warehouse_pickup"}', true),
(gen_random_uuid(), 'Coast Logistics Ltd', 'logistics_company', 'Mary Wanjiku', '+254723456789', 'mary@coastlogistics.ke', 'Mombasa', '{"Mombasa", "Kilifi", "Kwale"}', '{"truck", "container"}', 12, 50, '{"door_to_door", "port_services", "customs_clearance"}', true),
(gen_random_uuid(), 'Rift Valley Movers', 'transporter', 'Peter Kiprop', '+254734567890', 'peter@riftvalley.ke', 'Eldoret', '{"Uasin Gishu", "Trans Nzoia", "Bungoma"}', '{"truck"}', 3, 15, '{"door_to_door"}', false);
