-- Add first_name and last_name columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Split full_name into first_name and last_name
-- This logic assumes the first part is the first name and the rest is the last name
UPDATE public.profiles
SET 
  first_name = split_part(full_name, ' ', 1),
  last_name = substring(full_name from position(' ' in full_name) + 1)
WHERE full_name IS NOT NULL AND first_name IS NULL AND last_name IS NULL;
