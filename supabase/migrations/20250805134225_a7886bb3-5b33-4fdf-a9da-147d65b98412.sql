-- Security Fix Phase 1: Add missing RLS policies for critical tables

-- Create security definer function for role checking to prevent recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Add RLS policies for animals table
CREATE POLICY "Users can manage their own animals" 
ON public.animals 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for farmer_contract_members table
CREATE POLICY "Contract members can view their memberships" 
ON public.farmer_contract_members 
FOR SELECT 
USING (auth.uid() = farmer_id);

CREATE POLICY "Contract members can join contracts" 
ON public.farmer_contract_members 
FOR INSERT 
WITH CHECK (auth.uid() = farmer_id);

-- Add RLS policies for export_documentation table
CREATE POLICY "Users can manage export documentation" 
ON public.export_documentation 
FOR ALL 
USING (auth.uid() = uploaded_by)
WITH CHECK (auth.uid() = uploaded_by);

-- Add RLS policies for export_opportunities table  
CREATE POLICY "Anyone can view export opportunities" 
ON public.export_opportunities 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage export opportunities" 
ON public.export_opportunities 
FOR ALL 
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

-- Add RLS policies for farmer_consolidations table
CREATE POLICY "Consolidators can manage their consolidations" 
ON public.farmer_consolidations 
FOR ALL 
USING (auth.uid() = consolidator_id OR auth.uid() = ANY(farmer_ids))
WITH CHECK (auth.uid() = consolidator_id);

-- Add RLS policies for collaboration_proposals table
CREATE POLICY "Exporters can create proposals" 
ON public.collaboration_proposals 
FOR INSERT 
WITH CHECK (auth.uid() = exporter_id);

CREATE POLICY "Exporters can view their proposals" 
ON public.collaboration_proposals 
FOR SELECT 
USING (auth.uid() = exporter_id);

CREATE POLICY "Exporters can update their proposals" 
ON public.collaboration_proposals 
FOR UPDATE 
USING (auth.uid() = exporter_id);

-- Add INSERT policy for profiles table (critical security fix)
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Add admin policies where needed
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'admin' OR auth.uid() = id);

CREATE POLICY "Admins can manage user notifications" 
ON public.user_notifications 
FOR ALL 
USING (public.get_current_user_role() = 'admin' OR auth.uid() = user_id)
WITH CHECK (public.get_current_user_role() = 'admin');

-- Update notification preferences policies to allow creation
CREATE POLICY "Users can create notification preferences" 
ON public.user_notification_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Prevent users from updating their own role (security fix)
CREATE POLICY "Users cannot change their own role" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  CASE 
    WHEN OLD.role IS DISTINCT FROM NEW.role THEN 
      public.get_current_user_role() = 'admin'
    ELSE true
  END
);

-- Add bulk order bids view policy
CREATE POLICY "Users can view relevant bulk order bids" 
ON public.bulk_order_bids 
FOR SELECT 
USING (
  auth.uid() = farmer_id OR 
  EXISTS (
    SELECT 1 FROM public.bulk_orders 
    WHERE id = order_id AND buyer_id = auth.uid()
  )
);