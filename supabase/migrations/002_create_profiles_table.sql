
-- Create a table for public profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  title text,
  description text,
  city text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, title, description, city)
  values (new.id, null, 'Mon Espace Talent', 'Décrivez votre talent ici.', 'Votre ville');
  return new;
end;
$$;

-- Drop trigger if exists, then create
drop trigger if exists on_auth_user_created_create_profile on auth.users;
create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();

-- Set up Storage!
insert into storage.buckets (id, name, public)
  values ('profile-avatars', 'profile-avatars', true)
  on conflict (id) do nothing;

-- Set up access controls for storage
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'profile-avatars' );

drop policy if exists "Anyone can upload an avatar." on storage.objects;
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'profile-avatars' );

drop policy if exists "Anyone can update their own avatar." on storage.objects;
create policy "Anyone can update their own avatar."
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'profile-avatars' );

drop policy if exists "Anyone can delete their own avatar." on storage.objects;
create policy "Anyone can delete their own avatar."
  on storage.objects for delete
  using ( bucket_id = 'profile-avatars' and auth.uid() = owner );
