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
  // --- ANCESTRAL GEOMETRY SIGNATURES ---
  
  "artisanat": ( // Creative Spiral / Genesis (Inspired by Bogolan patterns)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 10C14 8.5 15.5 7 20 7C24.5 7 26 8.5 26 10C26 13 23 15 20 15C17 15 14 13 14 12" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M10 10C10 6 14 3 20 3C26 3 30 6 30 10C30 15 26 18 20 18C14 18 10 15 10 13" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),

  "humour-comedie": ( // Diamond Shards (Image 3 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6L16 10L12 14L8 10L12 6Z" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M28 6L32 10L28 14L24 10L28 6Z" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M20 4L22 10L20 16L18 10L20 4Z" fill={GOLD_COLOR} opacity="0.4"/>
    </svg>
  ),

  "voix-lieux": ( // Nested Foundations (Image 4 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="4" width="20" height="12" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M14 8H26M14 12H26" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M20 4V16" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),

  "saveurs-benin": ( // Gastronomie (Diamond seeds grid / Abundance)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="10" r="1.5" fill={GOLD_COLOR}/>
      <circle cx="20" cy="5" r="1.2" fill={GOLD_COLOR} opacity="0.6"/>
      <circle cx="20" cy="15" r="1.2" fill={GOLD_COLOR} opacity="0.6"/>
      <circle cx="15" cy="10" r="1.2" fill={GOLD_COLOR} opacity="0.6"/>
      <circle cx="25" cy="10" r="1.2" fill={GOLD_COLOR} opacity="0.6"/>
      <path d="M12 10L20 2L28 10L20 18L12 10Z" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" opacity="0.3" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),

  "memoire-ancetres": ( // Diamond chain / Hourglass (Image 3 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10L15 5L20 10L15 15L10 10ZM20 10L25 5L30 10L25 15L20 10Z" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="15" cy="10" r="0.8" fill={GOLD_COLOR}/>
      <circle cx="25" cy="10" r="0.8" fill={GOLD_COLOR}/>
    </svg>
  ),

  "danses-benin": ( // Sketched Waves (Image 2 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12C8 8 12 16 16 12C20 8 24 16 28 12C32 8 36 16 40 12" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M0 10C4 6 8 14 12 10C16 6 20 14 24 10C28 6 32 14 36 10" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),

  "musiques-benin": ( // Balafon Rhythm (Image 2 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5V15M12 7V13M16 4V16M20 6V14M24 8V12M28 5V15M32 9V11" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),

  "beninois-monde": ( // Solar Radiant Burst (Image 5 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="10" r="3" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} vectorEffect={VECTOR_EFFECT}/>
      <path d="M20 2V5M20 15V18M12 10H15M25 10H28M14 4L16 6M26 4L24 6M14 16L16 14M26 16L24 14" stroke={GOLD_COLOR} strokeWidth="1" strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="10" r="0.5" fill={GOLD_COLOR}/>
    </svg>
  ),

  "beninois-du-monde": ( // Alias for Diaspora
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="10" r="3" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} vectorEffect={VECTOR_EFFECT}/>
      <path d="M20 2V5M20 15V18M12 10H15M25 10H28M14 4L16 6M26 4L24 6M14 16L16 14M26 16L24 14" stroke={GOLD_COLOR} strokeWidth="1" strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="10" r="0.5" fill={GOLD_COLOR}/>
    </svg>
  ),

  "mythes-legendes": ( // Double column Fâ ticks (Holy Breath) + Dots (Image 1)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4V16M24 4V16" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M14 6H18M14 9H18M14 12H18M14 15H18M22 6H26M22 9H26M22 12H26M22 15H26" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="7.5" r="0.6" fill={GOLD_COLOR}/>
      <circle cx="20" cy="10.5" r="0.6" fill={GOLD_COLOR}/>
      <circle cx="20" cy="13.5" r="0.6" fill={GOLD_COLOR}/>
    </svg>
  ),

  "startup-innovation": ( // Geometric Network (Image 1/3 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10L20 4L28 10L20 16L12 10Z" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M20 4V16M12 10H28" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="10" r="1.5" fill="white" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH}/>
    </svg>
  ),
  
  "start-up-innovation": ( // Alias
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10L20 4L28 10L20 16L12 10Z" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M20 4V16M12 10H28" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="10" r="1.5" fill="white" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH}/>
    </svg>
  ),

  "sagesse": ( // Concentric circle Horizon (Image 4 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="10" r="4" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="10" r="1.5" stroke={GOLD_COLOR} strokeWidth="0.8" vectorEffect={VECTOR_EFFECT}/>
      <path d="M6 10H14M26 10H34" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),

  "beaute-feminine": ( // Beaded perles chain (Image 1 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10H36" stroke={GOLD_COLOR} strokeWidth="0.6" strokeDasharray="2 2" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="12" cy="10" r="1.5" fill={GOLD_COLOR}/>
      <circle cx="20" cy="10" r="1.5" fill={GOLD_COLOR}/>
      <circle cx="28" cy="10" r="1.5" fill={GOLD_COLOR}/>
    </svg>
  ),

  "beaute-masculine": ( // Patterned Chevrons (Image 1 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 14L20 6L28 14" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M12 9L20 2L28 9" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <circle cx="20" cy="12" r="0.8" fill={GOLD_COLOR} opacity="0.6"/>
    </svg>
  ),

  "eloquence": ( // Concentric speech arcs (Image 4 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 14C14 14 17 9 20 9C23 9 26 14 26 14" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M10 16C10 16 15 6 20 6C25 6 30 16 30 16" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M6 18C6 18 13 3 20 3C27 3 34 18 34 18" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" opacity="0.4" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),

  "mode-style": ( // Rhythmic stripes (Image 1/2 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4V16M11 4V16M14 4V16M20 4V16M23 4V16M26 4V16M32 4V16" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  ),

  "parole-aines": ( // Nested wisdom squares (Image 4 inspiration)
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="5" width="16" height="10" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <rect x="16" y="8" width="8" height="4" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
      <path d="M20 5V8M20 12V15" stroke={GOLD_COLOR} strokeWidth="0.8" strokeLinecap="round" vectorEffect={VECTOR_EFFECT}/>
    </svg>
  )
};

// Mappage de secours pour les identifiants courts ou alternatifs
const ALIASES: Record<string, string> = {
  "mythes": "mythes-legendes",
  "innovation": "startup-innovation",
  "saveurs": "saveurs-benin",
  "musique": "musiques-benin",
  "musiques": "musiques-benin",
  "danse": "danses-benin",
  "danses": "danses-benin",
  "art": "artisanat",
  "artisanat": "artisanat",
  "vision": "artisanat",
  "beaute": "beaute-feminine",
  "beauté": "beaute-feminine",
  "beninois": "beninois-du-monde",
  "diaspora": "beninois-du-monde",
  "mode": "mode-style",
  "style": "mode-style",
  "ancetres": "memoire-ancetres",
  "ancêtres": "memoire-ancetres",
  "aines": "parole-aines",
  "aînés": "parole-aines",
  "gastronomie": "saveurs-benin",
  "gastrononie": "saveurs-benin"
};

const DEFAULT_PATTERN = (
  <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 10H35" stroke={GOLD_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" opacity="0.3" vectorEffect={VECTOR_EFFECT}/>
  </svg>
);

export const CategoryPattern = ({ id, className }: CategoryPatternProps) => {
  const normalizedId = id.toLowerCase().trim();
  
  // 1. Recherche directe
  let pattern = CATEGORY_PATTERNS[normalizedId];
  
  // 2. Recherche via alias
  if (!pattern) {
    const aliasKey = ALIASES[normalizedId];
    if (aliasKey) pattern = CATEGORY_PATTERNS[aliasKey];
  }
  
  // 3. Recherche floue (si l'ID contient un mot clé d'un des patterns)
  if (!pattern) {
    const matchingKey = Object.keys(CATEGORY_PATTERNS).find(key => 
      normalizedId.includes(key) || key.includes(normalizedId)
    );
    if (matchingKey) pattern = CATEGORY_PATTERNS[matchingKey];
  }

  return (
    <div className={cn("w-10 h-5 animate-in fade-in duration-500", className)}>
      {pattern || DEFAULT_PATTERN}
    </div>
  );
};
