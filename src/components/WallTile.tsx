'use client';

import { memo } from "react";
import { motion } from "framer-motion";
import { PROFILE_PHOTOS } from "@/assets/profiles";
import type { Consultation } from "@/data/consultations";

interface Props {
  consultation?: Consultation | null; // Rendu optionnel
  index: number;
  isSelected?: boolean;
  onClick?: (c: Consultation) => void;
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

const WallTile = memo(({ consultation, index, isSelected, onClick }: Props) => {
  // --- ÉTAT VIDE (Sable) ---
  if (!consultation) {
    const tileBg = TILE_BACKGROUNDS[index % TILE_BACKGROUNDS.length];
    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.5 },
          visible: { opacity: 1, scale: 1 }
        }}
        animate={{ 
          y: [0, -1.5, 0, 1.5, 0],
          opacity: [0.92, 1, 0.92]
        }}
        transition={{
          y: { duration: 7 + (index % 5), repeat: Infinity, ease: "easeInOut", delay: (index % 7) * 0.35 },
          opacity: { duration: 4, repeat: Infinity, ease: "linear" },
          layout: { type: "spring", stiffness: 110, damping: 18 }
        }}
        layout
        whileHover={{ scale: 1.1, zIndex: 10 }}
        className="relative aspect-square overflow-hidden border-[0.5px] border-black/5"
        style={{ backgroundColor: tileBg, opacity: 0.7 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[2px] h-[2px] bg-white opacity-40 rounded-full" />
        </div>
      </motion.div>
    );
  }

  // --- ÉTAT PLEIN (Bokônon) ---
  const photo = PROFILE_PHOTOS[consultation.videoSeed % PROFILE_PHOTOS.length];
  const tileBg = TILE_BACKGROUNDS[index % TILE_BACKGROUNDS.length];
  const accent = BENIN_ACCENTS[index % BENIN_ACCENTS.length];

  return (
    <motion.button
      layout
      variants={{
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1 }
      }}
      onClick={() => onClick?.(consultation)}
      className="relative aspect-square overflow-hidden rounded-[2px] cursor-pointer group bg-neutral-800 select-none border-[0.5px] border-border shadow-none"
      animate={{
        y: [0, -1.5, 0, 1.5, 0],
        opacity: [0.92, 1, 0.92]
      }}
      transition={{
        y: { duration: 7 + (index % 5), repeat: Infinity, ease: "easeInOut", delay: (index % 7) * 0.35 },
        opacity: { duration: 4, repeat: Infinity, ease: "linear" },
        layout: { type: "spring", stiffness: 110, damping: 18 }
      }}
      whileHover={{ 
        scale: 1.35, 
        zIndex: 20,
        opacity: 1,
        y: 0,
        boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
      }}
      style={{ backgroundColor: tileBg, opacity: 1 }}
    >
      <motion.img
        src={photo}
        alt={consultation.author}
        loading="lazy"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 5 + (index % 4), repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none sepia-[0.1] saturate-[0.9] group-hover:sepia-0 group-hover:saturate-100 transition-all duration-500"
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
          {consultation.author}
        </p>
      </div>
    </motion.button>
  );
});

WallTile.displayName = "WallTile";
export default WallTile;