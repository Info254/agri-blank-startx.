-- SokoConnect Comprehensive Database Schema
-- Core Users and Profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  location TEXT,
  user_type TEXT CHECK (user_type IN ('farmer', 'buyer', 'transporter', 'supplier', 'exporter', 'service_provider', 'admin')) DEFAULT 'farmer',
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  profile_image_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Farm Information
CREATE TABLE public.farms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  farm_name TEXT NOT NULL,
  location TEXT NOT NULL,
  size_hectares DECIMAL(10,2),
  coordinates JSONB,
  farm_type TEXT,
  certifications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Products/Commodities
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  unit_of_measure TEXT NOT NULL,
  image_url TEXT,
  seasonal_availability TEXT[],
  shelf_life_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Marketplace Listings
CREATE TABLE public.marketplace_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  location TEXT NOT NULL,
  quality_grade TEXT,
  harvest_date DATE,
  available_from DATE DEFAULT CURRENT_DATE,
  available_until DATE,
  status TEXT CHECK (status IN ('active', 'sold', 'expired', 'draft')) DEFAULT 'active',
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Barter Exchange
CREATE TABLE public.barter_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  offering_product_id UUID NOT NULL REFERENCES public.products(id),
  offering_quantity DECIMAL(10,2) NOT NULL,
  seeking_product_id UUID NOT NULL REFERENCES public.products(id),
  seeking_quantity DECIMAL(10,2) NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'matched', 'completed', 'cancelled')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Group Input Orders
CREATE TABLE public.group_input_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  input_name TEXT NOT NULL,
  description TEXT,
  target_quantity DECIMAL(10,2) NOT NULL,
  current_quantity DECIMAL(10,2) DEFAULT 0,
  unit_price DECIMAL(10,2) NOT NULL,
  deadline DATE NOT NULL,
  location TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'target_reached', 'completed', 'cancelled')) DEFAULT 'active',
  supplier_id UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Group Input Order Participants
CREATE TABLE public.group_order_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.group_input_orders(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(order_id, participant_id)
);

-- Price Trends
CREATE TABLE public.price_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  market_type TEXT,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trades
CREATE TABLE public.my_trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.marketplace_listings(id),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  trade_type TEXT CHECK (trade_type IN ('direct_sale', 'auction', 'barter')) DEFAULT 'direct_sale',
  status TEXT CHECK (status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'completed', 'disputed', 'cancelled')) DEFAULT 'pending',
  payment_method TEXT,
  delivery_location TEXT,
  delivery_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Logistics and Transportation
CREATE TABLE public.transportation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  transporter_id UUID REFERENCES public.profiles(user_id),
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  cargo_details TEXT NOT NULL,
  cargo_weight DECIMAL(10,2),
  preferred_date DATE,
  budget DECIMAL(10,2),
  status TEXT CHECK (status IN ('open', 'assigned', 'in_transit', 'delivered', 'cancelled')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Service Providers
CREATE TABLE public.service_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  service_category TEXT NOT NULL,
  services_offered TEXT[],
  coverage_areas TEXT[],
  pricing_structure JSONB,
  certification_documents TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Training Events
CREATE TABLE public.training_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('workshop', 'seminar', 'field_demonstration', 'online_course')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  fee DECIMAL(10,2) DEFAULT 0,
  requirements TEXT,
  materials_provided TEXT[],
  status TEXT CHECK (status IN ('planned', 'open_registration', 'full', 'ongoing', 'completed', 'cancelled')) DEFAULT 'planned',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Food Rescue System
CREATE TABLE public.food_rescue_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  condition_description TEXT,
  expiry_date DATE,
  pickup_location TEXT NOT NULL,
  available_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  available_until TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('available', 'claimed', 'collected', 'expired')) DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community Forums
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  images TEXT[],
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('active', 'archived', 'deleted')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community Comments
CREATE TABLE public.community_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.community_comments(id),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  related_id UUID,
  related_table TEXT,
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barter_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_input_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_order_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.my_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_rescue_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;