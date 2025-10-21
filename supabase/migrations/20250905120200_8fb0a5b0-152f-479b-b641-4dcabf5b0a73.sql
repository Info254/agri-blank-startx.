-- Create bluetooth marketplace tables for offline price sharing and trader discovery

-- Bluetooth discovered devices table
CREATE TABLE public.bluetooth_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  device_name TEXT,
  user_id UUID REFERENCES auth.users(id),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  signal_strength INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bluetooth shared prices table
CREATE TABLE public.bluetooth_shared_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  commodity TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  market_name TEXT NOT NULL,
  quality_grade TEXT,
  source_type TEXT NOT NULL DEFAULT 'user', -- 'user', 'verified', 'market_data'
  shared_by_device TEXT NOT NULL,
  shared_by_user UUID REFERENCES auth.users(id),
  contact_info TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  verification_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bluetooth marketplace alerts table
CREATE TABLE public.bluetooth_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL, -- 'price_drop', 'price_rise', 'high_demand', 'low_supply', 'buyer_request', 'seller_offer'
  commodity TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  message TEXT NOT NULL,
  threshold_value NUMERIC,
  alert_by_device TEXT NOT NULL,
  alert_by_user UUID REFERENCES auth.users(id),
  contact_info TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '6 hours'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bluetooth traders directory table
CREATE TABLE public.bluetooth_traders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  trader_name TEXT NOT NULL,
  trader_type TEXT NOT NULL, -- 'buyer', 'seller', 'transporter', 'service_provider'
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  commodities TEXT[] DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  contact_info TEXT,
  rating NUMERIC DEFAULT NULL,
  announced_by_user UUID REFERENCES auth.users(id),
  last_announced TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(device_id, trader_type)
);

-- Enable Row Level Security
ALTER TABLE public.bluetooth_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bluetooth_shared_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bluetooth_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bluetooth_traders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bluetooth_devices
CREATE POLICY "Users can view all bluetooth devices" 
ON public.bluetooth_devices FOR SELECT USING (true);

CREATE POLICY "Users can insert their bluetooth devices" 
ON public.bluetooth_devices FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their bluetooth devices" 
ON public.bluetooth_devices FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for bluetooth_shared_prices
CREATE POLICY "Users can view all shared prices" 
ON public.bluetooth_shared_prices FOR SELECT 
USING (expires_at > now());

CREATE POLICY "Users can share prices" 
ON public.bluetooth_shared_prices FOR INSERT 
WITH CHECK (auth.uid() = shared_by_user OR shared_by_user IS NULL);

CREATE POLICY "Users can update their shared prices" 
ON public.bluetooth_shared_prices FOR UPDATE 
USING (auth.uid() = shared_by_user);

-- RLS Policies for bluetooth_alerts
CREATE POLICY "Users can view active alerts" 
ON public.bluetooth_alerts FOR SELECT 
USING (expires_at > now());

CREATE POLICY "Users can create alerts" 
ON public.bluetooth_alerts FOR INSERT 
WITH CHECK (auth.uid() = alert_by_user OR alert_by_user IS NULL);

CREATE POLICY "Users can update their alerts" 
ON public.bluetooth_alerts FOR UPDATE 
USING (auth.uid() = alert_by_user);

-- RLS Policies for bluetooth_traders
CREATE POLICY "Users can view all trader announcements" 
ON public.bluetooth_traders FOR SELECT USING (true);

CREATE POLICY "Users can announce as traders" 
ON public.bluetooth_traders FOR INSERT 
WITH CHECK (auth.uid() = announced_by_user OR announced_by_user IS NULL);

CREATE POLICY "Users can update their trader info" 
ON public.bluetooth_traders FOR UPDATE 
USING (auth.uid() = announced_by_user);

-- Create indexes for better performance
CREATE INDEX idx_bluetooth_devices_device_id ON public.bluetooth_devices(device_id);
CREATE INDEX idx_bluetooth_devices_user_id ON public.bluetooth_devices(user_id);
CREATE INDEX idx_bluetooth_devices_last_seen ON public.bluetooth_devices(last_seen);

CREATE INDEX idx_bluetooth_shared_prices_commodity ON public.bluetooth_shared_prices(commodity);
CREATE INDEX idx_bluetooth_shared_prices_location ON public.bluetooth_shared_prices(location, county);
CREATE INDEX idx_bluetooth_shared_prices_timestamp ON public.bluetooth_shared_prices(timestamp);
CREATE INDEX idx_bluetooth_shared_prices_expires_at ON public.bluetooth_shared_prices(expires_at);

CREATE INDEX idx_bluetooth_alerts_commodity ON public.bluetooth_alerts(commodity);
CREATE INDEX idx_bluetooth_alerts_location ON public.bluetooth_alerts(location, county);
CREATE INDEX idx_bluetooth_alerts_type ON public.bluetooth_alerts(alert_type);
CREATE INDEX idx_bluetooth_alerts_expires_at ON public.bluetooth_alerts(expires_at);

CREATE INDEX idx_bluetooth_traders_device_id ON public.bluetooth_traders(device_id);
CREATE INDEX idx_bluetooth_traders_type ON public.bluetooth_traders(trader_type);
CREATE INDEX idx_bluetooth_traders_location ON public.bluetooth_traders(location, county);
CREATE INDEX idx_bluetooth_traders_commodities ON public.bluetooth_traders USING GIN(commodities);

-- Create function to clean up expired records
CREATE OR REPLACE FUNCTION public.cleanup_expired_bluetooth_data()
RETURNS void AS $$
BEGIN
  -- Delete expired prices
  DELETE FROM public.bluetooth_shared_prices WHERE expires_at < now();
  
  -- Delete expired alerts
  DELETE FROM public.bluetooth_alerts WHERE expires_at < now();
  
  -- Delete inactive devices (not seen for 30 days)
  DELETE FROM public.bluetooth_devices WHERE last_seen < now() - INTERVAL '30 days';
  
  -- Delete old trader announcements (not announced for 7 days)
  DELETE FROM public.bluetooth_traders WHERE last_announced < now() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;