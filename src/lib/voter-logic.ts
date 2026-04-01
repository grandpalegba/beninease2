import { universes } from "@/lib/data/universes";

export type VoterStatus = {
  level: number;
  label: string;
  minVotes: number;
  minUniverses: number;
  minCategories: number;
  color: string;
  bg: string;
  icon: string;
};

export const GRADES = [
  { level: 1, label: "Votant", minVotes: 0, minUniverses: 0, minCategories: 0 },
  { level: 2, label: "Électeur", minVotes: 5, minUniverses: 2, minCategories: 3 },
  { level: 3, label: "Grand Électeur", minVotes: 15, minUniverses: 4, minCategories: 8 },
  { level: 4, label: "Citoyen", minVotes: 35, minUniverses: 6, minCategories: 15 },
  { level: 5, label: "Citoyen Engagé", minVotes: 70, minUniverses: 9, minCategories: 25 },
  { level: 6, label: "Citoyen Conscient", minVotes: 120, minUniverses: 12, minCategories: 40 },
  { level: 7, label: "Référent", minVotes: 180, minUniverses: 14, minCategories: 55 },
  { level: 8, label: "Gardien", minVotes: 250, minUniverses: 16, minCategories: 64 }
];

export function calculateVoterStatus(votes: number, universes: number, categories: number) {
  let current = GRADES[0];
  for (const grade of GRADES) {
    if (votes >= grade.minVotes && universes >= grade.minUniverses && categories >= grade.minCategories) {
      current = grade;
    } else { break; }
  }
  return current;
}

export function getNextStatus(currentLevel: number) {
  return GRADES.find(g => g.level === currentLevel + 1) || null;
}

export function getUniverseFromCategory(category: string): string {
  // Match category to its universe
  const found = universes.find(u => 
    u.name === category || u.subs.includes(category)
  );
  return found ? found.name : "Autre";
}
