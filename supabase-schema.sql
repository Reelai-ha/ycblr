-- YC Startup School Bangalore — Supabase Schema
-- Run this in your Supabase SQL editor

create table if not exists founders (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  name text not null,
  company text not null,
  tagline text,
  description text,
  website text,
  twitter text,
  category text default 'Other',
  created_at timestamptz default now()
);

create table if not exists showcases (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  product_name text not null,
  tagline text,
  description text,
  website text not null,
  category text default 'Other',
  logo_url text,
  upvotes int default 0,
  created_at timestamptz default now()
);

create table if not exists connections (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  name text not null,
  company text,
  notes text,
  twitter text,
  email text,
  created_at timestamptz default now()
);

create table if not exists meetup_requests (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  name text not null,
  company text,
  category text default 'Other',
  message text not null,
  location text not null,
  time_slot text not null,
  created_at timestamptz default now()
);

create table if not exists event_pins (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  name text not null,
  title text not null,
  location_key text not null,
  time_slot text not null,
  attendee_count int default 1,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table founders enable row level security;
alter table showcases enable row level security;
alter table connections enable row level security;

-- Founders: anyone can read, only owner can insert/update/delete
create policy "Public read founders" on founders for select using (true);
create policy "Insert own founder" on founders for insert with check (true);
create policy "Update own founder" on founders for update using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');
create policy "Delete own founder" on founders for delete using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Showcases: anyone can read, owner manages their own
create policy "Public read showcases" on showcases for select using (true);
create policy "Insert own showcase" on showcases for insert with check (true);
create policy "Update own showcase" on showcases for update using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');
create policy "Delete own showcase" on showcases for delete using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Connections: fully private — only owner can access
create policy "Own connections only" on connections for all using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

alter table meetup_requests enable row level security;
alter table event_pins enable row level security;

create policy "Public read meetup_requests" on meetup_requests for select using (true);
create policy "Insert own meetup_request" on meetup_requests for insert with check (true);
create policy "Delete own meetup_request" on meetup_requests for delete using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Public read event_pins" on event_pins for select using (true);
create policy "Insert own event_pin" on event_pins for insert with check (true);
create policy "Delete own event_pin" on event_pins for delete using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');
