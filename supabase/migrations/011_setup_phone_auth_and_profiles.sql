
-- 1. Add missing columns to public.profiles
alter table public.profiles 
  add column if not exists prenom text,
  add column if not exists nom text,
  add column if not exists date_naissance date,
  add column if not exists whatsapp_number text unique,
  add column if not exists univers text,
  add column if not exists sous_categorie text;

-- 2. Function to normalize Benin phone numbers (+229)
-- Rule: If +229 followed by 8 digits, add "01" after the prefix.
create or replace function public.normalize_benin_phone_number()
returns trigger as $$
declare
    phone_val text;
begin
    -- Get the phone number from the field (whatsapp_number or phone depending on context)
    -- We use TG_ARGV[0] to determine which column to check if needed, but here we assume 'whatsapp_number'
    phone_val := NEW.whatsapp_number;

    if phone_val is not null and phone_val ~ '^\+229[0-9]{8}$' then
        -- It starts with +229 and has exactly 8 digits after.
        -- We insert '01' after '+229'
        NEW.whatsapp_number := '+22901' || right(phone_val, 8);
    end if;

    return NEW;
end;
$$ language plpgsql;

-- 3. Create Trigger for normalization on profiles
drop trigger if exists on_before_insert_normalize_phone on public.profiles;
create trigger on_before_insert_normalize_phone
  before insert or update on public.profiles
  for each row execute procedure public.normalize_benin_phone_number();

-- 3b. Create Trigger for normalization on applications (using the 'phone' column)
create or replace function public.normalize_benin_phone_number_apps()
returns trigger as $$
begin
    if NEW.phone is not null and NEW.phone ~ '^\+229[0-9]{8}$' then
        NEW.phone := '+22901' || right(NEW.phone, 8);
    end if;
    return NEW;
end;
$$ language plpgsql;

drop trigger if exists on_before_insert_normalize_phone_apps on public.applications;
create trigger on_before_insert_normalize_phone_apps
  before insert or update on public.applications
  for each row execute procedure public.normalize_benin_phone_number_apps();

-- 4. Update RLS Policies for profiles
-- Ensure user can only update their own profile
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- 5. Update handle_new_user_profile to include new fields from metadata if available
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, 
    full_name, 
    prenom, 
    nom, 
    whatsapp_number
  )
  values (
    new.id, 
    (new.raw_user_meta_data->>'full_name'),
    (new.raw_user_meta_data->>'prenom'),
    (new.raw_user_meta_data->>'nom'),
    new.phone -- Supabase stores the phone number in the 'phone' column of auth.users
  );
  return new;
end;
$$;
