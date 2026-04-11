"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumImageProps {
  src: string | null;
  alt: string;
  aspectRatio?: "16/9" | "4/5" | "4/3" | "square" | "portrait" | "video";
  className?: string;
  onClick?: () => void;
}

const FALLBACK_SRC =
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&q=80&w=1200";

/**
 * Construit une URL Unsplash CDN propre sans risque de paramètres dupliqués.
 * N'utilise PAS de timestamp (stable cache CDN).
 */
function buildImageUrl(src: string): string {
  const base = src.split("?")[0];
  // Ne re-builder que si c'est un lien Unsplash — sinon retourner tel quel
  if (base.includes("unsplash.com")) {
    return `${base}?auto=format&fit=crop&w=1200&q=80`;
  }
  return src;
}

/**
 * PremiumImage — Version "Bulletproof".
 *
 * GARANTIES :
 * - Une image ne peut JAMAIS rester invisible si l'URL est valide.
 * - Safety timer : si onLoad ne se déclenche pas dans les 4s, l'image est forcée visible.
 * - onError : le fallback Unsplash est affiché immédiatement et l'opacité est forcée à 1.
 * - Animation de scroll : utilise IntersectionObserver pour déclencher le reveal,
 *   mais l'opacité dépend UNIQUEMENT de isLoaded (pas de isInView).
 *   → Même si l'observer rate, l'image apparaît dès qu'elle est chargée.
 */
export default function PremiumImage({
  src,
  alt,
  aspectRatio = "16/9",
  className,
}: PremiumImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // IntersectionObserver — déclenche l'animation de reveal
  // Threshold très bas (0.05) pour quasi instantané dès le scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect(); // one-shot
        }
      },
      { threshold: 0.05, rootMargin: "100px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Safety timer : si onLoad n'a pas encore été déclenché 4s après le scroll,
  // on force isLoaded = true pour qu'on ne reste jamais bloqué sur un fond gris.
  useEffect(() => {
    if (!hasEnteredView || isLoaded) return;

    safetyTimerRef.current = setTimeout(() => {
      setIsLoaded(true);
    }, 4000);

    return () => {
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, [hasEnteredView, isLoaded]);

  // Vérification : si l'image est déjà dans le cache navigateur,
  // elle peut être "complete" avant que React n'attache le handler onLoad.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  if (!src) return null;

  const optimizedSrc = buildImageUrl(src);

  const ratioClasses: Record<string, string> = {
    "16/9": "aspect-video",
    "4/5": "aspect-[4/5]",
    square: "aspect-square",
    portrait: "aspect-[2/3]",
    video: "aspect-video",
    "4/3": "aspect-[4/3]",
  };

  const handleLoad = () => {
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    setIsLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    e.currentTarget.src = FALLBACK_SRC;
    // On force visible même sur le fallback
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl shadow-xl bg-[#f3f3f3] group",
        onClick && "cursor-zoom-in",
        ratioClasses[aspectRatio],
        className
      )}
      onClick={onClick}
    >
      {/* Skeleton — visible uniquement avant le chargement */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#ebebeb] animate-pulse z-0" />
      )}

      {/* Image
          - L'opacité dépend UNIQUEMENT de isLoaded (jamais de isInView).
          - L'animation de translate/scale utilise hasEnteredView pour l'effet premium au scroll.
          - Pas de `key` dynamique → pas de re-mount non nécessaire.
      */}
      <motion.img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        initial={{ opacity: 0, scale: 1.04, y: 12 }}
        animate={{
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded && hasEnteredView ? 1 : 1.04,
          y: isLoaded && hasEnteredView ? 0 : 12,
        }}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "absolute inset-0 w-full h-full object-cover",
          "md:group-hover:scale-[1.03] md:group-hover:brightness-[1.04] transition-[transform,filter] duration-700"
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />

      {/* Overlay dégradé premium */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </div>
  );
}
