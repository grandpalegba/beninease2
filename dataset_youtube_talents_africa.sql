BEGIN;

-- Définition de 4 vraies vidéos sur le BÉNIN et l'AFRIQUE
-- Ces vidéos ont été sélectionnées pour leur beauté (4K/HD) et leur rapport direct avec le continent.
-- Vidéo 1 (Qui je suis / Portrait) : rbXrgwrQWgY (Ganvié: The Venice of Africa - BÉNIN)
-- Vidéo 2 (Histoire / Culture) : bC6jF-J5t7Y (Deep Inside Village Life in Benin - BÉNIN)
-- Vidéo 3 (Services / Activité) : lM3G43_m_wU (Cotonou City Tour - BÉNIN) 
-- Vidéo 4 (Pourquoi / Inspiration) : Uo-N966F99k (Africa from Above: Ghana - AFRIQUE)

UPDATE talents SET
  video_qui_je_suis = CASE slug
    WHEN 'basile-kora' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'armand-tossou' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'lionel-agossou' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'aicha-hounkpatin' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'romaric-hountondji' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-ahouansou' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'carine-adjovi' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'jonas-ahodehou' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'senami-dossou' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'arnaud-zinsou' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'mireille-tognifode' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'ibrahim-lawani' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-adjakpa' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'grace-houessou' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'steve-kpade' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'nadege-kiki' THEN 'https://www.youtube.com/embed/rbXrgwrQWgY?autoplay=1&mute=1&playsinline=1&rel=0'
  END,

  video_histoire = CASE slug
    WHEN 'basile-kora' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'armand-tossou' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'lionel-agossou' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'aicha-hounkpatin' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'romaric-hountondji' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-ahouansou' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'carine-adjovi' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'jonas-ahodehou' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'senami-dossou' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'arnaud-zinsou' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'mireille-tognifode' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'ibrahim-lawani' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-adjakpa' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'grace-houessou' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'steve-kpade' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'nadege-kiki' THEN 'https://www.youtube.com/embed/bC6jF-J5t7Y?autoplay=1&mute=1&playsinline=1&rel=0'
  END,

  video_services = CASE slug
    WHEN 'basile-kora' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'armand-tossou' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'lionel-agossou' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'aicha-hounkpatin' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'romaric-hountondji' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-ahouansou' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'carine-adjovi' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'jonas-ahodehou' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'senami-dossou' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'arnaud-zinsou' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'mireille-tognifode' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'ibrahim-lawani' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-adjakpa' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'grace-houessou' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'steve-kpade' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'nadege-kiki' THEN 'https://www.youtube.com/embed/lM3G43_m_wU?autoplay=1&mute=1&playsinline=1&rel=0'
  END,

  video_pourquoi = CASE slug
    WHEN 'basile-kora' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'armand-tossou' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'lionel-agossou' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'aicha-hounkpatin' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'romaric-hountondji' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-ahouansou' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'carine-adjovi' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'jonas-ahodehou' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'senami-dossou' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'arnaud-zinsou' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'mireille-tognifode' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'ibrahim-lawani' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-adjakpa' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'grace-houessou' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'steve-kpade' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'nadege-kiki' THEN 'https://www.youtube.com/embed/Uo-N966F99k?autoplay=1&mute=1&playsinline=1&rel=0'
  END

WHERE slug IN (
  'basile-kora','armand-tossou','lionel-agossou','aicha-hounkpatin',
  'romaric-hountondji','koffi-ahouansou','carine-adjovi','jonas-ahodehou',
  'senami-dossou','arnaud-zinsou','mireille-tognifode','ibrahim-lawani',
  'koffi-adjakpa','grace-houessou','steve-kpade','nadege-kiki'
);

COMMIT;
