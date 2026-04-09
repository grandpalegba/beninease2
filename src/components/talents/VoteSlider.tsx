"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoteSliderProps {
  value: number;
  onChange: (value: number) => void;
  onVoteSubmit: (value: number) => void;
  disabled?: boolean;
}

export default function VoteSlider({ value, onChange, onVoteSubmit, disabled }: VoteSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpdate = (clientX: number) => {
    if (!trackRef.current || disabled) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    onChange(Math.round((x / rect.width) * 100));
  };

  return (
    <div className="w-full flex flex-col items-center font-manrope">
      {/* 1. MASSIVE SCORE */}
      <div className="mb-10 text-center">
        <span className="text-7xl font-extrabold text-[#1a1c1c] tracking-tighter tabular-nums">
          {value}%
        </span>
      </div>

      {/* 2. NATIONAL TRACK */}
      <div
        ref={trackRef}
        className="relative w-full h-8 bg-[#eeeeee] rounded-full cursor-pointer touch-none mb-14"
        onPointerDown={(e) => { if (!disabled) { setIsDragging(true); handleUpdate(e.clientX); e.currentTarget.setPointerCapture(e.pointerId); } }}
        onPointerMove={(e) => isDragging && handleUpdate(e.clientX)}
        onPointerUp={() => setIsDragging(false)}
      >
        <div className="absolute inset-0 flex rounded-full overflow-hidden">
          <div className="h-full bg-[#006b3f]" style={{ width: "33.33%" }} />
          <div className="h-full bg-[#fcd116]" style={{ width: "33.33%" }} />
          <div className="h-full bg-[#bd0020]" style={{ width: "33.33%" }} />
        </div>

        {/* CURSOR (Sceau Béninois) */}
        <motion.div
          animate={{ left: `${value}%` }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-10 h-10 bg-[#1a1c1c] rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* 3. CTA */}
      <div className="w-full flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-[10px] font-black text-[#1a1c1c]/30 uppercase tracking-[0.4em]">Gain potentiel</p>
          <p className="text-xl font-black text-[#006b3f]">+ 150 PTS</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onVoteSubmit(value)}
          disabled={disabled}
          className={cn(
            "w-full bg-[#1a1c1c] text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all",
            disabled && "opacity-50 grayscale"
          )}
        >
          {disabled ? "Validation en cours..." : "Valider mon choix"}
        </motion.button>
      </div>
    </div>
  );
}