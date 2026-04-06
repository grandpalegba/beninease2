
-- 1. Mise à jour de la table THEMES
CREATE TABLE IF NOT EXISTS public.themes (
    id text PRIMARY KEY, -- Acceptation d'identifiants strings (ex: 'arch_1')
    name text NOT NULL,
    "order" integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- 2. Création/Mise à jour de la table MYSTERES
CREATE TABLE IF NOT EXISTS public.mysteres (
    id text PRIMARY KEY, -- Identifiant string (ex: 'arch_1')
    theme_id text REFERENCES public.themes(id) ON DELETE SET NULL,
    title text NOT NULL,
    subtitle text,
    mise_en_abyme text,
    difficulty integer DEFAULT 1,
    cover_image_url text,
    mystere_number integer,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Création de la table QUESTIONS
CREATE TABLE IF NOT EXISTS public.questions (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text, -- Supporte UUID ou string
    mystere_id text REFERENCES public.mysteres(id) ON DELETE CASCADE,
    question_number integer NOT NULL,
    question text NOT NULL,
    choice_a text NOT NULL,
    choice_b text NOT NULL,
    choice_c text NOT NULL,
    choice_d text NOT NULL,
    correct_answer text NOT NULL, -- 'A', 'B', 'C', ou 'D'
    explanation text,
    created_at timestamptz DEFAULT now()
);

-- 4. Mise à jour de la table TALENTS
-- Ajout des colonnes manquantes et initialisation des votes
ALTER TABLE public.talents 
    ALTER COLUMN votes SET DEFAULT 0,
    ALTER COLUMN votes SET NOT NULL;

-- S'assurer que les votes existants ne sont pas NULL
UPDATE public.talents SET votes = 0 WHERE votes IS NULL;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='talents' AND column_name='video_urls') THEN
        ALTER TABLE public.talents ADD COLUMN video_urls text[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='talents' AND column_name='slogan') THEN
        ALTER TABLE public.talents ADD COLUMN slogan text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='talents' AND column_name='instagram_url') THEN
        ALTER TABLE public.talents ADD COLUMN instagram_url text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='talents' AND column_name='tiktok_url') THEN
        ALTER TABLE public.talents ADD COLUMN tiktok_url text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='talents' AND column_name='whatsapp_number') THEN
        ALTER TABLE public.talents ADD COLUMN whatsapp_number text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='talents' AND column_name='city') THEN
        ALTER TABLE public.talents ADD COLUMN city text;
    END IF;
END $$;

-- 5. Création de la table VOTES avec contrainte UNIQUE
CREATE TABLE IF NOT EXISTS public.votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    talent_id uuid REFERENCES public.talents(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT unique_user_talent_vote UNIQUE(user_id, talent_id)
);

-- 6. Trigger pour incrémenter le compteur de votes dans TALENTS
CREATE OR REPLACE FUNCTION public.handle_new_vote()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.talents
    SET votes = votes + 1
    WHERE id = NEW.talent_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_vote_added ON public.votes;
CREATE TRIGGER on_vote_added
    AFTER INSERT ON public.votes
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_vote();

-- RLS (Row Level Security)
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mysteres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Themes sont consultables par tous" ON public.themes;
CREATE POLICY "Themes sont consultables par tous" ON public.themes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Mysteres sont consultables par tous" ON public.mysteres;
CREATE POLICY "Mysteres sont consultables par tous" ON public.mysteres FOR SELECT USING (true);

DROP POLICY IF EXISTS "Questions sont consultables par tous" ON public.questions;
CREATE POLICY "Questions sont consultables par tous" ON public.questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Votes consultables par l'auteur" ON public.votes;
CREATE POLICY "Votes consultables par l'auteur" ON public.votes FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Utilisateurs peuvent voter" ON public.votes;
CREATE POLICY "Utilisateurs peuvent voter" ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Talents sont consultables par tous" ON public.talents;
CREATE POLICY "Talents sont consultables par tous" ON public.talents FOR SELECT USING (true);
