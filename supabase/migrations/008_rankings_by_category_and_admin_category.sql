-- Ensure profiles.category exists + index + rankings view + admin category setter

alter table public.profiles
  add column if not exists category text;

create index if not exists profiles_category_idx on public.profiles (category);

create or replace view public.rankings_by_category as
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

create or replace function public.admin_set_profile_category(
  p_profile_id uuid,
  p_category text
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

  update public.profiles
  set category = p_category, updated_at = now()
  where id = p_profile_id;
end;
$$;

revoke all on function public.admin_set_profile_category(uuid, text) from public;
grant execute on function public.admin_set_profile_category(uuid, text) to authenticated;

