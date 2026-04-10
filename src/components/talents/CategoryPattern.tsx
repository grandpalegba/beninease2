"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CategoryPatternProps {
  id: string;
  className?: string;
}

const GOLD_COLOR = "#B8860B";
const STROKE_WIDTH = "1.2";
const VECTOR_EFFECT = "non-scaling-stroke";

const CATEGORY_PATTERNS: Record<string, React.ReactNode> = {
  // --- FÂ INSPIRED SIGNATURES ---
  "artisanat": ( // Irossoun-Médji (Eye)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10C14 6 26 6 30 10M10 10C14 14 26 14 30 10" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="10" r="1.5" fill={GOLD_COLOR}/>
    </svg>
  ),
  "humour-comedie": ( // Oché-Médji (Laughter/Improvisation)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 6L8 10L14 14M26 6L32 10L26 14" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M18 10L22 10" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),
  "voix-lieux": ( // Létè-Médji (Foundations/Architecture)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="6" width="24" height="8" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <rect x="14" y="9" width="12" height="2" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),
  "saveurs-benin": ( // Gbé-Médji (Seeds/Circle)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="10" r="1.5" fill={GOLD_COLOR}/>
      <path d="M20 5L22 7L20 9L18 7Z" fill={GOLD_COLOR} opacity="0.6"/>
      <path d="M25 10L27 12L25 14L23 12Z" fill={GOLD_COLOR} opacity="0.6"/>
      <path d="M15 10L17 12L15 14L13 12Z" fill={GOLD_COLOR} opacity="0.6"/>
      <path d="M20 15L22 17L20 19L18 17Z" fill={GOLD_COLOR} opacity="0.6"/>
    </svg>
  ),
  "memoire-ancetres": ( // Di-Médji (Hourglass/Time chain)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6H28L12 14H28L12 6" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M20 2V6M20 14V18" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),
  "danses-benin": ( // Woli-Médji (Movement)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10C10 4 14 16 20 10C26 4 30 16 36 10" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M8 12C14 6 18 18 24 12C30 6 34 18 40 12" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),
  "musiques-benin": ( // Abla-Médji (Rhythm/Strings)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4V16M14 6V14M18 4V16M22 6V14M26 4V16M30 6V14" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),
  "beninois-monde": ( // Troukpoun-Médji (Diaspora arrows)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10L12 4M20 10L12 16M20 10L28 4M20 10L28 16M20 10V3M20 10V17" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="10" r="1" fill={GOLD_COLOR}/>
    </svg>
  ),
  "beninois-du-monde": ( // Alias for Diaspora
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10L12 4M20 10L12 16M20 10L28 4M20 10L28 16M20 10V3M20 10V17" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="10" r="1" fill={GOLD_COLOR}/>
    </svg>
  ),
  "mythes-legendes": ( // Sè-Médji (Holy Breath)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4V16M24 4V16" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M14 6H18M14 9H18M14 12H18M14 15H18M22 6H26M22 9H26M22 12H26M22 15H26" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),
  "startup-innovation": ( // Touloula-Médji (Network/Star)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10H28M20 4V16M14 6L26 14M14 14L26 6" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="10" r="1.5" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH}/>
    </svg>
  ),
  "start-up-innovation": ( // Alias
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10H28M20 4V16M14 6L26 14M14 14L26 6" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="10" r="1.5" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH}/>
    </svg>
  ),

  // --- PRESERVED MINIMALIST SIGNATURES (Refined for Gold style) ---
  "sagesse": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 10H16M24 10H38" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="10" r="3" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),
  "beaute-feminine": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="10" r="1.5" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="10" r="1.5" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} vectorEffect={VECTOR_EFFECT}/>
      <circle cx="28" cy="10" r="1.5" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} vectorEffect={VECTOR_EFFECT}/>
      <path d="M4 10H10M30 10H36" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),
  "beaute-masculine": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 14L20 6L28 14M12 10L20 2L28 10" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),
  "eloquence": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 14C12 14 16 8 20 8C24 8 28 14 28 14" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M8 15C8 15 14 6 20 6C26 6 32 15 32 15" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),
  "mode-style": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4V16M12 4V16M18 4V16M22 4V16M28 4V16M32 4V16" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),
  "parole-aines": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="5" width="16" height="10" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <rect x="16" y="8" width="8" height="4" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  )
};

const DEFAULT_PATTERN = (
  <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 10H35" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" opacity="0.3" vectorEffect={VECTOR_EFFECT}/>
  </svg>
);

export const CategoryPattern = ({ id, className }: CategoryPatternProps) => {
  const pattern = CATEGORY_PATTERNS[id] || DEFAULT_PATTERN;

  return (
    <div className={cn("w-10 h-5 animate-in fade-in duration-500", className)}>
      {pattern}
    </div>
  );
};
