
export interface DuMajeur {
  name: string;
  pattern: number[]; // 1 for single dot, 2 for double dot
}

export interface SigneFa {
  nom: string;
  duGauche: DuMajeur;
  duDroite: DuMajeur;
}

export const DU_MAJEURS: DuMajeur[] = [
  { name: "Gbé", pattern: [1, 1, 1, 1] },
  { name: "Yɛku", pattern: [2, 2, 2, 2] },
  { name: "Woli", pattern: [2, 1, 1, 2] },
  { name: "Di", pattern: [1, 2, 2, 1] },
  { name: "Loṣo", pattern: [1, 1, 2, 2] },
  { name: "Winlin", pattern: [2, 2, 1, 1] },
  { name: "Abla", pattern: [2, 1, 2, 1] },
  { name: "Aklan", pattern: [1, 2, 1, 2] },
  { name: "Guda", pattern: [1, 1, 1, 2] },
  { name: "Sa", pattern: [2, 1, 1, 1] },
  { name: "Ka", pattern: [2, 2, 2, 1] },
  { name: "Trukpin", pattern: [1, 2, 2, 2] },
  { name: "Tula", pattern: [1, 2, 1, 1] },
  { name: "Lɛtɛ", pattern: [2, 1, 2, 2] },
  { name: "Cɛ", pattern: [1, 1, 2, 1] },
  { name: "Fu", pattern: [2, 2, 1, 2] },
];

export function genererTirage(): SigneFa {
  const left = DU_MAJEURS[Math.floor(Math.random() * DU_MAJEURS.length)];
  const right = DU_MAJEURS[Math.floor(Math.random() * DU_MAJEURS.length)];
  
  return {
    nom: left.name === right.name ? `${left.name} Mèdji` : `${left.name} ${right.name}`,
    duGauche: left,
    duDroite: right,
  };
}
