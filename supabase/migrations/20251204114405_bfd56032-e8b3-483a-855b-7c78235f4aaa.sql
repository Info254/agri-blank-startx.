-- Create partner_events table for partner dashboard
CREATE TABLE IF NOT EXISTS public.partner_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_events ENABLE ROW LEVEL SECURITY;

-- Policies for partner_events
CREATE POLICY "Anyone can view events" ON public.partner_events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON public.partner_events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own events" ON public.partner_events FOR UPDATE USING (auth.uid() = partner_id);
CREATE POLICY "Users can delete their own events" ON public.partner_events FOR DELETE USING (auth.uid() = partner_id);

-- Trigger for updated_at
CREATE TRIGGER update_partner_events_updated_at
BEFORE UPDATE ON public.partner_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create partners table if not exists
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  logo_url TEXT,
  website TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for partners
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Policies for partners
CREATE POLICY "Anyone can view partners" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create partner profile" ON public.partners FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own partner profile" ON public.partners FOR UPDATE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();