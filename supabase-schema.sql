-- YC Startup School Bangalore — Supabase Schema
-- Fully idempotent: safe to re-run on existing databases

-- Tables
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
  featured boolean default false,
  profile_photo_url text,
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
  featured boolean default false,
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

-- Add new columns to existing tables (safe to run even if column exists)
alter table founders add column if not exists featured boolean default false;
alter table founders add column if not exists profile_photo_url text;
alter table showcases add column if not exists featured boolean default false;

-- Enable Row Level Security
alter table founders enable row level security;
alter table showcases enable row level security;
alter table connections enable row level security;
alter table meetup_requests enable row level security;
alter table event_pins enable row level security;

-- Policies (drop first so re-running doesn't error)
drop policy if exists "Public read founders" on founders;
drop policy if exists "Insert own founder" on founders;
drop policy if exists "Update own founder" on founders;
drop policy if exists "Delete own founder" on founders;

create policy "Public read founders" on founders for select using (true);
create policy "Insert own founder" on founders for insert with check (true);
create policy "Update own founder" on founders for update using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');
create policy "Delete own founder" on founders for delete using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

drop policy if exists "Public read showcases" on showcases;
drop policy if exists "Insert own showcase" on showcases;
drop policy if exists "Update own showcase" on showcases;
drop policy if exists "Delete own showcase" on showcases;

create policy "Public read showcases" on showcases for select using (true);
create policy "Insert own showcase" on showcases for insert with check (true);
create policy "Update own showcase" on showcases for update using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');
create policy "Delete own showcase" on showcases for delete using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

drop policy if exists "Own connections only" on connections;
create policy "Own connections only" on connections for all using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

drop policy if exists "Public read meetup_requests" on meetup_requests;
drop policy if exists "Insert own meetup_request" on meetup_requests;
drop policy if exists "Delete own meetup_request" on meetup_requests;

create policy "Public read meetup_requests" on meetup_requests for select using (true);
create policy "Insert own meetup_request" on meetup_requests for insert with check (true);
create policy "Delete own meetup_request" on meetup_requests for delete using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

drop policy if exists "Public read event_pins" on event_pins;
drop policy if exists "Insert own event_pin" on event_pins;
drop policy if exists "Delete own event_pin" on event_pins;

create policy "Public read event_pins" on event_pins for select using (true);
create policy "Insert own event_pin" on event_pins for insert with check (true);
create policy "Delete own event_pin" on event_pins for delete using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');
