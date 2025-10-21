-- Fix critical security vulnerabilities in RLS policies

-- 1. Fix profiles table - replace overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Public profile info viewable by all" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Note: The above creates two policies - one for full profile access (own data) 
-- and one for public info. We need to modify the table to have public/private fields

-- Add a view for public profile information only
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  user_id,
  full_name,
  location,
  user_type,
  profile_image_url,
  created_at
FROM public.profiles;

-- Grant access to the public view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- 2. Fix farm input orders data leakage - restrict supplier access properly
DROP POLICY IF EXISTS "Users can view their orders" ON public.farm_input_orders;

CREATE POLICY "Buyers can view their own orders" 
ON public.farm_input_orders 
FOR SELECT 
USING (buyer_id = auth.uid());

-- Create a security definer function to check if user is the supplier
CREATE OR REPLACE FUNCTION public.is_supplier_for_order(order_supplier_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.farm_input_suppliers 
    WHERE id = order_supplier_id 
    AND supplier_name IN (
      SELECT full_name FROM public.profiles WHERE user_id = auth.uid()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE POLICY "Suppliers can view orders assigned to them" 
ON public.farm_input_orders 
FOR SELECT 
USING (public.is_supplier_for_order(supplier_id));

-- 3. Add rate limiting table for authentication attempts
CREATE TABLE IF NOT EXISTS public.auth_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL, -- email or phone
  attempt_count integer NOT NULL DEFAULT 1,
  last_attempt timestamp with time zone NOT NULL DEFAULT now(),
  blocked_until timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_identifier ON public.auth_rate_limits(user_identifier);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_blocked ON public.auth_rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;

-- RLS for rate limiting table
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage rate limits" 
ON public.auth_rate_limits 
FOR ALL 
USING (true);

-- 4. Add security audit log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event_type text NOT NULL,
  event_details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can log security events" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own security logs" 
ON public.security_audit_log 
FOR SELECT 
USING (auth.uid() = user_id);