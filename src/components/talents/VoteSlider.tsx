"use client";

import React, { useRef, useState, useEffect } from "react";
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

  // Calcul des scores
  const leftScore = 100 - value;
  const rightScore = value;

  const handleUpdate = (clientX: number) => {
    if (!trackRef.current || disabled) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newValue = Math.round((x / rect.width) * 100);
    onChange(newValue);
  };

  return (
    <div className="w-full select-none space-y-8 py-4">
      {/* AFFICHAGE DES SCORES (STYLE ARENA) */}
      <div className="flex justify-between items-end px-2 font-manrope">
        <motion.div
          animate={{
            scale: value < 50 ? 1.05 : 0.95,
            opacity: value < 50 ? 1 : 0.5
          }}
          className="flex flex-col"
        >
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">
            {leftName?.split(' ')[0] || "Candidat"}
          </span>
          <span className="text-5xl font-black text-[#006b3f] leading-none">
            {leftScore}%
          </span>
        </motion.div>

        <motion.div
          animate={{
            scale: value > 50 ? 1.05 : 0.95,
            opacity: value > 50 ? 1 : 0.5
          }}
          className="flex flex-col items-end"
        >
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">
            {rightName?.split(' ')[0] || "Candidat"}
          </span>
          <span className="text-5xl font-black text-[#fcd116] leading-none">
            {rightScore}%
          </span>
        </motion.div>
      </div>

      {/* ZONE DU SLIDER */}
      <div
        ref={trackRef}
        className={cn(
          "relative h-20 flex items-center touch-none",
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
        {/* RAIL NATIONAL (VERT - JAUNE - ROUGE) */}
        <div className="absolute w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          {/* Fond dégradé national */}
          <div
            className="absolute inset-0 w-full h-full opacity-30"
            style={{ background: 'linear-gradient(90deg, #006b3f 0%, #fcd116 50%, #e8112d 100%)' }}
          />

          {/* Remplissage dynamique Vert (Gauche) */}
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{ backgroundColor: "#006b3f" }}
            animate={{ width: `${100 - value}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          />

          {/* Remplissage dynamique Jaune (Droite) */}
          <motion.div
            className="absolute inset-y-0 right-0"
            style={{ backgroundColor: "#fcd116" }}
            animate={{ width: `${value}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          />
        </div>

        {/* MARQUEUR CENTRAL (50%) */}
        <div className="absolute left-1/2 -translate-x-1/2 w-1 h-8 bg-black/5 z-10 rounded-full" />

        {/* LE SCEAU ROUGE (Bouton de validation flottant) */}
        <motion.div
          animate={{
            left: `${value}%`,
            scale: isDragging ? 1.15 : 1,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          className="absolute z-20 -translate-x-1/2 pointer-events-none"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isDragging && !disabled) {
                if (onVoteSubmit) onVoteSubmit(value);
                if (onValidate) onValidate();
              }
            }}
            className={cn(
              "w-14 h-14 rounded-full bg-[#e8112d] border-[4px] border-white shadow-xl flex items-center justify-center pointer-events-auto transition-all",
              !isDragging && !disabled && "animate-pulse"
            )}
            style={{ boxShadow: '0 10px 25px rgba(232, 17, 45, 0.4)' }}
          >
            {/* Centre du sceau */}
            <div className="w-2.5 h-2.5 bg-white rounded-full" />
          </motion.button>

          {/* TOOLTIP INTERACTIF */}
          <AnimatePresence>
            {!isDragging && !disabled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -50 }}
                exit={{ opacity: 0 }}
                className="absolute left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-black px-3 py-1.5 rounded-full whitespace-nowrap tracking-tighter"
              >
                SCELLER MON VOTE
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* LÉGENDE */}
      <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
        Faites glisser pour ajuster • Appuyez pour voter
      </p>
    </div>
  );
}