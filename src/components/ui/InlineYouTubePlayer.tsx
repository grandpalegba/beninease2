"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InlineYouTubePlayerProps {
  url: string | null;
  title: string;
}

/**
 * InlineYouTubePlayer - Expérience Immersive "Sensation Netflix".
 * - Preview silencieuse automatique au scroll (60% visibilité).
 * - Preview au survol (Desktop).
 * - Lecture complète avec son au clic.
 * - Performance : Iframe chargée uniquement si nécessaire.
 */
export default function InlineYouTubePlayer({ url, title }: InlineYouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Extraction ROBUSTE du YouTube VIDEO_ID
  const extractYouTubeId = (rawUrl: string | null) => {
    if (!rawUrl) return null;
    const match = rawUrl.match(/(?:youtube\.com\/embed\/|watch\?v=|youtu\.be\/|watch\?.*v=)([^?&]+)/);
    return match ? match[1] : rawUrl.split('/').pop() || null;
  };

  const videoId = extractYouTubeId(url);

  // 2. IntersectionObserver (Auto-Preview au Scroll)
  useEffect(() => {
    if (!containerRef.current || isPlaying) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Seuil 60% de visibilité avec marge de sécurité
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          setIsPreviewing(true);
        } else {
          setIsPreviewing(false);
        }
      },
      { 
        threshold: [0, 0.6, 1],
        rootMargin: "0px 0px -10% 0px" // Stopper légèrement avant la sortie complète
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isPlaying]);

  if (!url || !videoId) return null;

  // 3. URLs Médias & Fallbacks
  const thumbnailMax = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const thumbnailFallback = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // Mode Preview : Silencieux, boucle, sans contrôles
  const previewUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1&enablejsapi=1`;
  
  // Mode Full : Son, contrôles standards
  const fullUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&showinfo=0`;

  const handleMouseEnter = () => {
    if (!isPlaying && window.innerWidth > 768) {
      setIsPreviewing(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPlaying && window.innerWidth > 768) {
      setIsPreviewing(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div
            key="thumbnail-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => {
              setIsPlaying(true);
              setIsPreviewing(false);
            }}
          >
            {/* Thumbnail Image avec Fallback Error */}
            <img
              src={thumbnailMax}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              onError={(e) => {
                e.currentTarget.src = thumbnailFallback;
              }}
              loading="lazy"
            />

            {/* Silent Preview Iframe (Chargée conditionnellement) */}
            {isPreviewing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-10 pointer-events-none saturate-[1.1] brightness-[1.05]"
              >
                <iframe
                  src={previewUrl}
                  title={`${title} Preview`}
                  className="w-full h-full border-0 scale-105" // Over-scan pour cacher bordure noire potentielle
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </motion.div>
            )}

            {/* Overlay Gradient Premium */}
            <div className="absolute inset-0 z-20 transition-all duration-500 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40" />

            {/* Play Button central (Glassmorphism) */}
            <div className="absolute inset-0 z-30 flex items-center justify-center">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:bg-white/20"
              >
                <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-0.5" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="full-player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 bg-black"
          >
            <iframe
              src={fullUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
