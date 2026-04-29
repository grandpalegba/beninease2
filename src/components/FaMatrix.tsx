
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SIGNS, type FongbeSign } from '@/data/fongbe';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';

/**
 * Renders a small version of the ideogram dots
 */
export const SignDotsColumn = ({ code, color = "#000000", size = 1.5 }: { code: [number, number, number, number], color?: string, size?: number }) => {
  const dotSize = size;
  const innerGap = size < 2 ? 1.5 : (size / 8); // Elegant gap for matrix dots
  
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

export const SignIdeogram = ({ leftSign, rightSign, color = "#1a1a1a", size = 1 }: { 
  leftSign: FongbeSign, 
  rightSign: FongbeSign,
  color?: string,
  size?: number
}) => {
  // size Prop is used as the DOT size directly for more control
  const dotSize = size > 5 ? (size / 6.5) : 1.5 * size;
  const columnGap = size > 5 ? (size / 3.5) : 4 * size;

  return (
    <div className="flex items-center justify-center pointer-events-none" style={{ gap: columnGap }}>
      <SignDotsColumn code={leftSign.code} color={color} size={dotSize} />
      <SignDotsColumn code={rightSign.code} color={color} size={dotSize} />
    </div>
  );
};

const MatrixCell = ({ rIndex, cIndex, onClick }: { rIndex: number, cIndex: number, onClick: (r: number, c: number) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const leftSign = SIGNS[rIndex];
  const rightSign = SIGNS[cIndex];

  // Animation delay based on distance from top-left (sweep effect)
  const revealDelay = (rIndex + cIndex) * 0.02;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9, backgroundColor: "#ffffff" }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        backgroundColor: "#f9fafb", // neutral-50
        transition: { 
          delay: revealDelay,
          duration: 0.5,
          ease: "easeOut"
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(rIndex, cIndex)}
      className={`
        relative w-10 h-10 rounded-[4px] border transition-all duration-300 ease-out flex items-center justify-center overflow-hidden
        ${isHovered ? 'bg-[#FCD116]/10 border-[#FCD116]/30 z-10' : 'border-[#008751]/20'}
      `}
      style={{
        boxShadow: isHovered ? '0 10px 20px rgba(0,135,81,0.05)' : 'none',
        transform: isHovered ? 'translateY(-2px) scale(1.05)' : 'none'
      }}
    >
      {/* Golden Flash Overlay (Revealing Light) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 0.8, 0],
          scale: [0.5, 1.5, 1],
        }}
        transition={{ 
          delay: revealDelay,
          duration: 0.8,
          times: [0, 0.2, 1]
        }}
        className="absolute inset-0 bg-[#FCD116] blur-[8px] pointer-events-none"
      />

      {/* Ghost Ideogram */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0.3 }}
        transition={{ delay: revealDelay + 0.2, duration: 0.5 }}
        className="transition-all duration-300"
      >
        <SignIdeogram 
          leftSign={leftSign} 
          rightSign={rightSign} 
          color={isHovered ? "#E8112D" : "#1a1a1a"} 
          size={2} 
        />
      </motion.div>

      {/* Tiny Yellow Glow in center on hover */}
      {isHovered && (
        <motion.div 
          layoutId="glow"
          className="absolute w-1.5 h-1.5 bg-[#FCD116] rounded-full blur-[4px] opacity-60"
        />
      )}
    </motion.button>
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
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 bg-white select-none no-scrollbar">
      <div className="relative inline-block p-4">
        {/* Top Header */}
        <div className="flex gap-[2px]">
          {/* Intersection Cell: Bases (The Join) */}
          <motion.button
            onClick={() => router.push('/sagesses/generalites')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-16 h-16 flex flex-col items-center justify-center flex-shrink-0 rounded-lg group relative overflow-hidden transition-all shadow-sm border border-[#008751]/20 bg-gradient-to-br from-[#00693E] to-[#008751]"
          >
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
            <BookOpen size={18} className="text-white mb-1 drop-shadow-md" strokeWidth={2.5} />
            <span className="text-[9px] font-black uppercase tracking-widest text-white drop-shadow-md">Bases</span>
          </motion.button>

          {/* Top Header Labels (Extra Row) */}
          <div className="flex gap-[2px]">
            {SIGNS.map((sign, i) => (
              <div 
                key={`h-${i}`} 
                className="w-10 h-16 flex items-end justify-center pb-4"
              >
                <motion.span 
                  initial={{ opacity: 0, y: -5, rotate: -45 }}
                  animate={{ opacity: 1, y: 0, rotate: -45 }}
                  transition={{ delay: i * 0.02, duration: 0.5 }}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-black font-sans origin-bottom whitespace-nowrap"
                >
                  {sign.name}
                </motion.span>
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-[2px]">
          {SIGNS.map((rowSign, rIndex) => (
            <div key={`r-${rIndex}`} className="flex gap-[2px]">
              {/* Left Header */}
              <div className="w-16 h-10 flex items-center justify-end pr-4 flex-shrink-0">
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rIndex * 0.02, duration: 0.5 }}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-black font-sans"
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
