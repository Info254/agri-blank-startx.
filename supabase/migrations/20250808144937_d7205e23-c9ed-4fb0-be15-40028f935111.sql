-- Add additional tables needed for comprehensive SokoConnect system

-- Input Pricing Verification  
CREATE TABLE public.input_pricing_verification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  supplier_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  reported_price DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  verifier_id UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reverse Bulk Auctions
CREATE TABLE public.reverse_bulk_auctions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  max_price DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'closed', 'cancelled')) DEFAULT 'active',
  winning_bid_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- City Markets
CREATE TABLE public.city_markets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB,
  operating_hours TEXT,
  market_type TEXT,
  facilities TEXT[],
  contact_info JSONB,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recipients for donations/food rescue
CREATE TABLE public.recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  contact_person TEXT,
  phone_number TEXT,
  email TEXT,
  location TEXT NOT NULL,
  capacity_description TEXT,
  requirements TEXT[],
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Supplier Reviews
CREATE TABLE public.input_supplier_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  supplier_name TEXT NOT NULL,
  product_category TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  delivery_timeliness INTEGER CHECK (delivery_timeliness >= 1 AND delivery_timeliness <= 5),
  product_quality INTEGER CHECK (product_quality >= 1 AND product_quality <= 5),
  customer_service INTEGER CHECK (customer_service >= 1 AND customer_service <= 5),
  would_recommend BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Food Rescue Matches (connecting donors with recipients)
CREATE TABLE public.food_rescue_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.food_rescue_listings(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.recipients(id) ON DELETE CASCADE,
  matched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT CHECK (status IN ('matched', 'in_progress', 'completed', 'cancelled')) DEFAULT 'matched',
  pickup_scheduled_at TIMESTAMP WITH TIME ZONE,
  completion_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Donations
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.recipients(id),
  donation_type TEXT NOT NULL,
  amount DECIMAL(10,2),
  items_description TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'distributed', 'completed')) DEFAULT 'pending',
  distribution_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Donation Requests
CREATE TABLE public.donation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID NOT NULL REFERENCES public.recipients(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL,
  items_needed TEXT NOT NULL,
  quantity_needed TEXT,
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  deadline DATE,
  description TEXT,
  status TEXT CHECK (status IN ('open', 'partially_fulfilled', 'fulfilled', 'expired')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Warehouse Information
CREATE TABLE public.warehouses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB,
  capacity_tons DECIMAL(10,2),
  storage_types TEXT[],
  facilities TEXT[],
  temperature_controlled BOOLEAN DEFAULT FALSE,
  security_features TEXT[],
  pricing_structure JSONB,
  contact_info JSONB,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Warehouse Bookings
CREATE TABLE public.warehouse_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL,
  quantity_tons DECIMAL(10,2) NOT NULL,
  storage_start_date DATE NOT NULL,
  storage_end_date DATE NOT NULL,
  total_cost DECIMAL(10,2),
  status TEXT CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')) DEFAULT 'pending',
  special_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Success Stories
CREATE TABLE public.success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  category TEXT,
  featured_image_url TEXT,
  impact_metrics JSONB,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reviews system for various entities
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  reviewed_entity_type TEXT NOT NULL,
  reviewed_entity_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  helpful_votes INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- App Settings for user preferences
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  notification_preferences JSONB DEFAULT '{}',
  language_preference TEXT DEFAULT 'en',
  currency_preference TEXT DEFAULT 'KES',
  location_sharing BOOLEAN DEFAULT TRUE,
  marketing_communications BOOLEAN DEFAULT TRUE,
  data_sync_enabled BOOLEAN DEFAULT TRUE,
  theme_preference TEXT DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.input_pricing_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reverse_bulk_auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.input_supplier_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_rescue_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;