-- Add RLS policies for new tables

-- Input Pricing Verification policies
CREATE POLICY "Users can view input pricing verifications" ON public.input_pricing_verification
  FOR SELECT USING (true);

CREATE POLICY "Users can submit input pricing verifications" ON public.input_pricing_verification
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pricing verifications" ON public.input_pricing_verification
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = verifier_id);

-- Reverse Bulk Auctions policies
CREATE POLICY "Users can view active reverse auctions" ON public.reverse_bulk_auctions
  FOR SELECT USING (status = 'active' OR buyer_id = auth.uid());

CREATE POLICY "Users can create reverse auctions" ON public.reverse_bulk_auctions
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update their auctions" ON public.reverse_bulk_auctions
  FOR UPDATE USING (auth.uid() = buyer_id);

-- City Markets policies (public data)
CREATE POLICY "Anyone can view city markets" ON public.city_markets
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert city markets" ON public.city_markets
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Recipients policies
CREATE POLICY "Anyone can view verified recipients" ON public.recipients
  FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Authenticated users can register as recipients" ON public.recipients
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Input Supplier Reviews policies
CREATE POLICY "Anyone can view supplier reviews" ON public.input_supplier_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create supplier reviews" ON public.input_supplier_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can update their reviews" ON public.input_supplier_reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- Food Rescue Matches policies
CREATE POLICY "Users can view relevant rescue matches" ON public.food_rescue_matches
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.food_rescue_listings WHERE id = listing_id AND donor_id = auth.uid())
  );

CREATE POLICY "System can create rescue matches" ON public.food_rescue_matches
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Involved parties can update matches" ON public.food_rescue_matches
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.food_rescue_listings WHERE id = listing_id AND donor_id = auth.uid())
  );

-- Donations policies
CREATE POLICY "Users can view relevant donations" ON public.donations
  FOR SELECT USING (donor_id = auth.uid());

CREATE POLICY "Users can create donations" ON public.donations
  FOR INSERT WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update their donations" ON public.donations
  FOR UPDATE USING (auth.uid() = donor_id);

-- Donation Requests policies
CREATE POLICY "Anyone can view open donation requests" ON public.donation_requests
  FOR SELECT USING (status = 'open');

CREATE POLICY "Recipients can create donation requests" ON public.donation_requests
  FOR INSERT WITH CHECK (true);

-- Warehouses policies (public data)
CREATE POLICY "Anyone can view active warehouses" ON public.warehouses
  FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can add warehouses" ON public.warehouses
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Warehouse Bookings policies
CREATE POLICY "Users can view their warehouse bookings" ON public.warehouse_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create warehouse bookings" ON public.warehouse_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their warehouse bookings" ON public.warehouse_bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Success Stories policies
CREATE POLICY "Anyone can view published success stories" ON public.success_stories
  FOR SELECT USING (is_published = true OR author_id = auth.uid());

CREATE POLICY "Users can create success stories" ON public.success_stories
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their success stories" ON public.success_stories
  FOR UPDATE USING (auth.uid() = author_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can update their reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- App Settings policies
CREATE POLICY "Users can view their own app settings" ON public.app_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their app settings" ON public.app_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their app settings" ON public.app_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Add updated_at triggers for new tables
CREATE TRIGGER update_input_pricing_verification_updated_at
  BEFORE UPDATE ON public.input_pricing_verification
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reverse_bulk_auctions_updated_at
  BEFORE UPDATE ON public.reverse_bulk_auctions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_city_markets_updated_at
  BEFORE UPDATE ON public.city_markets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recipients_updated_at
  BEFORE UPDATE ON public.recipients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_input_supplier_reviews_updated_at
  BEFORE UPDATE ON public.input_supplier_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_rescue_matches_updated_at
  BEFORE UPDATE ON public.food_rescue_matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donation_requests_updated_at
  BEFORE UPDATE ON public.donation_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at
  BEFORE UPDATE ON public.warehouses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_warehouse_bookings_updated_at
  BEFORE UPDATE ON public.warehouse_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_success_stories_updated_at
  BEFORE UPDATE ON public.success_stories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();