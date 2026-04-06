"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface EditorialSectionProps {
  title: string;
  videoUrl?: string | null;
  imageUrl?: string | null;
  onPlayVideo: (url: string) => void;
  index: number;
}

/**
 * EditorialSection - Le bloc narratif "Stitch Digital Atelier".
 * - Rythme vertical aéré
 * - Rendu conditionnel des médias
 * - Séparateur signature aux couleurs du Bénin
 */
export default function EditorialSection({
  title,
  videoUrl,
  imageUrl,
  onPlayVideo,
  index,
}: EditorialSectionProps) {
  // RÈGLE STRICTE : Si aucun média n'est présent, masquer toute la section.
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
      className="w-full flex flex-col items-center gap-10 md:gap-14"
    >
      {/* 1. Titre de Section (Digital Atelier Style) */}
      <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-gray-400">
        {title}
      </h3>

      {/* 2. Bloc Vidéo (Si présent) */}
      {videoUrl && (
        <div 
          className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-2xl transition-transform duration-700 hover:scale-[1.01]"
          onClick={() => onPlayVideo(videoUrl)}
        >
          {/* Overlay cinématique (Vignette) */}
          <div className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
          
          {/* Play Button Glassmorphism */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20">
              <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1" />
            </div>
          </div>

          <Image
            src={`https://img.youtube.com/vi/${videoUrl.split('v=')[1] || videoUrl.split('/').pop()}/maxresdefault.jpg`}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 820px) 100vw, 820px"
          />
        </div>
      )}

      {/* 3. Séparateur Signature (Couleurs Bénin) */}
      <div className="w-16 md:w-24 h-[1.5px] bg-gradient-to-r from-[#008751] via-[#FCD116] to-[#E8112D] opacity-70" />

      {/* 4. Bloc Image (Si présent) */}
      {imageUrl && (
        <div className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-xl group transition-transform duration-700 hover:scale-[1.01]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
            sizes="(max-width: 820px) 100vw, 820px"
          />
        </div>
      )}
    </motion.section>
  );
}
