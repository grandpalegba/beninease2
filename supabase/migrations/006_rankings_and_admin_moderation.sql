-- Category rankings + admin-only moderation helpers

create extension if not exists "pgcrypto";

-- Add category to profiles for public rankings (16 categories)
alter table public.profiles
  add column if not exists category text;

create index if not exists profiles_category_idx on public.profiles (category);

-- Ranking view: rank candidates within their own category
create or replace view public.category_rankings as
select
  p.id as candidate_id,
  p.category,
  p.full_name,
  p.avatar_url,
  p.city,
  p.description,
  p.votes_count,
  dense_rank() over (
    partition by p.category
    order by coalesce(p.votes_count, 0) desc, p.updated_at desc, p.id asc
  ) as category_rank
from public.profiles p
where p.type = 'candidate' and p.category is not null;

-- Helper: is current user an admin (based on public.users role)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Admin-only: delete profile + dependent rows (DB only; storage is deleted via client with admin policy)
create or replace function public.admin_delete_profile(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not_admin';
  end if;

  delete from public.votes where candidate_id = p_profile_id;
  delete from public.videos where candidate_id = p_profile_id;
  delete from public.profiles where id = p_profile_id;
end;
$$;

revoke all on function public.admin_delete_profile(uuid) from public;
grant execute on function public.admin_delete_profile(uuid) to authenticated;

-- Admin-only: reset avatar_url
create or replace function public.admin_reset_avatar(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not_admin';
  end if;

  update public.profiles
  set avatar_url = null, updated_at = now()
  where id = p_profile_id;
end;
$$;

revoke all on function public.admin_reset_avatar(uuid) from public;
grant execute on function public.admin_reset_avatar(uuid) to authenticated;

-- Admin-only: reset video or thumbnail for a specific dimension
create or replace function public.admin_reset_candidate_media(
  p_candidate_id uuid,
  p_video_type text,
  p_reset_video boolean,
  p_reset_thumbnail boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not_admin';
  end if;

  update public.videos
  set
    video_url = case when p_reset_video then null else video_url end,
    thumbnail_url = case when p_reset_thumbnail then null else thumbnail_url end
  where candidate_id = p_candidate_id and video_type = p_video_type;

  delete from public.videos
  where candidate_id = p_candidate_id
    and video_type = p_video_type
    and video_url is null
    and thumbnail_url is null;
end;
$$;

revoke all on function public.admin_reset_candidate_media(uuid, text, boolean, boolean) from public;
grant execute on function public.admin_reset_candidate_media(uuid, text, boolean, boolean) to authenticated;

-- Ensure videos table is protected but functional for candidates + admin
alter table public.videos enable row level security;

drop policy if exists "videos_select_own_or_admin" on public.videos;
create policy "videos_select_own_or_admin"
on public.videos
for select
to authenticated
using (candidate_id = auth.uid() or public.is_admin());

drop policy if exists "videos_insert_own_or_admin" on public.videos;
create policy "videos_insert_own_or_admin"
on public.videos
for insert
to authenticated
with check (candidate_id = auth.uid() or public.is_admin());

drop policy if exists "videos_update_own_or_admin" on public.videos;
create policy "videos_update_own_or_admin"
on public.videos
for update
to authenticated
using (candidate_id = auth.uid() or public.is_admin())
with check (candidate_id = auth.uid() or public.is_admin());

drop policy if exists "videos_delete_admin_only" on public.videos;
create policy "videos_delete_admin_only"
on public.videos
for delete
to authenticated
using (public.is_admin());

-- Storage: allow admin to delete media (for moderation)
drop policy if exists "Admin can delete candidate videos." on storage.objects;
create policy "Admin can delete candidate videos."
on storage.objects for delete
to authenticated
using (bucket_id = 'candidate-videos' and public.is_admin());

drop policy if exists "Admin can delete video thumbnails." on storage.objects;
create policy "Admin can delete video thumbnails."
on storage.objects for delete
to authenticated
using (bucket_id = 'video-thumbnails' and public.is_admin());

drop policy if exists "Admin can delete profile avatars." on storage.objects;
create policy "Admin can delete profile avatars."
on storage.objects for delete
to authenticated
using (bucket_id = 'profile-avatars' and public.is_admin());

