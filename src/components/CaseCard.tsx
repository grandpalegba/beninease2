'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { LifeCase } from "@/features/consultation/useLifeCases";

interface Props {
  lifeCase: LifeCase;
  onOpenMatrix: (selectedOptionIdx: number | null) => void;
}

/**
 * CaseCard - Editorial Layout for a single Life Case.
 * Features a large cinematic visual and a structured decision area.
 */
const CaseCard = ({ lifeCase, onOpenMatrix }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-body bg-[#ffffff] rounded-xl overflow-hidden flex flex-col md:flex-row"
      style={{
        boxShadow: "0 20px 60px rgba(45, 47, 47, 0.08)",
        color: "#2d2f2f",
      }}
    >
      {/* Left: Cinematic Visual */}
      <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[600px] group">
        <img
          alt={lifeCase.persona}
          className="w-full h-full object-cover pointer-events-none select-none"
          src={lifeCase.photoUrl || "/placeholder-face.jpg"}
          draggable={false}
        />

        {/* Floating Persona Badge (glassmorphic) */}
        <div className="absolute bottom-8 left-8 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg z-20 border border-white/30">
          <p className="font-headline italic text-base md:text-lg text-white drop-shadow">
            {lifeCase.persona}
          </p>
        </div>

        {/* Minimalist Play Button */}
        <div className="absolute bottom-8 right-8 z-20">
          <button
            type="button"
            aria-label="Écouter la mise en scène"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
          >
            <Play size={20} fill="currentColor" />
          </button>
        </div>

        {/* Golden waveform */}
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-1 pb-4 px-8 z-10 pointer-events-none">
          {[3, 6, 8, 4, 7, 5, 9, 4, 6, 3].map((h, i) => (
            <span
              key={i}
              className="w-1 rounded-full"
              style={{
                background: "#D4AF37",
                height: `${h * 4}px`,
                opacity: 0.6,
                transformOrigin: "bottom",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right: Editorial Content */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        {/* Domain label + Benin flag dots */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <span
            className="font-label text-xs tracking-[0.2em] uppercase font-bold"
            style={{ color: "#5a5c5c" }}
          >
            {lifeCase.label}
          </span>
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: "#008751" }} />
            <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: "#fcd116" }} />
            <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: "#e8112d" }} />
          </div>
        </div>

        {/* Editorial title */}
        <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl leading-tight mb-6" style={{ color: "#00693e" }}>
          {lifeCase.title}
        </h2>

        {/* Quote — italic with golden left border */}
        <blockquote
          className="mb-8 md:mb-10 italic text-base md:text-lg leading-relaxed pl-5 md:pl-6"
          style={{
            borderLeft: "4px solid #fbd115",
            color: "rgba(45, 47, 47, 0.9)",
          }}
        >
          "{lifeCase.quote}"
        </blockquote>

        <p className="font-label text-[11px] uppercase tracking-widest mb-5" style={{ color: "#5a5c5c" }}>
          Choisissez une option selon votre intuition et ouvrez la matrice des choix
        </p>

        {/* Options */}
        <div className="space-y-3 mb-8 md:mb-10">
          {lifeCase.options.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                className="group w-full flex items-start text-left p-4 rounded-xl transition-all cursor-pointer"
                style={{
                  background: isSelected ? "#ffffff" : "#f0f1f1",
                  boxShadow: isSelected
                    ? "inset 0 0 0 2px #00693e"
                    : "inset 0 0 0 1px rgba(172,173,173,0.15)",
                }}
              >
                <span className="text-sm md:text-base font-medium leading-snug" style={{ color: isSelected ? "#00693e" : "#2d2f2f" }}>
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)}:</span>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Primary CTA */}
        <div className="flex justify-center md:justify-start">
          <button
            type="button"
            onClick={() => onOpenMatrix(selected)}
            className="px-10 py-5 rounded-md font-bold text-xs md:text-sm uppercase tracking-widest text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: "linear-gradient(90deg, #00693e 0%, #005c36 100%)",
              boxShadow: "0 12px 30px rgba(0, 105, 62, 0.25)",
            }}
          >
            Ouvrir la matrice des choix
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseCard;
