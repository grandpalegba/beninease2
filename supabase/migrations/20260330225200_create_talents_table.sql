-- Create talents table for the application
CREATE TABLE IF NOT EXISTS public.talents (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  prenom text,
  nom text,
  category text,
  univers text,
  portrait text,
  bio text,
  votes integer DEFAULT 0,
  avatar_url text,
  is_validated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;

-- Policies for talents table
DROP POLICY IF EXISTS "talents_select_public" ON public.talents;
CREATE POLICY "talents_select_public" 
ON public.talents 
FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "talents_select_own" ON public.talents;
CREATE POLICY "talents_select_own" 
ON public.talents 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "talents_update_own" ON public.talents;
CREATE POLICY "talents_update_own" 
ON public.talents 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS talents_slug_idx ON public.talents(slug);
CREATE INDEX IF NOT EXISTS talents_votes_idx ON public.talents(votes DESC);
