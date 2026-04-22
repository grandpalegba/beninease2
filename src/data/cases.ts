export interface LifeCase {
  id: string;
  cas_numero: number;
  label: string;
  persona: string;
  title: string;
  quote: string;
  options: string[];
  verdicts: string[];
  audioUrls: string[];
  photoUrl: string;
  audioUrl: string;
}

export const LIFE_CASES: LifeCase[] = [];
