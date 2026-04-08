"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoteSliderProps {
  value: number;
  onChange: (value: number) => void;
  onVoteSubmit: (value: number) => void;
  leftName?: string;  // Ajouté pour la cohérence des types
  rightName?: string; // Ajouté pour la cohérence des types
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
    <div className="w-full space-y-8 font-manrope">
      <div className="flex justify-between items-end px-2">
        <span className="text-4xl font-black text-[#006b3f] tabular-nums">{100 - value}%</span>
        <span className="text-4xl font-black text-[#bd0020] tabular-nums">{value}%</span>
      </div>

      <div
        ref={trackRef}
        className="relative h-4 w-full bg-gray-100 rounded-full cursor-pointer touch-none"
        onPointerDown={(e) => {
          if (disabled) return;
          setIsDragging(true);
          handleUpdate(e.clientX);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => isDragging && handleUpdate(e.clientX)}
        onPointerUp={(e) => setIsDragging(false)}
      >
        <div className="absolute inset-0 flex rounded-full overflow-hidden">
          <div className="h-full bg-[#006b3f]" style={{ width: "33.33%" }} />
          <div className="h-full bg-[#fcd116]" style={{ width: "33.33%" }} />
          <div className="h-full bg-[#bd0020]" style={{ width: "33.33%" }} />
        </div>

        <motion.div
          animate={{ left: `${value}%` }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-10 h-10 bg-white rounded-full border-4 border-white shadow-lg" />
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
          Points en jeu : 100 XP
        </div>
        <motion.button
          disabled={disabled}
          whileTap={{ scale: 0.97 }}
          onClick={() => onVoteSubmit(value)}
          className={cn(
            "w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-xs shadow-2xl",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          Valider le vote
        </motion.button>
      </div>
    </div>
  );
}