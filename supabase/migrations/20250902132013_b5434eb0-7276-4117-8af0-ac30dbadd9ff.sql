-- Create farm input categories table
CREATE TABLE public.farm_input_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.farm_input_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Anyone can view categories" 
ON public.farm_input_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create categories" 
ON public.farm_input_categories 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create product likes table
CREATE TABLE public.farm_input_product_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS for likes
ALTER TABLE public.farm_input_product_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own likes" 
ON public.farm_input_product_likes 
FOR ALL 
USING (auth.uid() = user_id);

-- Create product ratings table
CREATE TABLE public.farm_input_product_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS for ratings
ALTER TABLE public.farm_input_product_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings" 
ON public.farm_input_product_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own ratings" 
ON public.farm_input_product_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.farm_input_product_ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create supplier likes table
CREATE TABLE public.farm_input_supplier_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  supplier_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, supplier_id)
);

-- Enable RLS for supplier likes
ALTER TABLE public.farm_input_supplier_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their supplier likes" 
ON public.farm_input_supplier_likes 
FOR ALL 
USING (auth.uid() = user_id);

-- Create supplier ratings table
CREATE TABLE public.farm_input_supplier_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  supplier_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, supplier_id)
);

-- Enable RLS for supplier ratings
ALTER TABLE public.farm_input_supplier_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view supplier ratings" 
ON public.farm_input_supplier_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their supplier ratings" 
ON public.farm_input_supplier_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their supplier ratings" 
ON public.farm_input_supplier_ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create product bookmarks table
CREATE TABLE public.farm_input_product_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS for bookmarks
ALTER TABLE public.farm_input_product_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their bookmarks" 
ON public.farm_input_product_bookmarks 
FOR ALL 
USING (auth.uid() = user_id);

-- Create entity flags table (for reporting inappropriate content)
CREATE TABLE public.farm_input_entity_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('supplier', 'product')),
  entity_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_id UUID
);

-- Enable RLS for flags
ALTER TABLE public.farm_input_entity_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create flags" 
ON public.farm_input_entity_flags 
FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reporters can view their flags" 
ON public.farm_input_entity_flags 
FOR SELECT 
USING (auth.uid() = reporter_id);

-- Create ban recommendations table
CREATE TABLE public.farm_input_ban_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('supplier', 'user')),
  entity_id UUID NOT NULL,
  reason TEXT NOT NULL,
  evidence TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_id UUID
);

-- Enable RLS for ban recommendations
ALTER TABLE public.farm_input_ban_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create ban recommendations" 
ON public.farm_input_ban_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reporters can view their recommendations" 
ON public.farm_input_ban_recommendations 
FOR SELECT 
USING (auth.uid() = reporter_id);

-- Create triggers for updated_at
CREATE TRIGGER update_farm_input_categories_updated_at
BEFORE UPDATE ON public.farm_input_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farm_input_product_ratings_updated_at
BEFORE UPDATE ON public.farm_input_product_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farm_input_supplier_ratings_updated_at
BEFORE UPDATE ON public.farm_input_supplier_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();