"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function VoteSlider({ value, onChange, onVoteSubmit, disabled }: any) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpdate = (clientX: number) => {
    if (!trackRef.current || disabled) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    onChange(Math.round((x / rect.width) * 100));
  };

  return (
    <div className="w-full flex flex-col items-center bg-white font-manrope">
      {/* 1. MIROIR DES SCORES : Massive Scale */}
      <div className="flex justify-between w-full mb-12 px-4 items-baseline">
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-[#1a1c1c]/30 uppercase tracking-[0.3em] mb-2">Gauche</span>
          <span className="text-7xl font-black text-[#1a1c1c] tracking-tighter italic leading-none">{100 - value}%</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-black text-[#1a1c1c]/30 uppercase tracking-[0.3em] mb-2">Droite</span>
          <span className="text-7xl font-black text-[#1a1c1c] tracking-tighter italic leading-none">{value}%</span>
        </div>
      </div>

      {/* 2. LE RAIL (Vert & Jaune) */}
      <div
        ref={trackRef}
        className="relative w-full h-8 bg-[#eeeeee] rounded-full cursor-pointer touch-none mb-16 shadow-inner border border-gray-100"
        onPointerDown={(e) => { if (!disabled) { setIsDragging(true); handleUpdate(e.clientX); e.currentTarget.setPointerCapture(e.pointerId); } }}
        onPointerMove={(e) => isDragging && handleUpdate(e.clientX)}
        onPointerUp={() => setIsDragging(false)}
      >
        <div className="absolute inset-0 flex rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-[#006b3f]" />
          <div className="w-1/2 h-full bg-[#ffd31a]" />
        </div>

        {/* CURSEUR ROUGE */}
        <motion.div
          animate={{ left: `${value}%` }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-10 h-10 bg-[#bd0020] rounded-full border-[4px] border-white shadow-xl" />
        </motion.div>
      </div>

      {/* 3. CTA : Bouton Noir "Ink" */}
      <div className="w-full flex flex-col items-center gap-8">
        <div className="text-center">
          <p className="text-[11px] font-black text-[#1a1c1c]/40 uppercase tracking-[0.4em]">Gain potentiel</p>
          <p className="text-2xl font-black text-[#006b3f]">+ 150 PTS</p>
        </div>
        <button
          onClick={() => onVoteSubmit(value)}
          disabled={disabled}
          className="w-full bg-[#1a1c1c] text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all active:scale-95"
        >
          {disabled ? "ENREGISTREMENT..." : "VALIDER MON CHOIX"}
        </button>
      </div>
    </div>
  );
}