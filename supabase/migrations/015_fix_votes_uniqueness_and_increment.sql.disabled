
-- 1. S'assurer que la table votes a les bonnes contraintes
-- On utilise voter_id et candidate_id pour l'unicité
DO $$ 
BEGIN
    -- Supprimer l'ancienne contrainte si elle existe sous un autre nom
    ALTER TABLE IF EXISTS public.votes DROP CONSTRAINT IF EXISTS votes_voter_id_candidate_id_key;
    
    -- Ajouter la contrainte d'unicité sur (voter_id, candidate_id)
    ALTER TABLE public.votes 
    ADD CONSTRAINT votes_voter_id_candidate_id_key UNIQUE (voter_id, candidate_id);
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Constraint might already exist or table is missing';
END $$;

-- 2. Fonction RPC pour incrémenter les votes de manière atomique
-- Cette fonction sera appelée après chaque insertion réussie dans 'votes'
CREATE OR REPLACE FUNCTION public.increment_votes(candidate_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.talents
    SET votes = COALESCE(votes, 0) + 1
    WHERE id = candidate_id;
END;
$$;
