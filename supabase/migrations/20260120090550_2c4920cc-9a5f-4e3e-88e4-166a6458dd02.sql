-- =====================================================
-- MISSING TABLES MIGRATION - Comprehensive Addition
-- =====================================================

-- 1. Cooperatives & Groups
CREATE TABLE IF NOT EXISTS public.cooperatives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  county TEXT NOT NULL,
  location TEXT,
  registration_number TEXT,
  member_count INTEGER DEFAULT 0,
  established_date DATE,
  contact_email TEXT,
  contact_phone TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cooperative_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cooperative_id UUID REFERENCES public.cooperatives(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- 2. Farm Tourism
CREATE TABLE IF NOT EXISTS public.farm_tourism_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  farm_name TEXT NOT NULL,
  description TEXT,
  county TEXT NOT NULL,
  location TEXT NOT NULL,
  activities TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  price_per_person NUMERIC,
  max_guests INTEGER DEFAULT 10,
  contact_phone TEXT,
  contact_email TEXT,
  image_urls TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.farm_tourism_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.farm_tourism_listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  booking_date DATE NOT NULL,
  guests INTEGER DEFAULT 1,
  total_amount NUMERIC,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Batch Tracking / Traceability
CREATE TABLE IF NOT EXISTS public.batch_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  batch_number TEXT NOT NULL UNIQUE,
  product_name TEXT NOT NULL,
  product_category TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'kg',
  origin_farm TEXT,
  origin_county TEXT,
  harvest_date DATE,
  processing_date DATE,
  expiry_date DATE,
  certifications TEXT[] DEFAULT '{}',
  quality_grade TEXT,
  current_location TEXT,
  status TEXT DEFAULT 'in_storage',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.batch_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES public.batch_tracking(id) ON DELETE CASCADE,
  from_location TEXT,
  to_location TEXT,
  moved_by UUID,
  movement_type TEXT,
  quantity NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Contract Farming
CREATE TABLE IF NOT EXISTS public.contract_farming_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  contract_title TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'kg',
  agreed_price NUMERIC NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  delivery_location TEXT,
  terms_conditions TEXT,
  status TEXT DEFAULT 'pending',
  farmer_signed BOOLEAN DEFAULT false,
  buyer_signed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Farmer Networks
CREATE TABLE IF NOT EXISTS public.farmer_networks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  county TEXT,
  focus_crop TEXT,
  member_count INTEGER DEFAULT 0,
  created_by UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.farmer_network_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  network_id UUID REFERENCES public.farmer_networks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(network_id, user_id)
);

-- 6. Success Stories
CREATE TABLE IF NOT EXISTS public.farmer_success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  farmer_name TEXT NOT NULL,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  county TEXT,
  crop_type TEXT,
  achievement_type TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Recipe Resources
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] NOT NULL,
  instructions TEXT NOT NULL,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  category TEXT,
  main_ingredient TEXT,
  image_url TEXT,
  is_approved BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Workshops
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  workshop_type TEXT,
  county TEXT NOT NULL,
  location TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  cost NUMERIC DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  contact_phone TEXT,
  contact_email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workshop_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT DEFAULT 'registered',
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workshop_id, user_id)
);

-- 9. Processing Facilities
CREATE TABLE IF NOT EXISTS public.processing_facilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  facility_name TEXT NOT NULL,
  facility_type TEXT NOT NULL,
  county TEXT NOT NULL,
  location TEXT,
  capacity TEXT,
  products_processed TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  contact_phone TEXT,
  contact_email TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Imperfect/Surplus Produce
CREATE TABLE IF NOT EXISTS public.imperfect_produce (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'kg',
  discount_percentage NUMERIC DEFAULT 30,
  original_price NUMERIC,
  discounted_price NUMERIC,
  reason TEXT,
  county TEXT NOT NULL,
  location TEXT,
  available_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Buy Requests
CREATE TABLE IF NOT EXISTS public.buy_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT,
  quantity_needed NUMERIC NOT NULL,
  unit TEXT DEFAULT 'kg',
  max_price NUMERIC,
  county TEXT,
  delivery_location TEXT,
  needed_by DATE,
  status TEXT DEFAULT 'open',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Contact Submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  responded_at TIMESTAMPTZ,
  responded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. FAQ Items
CREATE TABLE IF NOT EXISTS public.faq_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. User Bookmarks (for saving listings)
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- 15. Product Reviews
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_type TEXT NOT NULL,
  product_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 16. Market Suggestions
CREATE TABLE IF NOT EXISTS public.market_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  market_name TEXT NOT NULL,
  county TEXT NOT NULL,
  location TEXT,
  description TEXT,
  contact_info TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. Quality Control Discussions
CREATE TABLE IF NOT EXISTS public.quality_control_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  product_type TEXT,
  county TEXT,
  is_resolved BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 18. Stakeholder Profiles
CREATE TABLE IF NOT EXISTS public.stakeholder_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  stakeholder_type TEXT NOT NULL,
  organization_name TEXT,
  position TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  counties_active TEXT[] DEFAULT '{}',
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 19. Reverse Auction tables (if not exists)
CREATE TABLE IF NOT EXISTS public.reverse_auctions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'kg',
  max_price NUMERIC NOT NULL,
  county TEXT,
  delivery_location TEXT,
  delivery_date DATE,
  requirements TEXT,
  status TEXT DEFAULT 'active',
  winning_bid_id UUID,
  end_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reverse_auction_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES public.reverse_auctions(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL,
  bid_price NUMERIC NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 20. Road Markets
CREATE TABLE IF NOT EXISTS public.road_markets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  route_name TEXT NOT NULL,
  county TEXT NOT NULL,
  location TEXT,
  gps_coordinates TEXT,
  market_days TEXT[] DEFAULT '{}',
  operating_hours TEXT,
  specialties TEXT[] DEFAULT '{}',
  contact_info TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.road_market_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID REFERENCES public.road_markets(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT,
  price NUMERIC NOT NULL,
  unit TEXT DEFAULT 'kg',
  quantity NUMERIC,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 21. Service Provider Reviews
CREATE TABLE IF NOT EXISTS public.service_provider_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  service_type TEXT,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider_id, user_id)
);

-- =====================================================
-- ENABLE RLS ON ALL NEW TABLES
-- =====================================================
ALTER TABLE public.cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooperative_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_tourism_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_tourism_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_farming_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_network_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imperfect_produce ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_control_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reverse_auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reverse_auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.road_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.road_market_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_provider_reviews ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - Public Read, Authenticated Write
-- =====================================================

-- Cooperatives
CREATE POLICY "Anyone can view cooperatives" ON public.cooperatives FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create cooperatives" ON public.cooperatives FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Creators can update their cooperatives" ON public.cooperatives FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Creators can delete their cooperatives" ON public.cooperatives FOR DELETE USING (auth.uid() = created_by);

-- Cooperative Members
CREATE POLICY "Anyone can view cooperative members" ON public.cooperative_members FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join cooperatives" ON public.cooperative_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members can leave cooperatives" ON public.cooperative_members FOR DELETE USING (auth.uid() = user_id);

-- Farm Tourism
CREATE POLICY "Anyone can view farm tourism listings" ON public.farm_tourism_listings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create listings" ON public.farm_tourism_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update their listings" ON public.farm_tourism_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their listings" ON public.farm_tourism_listings FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view bookings" ON public.farm_tourism_bookings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create bookings" ON public.farm_tourism_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their bookings" ON public.farm_tourism_bookings FOR UPDATE USING (auth.uid() = user_id);

-- Batch Tracking
CREATE POLICY "Users can view their batches" ON public.batch_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create batches" ON public.batch_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their batches" ON public.batch_tracking FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their batches" ON public.batch_tracking FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their batch movements" ON public.batch_movements FOR SELECT USING (EXISTS (SELECT 1 FROM public.batch_tracking WHERE id = batch_id AND user_id = auth.uid()));
CREATE POLICY "Users can create batch movements" ON public.batch_movements FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.batch_tracking WHERE id = batch_id AND user_id = auth.uid()));

-- Contract Farming
CREATE POLICY "Parties can view their contracts" ON public.contract_farming_agreements FOR SELECT USING (auth.uid() = farmer_id OR auth.uid() = buyer_id);
CREATE POLICY "Authenticated users can create contracts" ON public.contract_farming_agreements FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Parties can update their contracts" ON public.contract_farming_agreements FOR UPDATE USING (auth.uid() = farmer_id OR auth.uid() = buyer_id);

-- Farmer Networks
CREATE POLICY "Anyone can view farmer networks" ON public.farmer_networks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create networks" ON public.farmer_networks FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update their networks" ON public.farmer_networks FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Creators can delete their networks" ON public.farmer_networks FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Anyone can view network members" ON public.farmer_network_members FOR SELECT USING (true);
CREATE POLICY "Users can join networks" ON public.farmer_network_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave networks" ON public.farmer_network_members FOR DELETE USING (auth.uid() = user_id);

-- Success Stories
CREATE POLICY "Anyone can view approved stories" ON public.farmer_success_stories FOR SELECT USING (is_approved = true);
CREATE POLICY "Authenticated users can create stories" ON public.farmer_success_stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their stories" ON public.farmer_success_stories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their stories" ON public.farmer_success_stories FOR DELETE USING (auth.uid() = user_id);

-- Recipes
CREATE POLICY "Anyone can view recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create recipes" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their recipes" ON public.recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their recipes" ON public.recipes FOR DELETE USING (auth.uid() = user_id);

-- Workshops
CREATE POLICY "Anyone can view workshops" ON public.workshops FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create workshops" ON public.workshops FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update their workshops" ON public.workshops FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Organizers can delete their workshops" ON public.workshops FOR DELETE USING (auth.uid() = organizer_id);

CREATE POLICY "Anyone can view registrations" ON public.workshop_registrations FOR SELECT USING (true);
CREATE POLICY "Users can register for workshops" ON public.workshop_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel registration" ON public.workshop_registrations FOR DELETE USING (auth.uid() = user_id);

-- Processing Facilities
CREATE POLICY "Anyone can view facilities" ON public.processing_facilities FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create facilities" ON public.processing_facilities FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their facilities" ON public.processing_facilities FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete their facilities" ON public.processing_facilities FOR DELETE USING (auth.uid() = owner_id);

-- Imperfect Produce
CREATE POLICY "Anyone can view imperfect produce" ON public.imperfect_produce FOR SELECT USING (true);
CREATE POLICY "Users can list imperfect produce" ON public.imperfect_produce FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their listings" ON public.imperfect_produce FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their listings" ON public.imperfect_produce FOR DELETE USING (auth.uid() = user_id);

-- Buy Requests
CREATE POLICY "Anyone can view buy requests" ON public.buy_requests FOR SELECT USING (true);
CREATE POLICY "Users can create buy requests" ON public.buy_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their requests" ON public.buy_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their requests" ON public.buy_requests FOR DELETE USING (auth.uid() = user_id);

-- Contact Submissions
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view submissions" ON public.contact_submissions FOR SELECT USING (auth.uid() IS NOT NULL);

-- FAQ Items
CREATE POLICY "Anyone can view published FAQs" ON public.faq_items FOR SELECT USING (is_published = true);

-- User Bookmarks
CREATE POLICY "Users can view their bookmarks" ON public.user_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookmarks" ON public.user_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete bookmarks" ON public.user_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Product Reviews
CREATE POLICY "Anyone can view reviews" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their reviews" ON public.product_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their reviews" ON public.product_reviews FOR DELETE USING (auth.uid() = user_id);

-- Market Suggestions
CREATE POLICY "Anyone can suggest markets" ON public.market_suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view suggestions" ON public.market_suggestions FOR SELECT USING (true);

-- Quality Control Discussions
CREATE POLICY "Anyone can view discussions" ON public.quality_control_discussions FOR SELECT USING (true);
CREATE POLICY "Users can create discussions" ON public.quality_control_discussions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their discussions" ON public.quality_control_discussions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their discussions" ON public.quality_control_discussions FOR DELETE USING (auth.uid() = user_id);

-- Stakeholder Profiles
CREATE POLICY "Anyone can view stakeholder profiles" ON public.stakeholder_profiles FOR SELECT USING (true);
CREATE POLICY "Users can create their profile" ON public.stakeholder_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their profile" ON public.stakeholder_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Reverse Auctions
CREATE POLICY "Anyone can view reverse auctions" ON public.reverse_auctions FOR SELECT USING (true);
CREATE POLICY "Buyers can create auctions" ON public.reverse_auctions FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update their auctions" ON public.reverse_auctions FOR UPDATE USING (auth.uid() = buyer_id);

CREATE POLICY "Anyone can view bids" ON public.reverse_auction_bids FOR SELECT USING (true);
CREATE POLICY "Sellers can place bids" ON public.reverse_auction_bids FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their bids" ON public.reverse_auction_bids FOR UPDATE USING (auth.uid() = seller_id);

-- Road Markets
CREATE POLICY "Anyone can view road markets" ON public.road_markets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add markets" ON public.road_markets FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view road market products" ON public.road_market_products FOR SELECT USING (true);
CREATE POLICY "Sellers can list products" ON public.road_market_products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update products" ON public.road_market_products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete products" ON public.road_market_products FOR DELETE USING (auth.uid() = seller_id);

-- Service Provider Reviews
CREATE POLICY "Anyone can view reviews" ON public.service_provider_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.service_provider_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their reviews" ON public.service_provider_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their reviews" ON public.service_provider_reviews FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_cooperatives_county ON public.cooperatives(county);
CREATE INDEX IF NOT EXISTS idx_farm_tourism_county ON public.farm_tourism_listings(county);
CREATE INDEX IF NOT EXISTS idx_batch_tracking_user ON public.batch_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_tracking_number ON public.batch_tracking(batch_number);
CREATE INDEX IF NOT EXISTS idx_contract_farming_farmer ON public.contract_farming_agreements(farmer_id);
CREATE INDEX IF NOT EXISTS idx_contract_farming_buyer ON public.contract_farming_agreements(buyer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_networks_county ON public.farmer_networks(county);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON public.recipes(category);
CREATE INDEX IF NOT EXISTS idx_workshops_county ON public.workshops(county);
CREATE INDEX IF NOT EXISTS idx_imperfect_produce_county ON public.imperfect_produce(county);
CREATE INDEX IF NOT EXISTS idx_buy_requests_status ON public.buy_requests(status);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user ON public.user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_reverse_auctions_status ON public.reverse_auctions(status);
CREATE INDEX IF NOT EXISTS idx_road_markets_county ON public.road_markets(county);

-- =====================================================
-- UPDATE TRIGGERS
-- =====================================================
CREATE TRIGGER update_cooperatives_updated_at BEFORE UPDATE ON public.cooperatives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_farm_tourism_listings_updated_at BEFORE UPDATE ON public.farm_tourism_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_farm_tourism_bookings_updated_at BEFORE UPDATE ON public.farm_tourism_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_batch_tracking_updated_at BEFORE UPDATE ON public.batch_tracking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contract_farming_updated_at BEFORE UPDATE ON public.contract_farming_agreements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_farmer_networks_updated_at BEFORE UPDATE ON public.farmer_networks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_farmer_success_stories_updated_at BEFORE UPDATE ON public.farmer_success_stories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON public.recipes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON public.workshops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_processing_facilities_updated_at BEFORE UPDATE ON public.processing_facilities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_imperfect_produce_updated_at BEFORE UPDATE ON public.imperfect_produce FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_buy_requests_updated_at BEFORE UPDATE ON public.buy_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON public.product_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quality_control_discussions_updated_at BEFORE UPDATE ON public.quality_control_discussions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stakeholder_profiles_updated_at BEFORE UPDATE ON public.stakeholder_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reverse_auctions_updated_at BEFORE UPDATE ON public.reverse_auctions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_road_markets_updated_at BEFORE UPDATE ON public.road_markets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_road_market_products_updated_at BEFORE UPDATE ON public.road_market_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();