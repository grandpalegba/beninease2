-- Voters + votes tables for engagement (WhatsApp) and secure unique voting

create extension if not exists "pgcrypto";

create table if not exists public.voters (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null unique,
  full_name text not null,
  created_at timestamptz not null default now()
);

alter table public.voters enable row level security;

create table if not exists public.votes (
  id bigint generated always as identity primary key,
  voter_id uuid not null references public.voters (id) on delete cascade,
  candidate_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint votes_unique unique (voter_id, candidate_id)
);

alter table public.votes enable row level security;

-- Keep votes insertion only through RPC (no insert policy)
drop policy if exists "votes_select_public" on public.votes;
create policy "votes_select_public"
on public.votes
for select
to authenticated
using (public.is_admin());

drop function if exists public.normalize_phone(text);
create function public.normalize_phone(p_phone text)
returns text
language sql
immutable
as $$
  select regexp_replace(regexp_replace(regexp_replace(trim(p_phone), '\s+', '', 'g'), '[-()]', '', 'g'), '^\+?', '+');
$$;

drop function if exists public.register_or_get_voter(text, text);
create function public.register_or_get_voter(p_full_name text, p_phone text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  nphone text;
  vid uuid;
begin
  nphone := public.normalize_phone(p_phone);
  insert into public.voters (phone_number, full_name)
  values (nphone, p_full_name)
  on conflict (phone_number) do update
    set full_name = excluded.full_name
  returning id into vid;
  return vid;
end;
$$;

revoke all on function public.register_or_get_voter(text, text) from public;
grant execute on function public.register_or_get_voter(text, text) to anon, authenticated;

drop function if exists public.cast_vote(text, text, uuid);
create function public.cast_vote(p_full_name text, p_phone text, p_candidate_id uuid)
returns table(votes_count integer, created boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  vid uuid;
  inserted_id bigint;
  current_count integer;
begin
  vid := public.register_or_get_voter(p_full_name, p_phone);

  insert into public.votes (voter_id, candidate_id)
  values (vid, p_candidate_id)
  on conflict do nothing
  returning id into inserted_id;

  if inserted_id is not null then
    update public.profiles
    set votes_count = coalesce(votes_count, 0) + 1,
        updated_at = now()
    where id = p_candidate_id
    returning votes_count into current_count;
    return query select current_count, true;
  else
    select votes_count into current_count
    from public.profiles
    where id = p_candidate_id;
    return query select coalesce(current_count, 0), false;
  end if;
end;
$$;

revoke all on function public.cast_vote(text, text, uuid) from public;
grant execute on function public.cast_vote(text, text, uuid) to anon, authenticated;

