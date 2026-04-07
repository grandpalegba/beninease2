BEGIN;

UPDATE talents
SET
  photo_qui_je_suis = CASE slug
    WHEN 'basile-kora'        THEN 'https://images.unsplash.com/photo-Z3zRUPN0YVQ?auto=format&fit=crop&w=1200&q=80'
    WHEN 'armand-tossou'      THEN 'https://images.unsplash.com/photo-4Yv84VgQkRM?auto=format&fit=crop&w=1200&q=80'
    WHEN 'lionel-agossou'     THEN 'https://images.unsplash.com/photo-UZqhx42lfgI?auto=format&fit=crop&w=1200&q=80'
    WHEN 'aicha-hounkpatin'   THEN 'https://images.unsplash.com/photo-i2hoD-C2RUA?auto=format&fit=crop&w=1200&q=80'
    WHEN 'romaric-hountondji' THEN 'https://images.unsplash.com/photo-ioRBT9swcK8?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-ahouansou'    THEN 'https://images.unsplash.com/photo-a6Y-K1duTk8?auto=format&fit=crop&w=1200&q=80'
    WHEN 'carine-adjovi'      THEN 'https://images.unsplash.com/photo-aU_eOcelLhQ?auto=format&fit=crop&w=1200&q=80'
    WHEN 'jonas-ahodehou'     THEN 'https://images.unsplash.com/photo-RGsjc0D0p_o?auto=format&fit=crop&w=1200&q=80'
    WHEN 'senami-dossou'      THEN 'https://images.unsplash.com/photo-0cgpyigyIkM?auto=format&fit=crop&w=1200&q=80'
    WHEN 'arnaud-zinsou'      THEN 'https://images.unsplash.com/photo-VyFMlAecJpU?auto=format&fit=crop&w=1200&q=80'
    WHEN 'mireille-tognifode' THEN 'https://images.unsplash.com/photo-RcqKOjX0ZHE?auto=format&fit=crop&w=1200&q=80'
    WHEN 'ibrahim-lawani'     THEN 'https://images.unsplash.com/photo-e-TuK4z2LhY?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-adjakpa'      THEN 'https://images.unsplash.com/photo-tOshpNl-sW4?auto=format&fit=crop&w=1200&q=80'
    WHEN 'grace-houessou'     THEN 'https://images.unsplash.com/photo-QS9ZX5UnS14?auto=format&fit=crop&w=1200&q=80'
    WHEN 'steve-kpade'        THEN 'https://images.unsplash.com/photo-kwzWjTnDPLk?auto=format&fit=crop&w=1200&q=80'
    WHEN 'nadege-kiki'        THEN 'https://images.unsplash.com/photo-xmSWVeGEnJw?auto=format&fit=crop&w=1200&q=80'
  END,

  photo_histoire = CASE slug
    WHEN 'basile-kora'        THEN 'https://images.unsplash.com/photo-ZY0eI-L-FBc?auto=format&fit=crop&w=1200&q=80'
    WHEN 'armand-tossou'      THEN 'https://images.unsplash.com/photo-6UqJTfoXIq8?auto=format&fit=crop&w=1200&q=80'
    WHEN 'lionel-agossou'     THEN 'https://images.unsplash.com/photo-grYEjcIopgc?auto=format&fit=crop&w=1200&q=80'
    WHEN 'aicha-hounkpatin'   THEN 'https://images.unsplash.com/photo-GpPZLl7RM-A?auto=format&fit=crop&w=1200&q=80'
    WHEN 'romaric-hountondji' THEN 'https://images.unsplash.com/photo-vvQW-3yfuos?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-ahouansou'    THEN 'https://images.unsplash.com/photo-xNIc8pWjglM?auto=format&fit=crop&w=1200&q=80'
    WHEN 'carine-adjovi'      THEN 'https://images.unsplash.com/photo-KFO2m5Ms1Pc?auto=format&fit=crop&w=1200&q=80'
    WHEN 'jonas-ahodehou'     THEN 'https://images.unsplash.com/photo-Mf_J-HCtBcU?auto=format&fit=crop&w=1200&q=80'
    WHEN 'senami-dossou'      THEN 'https://images.unsplash.com/photo-SPS796v4KmM?auto=format&fit=crop&w=1200&q=80'
    WHEN 'arnaud-zinsou'      THEN 'https://images.unsplash.com/photo-tqkzjhnI9i8?auto=format&fit=crop&w=1200&q=80'
    WHEN 'mireille-tognifode' THEN 'https://images.unsplash.com/photo-jEEYZsaxbH4?auto=format&fit=crop&w=1200&q=80'
    WHEN 'ibrahim-lawani'     THEN 'https://images.unsplash.com/photo-RnQliMw6b4o?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-adjakpa'      THEN 'https://images.unsplash.com/photo-JoQqx0fOORU?auto=format&fit=crop&w=1200&q=80'
    WHEN 'grace-houessou'     THEN 'https://images.unsplash.com/photo-Tb9D4Ix9oYo?auto=format&fit=crop&w=1200&q=80'
    WHEN 'steve-kpade'        THEN 'https://images.unsplash.com/photo-pqiqRpE73Xs?auto=format&fit=crop&w=1200&q=80'
    WHEN 'nadege-kiki'        THEN 'https://images.unsplash.com/photo-aqmgLrdyz3E?auto=format&fit=crop&w=1200&q=80'
  END,

  photo_services = CASE slug
    WHEN 'basile-kora'        THEN 'https://images.unsplash.com/photo-DZMmcKTZCbA?auto=format&fit=crop&w=1200&q=80'
    WHEN 'armand-tossou'      THEN 'https://images.unsplash.com/photo-AEEL554dZqI?auto=format&fit=crop&w=1200&q=80'
    WHEN 'lionel-agossou'     THEN 'https://images.unsplash.com/photo-xzM6dK7nxME?auto=format&fit=crop&w=1200&q=80'
    WHEN 'aicha-hounkpatin'   THEN 'https://images.unsplash.com/photo-fBCptLC4GJY?auto=format&fit=crop&w=1200&q=80'
    WHEN 'romaric-hountondji' THEN 'https://images.unsplash.com/photo-M7ALc3UuX_g?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-ahouansou'    THEN 'https://images.unsplash.com/photo-ME416b6sp2?auto=format&fit=crop&w=1200&q=80'
    WHEN 'carine-adjovi'      THEN 'https://images.unsplash.com/photo-xY5injZuStQ?auto=format&fit=crop&w=1200&q=80'
    WHEN 'jonas-ahodehou'     THEN 'https://images.unsplash.com/photo-7-Y-O6FA9wE?auto=format&fit=crop&w=1200&q=80'
    WHEN 'senami-dossou'      THEN 'https://images.unsplash.com/photo-lH973Qz0Iy4?auto=format&fit=crop&w=1200&q=80'
    WHEN 'arnaud-zinsou'      THEN 'https://images.unsplash.com/photo-us5Ti3ladQY?auto=format&fit=crop&w=1200&q=80'
    WHEN 'mireille-tognifode' THEN 'https://images.unsplash.com/photo-9uKNyQxX04I?auto=format&fit=crop&w=1200&q=80'
    WHEN 'ibrahim-lawani'     THEN 'https://images.unsplash.com/photo-aV5lsZfxOwg?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-adjakpa'      THEN 'https://images.unsplash.com/photo-1AoGjqdyDLU?auto=format&fit=crop&w=1200&q=80'
    WHEN 'grace-houessou'     THEN 'https://images.unsplash.com/photo-Mx4auh5zO4w?auto=format&fit=crop&w=1200&q=80'
    WHEN 'steve-kpade'        THEN 'https://images.unsplash.com/photo-Wu3yqve2gnc?auto=format&fit=crop&w=1200&q=80'
    WHEN 'nadege-kiki'        THEN 'https://images.unsplash.com/photo-f6HbVnGtNnY?auto=format&fit=crop&w=1200&q=80'
  END,

  photo_pourquoi = CASE slug
    WHEN 'basile-kora'        THEN 'https://images.unsplash.com/photo-G-3AiLWJZTE?auto=format&fit=crop&w=1200&q=80'
    WHEN 'armand-tossou'      THEN 'https://images.unsplash.com/photo-GSh_PwsZsPQ?auto=format&fit=crop&w=1200&q=80'
    WHEN 'lionel-agossou'     THEN 'https://images.unsplash.com/photo-tvTFMDwH-cQ?auto=format&fit=crop&w=1200&q=80'
    WHEN 'aicha-hounkpatin'   THEN 'https://images.unsplash.com/photo-8-lNqEyAiY8?auto=format&fit=crop&w=1200&q=80'
    WHEN 'romaric-hountondji' THEN 'https://images.unsplash.com/photo-BQfzl7E9GQ8?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-ahouansou'    THEN 'https://images.unsplash.com/photo-_xK71jblMv8?auto=format&fit=crop&w=1200&q=80'
    WHEN 'carine-adjovi'      THEN 'https://images.unsplash.com/photo-XAOVn2V6Jd0?auto=format&fit=crop&w=1200&q=80'
    WHEN 'jonas-ahodehou'     THEN 'https://images.unsplash.com/photo-9NJXIPMlGPo?auto=format&fit=crop&w=1200&q=80'
    WHEN 'senami-dossou'      THEN 'https://images.unsplash.com/photo-h1lA3N5wb8M?auto=format&fit=crop&w=1200&q=80'
    WHEN 'arnaud-zinsou'      THEN 'https://images.unsplash.com/photo-1I3_xTAXTxo?auto=format&fit=crop&w=1200&q=80'
    WHEN 'mireille-tognifode' THEN 'https://images.unsplash.com/photo-1YnBzhJISg4?auto=format&fit=crop&w=1200&q=80'
    WHEN 'ibrahim-lawani'     THEN 'https://images.unsplash.com/photo-r7ZIVIgLzgs?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-adjakpa'      THEN 'https://images.unsplash.com/photo-yrzBgqapG1I?auto=format&fit=crop&w=1200&q=80'
    WHEN 'grace-houessou'     THEN 'https://images.unsplash.com/photo-m0DUL38R49Y?auto=format&fit=crop&w=1200&q=80'
    WHEN 'steve-kpade'        THEN 'https://images.unsplash.com/photo-wtk4VH8EU20?auto=format&fit=crop&w=1200&q=80'
    WHEN 'nadege-kiki'        THEN 'https://images.unsplash.com/photo-gB5qrP0eY50?auto=format&fit=crop&w=1200&q=80'
  END

WHERE slug IN (
  'basile-kora','armand-tossou','lionel-agossou','aicha-hounkpatin',
  'romaric-hountondji','koffi-ahouansou','carine-adjovi','jonas-ahodehou',
  'senami-dossou','arnaud-zinsou','mireille-tognifode','ibrahim-lawani',
  'koffi-adjakpa','grace-houessou','steve-kpade','nadege-kiki'
);

COMMIT;

-- ROLLBACK;
