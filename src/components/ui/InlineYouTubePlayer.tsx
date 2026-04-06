"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InlineYouTubePlayerProps {
  url: string | null;
  title: string;
}

/**
 * InlineYouTubePlayer - Expérience Immersive "Double Sécurité Alpha".
 * - ZÉRO Flash Gris YouTube (Thumbnail persistant tant que la vidéo n'est pas PRÊTE).
 * - Double Sécurité : onLoad + Délai de 200ms de confort visuel.
 * - Auto-Preview silencieuse au scroll (60%) et au hover (Desktop).
 * - Performance : Iframe montée seulement en cas d'action.
 * - Reset automatique des états au scroll-out.
 */
export default function InlineYouTubePlayer({ url, title }: InlineYouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Extraction ROBUSTE du YouTube VIDEO_ID
  const extractYouTubeId = (rawUrl: string | null) => {
    if (!rawUrl) return null;
    const match = rawUrl.match(/(?:youtube\.com\/embed\/|watch\?v=|youtu\.be\/|watch\?.*v=)([^?&]+)/);
    return match ? match[1] : rawUrl.split('/').pop() || null;
  };

  const videoId = extractYouTubeId(url);

  // 2. Réinitialisation des états (Anti-Bug / Anti-Flash)
  const resetStates = () => {
    setIsIframeReady(false);
    setIsBuffering(true);
    setIsPreviewing(false);
  };

  // 3. IntersectionObserver (Auto-Preview au Scroll)
  useEffect(() => {
    if (!containerRef.current || isPlaying) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          setIsPreviewing(true);
        } else {
          // Reset complet quand on sort du champ
          resetStates();
        }
      },
      { 
        threshold: [0, 0.6, 1],
        rootMargin: "0px 0px -10% 0px"
      }
    );

    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      resetStates();
    };
  }, [isPlaying]);

  if (!url || !videoId) return null;

  // 4. Sources et URLs
  const id = videoId;
  const thumbnailMax = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  const thumbnailFallback = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  // Construction des URLs avec paramètres critiques
  const baseParams = "autoplay=1&mute=1&controls=0&loop=1&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1";
  const previewUrl = `https://www.youtube.com/embed/${id}?${baseParams}&playlist=${id}`;
  const fullUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&showinfo=0&modestbranding=1&autohide=1`;

  // 5. Handlers
  const handleStartFullPlay = () => {
    setIsPlaying(true);
    setIsIframeReady(false); // Forcer re-vérification du chargement pour le mode plein son
    setIsBuffering(true);
    setIsPreviewing(false);
  };

  const handleIframeLoad = () => {
    // SÉCURITÉ CRITIQUE : Délai de confort de 200ms après le signal technique onLoad
    setTimeout(() => {
      setIsIframeReady(true);
      setIsBuffering(false);
    }, 200);
  };

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
      {/* 🎬 COUCHE 1 : IFRAME (Z-INDEX 1) */}
      {(isPlaying || isPreviewing) && (
        <div 
          className={cn(
            "absolute inset-0 z-10 transition-opacity duration-500 will-change-opacity",
            isIframeReady ? "opacity-100" : "opacity-0"
          )}
        >
          <iframe
            src={isPlaying ? fullUrl : previewUrl}
            title={title}
            className="w-full h-full border-0 scale-105" // Over-scan anti-bordure YouTube
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={isPlaying}
            onLoad={handleIframeLoad}
          />
        </div>
      )}

      {/* 🖼️ COUCHE 2 : THUMBNAIL DE COUVERTURE (Z-INDEX 2) */}
      <div 
        className={cn(
          "absolute inset-0 z-20 cursor-pointer transition-opacity duration-500 will-change-opacity",
          isIframeReady ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={handleStartFullPlay}
      >
        {/* Image Vignette avec Fallback */}
        <img
          src={thumbnailMax}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          onError={(e) => { e.currentTarget.src = thumbnailFallback; }}
          loading="lazy"
        />

        {/* Overlay Dégradé Premium */}
        <div className="absolute inset-0 z-30 transition-all duration-500 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50" />

        {/* Bouton Play (Visible tant qu'on n'est pas en lecture complète) */}
        {!isPlaying && (
          <div className="absolute inset-0 z-40 flex items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:bg-white/20"
            >
              <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-0.5" />
            </motion.div>
          </div>
        )}
      </div>

      {/* 🌀 COUCHE 3 : SPINNER PREMIUM (Z-INDEX 50) */}
      <AnimatePresence>
        {(isPlaying || isPreviewing) && isBuffering && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
          >
            <Loader2 className="w-8 h-8 text-white animate-spin opacity-80" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
