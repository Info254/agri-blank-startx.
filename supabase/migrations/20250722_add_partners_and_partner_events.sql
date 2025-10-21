-- Partners table
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  company_name text not null,
  contact_email text not null,
  contact_phone text,
  website text,
  description text,
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Partner Events table
create table if not exists partner_events (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references partners(id) on delete cascade,
  title text not null,
  description text,
  event_date date,
  location text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for partners
alter table partners enable row level security;
create policy "Partners: Only owner can view/edit" on partners
  for all using (auth.uid() = user_id);

-- RLS for partner_events
alter table partner_events enable row level security;
create policy "Partner Events: Only partner owner can view/edit" on partner_events
  for all using (
    exists (select 1 from partners p where p.id = partner_id and p.user_id = auth.uid())
  );
