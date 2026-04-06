"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InlineYouTubePlayerProps {
  url: string | null;
  title: string;
}

// 🌐 SINGLETON GLOBAL : Verrouille une seule pré-lecture active sur la page
let activeGlobalId: string | null = null;

/**
 * InlineYouTubePlayer - Version "Stabilité Production Alpha" (Haute Fidélité).
 * - Singleton Lock : Empêche la surcharge réseau/sonore via un verrouillage d'instance.
 * - Cleanup Strict : Supprime physiquement l'iframe du DOM hors viewport.
 * - Alpha-Sync Sécurisé : requestAnimationFrame + Timeout nettoyé au démontage.
 * - GPU Acceleration : Hardware forcing sur toutes les couches media.
 * - UX Tactile : Feedback physique (scale 0.98) avec ressort et suppression du highlight iOS.
 */
export default function InlineYouTubePlayer({ url, title }: InlineYouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const hasLockRef = useRef<boolean>(false);
  const timeoutRef = useRef<any>(null);
  const lastRatioRef = useRef<number>(0);

  // 1. Extraction ROBUSTE du YouTube VIDEO_ID
  const extractYouTubeId = (rawUrl: string | null) => {
    if (!rawUrl) return null;
    const match = rawUrl.match(/(?:youtube\.com\/embed\/|watch\?v=|youtu\.be\/|watch\?.*v=)([^?&]+)/);
    return match ? match[1] : rawUrl.split('/').pop() || null;
  };

  const id = extractYouTubeId(url);

  // 2. Libération du Verrou et Reset (ANTI FUITES)
  const releaseLockAndReset = () => {
    setIsIframeReady(false);
    setIsPreviewing(false);
    setShouldPreload(false);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (hasLockRef.current) {
      activeGlobalId = null;
      hasLockRef.current = false;
    }
  };

  // 3. IntersectionObserver (Seuils 0.1 / 0.6 + Unmount Strict)
  useEffect(() => {
    if (!containerRef.current || isPlaying || !id) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        
        // PROTECTION SCROLL RAPIDE : On ignore les updates redondantes
        if (lastRatioRef.current === ratio) return;
        lastRatioRef.current = ratio;

        // UNMOUNT STRICT : On libère tout dès que l'élément est hors-champ
        if (ratio === 0) {
          releaseLockAndReset();
          return;
        }

        // SEUIL 10% -> Tentative d'acquisition du Lock Global pour Preload
        if (ratio >= 0.1) {
          if (!activeGlobalId) {
            activeGlobalId = id;
            hasLockRef.current = true;
            setShouldPreload(true);
          } else if (activeGlobalId !== id) {
            // Un autre talent a le lock, on reste en attente (Vignette)
            setShouldPreload(false);
          }
        }

        // SEUIL 60% -> Activation Preview Visuelle si on a le lock
        if (ratio >= 0.6 && hasLockRef.current) {
          setIsPreviewing(true);
        } else {
          setIsPreviewing(false);
        }
      },
      { 
        threshold: [0, 0.1, 0.6, 1],
        rootMargin: "0px" 
      }
    );

    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
      releaseLockAndReset();
    };
  }, [isPlaying, id]);

  if (!url || !id) return null;

  // 4. Configuration Sources Alpha
  const thumbnailMax = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  const thumbnailFallback = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  const baseParams = "autoplay=1&mute=1&controls=0&loop=1&playsinline=1&modestbranding=1&rel=0&enablejsapi=1";
  const previewUrl = `https://www.youtube.com/embed/${id}?${baseParams}&playlist=${id}`;
  const fullUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&showinfo=0`;

  // 5. Alpha-Sync Sécurisé (rAF + Timeout Cleanup)
  const handleIframeLoad = () => {
    if (isIframeReady) return;

    requestAnimationFrame(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsIframeReady(true);
      }, 50);
    });
  };

  const handleStartFullPlay = () => {
    setIsPlaying(true);
    setIsPreviewing(false);
    setIsIframeReady(false);
    
    // On s'assure d'avoir le lock global pour la lecture sonore
    activeGlobalId = id;
    hasLockRef.current = true;
  };

  const isVideoVisible = isIframeReady && (isPreviewing || isPlaying);

  return (
    <motion.div 
      ref={containerRef}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black group transform translate-z-0 will-change-transform select-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* 🎬 IFRAME (Z-INDEX 1) - Désinstallation physique hors-champ */}
      {shouldPreload && (
        <div 
          className={cn(
            "absolute inset-0 z-10 transition-opacity duration-200 ease-out will-change-opacity transform translate-z-0",
            isVideoVisible ? "opacity-100" : "opacity-0"
          )}
          style={{ pointerEvents: isIframeReady ? "auto" : "none" }}
        >
          <iframe
            src={isPlaying ? fullUrl : previewUrl}
            title={title}
            className="w-full h-full border-0 scale-105 transform translate-z-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={isPlaying}
            onLoad={handleIframeLoad}
          />
        </div>
      )}

      {/* 🖼️ THUMBNAIL (Z-INDEX 2) */}
      <div 
        className={cn(
          "absolute inset-0 z-20 cursor-pointer transition-opacity duration-200 ease-out will-change-opacity transform translate-z-0",
          isVideoVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={handleStartFullPlay}
      >
        <img
          src={thumbnailMax}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] transform translate-z-0"
          onError={(e) => { e.currentTarget.src = thumbnailFallback; }}
          loading="lazy"
        />

        {/* Global Layer Overlay */}
        <div className="absolute inset-0 z-30 transition-all duration-500 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transform translate-z-0" />

        {/* Bouton Play Central (Glassmorphism) */}
        {!isPlaying && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:bg-white/20 transform translate-z-0"
            >
              <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-0.5" />
            </motion.div>
          </div>
        )}
      </div>

      {/* 🌀 LOADER (VISIBLE UNIQUEMENT AU CLIC PENDANT LE BUFFER) */}
      <AnimatePresence>
        {isPlaying && !isIframeReady && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[4px] transform translate-z-0"
          >
            <Loader2 className="w-8 h-8 text-white animate-spin opacity-80" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
