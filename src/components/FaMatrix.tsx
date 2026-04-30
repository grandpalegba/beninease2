
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SIGNS, type FongbeSign } from '@/data/fongbe';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Renders a small version of the ideogram dots
 */
export const SignDotsColumn = ({ code, color = "#000000", size = 1.5 }: { code: [number, number, number, number], color?: string, size?: number }) => {
  const dotSize = size;
  const innerGap = size < 2 ? 2 : (size * 1.5); // Spaced out gap (1.5x dot size)
  
  return (
    <div className="flex flex-col items-center" style={{ gap: innerGap }}>
      {code.map((type, i) => (
        <div key={i} className="flex" style={{ gap: innerGap }}>
          <div style={{ width: dotSize, height: dotSize, background: color }} className="rounded-full" />
          {type === 2 && <div style={{ width: dotSize, height: dotSize, background: color }} className="rounded-full" />}
        </div>
      ))}
    </div>
  );
};

export const SignIdeogram = ({ leftSign, rightSign, color = "#000000", size = 1 }: { 
  leftSign: FongbeSign, 
  rightSign: FongbeSign,
  color?: string,
  size?: number
}) => {
  const dotSize = size > 5 ? (size / 16) : 1.5 * size;
  const columnGap = size > 5 ? (size / 3) : 4 * size;

  return (
    <div className="flex items-center justify-center pointer-events-none" style={{ gap: columnGap }}>
      <SignDotsColumn code={leftSign.code} color={color} size={dotSize} />
      <SignDotsColumn code={rightSign.code} color={color} size={dotSize} />
    </div>
  );
};

const MatrixCell = ({ 
  rIndex, 
  cIndex, 
  onClick 
}: { 
  rIndex: number;
  cIndex: number;
  onClick: (r: number, c: number) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const leftSign = SIGNS[rIndex];
  const rightSign = SIGNS[cIndex];

  const isMeji = rIndex === cIndex;
  const hoverColor = isMeji ? "#E8112D" : "#008751";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: (rIndex + cIndex) * 0.005, duration: 0.3 }}
      className={cn(
        "w-4 h-4 md:w-10 md:h-10 flex items-center justify-center rounded-sm transition-all cursor-pointer border",
        isHovered 
          ? "scale-110 z-10 shadow-lg" 
          : "bg-black border-white/5 hover:border-white/20"
      )}
      style={{
        backgroundColor: isHovered ? hoverColor : undefined,
        borderColor: isHovered ? hoverColor : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(rIndex, cIndex)}
    >
      <motion.div 
        animate={{ scale: isHovered ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <SignIdeogram 
          leftSign={leftSign} 
          rightSign={rightSign} 
          color="#FFFFFF" 
          size={0.5} 
        />
      </motion.div>
    </motion.div>
  );
};

const FaMatrix = () => {
  const router = useRouter();

  const generateSlug = (name: string) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s-]/g, "");
  };

  const handleCellClick = (rIndex: number, cIndex: number) => {
    const leftSign = SIGNS[rIndex];
    const rightSign = SIGNS[cIndex];
    const combinedName = rIndex === cIndex 
      ? `${leftSign.name} Meji` 
      : `${leftSign.name} ${rightSign.name}`;
    const slug = generateSlug(combinedName);
    router.push(`/sagesses/cours/${slug}`);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-0.5 md:p-8 bg-white select-none no-scrollbar overflow-hidden">
      <div className="relative inline-block p-0.5 md:p-4 scale-[0.65] sm:scale-100">
        {/* Top Header */}
        <div className="flex gap-[1px] md:gap-[2px]">
          {/* Intersection Cell: Bases (The Join) */}
          <motion.button
            onClick={() => router.push('/sagesses/generalites')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-8 h-8 md:w-16 md:h-16 flex flex-col items-center justify-center flex-shrink-0 rounded-lg group relative overflow-hidden transition-all shadow-sm border border-white/10 bg-black"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
            <BookOpen size={10} className="md:size-[18px] text-[#FFD700] mb-0.5 md:mb-1 drop-shadow-md" strokeWidth={2.5} />
            <span className="text-[5px] md:text-[9px] font-black uppercase tracking-widest text-white/70 drop-shadow-md">Bases</span>
          </motion.button>

          {/* Top Header Labels (Extra Row) - Surgical Precision Alignment */}
          <div className="flex gap-[1px] md:gap-[2px]">
            {SIGNS.map((sign, i) => (
              <div 
                key={`h-${i}`} 
                className="w-4 h-8 md:w-10 md:h-16 relative"
              >
                <motion.span 
                  initial={{ opacity: 0, y: -5, rotate: -45 }}
                  animate={{ opacity: 1, y: 0, rotate: -45 }}
                  transition={{ delay: i * 0.02, duration: 0.5 }}
                  className="absolute left-1/2 bottom-1 md:bottom-4 text-[5px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-black font-sans origin-bottom-left whitespace-nowrap"
                >
                  {sign.name}
                </motion.span>
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-[1px] md:gap-[2px]">
          {SIGNS.map((rowSign, rIndex) => (
            <div key={`r-${rIndex}`} className="flex gap-[1px] md:gap-[2px]">
              {/* Left Header */}
              <div className="w-8 h-4 md:w-16 md:h-10 flex items-center justify-end pr-1 md:pr-4 flex-shrink-0">
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rIndex * 0.02, duration: 0.5 }}
                  className="text-[5px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-black font-sans"
                >
                  {rowSign.name}
                </motion.span>
              </div>

              {/* Cells */}
              {SIGNS.map((colSign, cIndex) => (
                <MatrixCell 
                  key={`${rIndex}-${cIndex}`} 
                  rIndex={rIndex} 
                  cIndex={cIndex} 
                  onClick={handleCellClick} 
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaMatrix;
