export interface Consultation {
  id: string;
  rowIndex: number;
  colIndex: number;
  author: string;
  reflection: string;
  videoSeed: number;
  lifeCase: {
    image: string;
    label: string;
    title: string;
    quote: string;
    persona: string;
  };
  signX: { name: string; code: [number, number, number, number]; value: string };
  signY: { name: string; code: [number, number, number, number]; value: string };
  dynamicWord: string;
  scores: { count: number };
  isAnonymous: boolean;
  age?: number;
}

export const CONSULTATIONS: Consultation[] = [
  {
    id: "1",
    author: "Bokônon Koffi",
    reflection: "La patience est le chemin de la sagesse.",
    videoSeed: 1,
    lifeCase: {
      image: "/assets/hero-benin-2.png",
      label: "Sagesse",
      title: "Le dilemme du pêcheur",
      quote: "Dois-je partir en mer malgré la tempête ?",
      persona: "Koffi, 45 ans, Pêcheur"
    },
    signX: { name: "Gbé", code: [1,1,1,1], value: "Transmission" },
    signY: { name: "Yɛku", code: [2,2,2,2], value: "Lucidité" },
    dynamicWord: "Enseignement",
    scores: { count: 12 },
    isAnonymous: false,
    age: 45
  }
];
