// Types pour l'architecture Trésors

export interface Theme {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Question {
  id: string;
  mystery_id: string;
  question_number: number;
  text: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface Mystery {
  id: string;
  theme_id: string;
  title: string;
  subtitle: string;
  icon: string;
  mise_en_abyme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  theme?: Theme;
  questions?: Question[];
}

export interface UserProgress {
  id: string;
  user_id: string;
  mystery_id: string;
  questions_completed: number;
  lives_lost: number;
  is_completed: boolean;
  cooldown_until?: string;
  created_at: string;
  updated_at: string;
}

export interface TreasuresState {
  mysteries: Mystery[];
  currentIndex: number;
  loading: boolean;
  error: string | null;
  userProgress: Record<string, UserProgress>;
  currentLives: number;
  isLocked: boolean;
  lockEndTime: Date | null;
}
