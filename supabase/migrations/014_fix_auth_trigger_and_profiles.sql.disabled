
-- 1. ENUMERATION DES ROLES
-- S'assurer que le type enum existe et contient 'votant'
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('admin', 'jury', 'candidat', 'ambassadeur', 'votant');
  ELSE
    BEGIN
      ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'votant';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- 2. ASSOUPLISSEMENT DE LA TABLE PROFILES
-- On rend toutes les colonnes optionnelles pour éviter de bloquer l'INSERT initial
ALTER TABLE public.profiles 
  ALTER COLUMN role SET DEFAULT 'votant'::public.user_role,
  ALTER COLUMN full_name DROP NOT NULL,
  ALTER COLUMN prenom DROP NOT NULL,
  ALTER COLUMN nom DROP NOT NULL,
  ALTER COLUMN city DROP NOT NULL,
  ALTER COLUMN univers DROP NOT NULL,
  ALTER COLUMN category DROP NOT NULL,
  ALTER COLUMN whatsapp_number DROP NOT NULL;

-- 3. TRIGGER AUTH ULTRA-ROBUSTE
-- On n'insère que le strict minimum vital pour garantir le succès de la connexion
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
BEGIN
  -- Détection du rôle via metadata ou défaut 'votant'
  v_role := COALESCE(NEW.raw_user_meta_data->>'registration_intent', 'votant');

  INSERT INTO public.profiles (
    id, 
    full_name,
    role,
    avatar_url,
    updated_at
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), -- On utilise l'email comme nom par défaut si vide
    v_role::public.user_role,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    role = EXCLUDED.role,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- En cas d'erreur fatale, on log l'erreur mais on laisse le trigger continuer 
  -- pour ne pas bloquer l'authentification Supabase (stratégie "Fail-Safe")
  RAISE WARNING 'Error in handle_new_user_profile: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- 4. RE-ATTACHEMENT DU TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created_create_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_create_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_profile();
