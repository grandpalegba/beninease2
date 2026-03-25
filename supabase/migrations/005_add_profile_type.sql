-- Add a 'type' column to profiles to distinguish candidates and jury members
-- Allowed values: 'candidate' | 'jury'

alter table public.profiles
  add column if not exists type text not null default 'candidate'
  check (type in ('candidate', 'jury'));

create index if not exists profiles_type_idx on public.profiles (type);

