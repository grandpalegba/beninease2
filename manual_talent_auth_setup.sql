-- Manual Talent Auth Setup SQL
-- Use this if the automated script fails due to database issues

-- Step 1: Create auth users manually (you can also do this via Supabase Dashboard)
-- Go to Supabase Dashboard → Authentication → Users → Add User

-- Step 2: Update talents table with auth_user_id
-- Run these updates after creating the auth users:

-- Aïcha Hounkpatin
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Aïcha' AND nom = 'Hounkpatin';

-- Armand Tossou
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Armand' AND nom = 'Tossou';

-- Arnaud Zinsou
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Arnaud' AND nom = 'Zinsou';

-- Basile Kora
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Basile' AND nom = 'Kora';

-- Carine Adjovi
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Carine' AND nom = 'Adjovi';

-- Grâce Houessou
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Grâce' AND nom = 'Houessou';

-- Ibrahim Lawani
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Ibrahim' AND nom = 'Lawani';

-- Jonas Ahodéhou
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Jonas' AND nom = 'Ahodéhou';

-- Koffi Ahouansou
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Koffi' AND nom = 'Ahouansou';

-- Koffi Adjakpa
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Koffi' AND nom = 'Adjakpa';

-- Lionel Agossou
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Lionel' AND nom = 'Agossou';

-- Mireille Tognifodé
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Mireille' AND nom = 'Tognifodé';

-- Nadège Kiki
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Nadège' AND nom = 'Kiki';

-- Romaric Hountondji
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Romaric' AND nom = 'Hountondji';

-- Sènami Dossou
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Sènami' AND nom = 'Dossou';

-- Steve Kpadé
UPDATE talents 
SET auth_user_id = 'AUTH_USER_ID_HERE' 
WHERE prenom = 'Steve' AND nom = 'Kpadé';

-- Step 3: Verification
SELECT 
  t.prenom, 
  t.nom, 
  t.auth_user_id, 
  a.email,
  a.created_at
FROM talents t
LEFT JOIN auth.users a ON t.auth_user_id = a.id
ORDER BY t.prenom;

-- Step 4: Check results
SELECT COUNT(*) as talents_with_auth 
FROM talents 
WHERE auth_user_id IS NOT NULL;
