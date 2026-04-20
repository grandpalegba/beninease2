'use client';

import { memo } from "react";
import { motion } from "framer-motion";
import { PROFILE_PHOTOS } from "@/assets/profiles";
import type { Consultation } from "@/data/consultations";

interface Props {
  consultation: Consultation;
  index: number;
  isSelected?: boolean;
  onClick: (c: Consultation) => void;
}

const BENIN_ACCENTS = [
  "#008751", // Green
  "#fcd116", // Yellow
  "#e8112d", // Red
];

/**
 * Variety of background tones to make the wall feel like a diverse community
 */
const TILE_BACKGROUNDS = [
  "#0d0d0d", "#f7f1e6", "#3a2a1c", "#c97b3a",
  "#1a3a2a", "#e8d5b7", "#7a1f1a", "#2d2f2f",
  "#d4a574", "#0a2540", "#a8501f", "#f0e6d2",
];

const WallTile = memo(({ consultation, index, isSelected, onClick }: Props) => {
  const photo = PROFILE_PHOTOS[consultation.videoSeed % PROFILE_PHOTOS.length];
  const accent = BENIN_ACCENTS[index % BENIN_ACCENTS.length];
  const tileBg = TILE_BACKGROUNDS[consultation.videoSeed % TILE_BACKGROUNDS.length];

  const driftDelay = (index % 7) * 0.35;
  const driftDuration = 7 + (index % 5);

  const breathDelay = (index % 9) * 0.4;
  const breathDuration = 5 + (index % 4);

  return (
    <motion.button
      layout
      onClick={() => onClick(consultation)}
      className="relative aspect-square overflow-hidden rounded-[4px] cursor-pointer group bg-neutral-100 select-none"
      animate={{
        y: [0, -1.5, 0, 1.5, 0],
        opacity: [0.92, 1, 0.92],
      }}
      transition={{
        duration: driftDuration,
        delay: driftDelay,
        repeat: Infinity,
        ease: "easeInOut",
        layout: { type: "spring", stiffness: 110, damping: 18 },
      }}
      whileHover={{ scale: 1.35, zIndex: 20, opacity: 1 }}
      style={{
        boxShadow: isSelected
          ? "inset 0 0 0 3px #00693e"
          : "inset 0 0 0 1px rgba(0,0,0,0.1)",
        background: tileBg,
      }}
      aria-label={`Consultation de ${consultation.author}`}
    >
      <motion.img
        src={photo}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{
          duration: breathDuration,
          delay: breathDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {isSelected && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(0,135,81,0.55) 0%, rgba(0,105,62,0.65) 100%)",
            mixBlendMode: "multiply",
          }}
        />
      )}

      {!isSelected && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[4px]"
          style={{ boxShadow: `inset 0 0 0 2px ${accent}` }}
        />
      )}

      <div
        className="absolute inset-x-0 bottom-0 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        <p
          className="text-white text-[9px] leading-tight font-headline italic truncate"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
        >
          {consultation.author}
          {!consultation.isAnonymous && consultation.age
            ? ` · ${consultation.age}`
            : ""}
        </p>
      </div>
    </motion.button>
  );
});

WallTile.displayName = "WallTile";
export default WallTile;
