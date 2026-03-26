export type Candidate = {
  id: string;
  slug: string;
  full_name: string;
  tagline: string;
  category: string;
  city: string;
  languages: string;
  portrait: string;
  tabs: {
    [key: string]: string;
  };
};

export const candidates: Candidate[] = [
  {
    id: "koffi-ahouansou",
    slug: "koffi-ahouansou",
    full_name: "Koffi Ahouansou",
    tagline: "Solutions de mobilité urbaine à Cotonou",
    category: "Transport & Mobilité",
    city: "Cotonou",
    languages: "Français, Fon, Mina",
    portrait: "/Talents/koffi-ahouansou.jpg",
    tabs: {
      "Qui je suis": "Je suis un entrepreneur qui organise le transport urbain pour le rendre fiable et accessible.",
      "Mon histoire": "J'ai commencé avec une moto, aujourd'hui je coordonne plusieurs chauffeurs dans la ville.",
      "Mon service": "Je propose des solutions de mobilité sécurisées et ponctuelles adaptées aux réalités locales.",
      "Pourquoi moi": "Parce que le transport est la base de toute activité économique."
    }
  },
  {
    id: "senami-dossou",
    slug: "senami-dossou",
    full_name: "Sènami Dossou",
    tagline: "Artisanat bois modernisé à Abomey",
    category: "Experts Métier",
    city: "Abomey",
    languages: "Français, Fon",
    portrait: "/Talents/senami-dossou.jpg",
    tabs: {
      "Qui je suis": "Je suis artisane spécialisée dans la transformation du bois et des matériaux locaux.",
      "Mon histoire": "Formée par mon père, j'ai modernisé un savoir-faire traditionnel.",
      "Mon service": "Je crée des objets durables adaptés aux besoins modernes.",
      "Pourquoi moi": "Parce que maîtriser un métier, c'est créer de la valeur réelle."
    }
  },
  {
    id: "ibrahim-lawani",
    slug: "ibrahim-lawani",
    full_name: "Dr Ibrahim Lawani",
    tagline: "Médecine accessible à Parakou",
    category: "Santé & Médecine",
    city: "Parakou",
    languages: "Français, Bariba, Dendi",
    portrait: "/Talents/ibrahim-lawani.jpg",
    tabs: {
      "Qui je suis": "Je suis médecin engagé dans l'accès aux soins en zone urbaine et périphérique.",
      "Mon histoire": "J'ai choisi de revenir exercer dans ma région d'origine.",
      "Mon service": "Je propose consultations, prévention et sensibilisation.",
      "Pourquoi moi": "Parce que la santé est la première richesse d'un peuple."
    }
  },
  {
    id: "arnaud-zinsou",
    slug: "arnaud-zinsou",
    full_name: "Arnaud Zinsou",
    tagline: "Stratégie digitale & création de contenu",
    category: "Médias & Digital",
    city: "Cotonou",
    languages: "Français, Anglais",
    portrait: "/Talents/arnaud-zinsou.jpg",
    tabs: {
      "Qui je suis": "Je suis créateur de contenu et stratège digital.",
      "Mon histoire": "J'ai construit une audience en valorisant les talents béninois.",
      "Mon service": "Je développe visibilité, branding et communication digitale.",
      "Pourquoi moi": "Parce que sans visibilité, aucun talent n'existe réellement."
    }
  },
  {
    id: "nadege-kiki",
    slug: "nadege-kiki",
    full_name: "Nadège Kiki",
    tagline: "Facilitation administrative à Porto-Novo",
    category: "Facilitateurs & Conciergerie",
    city: "Porto-Novo",
    languages: "Français, Yoruba, Goun",
    portrait: "/Talents/nadege-kiki.jpg",
    tabs: {
      "Qui je suis": "Je facilite les démarches et services du quotidien.",
      "Mon histoire": "J'ai aidé des dizaines de personnes à naviguer les complexités administratives.",
      "Mon service": "Je simplifie les démarches et fais gagner du temps.",
      "Pourquoi moi": "Parce que le temps est une ressource que peu savent protéger."
    }
  },
  {
    id: "lionel-agossou",
    slug: "lionel-agossou",
    full_name: "Lionel Agossou",
    tagline: "Art visuel inspiré du Danxomè",
    category: "Création & Culture",
    city: "Ouidah",
    languages: "Français, Fon",
    portrait: "/Talents/lionel-agossou.jpg",
    tabs: {
      "Qui je suis": "Je suis artiste visuel inspiré de l'histoire du Danxomè.",
      "Mon histoire": "Je transforme les récits historiques en œuvres contemporaines.",
      "Mon service": "Je crée des visuels, identités culturelles et storytelling visuel.",
      "Pourquoi moi": "Parce qu'un peuple sans image forte disparaît."
    }
  },
  {
    id: "romaric-hountondji",
    slug: "romaric-hountondji",
    full_name: "Romaric Hountondji",
    tagline: "Promotion immobilière à Calavi",
    category: "Immobilier & Construction",
    city: "Calavi",
    languages: "Français, Fon",
    portrait: "/Talents/romaric-hountondji.jpg",
    tabs: {
      "Qui je suis": "Je suis promoteur immobilier.",
      "Mon histoire": "J'ai commencé avec de petits chantiers, aujourd'hui je développe des logements.",
      "Mon service": "Je construis des habitations adaptées aux réalités locales.",
      "Pourquoi moi": "Parce que se loger dignement est une base."
    }
  },
  {
    id: "carine-adjovi",
    slug: "carine-adjovi",
    full_name: "Carine Adjovi",
    tagline: "Conseil et stratégie d'entreprise",
    category: "Business & Entreprises",
    city: "Cotonou",
    languages: "Français, Anglais",
    portrait: "/Talents/carine-adjovi.jpg",
    tabs: {
      "Qui je suis": "Je suis entrepreneure et consultante.",
      "Mon histoire": "J'accompagne des entreprises locales dans leur croissance.",
      "Mon service": "Stratégie, structuration et développement business.",
      "Pourquoi moi": "Parce que les idées sans structure échouent."
    }
  },
  {
    id: "jonas-ahodehou",
    slug: "jonas-ahodehou",
    full_name: "Jonas Ahodehou",
    tagline: "Guide touristique culturel à Ouidah",
    category: "Tourisme & Découvertes",
    city: "Ouidah",
    languages: "Français, Fon, Anglais",
    portrait: "/Talents/jonas-ahodehou.jpg",
    tabs: {
      "Qui je suis": "Je suis guide touristique.",
      "Mon histoire": "Je fais découvrir l'histoire du Bénin aux visiteurs.",
      "Mon service": "Visites culturelles, expériences immersives.",
      "Pourquoi moi": "Parce que connaître son histoire change sa vision du monde."
    }
  },
  {
    id: "koffi-adjakpa",
    slug: "koffi-adjakpa",
    full_name: "Koffi Adjakpa",
    tagline: "Gardien des traditions à Abomey",
    category: "Coutumes & Traditions",
    city: "Abomey",
    languages: "Fon, Français",
    portrait: "/Talents/koffi-adjakpa.jpg",
    tabs: {
      "Qui je suis": "Je suis gardien des traditions.",
      "Mon histoire": "Je transmets les rites et savoirs ancestraux.",
      "Mon service": "Transmission culturelle, éducation traditionnelle.",
      "Pourquoi moi": "Parce que sans transmission, tout disparaît."
    }
  },
  {
    id: "steve-kpade",
    slug: "steve-kpade",
    full_name: "Steve Kpadé",
    tagline: "Organisateur d'événements à Cotonou",
    category: "Événementiel & Vie Nocturne",
    city: "Cotonou",
    languages: "Français",
    portrait: "/Talents/steve-kpade.jpg",
    tabs: {
      "Qui je suis": "Je suis organisateur d'événements.",
      "Mon histoire": "J'ai lancé des événements populaires.",
      "Mon service": "Organisation, production et animation.",
      "Pourquoi moi": "Parce que rassembler crée des opportunités."
    }
  },
  {
    id: "mireille-tognifode",
    slug: "mireille-tognifode",
    full_name: "Mireille Tognifodé",
    tagline: "Hébergement touristique à Grand-Popo",
    category: "Hébergement & Séjour",
    city: "Grand-Popo",
    languages: "Français, Mina",
    portrait: "/Talents/mireille-tognifode.jpg",
    tabs: {
      "Qui je suis": "Je gère des hébergements touristiques.",
      "Mon histoire": "J'ai transformé une maison familiale en espace d'accueil.",
      "Mon service": "Hébergement et expérience locale.",
      "Pourquoi moi": "Parce que l'accueil définit l'image d'un pays."
    }
  },
  {
    id: "armand-tossou",
    slug: "armand-tossou",
    full_name: "Armand Tossou",
    tagline: "Coach sportif à Bohicon",
    category: "Bien-être & Fitness",
    city: "Bohicon",
    languages: "Français, Fon",
    portrait: "/Talents/armand-tossou.jpg",
    tabs: {
      "Qui je suis": "Coach sportif.",
      "Mon histoire": "J'aide les jeunes à améliorer leur condition physique.",
      "Mon service": "Coaching, nutrition, discipline.",
      "Pourquoi moi": "Parce que le corps est un outil de réussite."
    }
  },
  {
    id: "grace-houessou",
    slug: "grace-houessou",
    full_name: "Grâce Houessou",
    tagline: "Stylisme & mode africaine",
    category: "Mode & Beauté",
    city: "Cotonou",
    languages: "Français",
    portrait: "/Talents/grace-houessou.jpg",
    tabs: {
      "Qui je suis": "Styliste.",
      "Mon histoire": "Je valorise les tissus africains.",
      "Mon service": "Création mode et identité vestimentaire.",
      "Pourquoi moi": "Parce que l'image influence la perception."
    }
  },
  {
    id: "basile-kora",
    slug: "basile-kora",
    full_name: "Basile Kora",
    tagline: "Produits du terroir à Djougou",
    category: "Marchés & Produits Locaux",
    city: "Djougou",
    languages: "Dendi, Français",
    portrait: "/Talents/basile-kora.jpg",
    tabs: {
      "Qui je suis": "Commerçant local.",
      "Mon histoire": "Je valorise les produits du terroir.",
      "Mon service": "Distribution de produits locaux.",
      "Pourquoi moi": "Parce que consommer local renforce l'économie."
    }
  },
  {
    id: "aicha-hounkpatin",
    slug: "aicha-hounkpatin",
    full_name: "Aïcha Hounkpatin",
    tagline: "Cuisine traditionnelle à domicile à Cotonou",
    category: "Alimentation & Cuisine",
    city: "Cotonou",
    languages: "Français, Fon, Anglais",
    portrait: "/Talents/aicha-hounkpatin.jpg",
    tabs: {
      "Qui je suis": "Je m'appelle Aïcha, j'ai 28 ans et je suis passionnée par la cuisine béninoise. Chaque plat que je prépare raconte une histoire — celle de ma grand-mère, de mon quartier, de mon pays.",
      "Mon histoire": "Mon parcours a commencé dans la petite cuisine de ma grand-mère à Porto-Novo. C'est là que j'ai appris que cuisiner n'est pas seulement mélanger des ingrédients, c'est transmettre un héritage.",
      "Mon service": "Je propose une expérience culinaire immersive à domicile. Je me déplace avec mes épices et mon savoir-faire pour transformer votre dîner en un véritable voyage sensoriel au cœur du Bénin.",
      "Pourquoi moi": "Je mérite votre vote car je porte l'ambition de moderniser notre gastronomie tout en préservant ses racines. Être un Visage du Bénin serait l'opportunité de faire rayonner notre art de vivre."
    }
  }
];