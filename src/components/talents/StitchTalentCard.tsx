"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StitchTalentCardProps {
  image: string;
  title: string;
  categorie: string;
  bio: string;
  className?: string;
}

/**
 * StitchTalentCard - Design "Stitch" de la carte talent.
 * Pur composant de présentation (UI uniquement).
 */
export default function StitchTalentCard({
  image,
  title,
  categorie,
  bio,
  className,
}: StitchTalentCardProps) {
  return (
    <div className={cn(
      "w-full h-full bg-white rounded-[3rem] shadow-2xl shadow-black/10 overflow-hidden flex flex-col border border-white/50 relative",
      className
    )}>
      {/* Image Section (75% height) */}
      <div className="relative h-[75%] w-full overflow-hidden">
        <Image
          src={image || "/placeholder-portrait.jpg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Soft Background Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="px-8 md:px-12 flex-1 flex flex-col items-center justify-start text-center bg-white">
        {/* Category Badge */}
        <span className="text-amber-600 text-xs font-black uppercase tracking-[0.25em]">
          {categorie}
        </span>

        {/* Talent Name */}
        <h3 className="text-4xl md:text-5xl font-black text-[#1A1A1A] uppercase tracking-[0.05em] my-2">
          {title}
        </h3>

        {/* Talent Bio Snippet */}
        <p className="text-gray-600 italic text-lg md:text-xl line-clamp-2">
          "{bio}"
        </p>
      </div>
    </div>
  );
}
