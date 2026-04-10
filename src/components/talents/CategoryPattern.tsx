"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CategoryPatternProps {
  id: string;
  className?: string;
}

const CATEGORY_PATTERNS: Record<string, React.ReactNode> = {
  "artisanat": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 14L10 6L18 14L26 6L34 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "beaute-feminine": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="20" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="30" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 10H8M12 10H18M22 10H28M32 10H38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "beaute-masculine": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 14L20 6L30 14M10 10L20 2L30 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "beninois-monde": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 10H38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 5V15M15 10H25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 8V12M8 10H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 8V12M28 10H32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "beninois-du-monde": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 10H38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 5V15M15 10H25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 8V12M8 10H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 8V12M28 10H32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "danses-benin": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 10C10 2 10 18 20 10C30 2 30 18 38 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2 14C10 6 10 22 20 14C30 6 30 22 38 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  "eloquence": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 15C10 15 15 10 20 10C25 10 30 15 30 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 16C6 16 13 6 20 6C27 6 34 16 34 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2 17C2 17 11 2 20 2C29 2 38 17 38 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "humour-comedie": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4L24 10L20 16L16 10L20 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 8L12 11L10 14L8 11L10 8Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M30 8L32 11L30 14L28 11L30 8Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  "memoire-ancetres": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 18H38V2H10V14H30V6H18V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "mode-style": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 4V16M10 4V16M13 4V16M20 4V16M23 4V16M26 4V16M32 4V16M35 4V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "musiques-benin": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 15V10M16 15V5M24 15V8M32 15V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 17H36" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
    </svg>
  ),
  "mythes-legendes": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 10C6 14 10 14 14 10C18 6 22 6 26 10C30 14 34 14 38 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M34 10L38 6M38 14L34 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  "parole-aines": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="4" width="20" height="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="16" y="8" width="8" height="4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  "saveurs-benin": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10L10 6M20 10L10 14M20 10L30 6M20 10L30 14M20 10V2M20 10V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "startup-innovation": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="6" r="1.5" fill="currentColor"/>
      <circle cx="30" cy="6" r="1.5" fill="currentColor"/>
      <circle cx="20" cy="14" r="1.5" fill="currentColor"/>
      <path d="M10 6L30 6L20 14L10 6Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M10 6L20 14M30 6L20 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  "start-up-innovation": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="6" r="1.5" fill="currentColor"/>
      <circle cx="30" cy="6" r="1.5" fill="currentColor"/>
      <circle cx="20" cy="14" r="1.5" fill="currentColor"/>
      <path d="M10 6L30 6L20 14L10 6Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M10 6L20 14M30 6L20 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  "voix-lieux": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="14" height="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="22" y="4" width="14" height="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="10" y="11" width="20" height="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "sagesse": (
    <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 10H16M24 10H38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="20" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
};

const DEFAULT_PATTERN = (
  <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 10H38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
  </svg>
);

export const CategoryPattern = ({ id, className }: CategoryPatternProps) => {
  const pattern = CATEGORY_PATTERNS[id] || DEFAULT_PATTERN;

  return (
    <div className={cn("w-10 h-5 text-zinc-300 animate-in fade-in duration-700", className)}>
      {pattern}
    </div>
  );
};
