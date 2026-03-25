-- Votes counter + public read + atomic increment RPC for the voting page

alter table public.profiles
  add column if not exists votes_count integer not null default 0;

-- Allow public read for the voting grid + sanctuary
drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
on public.profiles
for select
to anon, authenticated
using (true);

-- Atomic increment (bypasses RLS)
create or replace function public.increment_votes(profile_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  update public.profiles
  set votes_count = coalesce(votes_count, 0) + 1,
      updated_at = now()
  where id = profile_id
  returning votes_count into new_count;

  if new_count is null then
    raise exception 'profile_not_found';
  end if;

  return new_count;
end;
$$;

revoke all on function public.increment_votes(uuid) from public;
grant execute on function public.increment_votes(uuid) to anon, authenticated;
