
-- Migration to update the applications table for the simplified form
alter table public.applications 
  add column if not exists dob date,
  alter column category drop not null,
  alter column sub_category drop not null;
