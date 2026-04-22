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

const WallTile = memo(({ consultation, index, isSelected, onClick }: Props) => {
  // --- ÉTAT VIDE (Sable) ---
  if (!consultation) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          backgroundColor: ["#f3eee3", "#e8d5b7", "#d4a574", "#f3eee3"]
        }}
        transition={{
          opacity: { duration: 0.5, delay: index * 0.01 },
          scale: { duration: 0.5, delay: index * 0.01 },
          backgroundColor: { duration: 15, repeat: Infinity, ease: "linear" }
        }}
        className="relative aspect-square overflow-hidden border-[0.5px] border-black/5"
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
      onClick={() => onClick?.(consultation)}
      className="relative aspect-square overflow-hidden rounded-[2px] cursor-pointer group bg-neutral-800 select-none border-[0.5px] border-border shadow-none"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -2, 0, 2, 0],
        x: [0, 1, 0, -1, 0]
      }}
      transition={{
        y: { duration: 10 + (index % 10), repeat: Infinity, ease: "easeInOut", delay: index * 0.01 },
        x: { duration: 12 + (index % 8), repeat: Infinity, ease: "easeInOut", delay: index * 0.01 },
        opacity: { duration: 0.5, delay: index * 0.01 },
        scale: { duration: 0.5, delay: index * 0.01 }
      }}
      whileHover={{ 
        scale: 1.2, 
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
        animate={{ scale: [1, 1.05, 1] }}
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