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

const SACRED_COLORS = [
  "#008751", // Vert Bénin (Forêt/Espoir)
  "#fcd116", // Jaune Bénin (Soleil/Richesse)
  "#e8112d", // Rouge Bénin (Force/Terre rouge)
  "#0a2540", // Bleu profond (Indigo/Nuit sacrée)
  "#d4a574", // Ocre (Sable)
  "#a8501f", // Terre brûlée
  "#f0e6d2", // Beige (Coton)
  "#3a2a1c"  // Brun (Bois d'Ebène)
];

const WallTile = memo(({ consultation, index, isSelected, onClick }: Props) => {
  // --- ÉTAT VIDE (Sable) ---
  if (!consultation) {
    const tileColor = SACRED_COLORS[index % SACRED_COLORS.length];
    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.5 },
          visible: { opacity: 1, scale: 1 }
        }}
        animate={{ 
          y: [0, -2, 0],
          x: [0, 1.2, 0, -1.2, 0]
        }}
        transition={{
          y: { duration: 10 + (index % 10), repeat: Infinity, ease: "easeInOut", delay: (index % 15) * 0.5 },
          x: { duration: 15 + (index % 8), repeat: Infinity, ease: "easeInOut", delay: (index % 15) * 0.5 },
          layout: { duration: 1.5, type: "spring" }
        }}
        layout
        whileHover={{ opacity: 1, zIndex: 50, scale: 1.1 }}
        className="relative aspect-square overflow-hidden border-[0.5px] border-black/5"
        style={{ backgroundColor: tileColor, opacity: 0.7 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[2px] h-[2px] bg-white opacity-40 rounded-full" />
        </div>
      </motion.div>
    );
  }

  // --- ÉTAT PLEIN (Bokônon) ---
  const photo = PROFILE_PHOTOS[consultation.videoSeed % PROFILE_PHOTOS.length];
  const tileBg = SACRED_COLORS[index % SACRED_COLORS.length];

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
        y: [0, -2, 0],
        x: [0, 1.2, 0, -1.2, 0]
      }}
      transition={{
        y: { duration: 10 + (index % 10), repeat: Infinity, ease: "easeInOut", delay: (index % 15) * 0.5 },
        x: { duration: 15 + (index % 8), repeat: Infinity, ease: "easeInOut", delay: (index % 15) * 0.5 },
        layout: { duration: 1.5, type: "spring" }
      }}
      whileHover={{ 
        scale: 1.3, 
        zIndex: 50,
        opacity: 1,
        y: 0,
        x: 0,
        boxShadow: "0 10px 20px rgba(212, 175, 55, 0.2)"
      }}
      style={{ backgroundColor: tileBg, opacity: 1 }}
    >
      <motion.img
        src={photo}
        alt={consultation.author}
        loading="lazy"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none sepia-[0.1] saturate-[0.9] group-hover:sepia-0 group-hover:saturate-100 transition-all duration-500"
      />

      {/* Overlay de sélection ou au survol */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        style={{
          boxShadow: `inset 0 0 0 3px ${isSelected ? '#008751' : tileBg}`,
          background: isSelected ? 'rgba(0,135,81,0.2)' : 'transparent'
        }}
      />

      {/* Nom au survol */}
      <div className="absolute inset-x-0 bottom-0 px-1 py-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-[2px]">
        <p className="text-white text-[8px] font-headline font-medium truncate uppercase tracking-tighter">
          {consultation.author}
        </p>
      </div>
    </motion.button>
  );
});

WallTile.displayName = "WallTile";
export default WallTile;