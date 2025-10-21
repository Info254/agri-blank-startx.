-- Create comprehensive RLS policies for SokoConnect

-- Profiles policies
CREATE POLICY "Users can view all public profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Farms policies  
CREATE POLICY "Users can view all farms" ON public.farms
  FOR SELECT USING (true);

CREATE POLICY "Farmers can insert their own farms" ON public.farms
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own farms" ON public.farms
  FOR UPDATE USING (auth.uid() = farmer_id);

-- Products policies (public data)
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Marketplace listings policies
CREATE POLICY "Users can view active marketplace listings" ON public.marketplace_listings
  FOR SELECT USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "Users can insert their own listings" ON public.marketplace_listings
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own listings" ON public.marketplace_listings
  FOR UPDATE USING (auth.uid() = seller_id);

-- Barter listings policies
CREATE POLICY "Users can view active barter listings" ON public.barter_listings
  FOR SELECT USING (status = 'active' OR user_id = auth.uid());

CREATE POLICY "Users can insert their own barter listings" ON public.barter_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own barter listings" ON public.barter_listings
  FOR UPDATE USING (auth.uid() = user_id);

-- Group input orders policies
CREATE POLICY "Users can view active group orders" ON public.group_input_orders
  FOR SELECT USING (status = 'active' OR organizer_id = auth.uid());

CREATE POLICY "Users can create group orders" ON public.group_input_orders
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their group orders" ON public.group_input_orders
  FOR UPDATE USING (auth.uid() = organizer_id);

-- Group order participants policies
CREATE POLICY "Users can view participants of orders they're involved in" ON public.group_order_participants
  FOR SELECT USING (
    participant_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.group_input_orders WHERE id = order_id AND organizer_id = auth.uid())
  );

CREATE POLICY "Users can join group orders" ON public.group_order_participants
  FOR INSERT WITH CHECK (auth.uid() = participant_id);

-- Price trends policies (public data)
CREATE POLICY "Anyone can view price trends" ON public.price_trends
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert price trends" ON public.price_trends
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- My trades policies
CREATE POLICY "Users can view their own trades" ON public.my_trades
  FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can insert trades they're involved in" ON public.my_trades
  FOR INSERT WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can update trades they're involved in" ON public.my_trades
  FOR UPDATE USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Transportation requests policies
CREATE POLICY "Users can view relevant transport requests" ON public.transportation_requests
  FOR SELECT USING (
    requester_id = auth.uid() OR 
    transporter_id = auth.uid() OR 
    (status = 'open' AND transporter_id IS NULL)
  );

CREATE POLICY "Users can create transport requests" ON public.transportation_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update transport requests they're involved in" ON public.transportation_requests
  FOR UPDATE USING (requester_id = auth.uid() OR transporter_id = auth.uid());

-- Service providers policies
CREATE POLICY "Anyone can view service providers" ON public.service_providers
  FOR SELECT USING (true);

CREATE POLICY "Users can create their service provider profile" ON public.service_providers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their service provider profile" ON public.service_providers
  FOR UPDATE USING (auth.uid() = user_id);

-- Training events policies
CREATE POLICY "Anyone can view training events" ON public.training_events
  FOR SELECT USING (true);

CREATE POLICY "Users can create training events" ON public.training_events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their training events" ON public.training_events
  FOR UPDATE USING (auth.uid() = organizer_id);

-- Food rescue listings policies
CREATE POLICY "Users can view available food rescue listings" ON public.food_rescue_listings
  FOR SELECT USING (status = 'available' OR donor_id = auth.uid());

CREATE POLICY "Users can create food rescue listings" ON public.food_rescue_listings
  FOR INSERT WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update their food rescue listings" ON public.food_rescue_listings
  FOR UPDATE USING (auth.uid() = donor_id);

-- Community posts policies
CREATE POLICY "Anyone can view active community posts" ON public.community_posts
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create community posts" ON public.community_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their community posts" ON public.community_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Community comments policies
CREATE POLICY "Anyone can view comments on active posts" ON public.community_comments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.community_posts WHERE id = post_id AND status = 'active')
  );

CREATE POLICY "Users can create comments" ON public.community_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their comments" ON public.community_comments
  FOR UPDATE USING (auth.uid() = author_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all relevant tables
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