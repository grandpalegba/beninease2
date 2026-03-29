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

export const VOTER_STATUSES: VoterStatus[] = [
  { level: 1, label: "Votant", minVotes: 1, minUniverses: 0, minCategories: 0, color: "#8E8E8E", bg: "bg-[#8E8E8E]/10", icon: "🗳️" },
  { level: 2, label: "Électeur", minVotes: 10, minUniverses: 2, minCategories: 0, color: "#008751", bg: "bg-[#008751]/10", icon: "✅" },
  { level: 3, label: "Électeur Actif", minVotes: 30, minUniverses: 4, minCategories: 0, color: "#006B3F", bg: "bg-[#006B3F]/10", icon: "🔥" },
  { level: 4, label: "Citoyen", minVotes: 80, minUniverses: 6, minCategories: 10, color: "#E9B113", bg: "bg-[#E9B113]/10", icon: "🇧🇯" },
  { level: 5, label: "Citoyen Engagé", minVotes: 160, minUniverses: 8, minCategories: 20, color: "#D4AF37", bg: "bg-[#D4AF37]/10", icon: "🤝" },
  { level: 6, label: "Citoyen Conscient", minVotes: 320, minUniverses: 12, minCategories: 40, color: "#C0C0C0", bg: "bg-[#C0C0C0]/10", icon: "🧠" },
  { level: 7, label: "Référent", minVotes: 600, minUniverses: 16, minCategories: 48, color: "#FFD700", bg: "bg-[#FFD700]/10", icon: "👑" },
];

export function calculateVoterStatus(voteCount: number, universeCount: number, categoryCount: number = 0): VoterStatus {
  // Start from the highest and find the first one that matches
  for (let i = VOTER_STATUSES.length - 1; i >= 0; i--) {
    const status = VOTER_STATUSES[i];
    if (voteCount >= status.minVotes && universeCount >= status.minUniverses && categoryCount >= status.minCategories) {
      return status;
    }
  }
  // Default to level 1 if at least one vote, or a special "Observateur" if 0 votes
  if (voteCount === 0) {
    return { level: 0, label: "Observateur", minVotes: 0, minUniverses: 0, minCategories: 0, color: "#8E8E8E", bg: "bg-[#8E8E8E]/5", icon: "👁️" };
  }
  return VOTER_STATUSES[0];
}

export function getNextStatus(currentLevel: number): VoterStatus | null {
  if (currentLevel >= VOTER_STATUSES.length) return null;
  return VOTER_STATUSES[currentLevel]; 
}

export function getUniverseFromCategory(category: string): string {
  // Match category to its universe
  const found = universes.find(u => 
    u.name === category || u.subs.includes(category)
  );
  return found ? found.name : "Autre";
}
