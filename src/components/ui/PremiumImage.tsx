"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl, stableImageKey } from "@/lib/utils/media";

interface PremiumImageProps {
  src: string | null;
  alt: string;
  aspectRatio?: "16/9" | "4/5" | "square" | "portrait" | "video";
  className?: string;
}

/**
 * PremiumImage - Une expérience visuelle immersive "Style Airbnb / Apple".
 * - Animation d'apparition au scroll (IntersectionObserver).
 * - Effet hover dynamique (zoom + brightness).
 * - Overlay dégradé premium.
 * - Gestion du chargement (placeholder) et des erreurs (fallback).
 */
export default function PremiumImage({ 
  src, 
  alt, 
  aspectRatio = "16/9", 
  className 
}: PremiumImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Optimized URL with WebP + CDN params (no bust timestamp in prod = stable CDN cache)
  const optimizedSrc = getOptimizedImageUrl(src);

  // Reset skeleton when image URL changes (e.g. after Supabase update)
  useEffect(() => {
    setIsLoaded(false);
  }, [optimizedSrc]);

  // 1. IntersectionObserver (Animation au Scroll)
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!src) return null;

  const fallbackImage = "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&q=80&w=800";
  const ratioClasses: Record<string, string> = {
    "16/9": "aspect-video",
    "4/5": "aspect-[4/5]",
    "square": "aspect-square",
    "portrait": "aspect-[2/3]",
    "video": "aspect-video"
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl shadow-xl bg-[#f3f3f3] group transition-all duration-700",
        ratioClasses[aspectRatio],
        className
      )}
    >
      {/* Image — key réactive pour forcer le re-render Rreact si l'URL change */}
      <motion.img
        key={stableImageKey(optimizedSrc)}
        src={optimizedSrc}
        alt={alt}
        initial={{ opacity: 0, scale: 1.05, y: 20 }}
        animate={isInView ? { 
          opacity: isLoaded ? 1 : 0, 
          scale: 1, 
          y: 0 
        } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-all duration-700 pointer-events-none",
          "md:group-hover:scale-105 md:group-hover:brightness-[1.05]"
        )}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          e.currentTarget.src = fallbackImage;
        }}
        loading="lazy"
      />

      {/* Overlay Gradient Premium */}
      <div className="absolute inset-0 z-10 transition-opacity duration-700 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-100" />

      {/* Skeleton pendant le chargement */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#f3f3f3] animate-pulse z-0" />
      )}
    </div>
  );
}
