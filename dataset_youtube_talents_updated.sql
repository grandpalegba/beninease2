BEGIN;

-- Définition des 4 vraies vidéos YouTube qui fonctionnent à 100%
-- Vidéo 1 (Qui je suis / Portrait) : J9iB5-Qd_y8 (Voyage / Culture Bénin)
-- Vidéo 2 (Histoire / Culture) : LXb3EKWsInQ (Costa Rica 4K Nature)
-- Vidéo 3 (Services / Activité) : aqz-KE-bpKQ (Big Buck Bunny / Animation test) 
-- Vidéo 4 (Pourquoi / Inspiration) : bHQqvYy5KYo (Standard YouTube test video)

UPDATE talents SET
  video_qui_je_suis = CASE slug
    WHEN 'basile-kora' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'armand-tossou' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'lionel-agossou' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'aicha-hounkpatin' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'romaric-hountondji' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-ahouansou' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'carine-adjovi' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'jonas-ahodehou' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'senami-dossou' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'arnaud-zinsou' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'mireille-tognifode' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'ibrahim-lawani' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-adjakpa' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'grace-houessou' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'steve-kpade' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'nadege-kiki' THEN 'https://www.youtube.com/embed/J9iB5-Qd_y8?autoplay=1&mute=1&playsinline=1&rel=0'
  END,

  video_histoire = CASE slug
    WHEN 'basile-kora' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'armand-tossou' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'lionel-agossou' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'aicha-hounkpatin' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'romaric-hountondji' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-ahouansou' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'carine-adjovi' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'jonas-ahodehou' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'senami-dossou' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'arnaud-zinsou' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'mireille-tognifode' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'ibrahim-lawani' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-adjakpa' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'grace-houessou' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'steve-kpade' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'nadege-kiki' THEN 'https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&playsinline=1&rel=0'
  END,

  video_services = CASE slug
    WHEN 'basile-kora' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'armand-tossou' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'lionel-agossou' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'aicha-hounkpatin' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'romaric-hountondji' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-ahouansou' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'carine-adjovi' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'jonas-ahodehou' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'senami-dossou' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'arnaud-zinsou' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'mireille-tognifode' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'ibrahim-lawani' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-adjakpa' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'grace-houessou' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'steve-kpade' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'nadege-kiki' THEN 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&playsinline=1&rel=0'
  END,

  video_pourquoi = CASE slug
    WHEN 'basile-kora' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'armand-tossou' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'lionel-agossou' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'aicha-hounkpatin' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'romaric-hountondji' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-ahouansou' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'carine-adjovi' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'jonas-ahodehou' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'senami-dossou' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'arnaud-zinsou' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'mireille-tognifode' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'ibrahim-lawani' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-adjakpa' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'grace-houessou' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'steve-kpade' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'nadege-kiki' THEN 'https://www.youtube.com/embed/bHQqvYy5KYo?autoplay=1&mute=1&playsinline=1&rel=0'
  END

WHERE slug IN (
  'basile-kora','armand-tossou','lionel-agossou','aicha-hounkpatin',
  'romaric-hountondji','koffi-ahouansou','carine-adjovi','jonas-ahodehou',
  'senami-dossou','arnaud-zinsou','mireille-tognifode','ibrahim-lawani',
  'koffi-adjakpa','grace-houessou','steve-kpade','nadege-kiki'
);

COMMIT;
