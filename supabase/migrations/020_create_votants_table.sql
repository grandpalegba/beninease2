-- Création de la table votants avec les bonnes permissions
-- Cette table stocke les informations des votants liés à auth.users

-- 1. Création de la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.votants (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'votant',
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Activation de RLS
ALTER TABLE public.votants ENABLE ROW LEVEL SECURITY;

-- 3. Suppression des anciennes policies (si existantes)
DROP POLICY IF EXISTS "votants_select_own" ON public.votants;
DROP POLICY IF EXISTS "votants_insert_own" ON public.votants;
DROP POLICY IF EXISTS "votants_update_own" ON public.votants;

-- 4. Création des policies RLS

-- Policy SELECT : Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "votants_select_own" 
ON public.votants 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Policy INSERT : Les utilisateurs peuvent insérer leur propre profil
CREATE POLICY "votants_insert_own" 
ON public.votants 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Policy UPDATE : Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "votants_update_own" 
ON public.votants 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
