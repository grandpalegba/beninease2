"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoteSliderProps {
  value: number;
  onChange: (value: number) => void;
  onValidate?: () => void;
  onVoteSubmit?: (value: number) => void;
  disabled?: boolean;
  leftName?: string;
  rightName?: string;
}

export default function VoteSlider({
  value,
  onChange,
  onValidate,
  onVoteSubmit,
  disabled = false,
  leftName,
  rightName
}: VoteSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Scores
  const leftScore = 100 - value;
  const rightScore = value;

  const handleUpdate = (clientX: number) => {
    if (!trackRef.current || disabled) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    onChange(Math.round((x / rect.width) * 100));
  };

  const handleFinalValidation = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (disabled) return;

    // On déclenche les deux callbacks possibles selon ton implémentation
    if (onVoteSubmit) onVoteSubmit(value);
    if (onValidate) onValidate();
  };

  return (
    <div className="w-full select-none space-y-6 pt-4">
      {/* SCORES GÉANTS - STYLE ARENA */}
      <div className="flex justify-between items-end px-4 font-manrope">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">
            {leftName?.split(' ')[0] || "Candidat"}
          </span>
          <span className={`text-5xl font-black transition-all ${value < 50 ? 'text-[#006b3f] scale-110' : 'text-gray-300'}`}>
            {leftScore}%
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">
            {rightName?.split(' ')[0] || "Candidat"}
          </span>
          <span className={`text-5xl font-black transition-all ${value > 50 ? 'text-[#ffd31a] scale-110' : 'text-gray-300'}`}>
            {rightScore}%
          </span>
        </div>
      </div>

      <div
        ref={trackRef}
        className={cn(
          "relative h-20 flex items-center touch-none px-8", // Padding pour éviter que le bouton sorte du rail
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
        onPointerDown={(e) => {
          if (disabled) return;
          setIsDragging(true);
          handleUpdate(e.clientX);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => isDragging && handleUpdate(e.clientX)}
        onPointerUp={(e) => {
          setIsDragging(false);
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
      >
        {/* RAIL NATIONAL */}
        <div className="absolute left-0 right-0 h-3 bg-gray-100 rounded-full overflow-hidden mx-4">
          <div className="absolute inset-y-0 left-0 bg-[#006b3f]" style={{ width: `${100 - value}%` }} />
          <div className="absolute inset-y-0 right-0 bg-[#ffd31a]" style={{ width: `${value}%` }} />
        </div>

        {/* LIGNE DE CENTRE (AXE DE SYMÉTRIE) */}
        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-6 bg-black/10 z-10" />

        {/* LE SCEAU ROUGE (FIX: Positionnement et Click) */}
        <motion.div
          className="absolute z-30"
          style={{
            left: `${value}%`,
            x: "-50%" // Garantit que le centre du bouton est pile sur le pourcentage
          }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
        >
          <div className="relative">
            <AnimatePresence>
              {!isDragging && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: -50 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black px-2 py-1 rounded-md whitespace-nowrap uppercase tracking-tighter"
                >
                  Sceller le vote
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onPointerDown={(e) => e.stopPropagation()} // Empêche le drag de s'activer quand on veut juste cliquer
              onClick={handleFinalValidation}
              className={cn(
                "w-16 h-16 rounded-full bg-[#bd0020] border-[4px] border-white shadow-2xl flex items-center justify-center transition-transform active:scale-90",
                !isDragging && "animate-pulse"
              )}
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </button>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">
        Faites glisser, puis appuyez pour valider
      </p>
    </div>
  );
}