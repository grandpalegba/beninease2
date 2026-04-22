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

const BENIN_ACCENTS = ["#008751", "#fcd116", "#e8112d"];

const SAND_VARIANTS = [
  "#f3eee3", // beige clair
  "#e8d5b7", // tan
  "#d4a574", // ocre
  "#c5a059", // dark ocre
  "#a8501f", // sienne brûlée
  "#833321", // terracotta
  "#f7f1e6", // cream
  "#d2b48c", // tan soft
];

const WallTile = memo(({ consultation, index, isSelected, onClick }: Props) => {
  // --- ÉTAT VIDE (Sable) ---
  if (!consultation) {
    const sandColor = SAND_VARIANTS[index % SAND_VARIANTS.length];
    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.5 },
          visible: { opacity: 1, scale: 1 }
        }}
        animate={{ 
          y: [0, -1.5, 0, 1.5, 0],
          x: [0, 1, 0, -1, 0]
        }}
        transition={{
          y: { duration: 12 + (index % 10), repeat: Infinity, ease: "easeInOut", delay: (index % 15) * 0.5 },
          x: { duration: 15 + (index % 8), repeat: Infinity, ease: "easeInOut", delay: (index % 15) * 0.5 },
          layout: { type: "spring", stiffness: 110, damping: 18 }
        }}
        layout
        className="relative aspect-square overflow-hidden border-[0.5px] border-black/5"
        style={{ backgroundColor: sandColor }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[2px] h-[2px] bg-[#d4a574] opacity-30 rounded-full" />
        </div>
      </motion.div>
    );
  }

  // --- ÉTAT PLEIN (Bokônon) ---
  const photo = PROFILE_PHOTOS[consultation.videoSeed % PROFILE_PHOTOS.length];
  const accent = BENIN_ACCENTS[index % BENIN_ACCENTS.length];

  // On utilise une couleur de fond "terreuse" par défaut si l'image met du temps à charger
  const tileBg = "#d4a574";

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
        x: [0, 1, 0, -1, 0]
      }}
      transition={{
        y: { duration: 12 + (index % 10), repeat: Infinity, ease: "easeInOut", delay: (index % 15) * 0.5 },
        x: { duration: 15 + (index % 8), repeat: Infinity, ease: "easeInOut", delay: (index % 15) * 0.5 },
        layout: { type: "spring", stiffness: 110, damping: 18 }
      }}
      whileHover={{ 
        scale: 1.3, 
        zIndex: 20,
        y: 0,
        x: 0,
        boxShadow: "0 10px 20px rgba(212, 175, 55, 0.2)"
      }}
      style={{ background: tileBg }}
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
          boxShadow: `inset 0 0 0 3px ${isSelected ? '#008751' : accent}`,
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