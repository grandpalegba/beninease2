-- 018_unify_model_and_clean_votes.sql
-- Unification of the data model: profiles as single source of truth for users and talents
-- Clean up of the voting system: single votes table

-- 1. HARMONIZATION OF PROFILES TABLE
-- Ensure all necessary columns exist for both regular users and talents
DO $$ 
BEGIN
  -- Add prenom/nom if they don't exist (migrate from first_name/last_name if they exist)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'prenom') THEN
    ALTER TABLE public.profiles ADD COLUMN prenom TEXT;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'first_name') THEN
      UPDATE public.profiles SET prenom = first_name;
    END IF;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'nom') THEN
    ALTER TABLE public.profiles ADD COLUMN nom TEXT;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_name') THEN
      UPDATE public.profiles SET nom = last_name;
    END IF;
  END IF;

  -- Ensure slug, bio, category exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'slug') THEN
    ALTER TABLE public.profiles ADD COLUMN slug TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
    ALTER TABLE public.profiles ADD COLUMN bio TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'category') THEN
    ALTER TABLE public.profiles ADD COLUMN category TEXT;
  END IF;

  -- Ensure votes column exists and is initialized
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'votes') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'votes_count') THEN
      ALTER TABLE public.profiles RENAME COLUMN votes_count TO votes;
    ELSE
      ALTER TABLE public.profiles ADD COLUMN votes INTEGER DEFAULT 0;
    END IF;
  END IF;

  -- Add role column if it's missing (using the user_role enum)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'votant';
  END IF;

  -- Add whatsapp column for simplified identification
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'whatsapp') THEN
    ALTER TABLE public.profiles ADD COLUMN whatsapp TEXT;
    -- Migrate from whatsapp_number if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'whatsapp_number') THEN
      UPDATE public.profiles SET whatsapp = whatsapp_number;
    END IF;
  END IF;
END $$;

-- Ensure whatsapp is unique in profiles for identification
CREATE UNIQUE INDEX IF NOT EXISTS profiles_whatsapp_unique_idx ON public.profiles (whatsapp) WHERE whatsapp IS NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS profiles_slug_idx ON public.profiles (slug);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);
CREATE INDEX IF NOT EXISTS profiles_category_idx ON public.profiles (category);

-- 2. UNIFY VOTES TABLE
-- Drop old tables and views to start fresh
DROP VIEW IF EXISTS public.category_rankings;
DROP TABLE IF EXISTS public.votes_records CASCADE;
-- We might want to keep data from the old votes table if it exists
-- But the user asked for a clean start with specific columns

-- Create the clean votes table
CREATE TABLE IF NOT EXISTS public.votes (
  id BIGSERIAL PRIMARY KEY,
  voter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT votes_voter_candidate_unique UNIQUE (voter_id, candidate_id)
);

-- Enable RLS on votes
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Policies for votes
DROP POLICY IF EXISTS "Anyone can view votes" ON public.votes;
CREATE POLICY "Anyone can view votes" ON public.votes FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Authenticated users can vote once per candidate" ON public.votes;
CREATE POLICY "Authenticated users can vote once per candidate" 
ON public.votes FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = voter_id);

-- 3. RECREATE RANKING VIEW (based on profiles)
CREATE OR REPLACE VIEW public.rankings AS
SELECT
  p.id as candidate_id,
  p.slug,
  p.prenom,
  p.nom,
  p.category,
  p.avatar_url,
  p.city,
  p.votes,
  DENSE_RANK() OVER (
    PARTITION BY p.category
    ORDER BY COALESCE(p.votes, 0) DESC, p.updated_at DESC, p.id ASC
  ) as category_rank
FROM public.profiles p
WHERE (p.role = 'candidat' OR p.role = 'ambassadeur') AND p.category IS NOT NULL;

-- 4. ATOMIC VOTE FUNCTION (Updated to use profiles and votes table)
CREATE OR REPLACE FUNCTION public.cast_vote(p_candidate_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_voter_id uuid;
  v_new_votes integer;
BEGIN
  -- Get voter ID from auth context
  v_voter_id := auth.uid();
  IF v_voter_id IS NULL THEN
    RAISE EXCEPTION 'Veuillez vous connecter pour voter';
  END IF;

  -- Ensure candidate exists and is a talent
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_candidate_id AND (role = 'candidat' OR role = 'ambassadeur' OR role = 'candidate')) THEN
    RAISE EXCEPTION 'Le talent spécifié n''existe pas';
  END IF;

  -- Insert vote record (unique constraint will prevent duplicates)
  INSERT INTO public.votes (voter_id, candidate_id)
  VALUES (v_voter_id, p_candidate_id);

  -- Increment vote count in profiles
  UPDATE public.profiles
  SET votes = COALESCE(votes, 0) + 1,
      updated_at = NOW()
  WHERE id = p_candidate_id
  RETURNING votes INTO v_new_votes;

  RETURN v_new_votes;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Vous avez déjà voté pour ce talent';
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- 5. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES ('talents', 'talents', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for talents bucket
DROP POLICY IF EXISTS "Talent images are publicly accessible." ON storage.objects;
CREATE POLICY "Talent images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'talents' );

DROP POLICY IF EXISTS "Authenticated users can upload talent images." ON storage.objects;
CREATE POLICY "Authenticated users can upload talent images."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'talents' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can update their own talent images." ON storage.objects;
CREATE POLICY "Users can update their own talent images."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'talents' AND auth.uid() = owner )
  WITH CHECK ( bucket_id = 'talents' );

DROP POLICY IF EXISTS "Users can delete their own talent images." ON storage.objects;
CREATE POLICY "Users can delete their own talent images."
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'talents' AND auth.uid() = owner );
