export type UserRole = 'votant' | 'candidat' | 'ambassadeur' | 'jury' | 'admin';

export interface Video {
  id: string;
  url: string;
  talent_id: string;
  title: string | null;
  description: string | null;
  created_at: string;
}

export interface Talent {
  id: string;
  slug: string;
  prenom: string | null;
  nom: string | null;
  categorie: string;
  avatar_url: string | null;
  votes: number;
  role: UserRole;
  type: string | null;
  is_validated: boolean;
  city: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  description: string | null;
  title: string | null;
  bio: string | null;
  updated_at: string | null;
  video_1_id: string | null;
  video_2_id: string | null;
  video_3_id: string | null;
  video_4_id: string | null;
}

export interface Votant {
  id: string;
  whatsapp: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Vote {
  id: string;
  votant_id: string;
  talent_id: string;
  univers: string;
  categorie: string;
  vote_date: string;
}

export type EntityType = 'talent' | 'jury' | 'treasure';

export interface Treasure {
  id: string;
  slug: string;
  title: string;
  description: string;
  categorie: 'Royauté' | 'Culture' | string;
  image_url: string | null;
  is_validated: boolean;
  video_1_id: string | null;
  video_2_id: string | null;
  video_3_id: string | null;
  video_4_id: string | null;
}
