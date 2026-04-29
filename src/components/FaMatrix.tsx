
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SIGNS, type FongbeSign } from '@/data/fongbe';
import { useRouter } from 'next/navigation';

/**
 * Renders a single column of dots for a sign (left or right half of the ideogram)
 */
const DotsColumn = ({ code, color = "#1a1a1a" }: { code: [number, number, number, number], color?: string }) => (
  <div className="flex flex-col gap-3 items-center">
    {code.map((type, i) => (
      <div key={i} className="flex gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
        {type === 2 && <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />}
      </div>
    ))}
  </div>
);

/**
 * SignIdeogram - Renders the combined 16x16 combination ideogram
 */
export const SignIdeogram = ({ leftSign, rightSign, size = 60, color = "#1a1a1a" }: { 
  leftSign: FongbeSign, 
  rightSign: FongbeSign,
  size?: number,
  color?: string
}) => {
  return (
    <div className="flex gap-6 items-center justify-center" style={{ transform: `scale(${size / 100})` }}>
      <DotsColumn code={leftSign.code} color={color} />
      <DotsColumn code={rightSign.code} color={color} />
    </div>
  );
};

const FaMatrix = () => {
  const router = useRouter();
  const [hoveredCell, setHoveredCell] = useState<{ r: number, c: number } | null>(null);
  const [clickedCell, setClickedCell] = useState<{ r: number, c: number } | null>(null);

  // Slug generation: no accents, no spaces, no dashes
  const generateSlug = (name: string) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[\s-]/g, ""); // Remove spaces and dashes
  };

  const handleCellClick = (rIndex: number, cIndex: number) => {
    const leftSign = SIGNS[rIndex];
    const rightSign = SIGNS[cIndex];
    
    // If signs are the same, it's a "Meji" sign
    const combinedName = rIndex === cIndex 
      ? `${leftSign.name}Meji` 
      : `${leftSign.name}${rightSign.name}`;
      
    const slug = generateSlug(combinedName);

    setClickedCell({ r: rIndex, c: cIndex });
    
    // Brief display of ideogram before redirect
    setTimeout(() => {
      router.push(`/savoirs/cours/${slug}`);
    }, 800);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 bg-white overflow-auto">
      <div className="relative inline-block border border-neutral-100 shadow-sm rounded-lg overflow-hidden">
        {/* Top Header */}
        <div className="flex">
          <div className="w-12 h-12 flex-shrink-0 bg-neutral-50 border-r border-b border-neutral-200" />
          {SIGNS.map((sign, i) => (
            <div 
              key={`h-${i}`} 
              className="w-10 h-12 flex items-center justify-center border-b border-r border-neutral-200 bg-neutral-50"
            >
              <span className="text-[8px] font-bold uppercase tracking-tighter rotate-[-45deg] text-neutral-400">
                {sign.name}
              </span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {SIGNS.map((rowSign, rIndex) => (
          <div key={`r-${rIndex}`} className="flex">
            {/* Left Header */}
            <div className="w-12 h-10 flex items-center justify-end px-2 border-r border-b border-neutral-200 bg-neutral-50 flex-shrink-0">
              <span className="text-[8px] font-bold uppercase tracking-tighter text-neutral-400">
                {rowSign.name}
              </span>
            </div>

            {/* Cells */}
            {SIGNS.map((colSign, cIndex) => (
              <button
                key={`${rIndex}-${cIndex}`}
                onMouseEnter={() => setHoveredCell({ r: rIndex, c: cIndex })}
                onMouseLeave={() => setHoveredCell(null)}
                onClick={() => handleCellClick(rIndex, cIndex)}
                className={`w-10 h-10 border-r border-b border-neutral-100 transition-colors duration-300 relative group
                  ${hoveredCell?.r === rIndex || hoveredCell?.c === cIndex ? 'bg-neutral-50' : 'bg-[#f5f5f5]'}
                  hover:bg-white
                `}
              >
                {/* Visual feedback for the cell */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-black" />
              </button>
            ))}
          </div>
        ))}

        {/* Click Animation Overlay */}
        <AnimatePresence>
          {clickedCell && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                className="flex flex-col items-center gap-8"
              >
                <SignIdeogram 
                  leftSign={SIGNS[clickedCell.r]} 
                  rightSign={SIGNS[clickedCell.c]} 
                  size={120}
                />
                <h2 className="text-xl font-display uppercase tracking-widest text-[#1a1a1a]">
                  {SIGNS[clickedCell.r].name}{SIGNS[clickedCell.c].name}
                </h2>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FaMatrix;
