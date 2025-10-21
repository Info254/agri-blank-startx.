-- Ensure all required tables exist with comprehensive structure

-- 1. F2C Subscription Boxes Tables
CREATE TABLE IF NOT EXISTS public.subscription_boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farmer_id uuid REFERENCES auth.users(id),
  box_type text NOT NULL,
  frequency text NOT NULL,
  duration_months integer NOT NULL,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscription_box_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id uuid NOT NULL REFERENCES public.subscription_boxes(id) ON DELETE CASCADE,
  delivery_date date NOT NULL,
  delivered boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Export Opportunities / Market Linkages Table (comprehensive)
CREATE TABLE IF NOT EXISTS public.market_linkages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  linkage_type text NOT NULL CHECK (linkage_type IN ('buyer_seller', 'contract_farming', 'cooperative', 'export_opportunity', 'processing_partnership')),
  crops_involved text[] DEFAULT '{}',
  counties text[] DEFAULT '{}',
  requirements text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  contact_info text NOT NULL,
  application_deadline date,
  start_date date,
  duration_months integer,
  minimum_quantity numeric,
  price_range text,
  max_participants integer,
  participants_count integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'completed')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Bulk Order Bids Table
CREATE TABLE IF NOT EXISTS public.bulk_order_bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.bulk_orders(id) ON DELETE CASCADE,
  bidder_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bid_price numeric NOT NULL,
  quantity numeric NOT NULL,
  delivery_terms text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. Reverse Auction Bids Table
CREATE TABLE IF NOT EXISTS public.reverse_auction_bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id uuid NOT NULL REFERENCES public.reverse_bulk_auctions(id) ON DELETE CASCADE,
  bidder_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bid_price numeric NOT NULL,
  quantity_offered numeric NOT NULL,
  delivery_timeframe text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.subscription_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_box_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_linkages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_order_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reverse_auction_bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_boxes
CREATE POLICY "Users can view their own subscription boxes" ON public.subscription_boxes
  FOR SELECT USING (auth.uid() = consumer_id OR auth.uid() = farmer_id);

CREATE POLICY "Users can create subscription boxes" ON public.subscription_boxes
  FOR INSERT WITH CHECK (auth.uid() = consumer_id);

CREATE POLICY "Users can update their subscription boxes" ON public.subscription_boxes
  FOR UPDATE USING (auth.uid() = consumer_id OR auth.uid() = farmer_id);

-- RLS Policies for subscription_box_deliveries
CREATE POLICY "Users can view deliveries for their boxes" ON public.subscription_box_deliveries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.subscription_boxes 
      WHERE id = box_id AND (consumer_id = auth.uid() OR farmer_id = auth.uid())
    )
  );

CREATE POLICY "System can create deliveries" ON public.subscription_box_deliveries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update delivery status" ON public.subscription_box_deliveries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.subscription_boxes 
      WHERE id = box_id AND (consumer_id = auth.uid() OR farmer_id = auth.uid())
    )
  );

-- RLS Policies for market_linkages
CREATE POLICY "Anyone can view active market linkages" ON public.market_linkages
  FOR SELECT USING (status = 'active' OR created_by = auth.uid());

CREATE POLICY "Users can create market linkages" ON public.market_linkages
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their linkages" ON public.market_linkages
  FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for bulk_order_bids
CREATE POLICY "Users can view bids for their orders or their own bids" ON public.bulk_order_bids
  FOR SELECT USING (
    auth.uid() = bidder_id OR 
    EXISTS (SELECT 1 FROM public.bulk_orders WHERE id = order_id AND organizer_id = auth.uid())
  );

CREATE POLICY "Users can create bids" ON public.bulk_order_bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);

CREATE POLICY "Bidders can update their bids" ON public.bulk_order_bids
  FOR UPDATE USING (auth.uid() = bidder_id);

-- RLS Policies for reverse_auction_bids
CREATE POLICY "Users can view bids for their auctions or their own bids" ON public.reverse_auction_bids
  FOR SELECT USING (
    auth.uid() = bidder_id OR 
    EXISTS (SELECT 1 FROM public.reverse_bulk_auctions WHERE id = auction_id AND buyer_id = auth.uid())
  );

CREATE POLICY "Users can create bids" ON public.reverse_auction_bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);

CREATE POLICY "Bidders can update their bids" ON public.reverse_auction_bids
  FOR UPDATE USING (auth.uid() = bidder_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscription_boxes_consumer ON public.subscription_boxes(consumer_id);
CREATE INDEX IF NOT EXISTS idx_subscription_boxes_farmer ON public.subscription_boxes(farmer_id);
CREATE INDEX IF NOT EXISTS idx_market_linkages_type ON public.market_linkages(linkage_type);
CREATE INDEX IF NOT EXISTS idx_market_linkages_status ON public.market_linkages(status);
CREATE INDEX IF NOT EXISTS idx_bulk_order_bids_order ON public.bulk_order_bids(order_id);
CREATE INDEX IF NOT EXISTS idx_reverse_auction_bids_auction ON public.reverse_auction_bids(auction_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_subscription_boxes_updated_at ON public.subscription_boxes;
CREATE TRIGGER update_subscription_boxes_updated_at
  BEFORE UPDATE ON public.subscription_boxes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_market_linkages_updated_at ON public.market_linkages;
CREATE TRIGGER update_market_linkages_updated_at
  BEFORE UPDATE ON public.market_linkages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bulk_order_bids_updated_at ON public.bulk_order_bids;
CREATE TRIGGER update_bulk_order_bids_updated_at
  BEFORE UPDATE ON public.bulk_order_bids
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reverse_auction_bids_updated_at ON public.reverse_auction_bids;
CREATE TRIGGER update_reverse_auction_bids_updated_at
  BEFORE UPDATE ON public.reverse_auction_bids
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();