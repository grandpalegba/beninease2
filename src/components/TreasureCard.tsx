"use client";

import { useState } from "react";
import type { Mystere } from "@/types/treasures";

interface TreasureCardProps {
  mystere: Mystere;
  onClick: () => void;
}

export default function TreasureCard({ mystere, onClick }: TreasureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      onClick={onClick}
    >
      <motion.div
        className="relative w-full max-w-sm mx-auto cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Carte principale */}
        <div className="relative bg-gradient-to-br from-terre-sombre to-black rounded-2xl border border-or-royal/20 shadow-2xl overflow-hidden">
          {/* Image/Poster */}
          <div className="relative h-64 bg-gradient-to-br from-or-royal/20 to-terre-sombre flex items-center justify-center">
            <div className="text-6xl">
              {mystere.icon || '🏺'}
            </div>
            
            {/* Overlay au survol */}
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-black/60 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center">
                  <div className="text-white text-lg font-bold mb-2">Explorer</div>
                  <div className="text-or-royal text-sm">Découvrir ce trésor</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Informations */}
          <div className="p-4 bg-terre-sombre/90">
            <h3 className="text-or-royal font-bold text-lg mb-2">
              {mystere.title}
            </h3>
            <p className="text-ivoire/80 text-sm mb-3">
              {mystere.subtitle}
            </p>
            
            {/* Thème/Univers */}
            <div className="flex items-center justify-between">
              <div className="inline-block bg-or-royal/10 border border-or-royal/30 px-3 py-1 rounded-full">
                <span className="text-or-royal text-xs font-medium">
                  {mystere.theme?.name || 'Thème'}
                </span>
              </div>
              
              {/* Difficulté */}
              {mystere.difficulty && (
                <div className="flex items-center gap-1">
                  <span className="text-ivoire/60 text-xs">Difficulté:</span>
                  <span className={`text-xs font-medium ${
                    mystere.difficulty === 'facile' ? 'text-green-400' :
                    mystere.difficulty === 'moyen' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {mystere.difficulty}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Indicateur de sélection */}
        {isHovered && (
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-or-royal rounded-full flex items-center justify-center shadow-lg"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 001.414 1.414l-6-6a1 1 0 00-1.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
