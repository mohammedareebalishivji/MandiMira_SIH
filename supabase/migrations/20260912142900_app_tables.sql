create table if not exists public.farmer_lots (
  id text primary key,
  farmer_name text not null,
  location text not null,
  district text not null,
  crop_name_en text not null,
  crop_type text not null,
  variety text not null,
  quantity_kg integer not null,
  grade text not null,
  harvest_date_days_ago integer not null default 0,
  storage_type text not null,
  storage_available boolean not null default false,
  has_rain_alert boolean not null default false,
  cash_urgency text not null,
  local_mandi_benchmark integer not null,
  owner_phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.sales_transactions (
  id text primary key,
  lot_id text not null,
  crop_name text not null,
  quantity_kg integer not null,
  rate_per_qtl integer not null,
  gross_amount integer not null,
  net_payout integer not null,
  buyer_name text not null,
  date text not null,
  status text not null,
  bank_ref text not null,
  mode text not null,
  owner_phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.grievances_app (
  id text primary key,
  raised_by text not null,
  raised_by_role text not null,
  against text not null,
  category text not null,
  txn_ref text not null,
  amount_disputed integer not null default 0,
  title text not null,
  description text not null,
  filed_on text not null,
  sla_hours integer not null default 48,
  hours_elapsed integer not null default 0,
  status text not null default 'open',
  resolution_note text not null default '',
  owner_phone text,
  created_at timestamptz not null default now()
);

alter table public.farmer_lots enable row level security;
alter table public.sales_transactions enable row level security;
alter table public.grievances_app enable row level security;

drop policy if exists "allow all" on public.farmer_lots;
create policy "allow all" on public.farmer_lots for all using (true) with check (true);

drop policy if exists "allow all" on public.sales_transactions;
create policy "allow all" on public.sales_transactions for all using (true) with check (true);

drop policy if exists "allow all" on public.grievances_app;
create policy "allow all" on public.grievances_app for all using (true) with check (true);
