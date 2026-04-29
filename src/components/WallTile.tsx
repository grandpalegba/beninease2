'use client';

import { memo } from "react";
import { motion } from "framer-motion";
import { PROFILE_PHOTOS } from "@/assets/profiles";
import type { Consultation } from "@/data/consultations";
import type { Profile } from "@/hooks/useProfiles";

interface Props {
  data?: Consultation | Profile | null; // Rendu optionnel
  index: number;
  isSelected?: boolean;
  onClick?: (d: any) => void;
}

const TILE_BACKGROUNDS = [
  "#0d0d0d", // noir profond
  "#f7f1e6", // beige clair
  "#3a2a1c", // terre brûlée
  "#c97b3a", // ocre
  "#1a3a2a", // vert sombre
  "#e8d5b7", // sable
  "#7a1f1a", // bordeaux
  "#2d2f2f", // gris anthracite
  "#d4a574", // miel
  "#0a2540", // bleu nuit
  "#a8501f", // brique
  "#f0e6d2", // ivoire
];

const BENIN_ACCENTS = [
  "hsl(var(--benin-green))",
  "hsl(var(--benin-yellow))",
  "hsl(var(--benin-red))",
];

const WallTile = memo(({ data, index, isSelected, onClick }: Props) => {
  // --- ÉTAT VIDE (Sable) ---
  if (!data) {
    const tileBg = TILE_BACKGROUNDS[index % TILE_BACKGROUNDS.length];
    return (
        layout
        className="relative w-full h-full"
        style={{ backgroundColor: tileBg }}
      />
    );
  }

  // --- ÉTAT PLEIN (Bokônon) ---
  const isProfile = 'firstName' in data;
  
  // Mapping des données (Profil ou Consultation)
  const author = isProfile 
    ? `${(data as Profile).firstName} ${(data as Profile).lastName}`.trim() 
    : (data as Consultation).author;
    
  const videoSeed = isProfile ? (data as Profile).photoIndex : (data as Consultation).videoSeed;
  
  // Logique d'URL d'image : storage Supabase
  const storageBaseUrl = "https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/profile-photos/";
  let imageUrl = isProfile && (data as Profile).imageUrl ? (data as Profile).imageUrl : "";
  
  if (imageUrl) {
    if (!imageUrl.startsWith('http')) {
      imageUrl = `${storageBaseUrl}${imageUrl}`;
    }
  } else {
    imageUrl = PROFILE_PHOTOS[videoSeed % PROFILE_PHOTOS.length];
  }

  const tileBg = TILE_BACKGROUNDS[index % TILE_BACKGROUNDS.length];
  const accent = BENIN_ACCENTS[index % BENIN_ACCENTS.length];

  return (
    <motion.button
      layout
      variants={{
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1 }
      }}
      onClick={() => onClick?.(data)}
      className="relative w-full h-full overflow-hidden cursor-pointer group bg-transparent select-none p-0 m-0 block"
      animate={{
        opacity: [0.95, 1, 0.95]
      }}
      transition={{
        opacity: { duration: 4, repeat: Infinity, ease: "linear" },
        layout: { type: "spring", stiffness: 110, damping: 18 }
      }}
      whileHover={{ 
        scale: 1.15, 
        zIndex: 20,
        opacity: 1,
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
      }}
      style={{ backgroundColor: 'transparent', opacity: 1, width: '100%', height: '100%', display: 'block' }}
    >
      <motion.img
        src={imageUrl}
        alt={author}
        loading="lazy"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 5 + (index % 4), repeat: Infinity, ease: "easeInOut" }}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        className="absolute top-0 left-0 pointer-events-none select-none group-hover:scale-105 transition-transform duration-500"
      />

      {/* Overlay de sélection ou au survol */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        style={{
          boxShadow: isSelected 
            ? 'inset 0 0 0 3px #00693e' 
            : `inset 0 0 0 1px hsl(var(--border)), inset 0 0 0 4px ${accent}`,
          background: isSelected 
            ? 'linear-gradient(135deg, rgba(0,135,81,0.55) 0%, rgba(0,105,62,0.65) 100%)' 
            : 'transparent',
          mixBlendMode: isSelected ? 'multiply' : 'normal'
        }}
      />

      {/* Nom au survol */}
      <div className="absolute inset-x-0 bottom-0 px-1 py-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/85 to-transparent">
        <p className="text-white text-[8px] font-headline font-medium truncate uppercase tracking-tighter" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
          {author}
        </p>
      </div>
    </motion.button>
  );
});

WallTile.displayName = "WallTile";
export default WallTile;