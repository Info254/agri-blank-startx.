-- Fix security definer view issue by removing it and using proper policies instead
DROP VIEW IF EXISTS public.public_profiles;

-- Remove the overly broad second policy that was causing issues
DROP POLICY IF EXISTS "Public profile info viewable by all" ON public.profiles;

-- Keep only the secure policy for own profile access
-- Users can only see their own full profile data

-- For public profile viewing, we'll create a separate endpoint or use joins in application code
-- rather than a security definer view

-- Fix OTP expiry by updating auth configuration (this needs to be done via Supabase dashboard)
-- The warning about OTP expiry needs to be addressed in the Supabase dashboard under Authentication > Settings
-- Reduce the OTP expiry time from current setting to 5-10 minutes maximum