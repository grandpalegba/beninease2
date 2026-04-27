"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Types
interface Location {
  ville: string;
  pays: string;
  institution?: string;
  coords?: [number, number];
}

interface JourneyMapProps {
  origine: Location;
  exil: Location;
  spoliationDate: string;
  spoliationEvent: string;
}

const CITY_COORDS: Record<string, [number, number]> = {
  // Bénin
  "Abomey": [7.1855, 1.9912],
  "Cotonou": [6.3654, 2.4183],
  "Porto-Novo": [6.4969, 2.6288],
  "Ouidah": [6.3667, 2.0833],
  "Dahomey": [7.1855, 1.9912],
  "Bénin": [9.3077, 2.3158],
  
  // France
  "Paris": [48.8566, 2.3522],
  "Lyon": [45.7640, 4.8357],
  "Marseille": [43.2965, 5.3698],
  "Le Havre": [49.4944, 0.1079],
  "France": [46.2276, 2.2137],

  // Royaume-Uni
  "Londres": [51.5074, -0.1278],
  "London": [51.5074, -0.1278],
  "Oxford": [51.7520, -1.2577],
  "Cambridge": [52.2053, 0.1218],
  "Royaume-Uni": [55.3781, -3.4360],
  "UK": [55.3781, -3.4360],

  // Allemagne
  "Berlin": [52.5200, 13.4050],
  "Hambourg": [53.5511, 9.9937],
  "Leipzig": [51.3397, 12.3731],
  "Allemagne": [51.1657, 10.4515],

  // Suisse
  "Genève": [46.2044, 6.1432],
  "Zurich": [47.3769, 8.5417],
  "Bâle": [47.5596, 7.5886],
  "Suisse": [46.8182, 8.2275],

  // Pays-Bas
  "Amsterdam": [52.3676, 4.9041],
  "Leyde": [52.1601, 4.4970],
  "Pays-Bas": [52.1326, 5.2913],

  // Belgique
  "Bruxelles": [50.8503, 4.3517],
  "Tervuren": [50.8247, 4.5126],
  "Belgique": [50.5039, 4.4699],

  // USA
  "New York": [40.7128, -74.0060],
  "Washington": [38.9072, -77.0369],
  "USA": [37.0902, -95.7129],
};

// Use dynamic import for the map component with SSR disabled
const MapComponent = dynamic(() => import("./MapComponent"), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
      <p className="text-[10px] uppercase tracking-widest text-gray-300 animate-pulse">Chargement de la carte...</p>
    </div>
  )
});

export function JourneyMap({ origine, exil, spoliationDate, spoliationEvent }: JourneyMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const startPos: [number, number] = origine.coords || CITY_COORDS[origine.ville] || CITY_COORDS[origine.pays] || CITY_COORDS["Bénin"];
  const endPos: [number, number] = exil.coords || CITY_COORDS[exil.ville] || CITY_COORDS[exil.pays] || CITY_COORDS["Paris"];

  return (
    <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm bg-white h-full flex flex-col">
      <div className="flex-1 w-full bg-gray-100 relative min-h-[400px]">
        {isMounted && (
          <MapComponent startPos={startPos} endPos={endPos} origine={origine} exil={exil} />
        )}
      </div>
    </div>
  );
}
