
-- 1. Activer RLS sur la table votes
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow users to vote" ON public.votes;
DROP POLICY IF EXISTS "Users can view their own votes" ON public.votes;
DROP POLICY IF EXISTS "Public can view all votes" ON public.votes;

-- 3. Politique d'insertion pour les utilisateurs authentifiés
-- On vérifie que le voter_id correspond à l'ID de l'utilisateur connecté
CREATE POLICY "Allow authenticated users to vote" 
ON public.votes 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = voter_id);

-- 4. Politique de lecture (nécessaire pour checkHasVoted)
CREATE POLICY "Users can view their own votes" 
ON public.votes 
FOR SELECT 
TO authenticated 
USING (auth.uid() = voter_id);

-- 5. Politique de lecture publique pour les compteurs (si nécessaire via la table votes)
CREATE POLICY "Public can view all votes" 
ON public.votes 
FOR SELECT 
TO public 
USING (true);
