
-- Migration to create the applications table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  full_name text not null,
  category text not null,
  sub_category text,
  city text,
  phone text not null,
  socials text,
  accept_videos boolean default false,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table public.applications enable row level security;

drop policy if exists "applications_select_own" on public.applications;
create policy "applications_select_own"
on public.applications
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "applications_insert_own" on public.applications;
create policy "applications_insert_own"
on public.applications
for insert
to authenticated
with check (auth.uid() = user_id);
