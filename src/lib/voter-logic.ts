import { universes } from "@/lib/data/universes";

export type VoterStatus = {
  level: number;
  label: string;
  minVotes: number;
  minUniverses: number;
  color: string;
  bg: string;
  icon: string;
};

export const VOTER_STATUSES: VoterStatus[] = [
  { level: 1, label: "Observateur", minVotes: 0, minUniverses: 0, color: "#8E8E8E", bg: "bg-[#8E8E8E]/10", icon: "👁️" },
  { level: 2, label: "Électeur", minVotes: 5, minUniverses: 0, color: "#008751", bg: "bg-[#008751]/10", icon: "🗳️" },
  { level: 3, label: "Grand Électeur", minVotes: 15, minUniverses: 3, color: "#E9B113", bg: "bg-[#E9B113]/10", icon: "🌟" },
  { level: 4, label: "Citoyen Engagé", minVotes: 30, minUniverses: 8, color: "#E8112D", bg: "bg-[#E8112D]/10", icon: "🤝" },
  { level: 5, label: "Citoyen Conscient", minVotes: 50, minUniverses: 16, color: "#004d3d", bg: "bg-[#004d3d]/10", icon: "👑" },
];

export function calculateVoterStatus(voteCount: number, universeCount: number): VoterStatus {
  // Start from the highest and find the first one that matches
  for (let i = VOTER_STATUSES.length - 1; i >= 0; i--) {
    const status = VOTER_STATUSES[i];
    if (voteCount >= status.minVotes && universeCount >= status.minUniverses) {
      return status;
    }
  }
  return VOTER_STATUSES[0];
}

export function getNextStatus(currentLevel: number): VoterStatus | null {
  if (currentLevel >= VOTER_STATUSES.length) return null;
  return VOTER_STATUSES[currentLevel]; // levels are 1-indexed, so VOTER_STATUSES[level] is the next one
}

export function getUniverseFromCategory(category: string): string {
  // Match category to its universe
  const found = universes.find(u => 
    u.name === category || u.subs.includes(category)
  );
  return found ? found.name : "Autre";
}
