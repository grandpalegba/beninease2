-- Role enum + public.users profile row + trigger: new auth.users -> public.users (candidate)
-- Run in Supabase SQL editor or via `supabase db push` if you use the Supabase CLI.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('admin', 'jury', 'candidate');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'candidate',
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- Read your own row (used by Middleware + Server Components with the user's JWT)
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
on public.users
for select
to authenticated
using (auth.uid() = id);

-- Optional: allow users to update non-privileged fields only (adjust as needed)
-- For real apps, restrict updates to safe columns or handle via admin/service role only.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, role, is_approved)
  values (new.id, 'candidate', false);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
