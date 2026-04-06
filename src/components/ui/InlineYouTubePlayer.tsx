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
 * InlineYouTubePlayer - Version "Zéro Latence" (API-Sync).
 * - Préchargement AGRESSIF à 1% de visibilité (shouldPreload).
 * - Instance UNIQUE d'iframe : Aucun changement de src au clic (Zéro Flash).
 * - Commandes via IFrame Player API (postMessage) pour unmute et play instantly.
 * - UX Perceptive : Feedback instantané scale 0.98 -> 1 au clic.
 */
export default function InlineYouTubePlayer({ url, title }: InlineYouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
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

  // 2. Libération du Verrou et Reset
  const releaseLockAndReset = () => {
    setIsIframeReady(false);
    setIsPreviewing(false);
    setShouldPreload(false);
    setIsPlaying(false);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (hasLockRef.current) {
      activeGlobalId = null;
      hasLockRef.current = false;
    }
  };

  // 3. Commandes API YouTube (postMessage)
  const sendCommand = (func: string, args: any = "") => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: "command",
        func: func,
        args: args
      }), "*");
    }
  };

  // 4. IntersectionObserver (Seuil 0.01 / 0.6)
  useEffect(() => {
    if (!containerRef.current || isPlaying || !id) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        if (lastRatioRef.current === ratio) return;
        lastRatioRef.current = ratio;

        if (ratio === 0) {
          releaseLockAndReset();
          return;
        }

        // AGGRESSIVE PRELOAD : 1% visible -> Déclencher le chargement immédiat
        if (ratio >= 0.01) {
          if (!activeGlobalId) {
            activeGlobalId = id;
            hasLockRef.current = true;
            setShouldPreload(true);
          } else if (activeGlobalId !== id) {
            setShouldPreload(false);
          }
        }

        // PREVIEW SILENCIEUSE : 60% visible
        if (ratio >= 0.6 && hasLockRef.current) {
          setIsPreviewing(true);
          // On s'assure d'être en lecture si preview
          sendCommand("playVideo");
        } else {
          setIsPreviewing(false);
        }
      },
      { 
        threshold: [0, 0.01, 0.6, 1],
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

  // 5. Configuration Source UNIQUE (Zéro reload)
  // playsinline=1 est vital pour mobile, enablejsapi=1 permet postMessage
  const baseParams = "autoplay=1&mute=1&controls=1&loop=1&playsinline=1&modestbranding=1&rel=0&enablejsapi=1";
  const embedUrl = `https://www.youtube.com/embed/${id}?${baseParams}&playlist=${id}`;

  // 6. Handlers (Zéro Latence)
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
    
    // ACTION INSTANTANÉE SANS RELOAD
    sendCommand("unMute");
    sendCommand("playVideo");

    // S'assurer d'avoir le lock global
    activeGlobalId = id;
    hasLockRef.current = true;
  };

  // Visibilité combinée pour la transition invisible
  const isVideoVisible = isIframeReady && (isPreviewing || isPlaying);

  return (
    <motion.div 
      ref={containerRef}
      initial={false}
      animate={{ scale: isPlaying ? 1 : 1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black group transform translate-z-0 will-change-transform select-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* 🎬 IFRAME UNIQUE (Z-INDEX 1) - Toujours "chaude" si shouldPreload */}
      {shouldPreload && (
        <div 
          className={cn(
            "absolute inset-0 z-10 transition-opacity duration-200 ease-out will-change-opacity transform translate-z-0",
            isVideoVisible ? "opacity-100" : "opacity-0"
          )}
          style={{ pointerEvents: isPlaying ? "auto" : "none" }} // Empêche interaction YouTube avant le clic Full
        >
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title}
            className="w-full h-full border-0 scale-105 transform translate-z-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            onLoad={handleIframeLoad}
          />
        </div>
      )}

      {/* 🖼️ THUMBNAIL COUVERTURE (Z-INDEX 2) */}
      <div 
        className={cn(
          "absolute inset-0 z-20 cursor-pointer transition-all duration-300 ease-out will-change-opacity transform translate-z-0",
          isVideoVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={handleStartFullPlay}
      >
        <img
          src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] transform translate-z-0"
          onError={(e) => { 
            e.currentTarget.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; 
          }}
          loading="lazy"
        />

        {/* Dynamic Overlay Darkening */}
        <div className="absolute inset-0 z-30 transition-all duration-500 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transform translate-z-0" />

        {/* Play Button - Masqué instantanément au clic */}
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

      {/* 🌀 LOADER (VISIBLE UNIQUEMENT PENDANT LA TRANSITION ALPHA-SYNC) */}
      <AnimatePresence>
        {(isPlaying || isPreviewing) && !isIframeReady && (
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
