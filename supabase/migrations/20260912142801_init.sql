create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null unique,
  password_hash text not null,
  role text not null check (role in ('FARMER','MIDDLEMAN','STORE','ADMIN')),
  name text,
  created_at timestamptz not null default now()
);

create table if not exists public.market_prices (
  id uuid primary key default gen_random_uuid(),
  commodity text not null,
  market text not null,
  price_per_quintal numeric not null,
  distance_km numeric not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.auctions (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references public.users(id),
  commodity text not null,
  quantity_quintals numeric not null,
  base_price numeric,
  type text not null default 'FORWARD',
  expiry_date timestamptz not null,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now()
);

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  bidder_id uuid not null references public.users(id),
  offered_price numeric not null,
  quality_grade text,
  proposed_delivery_date date,
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id),
  seller_id uuid not null references public.users(id),
  buyer_id uuid not null references public.users(id),
  amount numeric not null,
  status text not null default 'PENDING_PAYMENT',
  created_at timestamptz not null default now()
);

create table if not exists public.grievances (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id),
  issue_type text not null,
  description text not null,
  status text not null default 'OPEN',
  resolution_notes text,
  final_status text,
  created_at timestamptz not null default now()
);

insert into public.users (phone_number, password_hash, role, name) values
  ('9876543210', '26c07fc7be1668f8ea7e3801d4ffdbf33de487a593a69028936ec49f2c89f6ab', 'FARMER', 'Demo Farmer'),
  ('9876543211', 'e547bd13228250dfb4c7df1d1ebb78cfd9f2ada56ebb0c425d35829dd3ac4ae8', 'MIDDLEMAN', 'Demo Buyer'),
  ('9876543212', '8b3d9bca7c134a9190277204379941460eb33c39868309401f02fa8e0391d4a7', 'STORE', 'Demo Store'),
  ('9876543213', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'ADMIN', 'Demo Admin');

insert into public.market_prices (commodity, market, price_per_quintal, distance_km) values
  ('Onion', 'Lasalgaon APMC', 2850, 30),
  ('Onion', 'Pimpalgaon APMC', 2790, 45),
  ('Onion', 'Nashik APMC', 2600, 60),
  ('Potato', 'Agra Mandi', 1350, 120),
  ('Potato', 'Kolkata Mandi', 1420, 400),
  ('Potato', 'Delhi Azadpur', 1390, 180),
  ('Tomato', 'Kolar APMC', 1800, 90),
  ('Tomato', 'Bengaluru Hosur', 1750, 140),
  ('Tomato', 'Pune APMC', 1700, 210);

insert into public.auctions (farmer_id, commodity, quantity_quintals, base_price, type, expiry_date, status)
select u.id, 'Onion', 40, 2800, 'FORWARD', now() + interval '7 days', 'ACTIVE'
from public.users u where u.role = 'FARMER' limit 1;

insert into public.auctions (farmer_id, commodity, quantity_quintals, base_price, type, expiry_date, status)
select u.id, 'Potato', 60, 1300, 'SPOT', now() + interval '3 days', 'ACTIVE'
from public.users u where u.role = 'FARMER' limit 1;

insert into public.auctions (farmer_id, commodity, quantity_quintals, base_price, type, expiry_date, status)
select u.id, 'Tomato', 25, 1750, 'FORWARD', now() + interval '10 days', 'ACTIVE'
from public.users u where u.role = 'FARMER' limit 1;