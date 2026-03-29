export type UserRole = 'votant' | 'candidat' | 'ambassadeur' | 'jury' | 'admin';

export interface VideoSchema {
  video_1_id: string | null;
  video_2_id: string | null;
  video_3_id: string | null;
  video_4_id: string | null;
}

export interface Talent {
  id: string;
  slug: string;
  prenom: string | null;
  nom: string | null;
  category: string;
  categorie?: string;
  univers?: string;
  bio: string | null;
  avatar_url: string | null;
  votes: number;
  role?: string;
}

export interface Profile extends VideoSchema {
  id: string;
  slug: string;
  prenom: string | null;
  nom: string | null;
  category: string;
  categorie?: string;
  univers?: string;
  avatar_url: string | null;
  votes: number;
  role: UserRole;
  type: string | null;
  is_validated: boolean;
  city: string | null;
  whatsapp?: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  description: string | null;
  title: string | null;
  updated_at: string | null;
  bio?: string | null;
  full_name?: string | null;
}

export interface VoterSession {
  voter_id: string;
  whatsapp: string;
  role: UserRole;
}

export type EntityType = 'talent' | 'jury' | 'treasure';

export interface Treasure extends VideoSchema {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'Royauté' | 'Culture' | string;
  image_url: string | null;
  is_validated: boolean;
}
