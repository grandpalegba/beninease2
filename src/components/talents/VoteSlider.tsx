"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoteSliderProps {
  value: number;
  onChange: (value: number) => void;
  onValidate?: () => void;
  onVoteSubmit?: (value: number) => void; // Support pour le duel Talent
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

  // Scores calculés selon les couleurs du Bénin
  const leftScore = 100 - value;
  const rightScore = value;

  const handleUpdate = (clientX: number) => {
    if (!trackRef.current || disabled) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    onChange(Math.round((x / rect.width) * 100));
  };

  return (
    <div className="w-full select-none space-y-6">
      {/* Affichage des Scores Dynamiques */}
      <div className="flex justify-between items-center px-4 font-manrope">
        <motion.div
           animate={{ scale: value < 50 ? 1.1 : 0.9, opacity: value < 50 ? 1 : 0.4 }}
           className="flex flex-col"
         >
           <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
             {leftName?.split(' ')[0] || "Candidat Vert"}
           </span>
           <span className="text-3xl font-black text-[#006b3f]">{leftScore}%</span>
         </motion.div>

        <motion.div
           animate={{ scale: value > 50 ? 1.1 : 0.9, opacity: value > 50 ? 1 : 0.4 }}
           className="flex flex-col items-end"
         >
           <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
             {rightName?.split(' ')[0] || "Candidat Jaune"}
           </span>
           <span className="text-3xl font-black text-[#ffd31a]">{rightScore}%</span>
         </motion.div>
      </div>

      <div
        ref={trackRef}
        className={cn(
          "relative h-16 flex items-center touch-none",
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
        {/* Rail de base (Arrière-plan neutre) */}
        <div className="absolute w-full h-3 bg-white/10 rounded-full overflow-hidden">
          {/* FILL VERT (Gauche) */}
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{ backgroundColor: "#006b3f" }}
            animate={{ width: `${100 - value}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          />

          {/* FILL JAUNE (Droite) */}
          <motion.div
            className="absolute inset-y-0 right-0"
            style={{ backgroundColor: "#ffd31a" }}
            animate={{ width: `${value}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          />
        </div>

        {/* Ligne de séparation centrale */}
        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-6 bg-white/20 z-10" />

        {/* LE SCEAU ROUGE (Le bouton de validation) */}
        <motion.div
          animate={{
            x: `calc(${value}% - 32px)`,
            scale: isDragging ? 1.1 : 1,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          className="absolute z-20 pointer-events-none" // pointer-events-none car le track gère le drag
        >
          {/* Le bouton réel sur lequel on appuie pour valider */}
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
              "w-16 h-16 rounded-full bg-[#bd0020] border-[4px] border-white shadow-[0_0_30px_rgba(189,0,32,0.6)] flex items-center justify-center pointer-events-auto transition-transform",
              !isDragging && !disabled && "animate-pulse" // Pulsation quand immobile pour inviter au clic
            )}
          >
            {/* Icône de validation discrète au centre */}
            <div className="w-2 h-2 bg-white rounded-full shadow-inner" />
          </motion.button>

          {/* Tooltip d'aide (disparaît après le premier mouvement) */}
          <AnimatePresence>
            {!isDragging && value === 50 && !disabled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -45 }}
                exit={{ opacity: 0 }}
                className="absolute left-1/2 -translate-x-1/2 bg-white text-[#bd0020] text-[8px] font-black px-2 py-1 rounded-md whitespace-nowrap"
              >
                APPUYEZ POUR SCELLER
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.4em]">
        Faites glisser, puis appuyez sur le sceau
      </p>
    </div>
  );
}