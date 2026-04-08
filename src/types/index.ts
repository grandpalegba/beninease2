export type UserRole = 'votant' | 'candidat' | 'ambassadeur' | 'jury' | 'admin';

export interface VoterSession {
  user: {
    id: string;
    email: string;
  };  // CORRECT: auth.users object structure
  email: string; // Changed from whatsapp to email for auth.users compatibility
  role: UserRole;
}

export interface Video {
  id: string;
  url: string;
  ambassadeur_id: string;
  title: string | null;
  description: string | null;
  created_at: string;
}

export interface Ambassadeur {
  id: string;
  slug: string;
  prenom: string | null;
  nom: string | null;
  univers: string;
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
  slogan: string | null;
  bio: string | null; // Utilisé pour bio_longue
  updated_at: string | null;
  video_1_id: string | null;
  video_2_id: string | null;
  video_3_id: string | null;
  video_4_id: string | null;
  video_urls: string[] | null;
  photo_urls: string[] | null;
  weighted_votes_total: number | null;
}

export interface Votant {
  id: string;
  email: string | null; // Changed from whatsapp to email for auth.users compatibility
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Vote {
  id: string;
  voter_id: string;
  ambassadeur_id: string;
  univers: string;
  categorie: string;
  created_at: string;
}

export interface Talent {
  id: string;
  prenom_talent: string | null;
  nom_talent: string | null;
  avatar_url: string | null;
  video_url: string | null;
  signature: string | null;
  votes_count: number;
  categorie: string | null;
  created_at: string;
}

export type EntityType = 'ambassadeur' | 'jury' | 'treasure' | 'talent';

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
