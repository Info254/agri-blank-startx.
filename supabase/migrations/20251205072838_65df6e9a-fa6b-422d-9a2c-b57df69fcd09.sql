-- Create barter_offers table for barter exchange functionality
CREATE TABLE IF NOT EXISTS public.barter_offers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    offering_product TEXT NOT NULL,
    offering_quantity NUMERIC NOT NULL,
    offering_unit TEXT NOT NULL DEFAULT 'kg',
    seeking_product TEXT NOT NULL,
    seeking_quantity NUMERIC NOT NULL,
    seeking_unit TEXT NOT NULL DEFAULT 'kg',
    location TEXT NOT NULL,
    county TEXT,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.barter_offers ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view active barter offers" ON public.barter_offers
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create own barter offers" ON public.barter_offers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own barter offers" ON public.barter_offers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own barter offers" ON public.barter_offers
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_barter_offers_updated_at
    BEFORE UPDATE ON public.barter_offers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();