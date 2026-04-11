"use client";

import React from "react";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import PremiumImage from "../ui/PremiumImage";

interface MediaTileProps {
  type: "photo" | "video";
  url: string | null;
  alt: string;
  onClick: (e: React.MouseEvent) => void;
}

/**
 * MediaTile - Cellule individuelle du "Mur de Médias".
 * - Sécurisation : e.stopPropagation() pour bloquer le swipe parent.
 * - Style : Aspect constant (video sur desktop, square sur mobile).
 * - Effet : Hover brightness-110 et angle droit (rounded-none).
 */
export default function MediaTile({ type, url, alt, onClick }: MediaTileProps) {
  if (!url) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(e);
  };

  return (
    <div 
      className="relative group cursor-pointer overflow-hidden rounded-none aspect-square md:aspect-video"
      onClick={handleClick}
    >
      {type === "photo" ? (
        <PremiumImage
          src={url}
          alt={alt}
          noRounded={true}
          className="absolute inset-0 w-full h-full transition-all duration-700 md:group-hover:brightness-110 group-hover:scale-105 shadow-none"
        />
      ) : (
        <div className="absolute inset-0 bg-black overflow-hidden">
          <img
            src={`https://img.youtube.com/vi/${url.split('/').pop()?.split('?')[0]}/maxresdefault.jpg`}
            alt={alt}
            className="w-full h-full object-cover opacity-60 transition-all duration-700 md:group-hover:brightness-110 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1492138786312-3004a408e063?auto=format&fit=crop&w=800";
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl"
            >
              <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white ml-1" />
            </motion.div>
          </div>
        </div>
      )}
      
      {/* Overlay subtil pour indiquer l'interactivité */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
    </div>
  );
}
