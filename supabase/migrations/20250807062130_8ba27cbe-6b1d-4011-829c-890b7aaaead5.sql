-- Fix function search path security warnings by properly handling dependencies
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_farms_updated_at ON public.farms;
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS update_marketplace_listings_updated_at ON public.marketplace_listings;
DROP TRIGGER IF EXISTS update_barter_listings_updated_at ON public.barter_listings;
DROP TRIGGER IF EXISTS update_group_input_orders_updated_at ON public.group_input_orders;
DROP TRIGGER IF EXISTS update_my_trades_updated_at ON public.my_trades;
DROP TRIGGER IF EXISTS update_transportation_requests_updated_at ON public.transportation_requests;
DROP TRIGGER IF EXISTS update_service_providers_updated_at ON public.service_providers;
DROP TRIGGER IF EXISTS update_training_events_updated_at ON public.training_events;
DROP TRIGGER IF EXISTS update_food_rescue_listings_updated_at ON public.food_rescue_listings;
DROP TRIGGER IF EXISTS update_community_posts_updated_at ON public.community_posts;
DROP TRIGGER IF EXISTS update_community_comments_updated_at ON public.community_comments;

-- Now drop and recreate functions with proper search path
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Create secure functions with fixed search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Recreate all triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farms_updated_at
  BEFORE UPDATE ON public.farms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_barter_listings_updated_at
  BEFORE UPDATE ON public.barter_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_input_orders_updated_at
  BEFORE UPDATE ON public.group_input_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_my_trades_updated_at
  BEFORE UPDATE ON public.my_trades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transportation_requests_updated_at
  BEFORE UPDATE ON public.transportation_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_providers_updated_at
  BEFORE UPDATE ON public.service_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_events_updated_at
  BEFORE UPDATE ON public.training_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_rescue_listings_updated_at
  BEFORE UPDATE ON public.food_rescue_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at
  BEFORE UPDATE ON public.community_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();