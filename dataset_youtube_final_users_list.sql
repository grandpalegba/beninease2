BEGIN;

UPDATE talents SET
  video_qui_je_suis = CASE slug
    WHEN 'basile-kora' THEN 'https://www.youtube.com/embed/DYsZEoem39k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'armand-tossou' THEN 'https://www.youtube.com/embed/Wvh5w7tNZbc?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'lionel-agossou' THEN 'https://www.youtube.com/embed/MFSOrMJMFOQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'aicha-hounkpatin' THEN 'https://www.youtube.com/embed/jHyFJWzIPq4?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'romaric-hountondji' THEN 'https://www.youtube.com/embed/jS3M_DwVEuk?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-ahouansou' THEN 'https://www.youtube.com/embed/Ve-W_EYHqUg?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'carine-adjovi' THEN 'https://www.youtube.com/embed/UqkW-2qi-0w?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'jonas-ahodehou' THEN 'https://www.youtube.com/embed/Nm55uuIsN_c?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'senami-dossou' THEN 'https://www.youtube.com/embed/3U5KrRWMS7E?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'arnaud-zinsou' THEN 'https://www.youtube.com/embed/GgLRVrI3XlI?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'mireille-tognifode' THEN 'https://www.youtube.com/embed/CK3sx_aTkR0?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'ibrahim-lawani' THEN 'https://www.youtube.com/embed/lQvR7pfIzu4?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-adjakpa' THEN 'https://www.youtube.com/embed/7hvqxD8VZf0?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'grace-houessou' THEN 'https://www.youtube.com/embed/gcTmDdWikeg?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'steve-kpade' THEN 'https://www.youtube.com/embed/ISyjljqUP1g?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'nadege-kiki' THEN 'https://www.youtube.com/embed/e-2Z7HpiM8U?autoplay=1&mute=1&playsinline=1&rel=0'
  END,

  video_histoire = CASE slug
    WHEN 'basile-kora' THEN 'https://www.youtube.com/embed/Wvh5w7tNZbc?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'armand-tossou' THEN 'https://www.youtube.com/embed/MFSOrMJMFOQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'lionel-agossou' THEN 'https://www.youtube.com/embed/jHyFJWzIPq4?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'aicha-hounkpatin' THEN 'https://www.youtube.com/embed/jS3M_DwVEuk?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'romaric-hountondji' THEN 'https://www.youtube.com/embed/Ve-W_EYHqUg?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-ahouansou' THEN 'https://www.youtube.com/embed/UqkW-2qi-0w?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'carine-adjovi' THEN 'https://www.youtube.com/embed/Nm55uuIsN_c?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'jonas-ahodehou' THEN 'https://www.youtube.com/embed/3U5KrRWMS7E?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'senami-dossou' THEN 'https://www.youtube.com/embed/GgLRVrI3XlI?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'arnaud-zinsou' THEN 'https://www.youtube.com/embed/CK3sx_aTkR0?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'mireille-tognifode' THEN 'https://www.youtube.com/embed/lQvR7pfIzu4?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'ibrahim-lawani' THEN 'https://www.youtube.com/embed/7hvqxD8VZf0?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-adjakpa' THEN 'https://www.youtube.com/embed/gcTmDdWikeg?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'grace-houessou' THEN 'https://www.youtube.com/embed/ISyjljqUP1g?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'steve-kpade' THEN 'https://www.youtube.com/embed/e-2Z7HpiM8U?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'nadege-kiki' THEN 'https://www.youtube.com/embed/DYsZEoem39k?autoplay=1&mute=1&playsinline=1&rel=0'
  END,

  video_services = CASE slug
    WHEN 'basile-kora' THEN 'https://www.youtube.com/embed/MFSOrMJMFOQ?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'armand-tossou' THEN 'https://www.youtube.com/embed/jHyFJWzIPq4?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'lionel-agossou' THEN 'https://www.youtube.com/embed/jS3M_DwVEuk?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'aicha-hounkpatin' THEN 'https://www.youtube.com/embed/Ve-W_EYHqUg?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'romaric-hountondji' THEN 'https://www.youtube.com/embed/UqkW-2qi-0w?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-ahouansou' THEN 'https://www.youtube.com/embed/Nm55uuIsN_c?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'carine-adjovi' THEN 'https://www.youtube.com/embed/3U5KrRWMS7E?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'jonas-ahodehou' THEN 'https://www.youtube.com/embed/GgLRVrI3XlI?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'senami-dossou' THEN 'https://www.youtube.com/embed/CK3sx_aTkR0?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'arnaud-zinsou' THEN 'https://www.youtube.com/embed/lQvR7pfIzu4?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'mireille-tognifode' THEN 'https://www.youtube.com/embed/7hvqxD8VZf0?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'ibrahim-lawani' THEN 'https://www.youtube.com/embed/gcTmDdWikeg?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-adjakpa' THEN 'https://www.youtube.com/embed/ISyjljqUP1g?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'grace-houessou' THEN 'https://www.youtube.com/embed/e-2Z7HpiM8U?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'steve-kpade' THEN 'https://www.youtube.com/embed/DYsZEoem39k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'nadege-kiki' THEN 'https://www.youtube.com/embed/Wvh5w7tNZbc?autoplay=1&mute=1&playsinline=1&rel=0'
  END,

  video_pourquoi = CASE slug
    WHEN 'basile-kora' THEN 'https://www.youtube.com/embed/jHyFJWzIPq4?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'armand-tossou' THEN 'https://www.youtube.com/embed/jS3M_DwVEuk?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'lionel-agossou' THEN 'https://www.youtube.com/embed/Ve-W_EYHqUg?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'aicha-hounkpatin' THEN 'https://www.youtube.com/embed/UqkW-2qi-0w?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'romaric-hountondji' THEN 'https://www.youtube.com/embed/Nm55uuIsN_c?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-ahouansou' THEN 'https://www.youtube.com/embed/3U5KrRWMS7E?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'carine-adjovi' THEN 'https://www.youtube.com/embed/GgLRVrI3XlI?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'jonas-ahodehou' THEN 'https://www.youtube.com/embed/CK3sx_aTkR0?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'senami-dossou' THEN 'https://www.youtube.com/embed/lQvR7pfIzu4?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'arnaud-zinsou' THEN 'https://www.youtube.com/embed/7hvqxD8VZf0?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'mireille-tognifode' THEN 'https://www.youtube.com/embed/gcTmDdWikeg?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'ibrahim-lawani' THEN 'https://www.youtube.com/embed/ISyjljqUP1g?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'koffi-adjakpa' THEN 'https://www.youtube.com/embed/e-2Z7HpiM8U?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'grace-houessou' THEN 'https://www.youtube.com/embed/DYsZEoem39k?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'steve-kpade' THEN 'https://www.youtube.com/embed/Wvh5w7tNZbc?autoplay=1&mute=1&playsinline=1&rel=0'
    WHEN 'nadege-kiki' THEN 'https://www.youtube.com/embed/MFSOrMJMFOQ?autoplay=1&mute=1&playsinline=1&rel=0'
  END

WHERE slug IN (
  'basile-kora','armand-tossou','lionel-agossou','aicha-hounkpatin',
  'romaric-hountondji','koffi-ahouansou','carine-adjovi','jonas-ahodehou',
  'senami-dossou','arnaud-zinsou','mireille-tognifode','ibrahim-lawani',
  'koffi-adjakpa','grace-houessou','steve-kpade','nadege-kiki'
);

COMMIT;
