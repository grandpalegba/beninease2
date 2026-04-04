// Types pour l'architecture Trésors - Structure réelle de la base

export interface Theme {
  id: string;
  name: string;
  order: number;
}

export interface Question {
  id: string;
  mystere_id: string;
  question: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_choice: number;
  explication: string;
}

export interface Mystere {
  id: string;
  theme_id: string;
  title: string;
  subtitle: string;
  mise_en_abyme: string;
  icon: string;
  mystere_number: number;
  theme?: Theme;
  questions?: Question[];
}

export interface UserTreasure {
  user_id: string;
  treasure_id: string;
  attempts: number;
  locked_until: string | null;
  current_step: number;
  lives_remaining: number;
}

export interface TreasuresState {
  mysteres: Mystere[];
  currentIndex: number;
  loading: boolean;
  error: string | null;
  userProgress: Record<string, UserTreasure>;
  currentLives: number;
  isLocked: boolean;
  lockEndTime: Date | null;
}
