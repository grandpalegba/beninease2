
-- 1. Ensure UserRole enum is up to date (we can't easily alter enum values if they already exist without specific syntax)
-- But we can use text and check constraints if needed, or just assume the enum exists and add values.
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('admin', 'jury', 'candidat', 'ambassadeur', 'votant');
  ELSE
    -- Check for missing values and add them
    BEGIN
      ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'votant';
      ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'candidat';
      ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'ambassadeur';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- 2. Ensure profiles table has the correct columns with appropriate defaults/nullability
ALTER TABLE public.profiles 
  ALTER COLUMN role SET DEFAULT 'votant',
  ALTER COLUMN city DROP NOT NULL,
  ALTER COLUMN univers DROP NOT NULL,
  ALTER COLUMN category DROP NOT NULL;

-- 3. Robust Auth Trigger to create profile with dynamic role
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
BEGIN
  -- 1. Determine role from metadata (registration_intent) or default to 'votant'
  v_role := COALESCE(NEW.raw_user_meta_data->>'registration_intent', 'votant');
  
  -- 2. Insert into profiles (using the role determined above)
  INSERT INTO public.profiles (
    id, 
    full_name, 
    prenom, 
    nom, 
    whatsapp_number,
    role,
    avatar_url
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'prenom', NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'nom', NEW.raw_user_meta_data->>'last_name', ''),
    NEW.phone, -- If phone is provided during signup
    v_role::public.user_role,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    role = EXCLUDED.role,
    full_name = COALESCE(profiles.full_name, EXCLUDED.full_name),
    updated_at = NOW();

  -- 3. Also insert into public.users for legacy/admin checks (if needed)
  INSERT INTO public.users (id, role, is_approved)
  VALUES (NEW.id, v_role::public.user_role, (v_role = 'admin' OR v_role = 'jury'))
  ON CONFLICT (id) DO UPDATE
  SET role = EXCLUDED.role;

  RETURN NEW;
END;
$$;

-- 4. Re-attach the trigger to auth.users (ensure it exists and is correct)
DROP TRIGGER IF EXISTS on_auth_user_created_create_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_create_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_profile();
