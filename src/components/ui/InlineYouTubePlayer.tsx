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
 * InlineYouTubePlayer - Expérience Immersive "Instant-Play" (Ultra Haute Performance).
 * - Préchargement Invisible (shouldPreload) à 10% de visibilité.
 * - Silent Preview (isPreviewing) à 60% de visibilité.
 * - Alpha-Sync : requestAnimationFrame + 50ms pour une transition instantanée sans flash gris.
 * - Optimisation GPU : transform: translateZ(0) et will-change: transform, opacity.
 */
export default function InlineYouTubePlayer({ url, title }: InlineYouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(false);
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
    setIsPreviewing(false);
    setShouldPreload(false);
  };

  // 3. IntersectionObserver (Double Seuil : 0.1 et 0.6)
  useEffect(() => {
    if (!containerRef.current || isPlaying) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Seuil 10% -> Préchargement invisible
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          setShouldPreload(true);
        } else if (entry.intersectionRatio < 0.1) {
          setShouldPreload(false);
          setIsIframeReady(false);
        }

        // Seuil 60% -> Activation de la preview visible
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          setIsPreviewing(true);
        } else {
          setIsPreviewing(false);
        }
      },
      { 
        threshold: [0, 0.1, 0.6, 1],
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

  const baseParams = "autoplay=1&mute=1&controls=0&loop=1&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1";
  const previewUrl = `https://www.youtube.com/embed/${id}?${baseParams}&playlist=${id}`;
  const fullUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&showinfo=0&autohide=1`;

  // 5. Handlers (Alpha-Sync)
  const handleIframeLoad = () => {
    // Synchronisation matérielle via rAF + Micro-sécurité 50ms
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsIframeReady(true);
      }, 50);
    });
  };

  const startFullPlay = () => {
    setIsPlaying(true);
    setIsPreviewing(false);
    setIsIframeReady(false); // Re-sync pour le mode Full Play (nouveau src)
  };

  const handleMouseEnter = () => {
    if (!isPlaying && window.innerWidth > 768) {
      setIsPreviewing(true);
      setShouldPreload(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPlaying && window.innerWidth > 768 && containerRef.current) {
      // On garde because observer handles scroll, mais hover force si besoin
    }
  };

  // Visibilité combinée pour la transition invisible
  const isVideoVisible = isIframeReady && (isPreviewing || isPlaying);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black group transform translate-z-0 will-change-transform"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 🎬 IFRAME (Z-INDEX 1) - Toujours en fond si shouldPreload */}
      {(shouldPreload || isPlaying) && (
        <div 
          className={cn(
            "absolute inset-0 z-10 transition-opacity duration-200 ease-out will-change-opacity",
            isVideoVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <iframe
            src={isPlaying ? fullUrl : previewUrl}
            title={title}
            className="w-full h-full border-0 scale-105" // Over-scan
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={isPlaying}
            onLoad={handleIframeLoad}
          />
        </div>
      )}

      {/* 🖼️ THUMBNAIL COUVERTURE (Z-INDEX 2) */}
      <div 
        className={cn(
          "absolute inset-0 z-20 cursor-pointer transition-opacity duration-200 ease-out will-change-opacity transform translate-z-0",
          isVideoVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={startFullPlay}
      >
        <img
          src={thumbnailMax}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          onError={(e) => { e.currentTarget.src = thumbnailFallback; }}
          loading="lazy"
        />

        {/* Dynamic Overlay */}
        <div className="absolute inset-0 z-30 transition-all duration-500 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50" />

        {/* Play Button - Visible tant qu'on n'est pas en Full Play */}
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

      {/* 🌀 SPINNER PREMIUM (Seulement en Full Play Loading) */}
      <AnimatePresence>
        {isPlaying && !isIframeReady && (
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
