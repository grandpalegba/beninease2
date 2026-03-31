-- Debug script to check profiles data
-- Check slugs in profiles table
SELECT slug, prenom, nom, category FROM profiles LIMIT 10;

-- Check specific slug if needed
-- SELECT * FROM profiles WHERE slug = 'your-slug-here';
