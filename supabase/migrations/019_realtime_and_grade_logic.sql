-- 1. Activer le Temps Réel (Realtime)
-- On vérifie d'abord si la publication existe pour éviter les erreurs
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

-- Ajout des tables à la publication Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes_records;

-- 2. Créer une Fonction de Calcul de Grade (La Logique "Métier")
-- Note: Adaptation des colonnes selon la structure identifiée (user_id -> voter_id, sous_categorie -> category)
CREATE OR REPLACE FUNCTION public.get_user_grade(user_uuid UUID) 
RETURNS TEXT AS $$ 
DECLARE 
    v_count INTEGER; -- Nombre de votes 
    u_count INTEGER; -- Nombre d'univers (distincts) 
    c_count INTEGER; -- Nombre de catégories (distinctes) 
    grade TEXT; 
BEGIN 
    -- 1. Récupération des stats (Utilisation de voter_id et category selon notre schéma)
    SELECT count(*) INTO v_count FROM public.votes_records WHERE voter_id = user_uuid; 
    SELECT count(DISTINCT universe) INTO u_count FROM public.votes_records WHERE voter_id = user_uuid; 
    SELECT count(DISTINCT category) INTO c_count FROM public.votes_records WHERE voter_id = user_uuid; 

    -- 2. Logique des paliers (selon tes critères) 
    IF v_count >= 600 AND u_count = 16 AND c_count >= 48 THEN 
        grade := 'Référent 👑'; 
    ELSIF v_count >= 320 AND u_count >= 12 AND c_count >= 40 THEN 
        grade := 'Citoyen conscient'; 
    ELSIF v_count >= 160 AND u_count >= 8 AND c_count >= 20 THEN 
        grade := 'Citoyen engagé'; 
    ELSIF v_count >= 80 AND u_count >= 6 AND c_count >= 10 THEN 
        grade := 'Citoyen'; 
    ELSIF v_count >= 30 AND u_count >= 4 THEN 
        grade := 'Électeur actif'; 
    ELSIF v_count >= 10 AND u_count >= 2 THEN 
        grade := 'Électeur'; 
    ELSIF v_count >= 1 THEN 
        grade := 'Votant'; 
    ELSE 
        grade := 'Nouveau'; 
    END IF; 

    RETURN grade; 
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER; 

-- 3. Automatiser la mise à jour du compteur de votes 
-- Ce trigger assure que profiles.votes est toujours synchronisé avec votes_records
CREATE OR REPLACE FUNCTION public.handle_new_vote_sync() 
RETURNS TRIGGER AS $$ 
BEGIN 
    -- Incrémente le compteur de votes du talent dans la table profiles 
    UPDATE public.profiles 
    SET votes = COALESCE(votes, 0) + 1,
        updated_at = NOW()
    WHERE id = NEW.candidate_id; 
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER; 

-- On supprime le trigger s'il existe déjà pour éviter les doublons
DROP TRIGGER IF EXISTS on_vote_added_sync ON public.votes_records;

CREATE TRIGGER on_vote_added_sync 
AFTER INSERT ON public.votes_records 
FOR EACH ROW EXECUTE FUNCTION public.handle_new_vote_sync();
