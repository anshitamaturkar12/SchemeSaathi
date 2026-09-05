-- ==============================================================================
-- SchemeSaathi Production Database Migration for Supabase
-- ==============================================================================

-- 1. Create PROFILES table
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  full_name text not null,
  username text unique not null,
  email text not null,
  phone text,
  date_of_birth text,
  gender text,
  state text,
  city text,
  occupation text,
  annual_income numeric,
  social_category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create SCHEME_ACTIVITY table
create table if not exists public.scheme_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scheme_id text not null,
  scheme_name text not null,
  activity_type text not null check (activity_type in ('VIEWED', 'SAVED', 'APPLIED', 'PROFILE_UPDATED')),
  status text, -- e.g. 'interested', 'documents_needed', 'ready_to_apply', 'applied'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Indexes for High Performance
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_scheme_activity_user_id on public.scheme_activity(user_id);
create index if not exists idx_scheme_activity_scheme_id on public.scheme_activity(scheme_id);
create index if not exists idx_scheme_activity_created_at on public.scheme_activity(created_at desc);

-- 4. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.scheme_activity enable row level security;

-- 5. Row Level Security Policies for PROFILES
-- Users can only read their own profile
create policy "Profiles select own"
  on public.profiles for select
  using (auth.uid() = user_id);

-- Users can only insert their own profile
create policy "Profiles insert own"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- Users can only update their own profile
create policy "Profiles update own"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. Row Level Security Policies for SCHEME_ACTIVITY
-- Users can only view their own activity
create policy "Scheme activity select own"
  on public.scheme_activity for select
  using (auth.uid() = user_id);

-- Users can only insert their own activity
create policy "Scheme activity insert own"
  on public.scheme_activity for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own activity (e.g. un-save or remove)
create policy "Scheme activity delete own"
  on public.scheme_activity for delete
  using (auth.uid() = user_id);

-- 7. Automatic Trigger to create Profile on User Sign Up in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    user_id,
    full_name,
    username,
    email,
    state,
    occupation
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Citizen User'),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'state', 'Maharashtra'),
    coalesce(new.raw_user_meta_data->>'occupation', 'student')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if already exists then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
