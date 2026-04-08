BEGIN;

UPDATE talents SET
  photo_qui_je_suis = CASE slug
    WHEN 'basile-kora' THEN 'https://images.unsplash.com/photo-1653894644705-4dcec1db7c17?auto=format&fit=crop&w=1200&q=80'
    WHEN 'armand-tossou' THEN 'https://images.unsplash.com/photo-1689714386361-daba745f13c1?auto=format&fit=crop&w=1200&q=80'
    WHEN 'lionel-agossou' THEN 'https://plus.unsplash.com/premium_photo-1739997055431-785219159a73?auto=format&fit=crop&w=1200&q=80'
    WHEN 'aicha-hounkpatin' THEN 'https://images.unsplash.com/photo-1613038356370-19ebac6bba0b?auto=format&fit=crop&w=1200&q=80'
    WHEN 'romaric-hountondji' THEN 'https://images.unsplash.com/photo-1576950219198-8d52b25c038e?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-ahouansou' THEN 'https://images.unsplash.com/photo-1753818268536-b3227488c3f8?auto=format&fit=crop&w=1200&q=80'
    WHEN 'carine-adjovi' THEN 'https://images.unsplash.com/photo-1719396727215-6dc095e4a782?auto=format&fit=crop&w=1200&q=80'
    WHEN 'jonas-ahodehou' THEN 'https://images.unsplash.com/photo-1586901129524-3d350a6fc17b?auto=format&fit=crop&w=1200&q=80'
    WHEN 'senami-dossou' THEN 'https://images.unsplash.com/photo-1549631592-21f0869589e2?auto=format&fit=crop&w=1200&q=80'
    WHEN 'arnaud-zinsou' THEN 'https://images.unsplash.com/photo-1586900942326-e2e8f7b7b793?auto=format&fit=crop&w=1200&q=80'
    WHEN 'mireille-tognifode' THEN 'https://images.unsplash.com/photo-1633257057610-1bba0e32afed?auto=format&fit=crop&w=1200&q=80'
    WHEN 'ibrahim-lawani' THEN 'https://images.unsplash.com/photo-1445262514300-c58bfa7d9557?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-adjakpa' THEN 'https://images.unsplash.com/photo-1655682603240-03df03520988?auto=format&fit=crop&w=1200&q=80'
    WHEN 'grace-houessou' THEN 'https://images.unsplash.com/photo-1734868032501-448d1457dc38?auto=format&fit=crop&w=1200&q=80'
    WHEN 'steve-kpade' THEN 'https://images.unsplash.com/photo-1583108607572-a8c0bfc741fd?auto=format&fit=crop&w=1200&q=80'
    WHEN 'nadege-kiki' THEN 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80'
  END,

  photo_histoire = CASE slug
    WHEN 'basile-kora' THEN 'https://images.unsplash.com/photo-1649502913092-fb7f0e8fc632?auto=format&fit=crop&w=1200&q=80'
    WHEN 'armand-tossou' THEN 'https://images.unsplash.com/photo-1569706971306-de5d78f6418e?auto=format&fit=crop&w=1200&q=80'
    WHEN 'lionel-agossou' THEN 'https://plus.unsplash.com/premium_photo-1702634273856-7d734021f6f6?auto=format&fit=crop&w=1200&q=80'
    WHEN 'aicha-hounkpatin' THEN 'https://images.unsplash.com/photo-1722072391426-964abfef1924?auto=format&fit=crop&w=1200&q=80'
    WHEN 'romaric-hountondji' THEN 'https://images.unsplash.com/photo-1473649085228-583485e6e4d7?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-ahouansou' THEN 'https://images.unsplash.com/photo-1509099896299-af46ad97ff57?auto=format&fit=crop&w=1200&q=80'
    WHEN 'carine-adjovi' THEN 'https://images.unsplash.com/photo-1487546331507-fcf8a5d27ab3?auto=format&fit=crop&w=1200&q=80'
    WHEN 'jonas-ahodehou' THEN 'https://images.unsplash.com/photo-1680713660046-67b7350ed679?auto=format&fit=crop&w=1200&q=80'
    WHEN 'senami-dossou' THEN 'https://images.unsplash.com/photo-1509100194014-d49809396daa?auto=format&fit=crop&w=1200&q=80'
    WHEN 'arnaud-zinsou' THEN 'https://images.unsplash.com/photo-1593351799227-75df2026356b?auto=format&fit=crop&w=1200&q=80'
    WHEN 'mireille-tognifode' THEN 'https://images.unsplash.com/photo-1471771450139-6bfdb4b2609a?auto=format&fit=crop&w=1200&q=80'
    WHEN 'ibrahim-lawani' THEN 'https://images.unsplash.com/photo-1757485096842-aef9f822ef26?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-adjakpa' THEN 'https://images.unsplash.com/photo-1659944998870-640f6ca4441f?auto=format&fit=crop&w=1200&q=80'
    WHEN 'grace-houessou' THEN 'https://plus.unsplash.com/premium_photo-1663956132370-e6208392d8b1?auto=format&fit=crop&w=1200&q=80'
    WHEN 'steve-kpade' THEN 'https://images.unsplash.com/photo-1552392497-16ceed8ab81a?auto=format&fit=crop&w=1200&q=80'
    WHEN 'nadege-kiki' THEN 'https://images.unsplash.com/photo-1765584830084-eb3d2268b263?auto=format&fit=crop&w=1200&q=80'
  END,

  photo_services = CASE slug
    WHEN 'basile-kora' THEN 'https://images.unsplash.com/photo-1761666519224-5f81305cf170?auto=format&fit=crop&w=1200&q=80'
    WHEN 'armand-tossou' THEN 'https://images.unsplash.com/photo-1713289590440-3159f2d6063c?auto=format&fit=crop&w=1200&q=80'
    WHEN 'lionel-agossou' THEN 'https://images.unsplash.com/photo-1739463981518-f6ad86692105?auto=format&fit=crop&w=1200&q=80'
    WHEN 'aicha-hounkpatin' THEN 'https://images.unsplash.com/photo-1741874299706-2b8e16839aaa?auto=format&fit=crop&w=1200&q=80'
    WHEN 'romaric-hountondji' THEN 'https://images.unsplash.com/photo-1759316777881-24c0b09c3a63?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-ahouansou' THEN 'https://images.unsplash.com/photo-1588349419102-ff038134f2af?auto=format&fit=crop&w=1200&q=80'
    WHEN 'carine-adjovi' THEN 'https://images.unsplash.com/photo-1655720357872-ce227e4164ba?auto=format&fit=crop&w=1200&q=80'
    WHEN 'jonas-ahodehou' THEN 'https://plus.unsplash.com/premium_photo-1681398556150-7fa0d1e72703?auto=format&fit=crop&w=1200&q=80'
    WHEN 'senami-dossou' THEN 'https://images.unsplash.com/photo-1655682597128-2b10c079cf83?auto=format&fit=crop&w=1200&q=80'
    WHEN 'arnaud-zinsou' THEN 'https://plus.unsplash.com/premium_photo-1663957818983-c5f5c9a753a9?auto=format&fit=crop&w=1200&q=80'
    WHEN 'mireille-tognifode' THEN 'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=1200&q=80'
    WHEN 'ibrahim-lawani' THEN 'https://plus.unsplash.com/premium_photo-1691411181835-f4f08c97e0a2?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-adjakpa' THEN 'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?auto=format&fit=crop&w=1200&q=80'
    WHEN 'grace-houessou' THEN 'https://images.unsplash.com/photo-1529245019870-59b249281fd3?auto=format&fit=crop&w=1200&q=80'
    WHEN 'steve-kpade' THEN 'https://images.unsplash.com/photo-1518601794912-1af91724e528?auto=format&fit=crop&w=1200&q=80'
    WHEN 'nadege-kiki' THEN 'https://images.unsplash.com/photo-1548918901-9b31223c5c3a?auto=format&fit=crop&w=1200&q=80'
  END,

  photo_pourquoi = CASE slug
    WHEN 'basile-kora' THEN 'https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?auto=format&fit=crop&w=1200&q=80'
    WHEN 'armand-tossou' THEN 'https://images.unsplash.com/photo-1530785602389-07594beb8b73?auto=format&fit=crop&w=1200&q=80'
    WHEN 'lionel-agossou' THEN 'https://images.unsplash.com/photo-1696962701419-6f510910e838?auto=format&fit=crop&w=1200&q=80'
    WHEN 'aicha-hounkpatin' THEN 'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&w=1200&q=80'
    WHEN 'romaric-hountondji' THEN 'https://images.unsplash.com/photo-1473594659356-a404044aa2c2?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-ahouansou' THEN 'https://plus.unsplash.com/premium_photo-1745839715788-a175764e0ccf?auto=format&fit=crop&w=1200&q=80'
    WHEN 'carine-adjovi' THEN 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=1200&q=80'
    WHEN 'jonas-ahodehou' THEN 'https://images.unsplash.com/photo-1531300185372-b7cbe2eddf0b?auto=format&fit=crop&w=1200&q=80'
    WHEN 'senami-dossou' THEN 'https://images.unsplash.com/photo-1542513217-0b0eedf7005d?auto=format&fit=crop&w=1200&q=80'
    WHEN 'arnaud-zinsou' THEN 'https://images.unsplash.com/photo-1543366749-4dad497ea0a0?auto=format&fit=crop&w=1200&q=80'
    WHEN 'mireille-tognifode' THEN 'https://images.unsplash.com/photo-1613876215075-276fd62c89a4?auto=format&fit=crop&w=1200&q=80'
    WHEN 'ibrahim-lawani' THEN 'https://images.unsplash.com/photo-1622923047319-304b570ac19b?auto=format&fit=crop&w=1200&q=80'
    WHEN 'koffi-adjakpa' THEN 'https://images.unsplash.com/photo-1522512115668-c09775d6f424?auto=format&fit=crop&w=1200&q=80'
    WHEN 'grace-houessou' THEN 'https://plus.unsplash.com/premium_photo-1666789257491-287aad9658b6?auto=format&fit=crop&w=1200&q=80'
    WHEN 'steve-kpade' THEN 'https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?auto=format&fit=crop&w=1200&q=80'
    WHEN 'nadege-kiki' THEN 'https://plus.unsplash.com/premium_photo-1666789257718-cdae84486bdb?auto=format&fit=crop&w=1200&q=80'
  END

WHERE slug IN ('basile-kora','armand-tossou','lionel-agossou','aicha-hounkpatin','romaric-hountondji','koffi-ahouansou','carine-adjovi','jonas-ahodehou','senami-dossou','arnaud-zinsou','mireille-tognifode','ibrahim-lawani','koffi-adjakpa','grace-houessou','steve-kpade','nadege-kiki');

COMMIT;
