"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TeasingCardProps {
  id: string; // Gardé pour la cohérence, bien que non utilisé dans ce composant pur
  image: string;
  title: string;
  subtitle: string;
  text: string;
  className?: string;
  hideImage?: boolean;
  hideTitle?: boolean;
}

/**
 * TeasingCard - Composant purement présentatif utilisé dans le Deck.
 * La navigation est gérée par le composant parent (Link).
 */
export default function TeasingCard({
  image,
  title,
  subtitle,
  text,
  className,
  hideImage = false,
  hideTitle = false,
}: TeasingCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full h-full bg-white rounded-[3rem] shadow-2xl shadow-black/10 overflow-hidden flex flex-col border border-white/50 relative outline-none select-none",
        "touch-none", // Empêche l'interférence du scroll pendant le drag du deck
        className
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Section Image - 75% de hauteur pour un look élancé (style premium) */}
      {!hideImage && (
        <div className="relative h-[75%] w-full overflow-hidden">
          <div className="w-full h-full">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover pointer-events-none"
              priority
              draggable={false}
            />
          </div>
          {/* Dégradé blanc doux en bas de l'image pour fusionner avec le contenu */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
        </div>
      )}

      {/* Section Contenu - Layout High-End */}
      <div
        className={cn(
          "px-8 md:px-12 flex-1 flex flex-col items-center justify-start text-center bg-white relative z-20",
          hideImage
            ? "py-28 space-y-16"
            : "pt-6 pb-24 md:pt-10 md:pb-32 space-y-3 md:space-y-4"
        )}
      >
        {/* 1. Badge Catégorie */}
        <span className="text-amber-600 text-[12px] md:text-[14px] font-black uppercase tracking-[0.25em] block h-4">
          {subtitle}
        </span>

        {/* 2. Titre (Prénom Nom) - Tracking large */}
        {!hideTitle && (
          <div className="flex items-center justify-center min-h-[80px] md:min-h-[110px] w-full">
            <h3 className="text-4xl md:text-5xl font-display font-black text-[#1A1A1A] leading-[1.25] md:leading-[1.4] tracking-[0.05em] uppercase">
              {title}
            </h3>
          </div>
        )}

        {/* 3. Bio / Slogan - Layout aéré */}
        <div className="flex-1 flex flex-col items-center justify-start space-y-4 w-full">
          <p
            className={cn(
              "text-gray-600 font-sans italic mx-auto",
              hideImage
                ? "text-2xl md:text-3xl max-w-lg leading-[1.8] md:leading-[2]"
                : "text-lg md:text-xl max-w-[450px] leading-relaxed"
            )}
          >
            "{text}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
