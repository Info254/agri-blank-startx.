-- ============================================
-- 1️⃣ DEVELOPER & API MANAGEMENT TABLES
-- ============================================

-- API Keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  key_name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_preview TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'developer', 'enterprise')),
  rate_limit_per_minute INTEGER DEFAULT 100,
  monthly_request_limit INTEGER DEFAULT 1000,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- API Usage Logs table
CREATE TABLE IF NOT EXISTS public.api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- API Endpoints table
CREATE TABLE IF NOT EXISTS public.api_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_path TEXT NOT NULL UNIQUE,
  method TEXT NOT NULL,
  version TEXT DEFAULT 'v1',
  description TEXT,
  required_tier TEXT DEFAULT 'free' CHECK (required_tier IN ('free', 'developer', 'enterprise')),
  is_active BOOLEAN DEFAULT true,
  documentation_url TEXT,
  parameters JSONB,
  example_request JSONB,
  example_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Webhooks table
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  webhook_url TEXT NOT NULL,
  event_types TEXT[] NOT NULL,
  secret_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- API Pricing Plans table
CREATE TABLE IF NOT EXISTS public.api_pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'developer', 'enterprise')),
  monthly_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  rate_limit_per_minute INTEGER NOT NULL,
  monthly_request_limit INTEGER NOT NULL,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 2️⃣ AUTHENTICATION & ACCESS TABLES
-- ============================================

-- OAuth Clients table
CREATE TABLE IF NOT EXISTS public.oauth_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id TEXT NOT NULL UNIQUE,
  client_secret_hash TEXT NOT NULL,
  client_name TEXT NOT NULL,
  redirect_uris TEXT[] NOT NULL,
  allowed_scopes TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Developer Accounts table
CREATE TABLE IF NOT EXISTS public.developer_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT,
  company_registration TEXT,
  contact_person TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website_url TEXT,
  api_tier TEXT DEFAULT 'free' CHECK (api_tier IN ('free', 'developer', 'enterprise')),
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  total_api_calls INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 3️⃣ DATA SYNC & INTEGRATION TABLES
-- ============================================

-- Data Sync Jobs table
CREATE TABLE IF NOT EXISTS public.data_sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  source_system TEXT NOT NULL,
  target_system TEXT NOT NULL,
  sync_type TEXT CHECK (sync_type IN ('full', 'incremental', 'real-time')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  records_processed INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Integration Partners table
CREATE TABLE IF NOT EXISTS public.integration_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  partner_type TEXT CHECK (partner_type IN ('api_consumer', 'data_provider', 'service_partner')),
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  integration_status TEXT DEFAULT 'active' CHECK (integration_status IN ('active', 'suspended', 'terminated')),
  contract_start_date DATE,
  contract_end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 4️⃣ ANALYTICS & BILLING TABLES
-- ============================================

-- API Billing Records table
CREATE TABLE IF NOT EXISTS public.api_billing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  total_api_calls INTEGER NOT NULL DEFAULT 0,
  billable_calls INTEGER NOT NULL DEFAULT 0,
  amount_due NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')),
  invoice_number TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Developer Payments table
CREATE TABLE IF NOT EXISTS public.developer_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  billing_record_id UUID REFERENCES public.api_billing_records(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  payment_method TEXT,
  transaction_id TEXT UNIQUE,
  payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('completed', 'pending', 'failed', 'refunded')),
  payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 5️⃣ ERROR HANDLING & DEBUGGING TABLES
-- ============================================

-- Error Logs table
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,
  error_code TEXT,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,
  endpoint TEXT,
  request_payload JSONB,
  severity TEXT DEFAULT 'error' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rate Limit Logs table
CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  limit_type TEXT CHECK (limit_type IN ('per_minute', 'per_hour', 'per_day', 'per_month')),
  limit_value INTEGER NOT NULL,
  current_count INTEGER NOT NULL,
  exceeded_by INTEGER,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 6️⃣ DOCUMENTATION & SUPPORT TABLES
-- ============================================

-- API Docs table
CREATE TABLE IF NOT EXISTS public.api_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID REFERENCES public.api_endpoints(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  version TEXT DEFAULT 'v1',
  is_published BOOLEAN DEFAULT true,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Developer Tickets table
CREATE TABLE IF NOT EXISTS public.developer_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('bug', 'feature_request', 'api_question', 'billing', 'other')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_response', 'resolved', 'closed')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 7️⃣ GOVERNANCE & COMPLIANCE TABLES
-- ============================================

-- API Audit Trails table
CREATE TABLE IF NOT EXISTS public.api_audit_trails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GDPR Requests table
CREATE TABLE IF NOT EXISTS public.gdpr_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('data_export', 'data_deletion', 'data_correction')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  requested_data JSONB,
  processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  processed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ⚙️ OPTIONAL BUT RECOMMENDED TABLES
-- ============================================

-- API Response Times table
CREATE TABLE IF NOT EXISTS public.api_response_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  response_time_ms INTEGER NOT NULL,
  status_code INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Affiliate Referrals table
CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  conversion_status TEXT DEFAULT 'pending' CHECK (conversion_status IN ('pending', 'converted', 'expired')),
  commission_amount NUMERIC(10,2),
  commission_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  converted_at TIMESTAMPTZ
);

-- Developer Forum Posts table
CREATE TABLE IF NOT EXISTS public.developer_forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_post_id UUID REFERENCES public.developer_forum_posts(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  upvotes INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_answered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- API Keys indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON public.api_keys(is_active);

-- API Usage Logs indexes
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_api_key_id ON public.api_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_user_id ON public.api_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON public.api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_endpoint ON public.api_usage_logs(endpoint);

-- API Endpoints indexes
CREATE INDEX IF NOT EXISTS idx_api_endpoints_is_active ON public.api_endpoints(is_active);
CREATE INDEX IF NOT EXISTS idx_api_endpoints_version ON public.api_endpoints(version);

-- Webhooks indexes
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON public.webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_is_active ON public.webhooks(is_active);

-- Developer Accounts indexes
CREATE INDEX IF NOT EXISTS idx_developer_accounts_user_id ON public.developer_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_developer_accounts_api_tier ON public.developer_accounts(api_tier);

-- Billing Records indexes
CREATE INDEX IF NOT EXISTS idx_api_billing_records_user_id ON public.api_billing_records(user_id);
CREATE INDEX IF NOT EXISTS idx_api_billing_records_payment_status ON public.api_billing_records(payment_status);

-- Error Logs indexes
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON public.error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_is_resolved ON public.error_logs(is_resolved);

-- Developer Tickets indexes
CREATE INDEX IF NOT EXISTS idx_developer_tickets_user_id ON public.developer_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_developer_tickets_status ON public.developer_tickets(status);

-- API Response Times indexes
CREATE INDEX IF NOT EXISTS idx_api_response_times_endpoint ON public.api_response_times(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_response_times_timestamp ON public.api_response_times(timestamp);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_audit_trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_response_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_forum_posts ENABLE ROW LEVEL SECURITY;

-- API Keys policies
CREATE POLICY "Users can view own API keys" ON public.api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own API keys" ON public.api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own API keys" ON public.api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own API keys" ON public.api_keys FOR DELETE USING (auth.uid() = user_id);

-- API Usage Logs policies
CREATE POLICY "Users can view own usage logs" ON public.api_usage_logs FOR SELECT USING (auth.uid() = user_id);

-- API Endpoints policies (public read)
CREATE POLICY "Anyone can view active endpoints" ON public.api_endpoints FOR SELECT USING (is_active = true);

-- Webhooks policies
CREATE POLICY "Users can manage own webhooks" ON public.webhooks FOR ALL USING (auth.uid() = user_id);

-- API Pricing Plans policies (public read)
CREATE POLICY "Anyone can view active plans" ON public.api_pricing_plans FOR SELECT USING (is_active = true);

-- OAuth Clients policies
CREATE POLICY "Users can manage own OAuth clients" ON public.oauth_clients FOR ALL USING (auth.uid() = user_id);

-- Developer Accounts policies
CREATE POLICY "Users can view own developer account" ON public.developer_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own developer account" ON public.developer_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own developer account" ON public.developer_accounts FOR UPDATE USING (auth.uid() = user_id);

-- API Billing Records policies
CREATE POLICY "Users can view own billing records" ON public.api_billing_records FOR SELECT USING (auth.uid() = user_id);

-- Developer Payments policies
CREATE POLICY "Users can view own payments" ON public.developer_payments FOR SELECT USING (auth.uid() = user_id);

-- Error Logs policies
CREATE POLICY "Users can view own error logs" ON public.error_logs FOR SELECT USING (auth.uid() = user_id);

-- Rate Limit Logs policies
CREATE POLICY "Users can view own rate limit logs" ON public.rate_limit_logs FOR SELECT USING (auth.uid() = user_id);

-- API Docs policies (public read)
CREATE POLICY "Anyone can view published docs" ON public.api_docs FOR SELECT USING (is_published = true);

-- Developer Tickets policies
CREATE POLICY "Users can view own tickets" ON public.developer_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON public.developer_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON public.developer_tickets FOR UPDATE USING (auth.uid() = user_id);

-- GDPR Requests policies
CREATE POLICY "Users can view own GDPR requests" ON public.gdpr_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own GDPR requests" ON public.gdpr_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Affiliate Referrals policies
CREATE POLICY "Users can view own referrals" ON public.affiliate_referrals FOR SELECT USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);
CREATE POLICY "Users can create referrals" ON public.affiliate_referrals FOR INSERT WITH CHECK (auth.uid() = referrer_user_id);

-- Developer Forum Posts policies
CREATE POLICY "Anyone can view forum posts" ON public.developer_forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can create forum posts" ON public.developer_forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own forum posts" ON public.developer_forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own forum posts" ON public.developer_forum_posts FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON public.api_keys FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_api_endpoints_updated_at BEFORE UPDATE ON public.api_endpoints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON public.webhooks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_api_pricing_plans_updated_at BEFORE UPDATE ON public.api_pricing_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_oauth_clients_updated_at BEFORE UPDATE ON public.oauth_clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_developer_accounts_updated_at BEFORE UPDATE ON public.developer_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_integration_partners_updated_at BEFORE UPDATE ON public.integration_partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_api_billing_records_updated_at BEFORE UPDATE ON public.api_billing_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_api_docs_updated_at BEFORE UPDATE ON public.api_docs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_developer_tickets_updated_at BEFORE UPDATE ON public.developer_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gdpr_requests_updated_at BEFORE UPDATE ON public.gdpr_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_developer_forum_posts_updated_at BEFORE UPDATE ON public.developer_forum_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();