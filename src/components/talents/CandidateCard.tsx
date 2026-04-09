"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  talent: any;
  score: number;
  color: string;
  isActive: boolean;
}

export default function CandidateCard({ talent, score, color, isActive }: CandidateCardProps) {
  // 🛡️ Guard Clause : Empêche le crash si les données Supabase sont en cours de chargement
  if (!talent) {
    return <div className="flex-1 w-full bg-[#eeeeee] animate-pulse rounded-[32px] min-h-[300px]" />;
  }

  return (
    <div className="relative flex-1 w-full flex flex-col group font-manrope">
      {/* CONTAINER IMAGE : Rounded 32px + Grayscale dynamique */}
      <div className="relative flex-grow rounded-[32px] overflow-hidden bg-[#eeeeee] shadow-sm border border-gray-100 min-h-[320px]">
        <img
          src={talent.profile_image}
          alt={talent.prenom_talent}
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 ease-out"
        />

        {/* SCORE OVERLAY : Glassmorphism Top-Right */}
        <div className="absolute top-5 right-5 z-20">
          <div className="px-4 py-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl">
            <span className="text-white font-black text-xl tabular-nums tracking-tighter">
              {score}%
            </span>
          </div>
        </div>

        {/* SUBTLE GRADIENT : Pour la lisibilité du bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1c]/40 via-transparent to-transparent opacity-60" />
      </div>

      {/* INFO BLOCK : Asymmetrical Tension */}
      <div className="mt-6 px-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="w-3.5 h-3.5 rounded-full flex-shrink-0 animate-pulse"
            style={{ backgroundColor: color }}
          />
          <h2 className="font-black text-4xl tracking-tighter text-[#1a1c1c] uppercase italic leading-none">
            {talent.prenom_talent}
          </h2>
        </div>
      </div>
    </div>
  );
}