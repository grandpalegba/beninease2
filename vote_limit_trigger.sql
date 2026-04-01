-- Trigger SQL pour limiter les votes à 16 par 24 heures par utilisateur
-- À exécuter dans Supabase SQL Editor

-- Fonction pour vérifier la limite de votes
CREATE OR REPLACE FUNCTION check_vote_limit()
RETURNS TRIGGER AS $$
DECLARE
    vote_count INTEGER;
BEGIN
    -- Compter les votes de l'utilisateur dans les dernières 24 heures
    SELECT COUNT(*) INTO vote_count
    FROM votes
    WHERE voter_id = NEW.voter_id
      AND created_at >= NOW() - INTERVAL '24 hours';
    
    -- Vérifier si la limite est dépassée
    IF vote_count >= 16 THEN
        RAISE EXCEPTION 'Limite de 16 votes par 24h atteinte.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger BEFORE INSERT
DROP TRIGGER IF EXISTS enforce_vote_limit ON votes;
CREATE TRIGGER enforce_vote_limit
BEFORE INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION check_vote_limit();

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_votes_voter_created_at 
ON votes(voter_id, created_at DESC);
