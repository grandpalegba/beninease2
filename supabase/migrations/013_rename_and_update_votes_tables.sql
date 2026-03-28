
-- Migration to align database with the "Source of Truth" in the passation dossier
-- Rename voters.phone_number to voters.whatsapp
-- Rename votes table to votes_records
-- Ensure votes_records has voter_whatsapp column as per instructions

-- 1. Rename column in voters
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'voters' AND column_name = 'phone_number') THEN
    ALTER TABLE public.voters RENAME COLUMN phone_number TO whatsapp;
  END IF;
END $$;

-- 2. Rename votes table to votes_records
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'votes') THEN
    ALTER TABLE public.votes RENAME TO votes_records;
  END IF;
END $$;

-- 3. Update votes_records structure to include voter_whatsapp if it's missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'votes_records' AND column_name = 'voter_whatsapp') THEN
    ALTER TABLE public.votes_records ADD COLUMN voter_whatsapp TEXT;
    
    -- Populate voter_whatsapp from voters table
    UPDATE public.votes_records vr
    SET voter_whatsapp = v.whatsapp
    FROM public.voters v
    WHERE vr.voter_id = v.id;
    
    -- Make it NOT NULL and add unique constraint
    ALTER TABLE public.votes_records ALTER COLUMN voter_whatsapp SET NOT NULL;
    
    -- Drop old constraint if exists and add the new one
    ALTER TABLE public.votes_records DROP CONSTRAINT IF EXISTS votes_unique;
    ALTER TABLE public.votes_records ADD CONSTRAINT votes_records_unique UNIQUE (voter_whatsapp, candidate_id);
  END IF;
END $$;

-- 4. Update profiles.votes_count to profiles.votes if it's still votes_count
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'votes_count') THEN
    ALTER TABLE public.profiles RENAME COLUMN votes_count TO votes;
  END IF;
END $$;

-- 5. Update functions to use new names
CREATE OR REPLACE FUNCTION public.register_or_get_voter(p_full_name text, p_whatsapp text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  nwhatsapp text;
  vid uuid;
BEGIN
  nwhatsapp := public.normalize_phone(p_whatsapp);
  INSERT INTO public.voters (whatsapp, full_name)
  VALUES (nwhatsapp, p_full_name)
  ON CONFLICT (whatsapp) DO UPDATE
    SET full_name = EXCLUDED.full_name
  RETURNING id INTO vid;
  RETURN vid;
END;
$$;

CREATE OR REPLACE FUNCTION public.cast_vote(p_full_name text, p_whatsapp text, p_candidate_id uuid)
RETURNS TABLE(votes_count integer, created boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  vid uuid;
  inserted_id bigint;
  current_count integer;
  nwhatsapp text;
BEGIN
  nwhatsapp := public.normalize_phone(p_whatsapp);
  vid := public.register_or_get_voter(p_full_name, nwhatsapp);

  INSERT INTO public.votes_records (voter_id, voter_whatsapp, candidate_id)
  VALUES (vid, nwhatsapp, p_candidate_id)
  ON CONFLICT DO NOTHING
  RETURNING id INTO inserted_id;

  IF inserted_id IS NOT NULL THEN
    UPDATE public.profiles
    SET votes = COALESCE(votes, 0) + 1,
        updated_at = NOW()
    WHERE id = p_candidate_id
    RETURNING votes INTO current_count;
    RETURN QUERY SELECT current_count, TRUE;
  ELSE
    SELECT votes INTO current_count
    from public.profiles
    WHERE id = p_candidate_id;
    RETURN QUERY SELECT COALESCE(current_count, 0), FALSE;
  END IF;
END;
$$;
