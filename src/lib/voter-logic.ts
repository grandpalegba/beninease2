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
  { level: 1, label: "Votant", minVotes: 0, minUniverses: 0, minCategories: 0, color: "#8E8E8E", bg: "bg-[#8E8E8E]/10", icon: "🗳️" },
  { level: 2, label: "Électeur", minVotes: 5, minUniverses: 2, minCategories: 3, color: "#008751", bg: "bg-[#008751]/10", icon: "✅" },
  { level: 3, label: "Grand Électeur", minVotes: 15, minUniverses: 4, minCategories: 8, color: "#006B3F", bg: "bg-[#006B3F]/10", icon: "🔥" },
  { level: 4, label: "Citoyen", minVotes: 35, minUniverses: 6, minCategories: 15, color: "#E9B113", bg: "bg-[#E9B113]/10", icon: "🇧🇯" },
  { level: 5, label: "Citoyen Engagé", minVotes: 70, minUniverses: 9, minCategories: 25, color: "#D4AF37", bg: "bg-[#D4AF37]/10", icon: "🤝" },
  { level: 6, label: "Citoyen Conscient", minVotes: 120, minUniverses: 12, minCategories: 40, color: "#C0C0C0", bg: "bg-[#C0C0C0]/10", icon: "🧠" },
  { level: 7, label: "Référent", minVotes: 180, minUniverses: 14, minCategories: 55, color: "#FFD700", bg: "bg-[#FFD700]/10", icon: "👑" },
  { level: 8, label: "Gardien", minVotes: 250, minUniverses: 16, minCategories: 64, color: "#FF6B35", bg: "bg-[#FF6B35]/10", icon: "🛡️" },
];

export function calculateVoterStatus(voteCount: number, universeCount: number, categoryCount: number = 0): VoterStatus {
  // Start from the highest and find the first one that matches
  for (let i = VOTER_STATUSES.length - 1; i >= 0; i--) {
    const status = VOTER_STATUSES[i];
    if (voteCount >= status.minVotes && universeCount >= status.minUniverses && categoryCount >= status.minCategories) {
      return status;
    }
  }
  // Default to level 1 (Votant) if no criteria met
  return VOTER_STATUSES[0];
}

export function getNextStatus(currentLevel: number): VoterStatus | null {
  if (currentLevel >= VOTER_STATUSES.length) return null;
  return VOTER_STATUSES[currentLevel - 1]; // Adjust for 0-based array access
}

export function getUniverseFromCategory(category: string): string {
  // Match category to its universe
  const found = universes.find(u => 
    u.name === category || u.subs.includes(category)
  );
  return found ? found.name : "Autre";
}
