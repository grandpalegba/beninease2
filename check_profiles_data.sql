-- Check if profiles table has data
SELECT id, slug, prenom, nom FROM profiles LIMIT 10;

-- Check specific slug
SELECT * FROM profiles WHERE slug = 'jonas-ahodehou';
