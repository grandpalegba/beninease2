
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SIGNS, type FongbeSign } from '@/data/fongbe';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';

/**
 * Renders a small version of the ideogram dots
 */
const MiniDotsColumn = ({ code, color = "currentColor", size = 1.5 }: { code: [number, number, number, number], color?: string, size?: number }) => (
  <div className="flex flex-col gap-[2px] items-center">
    {code.map((type, i) => (
      <div key={i} className="flex gap-[2px]">
        <div style={{ width: size, height: size, background: color }} className="rounded-full" />
        {type === 2 && <div style={{ width: size, height: size, background: color }} className="rounded-full" />}
      </div>
    ))}
  </div>
);

const MiniIdeogram = ({ leftSign, rightSign, color = "currentColor", size = 1 }: { 
  leftSign: FongbeSign, 
  rightSign: FongbeSign,
  color?: string,
  size?: number
}) => (
  <div className="flex gap-1 items-center justify-center pointer-events-none transition-all duration-300" style={{ transform: `scale(${size})` }}>
    <MiniDotsColumn code={leftSign.code} color={color} size={1.5} />
    <MiniDotsColumn code={rightSign.code} color={color} size={1.5} />
  </div>
);

const MatrixCell = ({ rIndex, cIndex, onClick }: { rIndex: number, cIndex: number, onClick: (r: number, c: number) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const leftSign = SIGNS[rIndex];
  const rightSign = SIGNS[cIndex];

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: (Math.abs(rIndex - 7.5) + Math.abs(cIndex - 7.5)) * 0.03,
        duration: 0.4,
        ease: "easeOut"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(rIndex, cIndex)}
      className={`
        relative w-10 h-10 rounded-[4px] border transition-all duration-300 ease-out flex items-center justify-center
        ${isHovered ? 'bg-[#FCD116]/10 border-[#FCD116]/30 z-10' : 'bg-white border-[#008751]/10'}
      `}
      style={{
        boxShadow: isHovered ? '0 10px 20px rgba(0,135,81,0.05)' : 'none',
        transform: isHovered ? 'translateY(-2px) scale(1.05)' : 'none'
      }}
    >
      {/* Ghost Ideogram */}
      <div className={`transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-[0.15]'}`}>
        <MiniIdeogram 
          leftSign={leftSign} 
          rightSign={rightSign} 
          color={isHovered ? "#E8112D" : "#1a1a1a"} 
          size={0.8} 
        />
      </div>

      {/* Tiny Yellow Glow in center */}
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
    router.push(`/savoirs/cours/${slug}`);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 bg-white overflow-auto select-none">
      <div className="relative inline-block p-4">
        {/* Top Header */}
        <div className="flex gap-[2px] mb-[2px]">
          {/* Intersection Cell: GÉNÉRALITÉS with Benin Gradient */}
          <motion.button
            onClick={() => router.push('/savoirs/generalites')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-12 h-12 flex flex-col items-center justify-center flex-shrink-0 rounded-lg group relative overflow-hidden transition-all shadow-sm border border-[#008751]/20 bg-gradient-to-br from-[#00693E] to-[#008751]"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <BookOpen size={14} className="text-white mb-1 z-10" />
            <span className="text-[7px] font-bold uppercase tracking-[1px] text-white z-10">
              Généralités
            </span>
          </motion.button>

          {SIGNS.map((sign, i) => (
            <div 
              key={`h-${i}`} 
              className="w-10 h-12 flex items-center justify-center"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] rotate-[-45deg] text-[#FCD116] font-sans drop-shadow-sm">
                {sign.name}
              </span>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-[2px]">
          {SIGNS.map((rowSign, rIndex) => (
            <div key={`r-${rIndex}`} className="flex gap-[2px]">
              {/* Left Header */}
              <div className="w-12 h-10 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FCD116] font-sans drop-shadow-sm">
                  {rowSign.name}
                </span>
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
