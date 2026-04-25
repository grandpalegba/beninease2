/**
 * src/data/series.ts
 * Types alignés strictement sur le schéma Supabase (snake_case).
 * Tables : series_histoires · profiles_histoires · investissements_histoires · evaluations_histoires
 */

export type Serie = {
  id: string;
  titre: string;
  synopsis: string | null;
  affiche_url: string | null;
  episode_numero: number;
  episode_titre: string | null;
  episode_question: string | null;
  created_at?: string;
};

/** Élément JSONB dans profiles_histoires.video_urls */
export type Episode = {
  id: string;
  titre: string;
  video_url: string;
};

export type Profil = {
  id: string;
  series_id: string;
  nom_complet: string;
  age: number | null;
  profession: string | null;
  bio_courte: string | null;
  photo_url: string | null;
  valeur_noix_benies: number;
  video_urls: Episode[]; // JSONB → tableau d'Episodes
  total_investisseurs: number;
  numero_profil: number | null;
  accent?: string; // Optionnel pour theming design
};

export type InvestissementHistoire = {
  id: string;
  joueur_id: string;
  profil_id: string;
  montant_noix_investies: number;
  valeur_a_l_achat: number;
};

export type EvaluationHistoire = {
  id: string;
  joueur_id: string;
  impact: number;
  originalite: number;
  authenticite: number;
};

/** Type enrichi : profil + série embarquée (résultat de la jointure Supabase) */
export type ProfilAvecSerie = Profil & {
  serie: Serie | null;
};
