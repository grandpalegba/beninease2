-- Seed the 16 talents into the profiles table
-- Note: This assumes the profiles table exists and has the necessary columns (prenom, nom, category, slug, portrait, votes, role, bio)

INSERT INTO public.profiles (id, slug, prenom, nom, category, portrait, votes, role, bio)
VALUES 
  ('koffi-ahouansou', 'koffi-ahouansou', 'Koffi', 'Ahouansou', 'Transport & Mobilité', '/talents/koffi-ahouansou.jpg', 0, 'candidat', 'Solutions de mobilité urbaine à Cotonou'),
  ('senami-dossou', 'senami-dossou', 'Sènami', 'Dossou', 'Experts Métier', '/talents/senami-dossou.jpg', 0, 'candidat', 'Artisanat bois modernisé à Abomey'),
  ('ibrahim-lawani', 'ibrahim-lawani', 'Ibrahim', 'Lawani', 'Santé & Médecine', '/talents/ibrahim-lawani.jpg', 0, 'candidat', 'Médecine accessible à Parakou'),
  ('arnaud-zinsou', 'arnaud-zinsou', 'Arnaud', 'Zinsou', 'Médias & Digital', '/talents/arnaud-zinsou.jpg', 0, 'candidat', 'Stratégie digitale & création de contenu'),
  ('nadege-kiki', 'nadege-kiki', 'Nadège', 'Kiki', 'Facilitateurs & Conciergerie', '/talents/nadege-kiki.jpg', 0, 'candidat', 'Facilitation administrative à Porto-Novo'),
  ('lionel-agossou', 'lionel-agossou', 'Lionel', 'Agossou', 'Arts & Culture', '/talents/lionel-agossou.jpg', 0, 'candidat', 'Art visuel inspiré du Danxomè'),
  ('aicha-hounkpatin', 'aicha-hounkpatin', 'Aïcha', 'Hounkpatin', 'Gastronomie & Agro', '/talents/aicha-hounkpatin.jpg', 0, 'candidat', 'Cuisine fusion béninoise'),
  ('basile-kora', 'basile-kora', 'Basile', 'Kora', 'Agriculture & Elevage', '/talents/basile-kora.jpg', 0, 'candidat', 'Elevage avicole moderne à Parakou'),
  ('grace-houessou', 'grace-houessou', 'Grâce', 'Houessou', 'Mode & Design', '/talents/grace-houessou.jpg', 0, 'candidat', 'Design de mode éthique à Cotonou'),
  ('jonas-ahodehou', 'jonas-ahodehou', 'Jonas', 'Ahodéhou', 'BTP & Artisanat', '/talents/jonas-ahodehou.jpg', 0, 'candidat', 'Construction durable et bioclimatique'),
  ('koffi-adjakpa', 'koffi-adjakpa', 'Koffi', 'Adjakpa', 'Enseignement & Formation', '/talents/koffi-adjakpa.jpg', 0, 'candidat', 'Formation aux métiers du numérique'),
  ('mireille-tognifode', 'mireille-tognifode', 'Mireille', 'Tognifodé', 'Commerce & Distribution', '/talents/mireille-tognifode.jpg', 0, 'candidat', 'Distribution de produits locaux'),
  ('romaric-hountondji', 'romaric-hountondji', 'Romaric', 'Hountondji', 'Sport & Bien-être', '/talents/romaric-hountondji.jpg', 0, 'candidat', 'Coaching sportif et nutrition'),
  ('steve-kpade', 'steve-kpade', 'Steve', 'Kpadé', 'Tourisme & Loisirs', '/talents/steve-kpade.jpg', 0, 'candidat', 'Ecotourisme dans la vallée de l''Ouémé'),
  ('armand-tossou', 'armand-tossou', 'Armand', 'Tossou', 'Services aux entreprises', '/talents/armand-tossou.jpg', 0, 'candidat', 'Conseil en gestion et stratégie'),
  ('carine-adjovi', 'carine-adjovi', 'Carine', 'Adjovi', 'Social & Communautaire', '/talents/carine-adjovi.jpg', 0, 'candidat', 'Appui à l''entreprenariat féminin')
ON CONFLICT (slug) DO UPDATE 
SET 
  prenom = EXCLUDED.prenom,
  nom = EXCLUDED.nom,
  category = EXCLUDED.category,
  portrait = EXCLUDED.portrait,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio;
