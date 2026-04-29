'use client';

// 16 Fongbé mother signs with binary codes and value mappings
// Code: 1 = single line, 2 = double line (4 rows per sign)

export interface FongbeSign {
  index: number;
  name: string;
  code: [number, number, number, number]; // top to bottom
  value: string;
  valueIndex: number; // index in DYNAMICS_MATRIX
}

// Original DYNAMICS_MATRIX value order
const MATRIX_VALUE_ORDER = [
  "Transmission", "Bienveillance", "Créativité", "Gratitude",
  "Cohésion", "Empathie", "Authenticité", "Résilience",
  "Tolérance", "Équité", "Reliance", "Intuition",
  "Lucidité", "Persévérance", "Humilité", "Patience",
];

// Map from value name to its index in DYNAMICS_MATRIX
export const valueToMatrixIndex = (value: string): number =>
  MATRIX_VALUE_ORDER.indexOf(value);

// Canonical Fongbé sign codes (top → bottom): 1 = single line, 2 = double line.
// Reference: système Fa Fon — 256 signes (16 × 16 combinaisons).
// Order requested by user (0-15): Abla, Aklan, Di, Fu, Gbe, Guda, Ka, Lete, Loso, Sa, Tche, Trukpin, Tula, Winlin, Woli, Yeku
export const SIGNS: FongbeSign[] = [
  { index: 0,  name: "Abla",    code: [2,1,2,1], value: "Authenticité",  valueIndex: 6 },
  { index: 1,  name: "Aklan",   code: [1,2,1,2], value: "Patience",      valueIndex: 15 },
  { index: 2,  name: "Di",      code: [1,2,2,2], value: "Résilience",    valueIndex: 7 },
  { index: 3,  name: "Fu",      code: [2,2,1,2], value: "Tolérance",     valueIndex: 8 },
  { index: 4,  name: "Gbe",     code: [1,1,1,1], value: "Transmission",  valueIndex: 0 },
  { index: 5,  name: "Guda",    code: [1,2,2,1], value: "Cohésion",      valueIndex: 4 },
  { index: 6,  name: "Ka",      code: [2,2,2,1], value: "Persévérance",  valueIndex: 13 },
  { index: 7,  name: "Lete",    code: [2,1,2,2], value: "Intuition",     valueIndex: 11 },
  { index: 8,  name: "Loso",    code: [1,1,2,2], value: "Équité",        valueIndex: 9 },
  { index: 9,  name: "Sa",      code: [2,1,1,2], value: "Reliance",      valueIndex: 10 },
  { index: 10, name: "Tche",    code: [1,1,2,1], value: "Bienveillance", valueIndex: 1 },
  { index: 11, name: "Trukpin", code: [1,1,1,2], value: "Humilité",      valueIndex: 14 },
  { index: 12, name: "Tula",    code: [1,2,1,1], value: "Gratitude",     valueIndex: 3 },
  { index: 13, name: "Winlin",  code: [2,2,1,1], value: "Empathie",      valueIndex: 5 },
  { index: 14, name: "Woli",    code: [2,1,1,1], value: "Créativité",    valueIndex: 2 },
  { index: 15, name: "Yeku",    code: [2,2,2,2], value: "Lucidité",      valueIndex: 12 },
];

// Shuffle an array (Fisher-Yates)
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
