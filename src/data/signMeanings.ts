export interface SignMeaning {
  name: string;
  proverb: string;
  essence: string;
  vigilance: string;
  engagement: string;
  tier: "mother" | "child";
}

export function resolveFaSign(signXIdx: number, signYIdx: number): SignMeaning | null {
  // Mock resolver - in production this would contain all 256 signs
  return null;
}
