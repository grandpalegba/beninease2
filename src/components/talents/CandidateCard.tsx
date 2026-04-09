"use client";

import React from "react";

export default function CandidateCard({ talent, score, color }: any) {
  if (!talent) return <div className="flex-1 rounded-[32px] bg-gray-50 animate-pulse" />;

  return (
    <div className="relative flex-1 w-full flex flex-col items-center text-center group font-manrope">
      {/* IMAGE CONTAINER : Pas de bordure noire, juste du blanc */}
      <div className="relative w-full aspect-[3/4] rounded-[32px] overflow-hidden bg-[#eeeeee] mb-8 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
        <img
          src={talent.profile_image}
          alt={talent.prenom_talent}
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
        />
      </div>

      {/* NOM : Tracking Large + Point National */}
      <div className="flex items-center gap-4 mb-3">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <h2 className="font-black text-3xl tracking-[0.15em] text-[#1a1c1c] uppercase leading-none">
          {talent.prenom_talent}
        </h2>
      </div>

      {/* SCORE : Sous le nom, massif */}
      <div className="font-black text-6xl tracking-tighter text-[#1a1c1c] italic">
        {score}%
      </div>
    </div>
  );
}