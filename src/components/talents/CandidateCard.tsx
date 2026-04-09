"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  talent: any;
  score: number;
  color: string; // #006b3f ou #bd0020
  isActive: boolean;
}

export default function CandidateCard({ talent, score, color, isActive }: CandidateCardProps) {
  return (
    <div className="relative flex-1 w-full flex flex-col group">
      {/* Container Image avec Shadow douce style "Editorial" */}
      <div className="relative flex-grow rounded-[32px] overflow-hidden bg-[#eeeeee] shadow-sm border border-gray-100">
        <img
          src={talent.profile_image}
          alt={talent.prenom_talent}
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
        />

        {/* Overlay subtil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1c]/60 via-transparent to-transparent" />

        {/* Score Overlay (Top Right) */}
        <div className="absolute top-6 right-6">
          <div className="glass-overlay px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20">
            <span className="text-white font-manrope font-black text-xl tabular-nums">
              {score}%
            </span>
          </div>
        </div>
      </div>

      {/* Info Talent (Bottom Layout) */}
      <div className="mt-6 px-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="w-3.5 h-3.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <h2 className="font-manrope font-black text-4xl tracking-tighter text-[#1a1c1c] uppercase italic">
            {talent.prenom_talent}
          </h2>
        </div>
      </div>
    </div>
  );
}