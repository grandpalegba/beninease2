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
      <div
        className="relative aspect-square overflow-hidden rounded-[2px] bg-[#E8D5B7] opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at ${index % 4 * 25}% ${index % 3 * 30}%, rgba(0,0,0,0.05) 1px, transparent 1px)`,
          backgroundSize: '4px 4px'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-1 h-1 bg-black rounded-full" />
        </div>
      </div>
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
      className="relative aspect-square overflow-hidden rounded-[4px] cursor-pointer group bg-neutral-800 select-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -1.2, 0, 1.2, 0]
      }}
      transition={{
        y: { duration: 6 + (index % 4), repeat: Infinity, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }}
      whileHover={{ scale: 1.35, zIndex: 20 }}
      style={{ background: tileBg }}
    >
      <motion.img
        src={photo}
        alt={consultation.author}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none sepia-[0.2] group-hover:sepia-0 transition-all duration-500"
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
        <p className="text-white text-[8px] font-medium truncate uppercase tracking-tighter">
          {consultation.author}
        </p>
      </div>
    </motion.button>
  );
});

WallTile.displayName = "WallTile";
export default WallTile;