
-- 1. NETTOYAGE COMPLET DES ANCIENNES POLITIQUES
-- Approche ultra-robuste pour éviter les erreurs "query string argument of EXECUTE is null"
DO $$ 
DECLARE
    v_sql TEXT;
BEGIN
    -- Nettoyage pour la table 'votes'
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'votes' AND table_schema = 'public') THEN
        SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON public.votes;', ' ')
        INTO v_sql
        FROM pg_policies WHERE tablename = 'votes' AND schemaname = 'public';
        
        IF v_sql IS NOT NULL THEN
            EXECUTE v_sql;
        END IF;
    END IF;

    -- Nettoyage pour la table 'votes_records'
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'votes_records' AND table_schema = 'public') THEN
        SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON public.votes_records;', ' ')
        INTO v_sql
        FROM pg_policies WHERE tablename = 'votes_records' AND schemaname = 'public';
        
        IF v_sql IS NOT NULL THEN
            EXECUTE v_sql;
        END IF;
    END IF;
END $$;

-- 2. HARMONISATION DE LA STRUCTURE (voter_id vs user_id)
-- Si la table 'votes' a une colonne 'user_id', on la renomme en 'voter_id'
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'user_id') THEN
        ALTER TABLE public.votes RENAME COLUMN user_id TO voter_id;
    END IF;
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Note: Renommage non nécessaire ou impossible : %', SQLERRM;
END $$;

-- S'assurer que la table existe avec la bonne structure
CREATE TABLE IF NOT EXISTS public.votes (
    id BIGSERIAL PRIMARY KEY,
    voter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES public.talents(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT votes_voter_id_candidate_id_key UNIQUE (voter_id, candidate_id)
);

-- 3. RE-CREATION DES POLITIQUES RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Politique d'INSERT (voter_id est le nom officiel)
CREATE POLICY "Allow authenticated users to vote" 
ON public.votes 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = voter_id);

-- Politique de SELECT (Ses propres votes)
CREATE POLICY "Users can view their own votes" 
ON public.votes 
FOR SELECT 
TO authenticated 
USING (auth.uid() = voter_id);

-- Politique de lecture publique
CREATE POLICY "Public can view all votes" 
ON public.votes 
FOR SELECT 
TO public 
USING (true);

-- 4. REPARATION DES PROFILS ORPHELINS (FAIL-SAFE)
-- On s'assure que chaque utilisateur Auth a un profil pour respecter la clé étrangère
INSERT INTO public.profiles (id, full_name, role)
SELECT id, email, 'votant'::public.user_role
FROM auth.users
ON CONFLICT (id) DO NOTHING;
