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
  "Abomey": [7.1855, 1.9912],
  "Cotonou": [6.3654, 2.4183],
  "Porto-Novo": [6.4969, 2.6288],
  "Paris": [48.8566, 2.3522],
  "Londres": [51.5074, -0.1278],
  "Berlin": [52.5200, 13.4050],
  "Oxford": [51.7520, -1.2577],
  "Dahomey": [7.1855, 1.9912],
  "Bénin": [9.3077, 2.3158],
  "France": [46.2276, 2.2137],
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

  const startPos: [number, number] = origine.coords || CITY_COORDS[origine.ville] || CITY_COORDS["Abomey"];
  const endPos: [number, number] = exil.coords || CITY_COORDS[exil.ville] || CITY_COORDS["Paris"];

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
