-- Create cooperative groups table for community farming organizations
CREATE TABLE IF NOT EXISTS public.cooperative_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  group_type TEXT NOT NULL CHECK (group_type IN ('cooperative', 'farmers_group', 'savings_group', 'marketing_group', 'women_group', 'youth_group')),
  registration_number TEXT,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  coordinates JSONB,
  founded_date DATE,
  member_count INTEGER DEFAULT 0,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  bank_account_info JSONB,
  group_leader_id UUID REFERENCES auth.users(id),
  activities TEXT[] DEFAULT '{}',
  crops_traded TEXT[] DEFAULT '{}',
  services_offered TEXT[] DEFAULT '{}',
  membership_fee NUMERIC DEFAULT 0,
  share_value NUMERIC DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending_verification')),
  logo_url TEXT,
  documents JSONB,
  meeting_schedule TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create group members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.cooperative_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_role TEXT DEFAULT 'member' CHECK (member_role IN ('admin', 'treasurer', 'secretary', 'member')),
  shares_owned INTEGER DEFAULT 0,
  join_date DATE DEFAULT CURRENT_DATE,
  membership_status TEXT DEFAULT 'active' CHECK (membership_status IN ('active', 'inactive', 'suspended', 'pending')),
  contribution_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Create group messages table for internal communication
CREATE TABLE IF NOT EXISTS public.group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.cooperative_groups(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'announcement', 'meeting', 'transaction', 'alert')),
  attachments JSONB,
  is_priority BOOLEAN DEFAULT false,
  read_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create group transactions table
CREATE TABLE IF NOT EXISTS public.group_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.cooperative_groups(id) ON DELETE CASCADE,
  member_id UUID REFERENCES auth.users(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('contribution', 'loan', 'dividend', 'purchase', 'sale', 'expense', 'income')),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'KES',
  description TEXT,
  reference_number TEXT,
  approved_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  transaction_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cooperative_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cooperative_groups
CREATE POLICY "Anyone can view active groups"
  ON public.cooperative_groups FOR SELECT
  USING (status = 'active' OR group_leader_id = auth.uid());

CREATE POLICY "Group leaders can update their groups"
  ON public.cooperative_groups FOR UPDATE
  USING (auth.uid() = group_leader_id);

CREATE POLICY "Authenticated users can create groups"
  ON public.cooperative_groups FOR INSERT
  WITH CHECK (auth.uid() = group_leader_id);

-- RLS Policies for group_members
CREATE POLICY "Members can view their group memberships"
  ON public.group_members FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.group_members gm 
    WHERE gm.group_id = group_members.group_id 
    AND gm.user_id = auth.uid() 
    AND gm.member_role IN ('admin', 'treasurer', 'secretary')
  ));

CREATE POLICY "Users can join groups"
  ON public.group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Group admins can update memberships"
  ON public.group_members FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.group_members gm 
    WHERE gm.group_id = group_members.group_id 
    AND gm.user_id = auth.uid() 
    AND gm.member_role = 'admin'
  ));

-- RLS Policies for group_messages
CREATE POLICY "Group members can view messages"
  ON public.group_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_messages.group_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Group members can send messages"
  ON public.group_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_messages.group_id 
    AND user_id = auth.uid()
  ) AND auth.uid() = sender_id);

-- RLS Policies for group_transactions
CREATE POLICY "Group members can view transactions"
  ON public.group_transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = group_transactions.group_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Group admins can manage transactions"
  ON public.group_transactions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.group_members gm 
    WHERE gm.group_id = group_transactions.group_id 
    AND gm.user_id = auth.uid() 
    AND gm.member_role IN ('admin', 'treasurer')
  ));

-- Create updated_at trigger for cooperative_groups
CREATE TRIGGER update_cooperative_groups_updated_at
  BEFORE UPDATE ON public.cooperative_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_messages_group_id ON public.group_messages(group_id);
CREATE INDEX idx_group_transactions_group_id ON public.group_transactions(group_id);