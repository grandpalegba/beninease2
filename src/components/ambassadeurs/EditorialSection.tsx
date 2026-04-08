"use client";

import React from "react";
import { motion } from "framer-motion";
import PremiumImage from "../ui/PremiumImage";
import InlineYouTubePlayer from "../ui/InlineYouTubePlayer";

interface EditorialSectionProps {
  title: string;
  videoUrl?: string | null;
  imageUrl?: string | null;
  index: number;
}

/**
 * EditorialSection - Le bloc narratif "Digital Atelier" (Immersif).
 * - Ordre : Titre -> Séparateur -> Image Premium -> Vidéo Immersive.
 * - Utilisation des nouveaux composants PremiumImage et InlineYouTubePlayer.
 */
export default function EditorialSection({
  title,
  videoUrl,
  imageUrl,
  index,
}: EditorialSectionProps) {
  // Masquer si aucun média n'est présent
  if (!videoUrl && !imageUrl) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className="w-full flex flex-col items-center"
    >
      {/* 1. Titre de Section (Renforcé) */}
      <h3 className="text-[12px] md:text-[13px] font-extrabold uppercase tracking-[0.4em] text-gray-800 mb-6">
        {title}
      </h3>

      {/* 2. Séparateur Signature Bénin */}
      <div className="w-20 md:w-24 h-[1.5px] bg-gradient-to-r from-[#008751] via-[#FCD116] to-[#E8112D] opacity-60 mb-10 md:mb-14" />

      {/* 3. Bloc Image Premium (Si présent) */}
      {imageUrl && (
        <div className="w-full mb-10 md:mb-14">
          <PremiumImage 
            src={imageUrl} 
            alt={title} 
            aspectRatio="16/9" // Harmonisation avec le format vidéo
          />
        </div>
      )}

      {/* 4. Bloc Vidéo Immersive (Si présent) */}
      {videoUrl && (
        <div className="w-full">
          <InlineYouTubePlayer 
            url={videoUrl} 
            title={title} 
          />
        </div>
      )}
    </motion.section>
  );
}
