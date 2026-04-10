"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

export default function VoteSlider({ value, onChange, onVoteSubmit }: any) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpdate = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    onChange(Math.round((x / rect.width) * 100));
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* SCORE HEADER */}
      <div className="w-full flex justify-center mb-16">
        <h3 className="font-black text-[140px] text-[#1a1c1c] tracking-tighter tabular-nums leading-none italic">
          {value}%
        </h3>
      </div>

      {/* TRACK (Le fameux Vert/Jaune) */}
      <div
        ref={trackRef}
        className="relative w-full h-10 bg-[#eeeeee] rounded-full cursor-pointer touch-none mb-20 shadow-inner"
        onPointerDown={(e) => { setIsDragging(true); handleUpdate(e.clientX); e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => isDragging && handleUpdate(e.clientX)}
        onPointerUp={() => setIsDragging(false)}
      >
        <div className="absolute inset-0 flex rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-[#22C55E]" />
          <div className="w-1/2 h-full bg-[#715c00]" />
        </div>

        {/* CURSEUR ROUGE BORD BLANC */}
        <motion.div
          animate={{ left: `${value}%` }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-12 h-12 bg-[#bd0020] rounded-full border-[6px] border-white shadow-2xl" />
        </motion.div>
      </div>

      {/* CTA SECTION */}
      <div className="flex flex-col items-center gap-10">
        <div className="text-center">
          <p className="text-[12px] font-black text-[#1a1c1c]/40 uppercase tracking-[0.5em] mb-2">Gain potentiel</p>
          <p className="text-4xl font-black text-[#22C55E] italic">+ 150 PTS</p>
        </div>
        <button
          onClick={() => onVoteSubmit(value)}
          className="px-24 py-8 bg-[#1a1c1c] text-white rounded-3xl font-black uppercase tracking-[0.4em] text-[13px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
        >
          Valider mon choix
        </button>
      </div>
    </div>
  );
}