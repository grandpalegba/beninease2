
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SIGNS, type FongbeSign } from '@/data/fongbe';
import { useRouter } from 'next/navigation';
import { BookOpen, Maximize2, X as CloseIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import BeninFrame from './BeninFrame';

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
        "w-6 h-6 md:w-10 md:h-10 flex items-center justify-center rounded-sm transition-all cursor-pointer border",
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
          size={0.8} 
        />
      </motion.div>
    </motion.div>
  );
};

const FaMatrix = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(false);
    router.push(`/sagesses/cours/${slug}`);
  };

  const MatrixContent = ({ isModal = false }: { isModal?: boolean }) => (
    <div className={cn(
      "relative inline-block min-w-fit",
      isModal ? "p-4 sm:p-8" : "p-1 sm:p-2"
    )}>
      <BeninFrame 
        className="w-full h-full" 
        inset={isModal ? 32 : 24} 
        thickness={4}
      >
        <div className={cn(
          "relative",
          isModal ? "p-8 sm:p-12" : "p-4 sm:p-8"
        )}>
          {/* Top Header */}
          <div className="flex gap-[2px]">
            {/* Intersection Cell: Bases (The Join) */}
            <motion.button
              onClick={() => router.push('/sagesses/generalites')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-10 h-10 md:w-16 md:h-16 flex flex-col items-center justify-center flex-shrink-0 rounded-lg group relative overflow-hidden transition-all shadow-sm border border-white/10 bg-black"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
              <BookOpen size={14} className="md:size-[18px] text-[#FFD700] mb-0.5 md:mb-1 drop-shadow-md" strokeWidth={2.5} />
              <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-white/70 drop-shadow-md">Bases</span>
            </motion.button>

            {/* Top Header Labels */}
            <div className="flex gap-[2px]">
              {SIGNS.map((sign, i) => (
                <div 
                  key={`h-${i}`} 
                  className="w-6 h-10 md:w-12 md:h-16 relative"
                >
                  <motion.span 
                    initial={{ opacity: 0, y: -5, rotate: -45 }}
                    animate={{ opacity: 1, y: 0, rotate: -45 }}
                    transition={{ delay: i * 0.02, duration: 0.5 }}
                    className="absolute left-1/2 bottom-2 md:bottom-4 text-[7px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-black font-sans origin-bottom-left whitespace-nowrap"
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
                <div className="w-10 h-6 md:w-16 md:h-12 flex items-center justify-end pr-3 md:pr-4 flex-shrink-0">
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rIndex * 0.02, duration: 0.5 }}
                    className="text-[7px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-black font-sans"
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
      </BeninFrame>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-start bg-white select-none relative">
      {/* Desktop View / Always visible but scaled on mobile if not in modal */}
      <div className="w-full h-full overflow-auto no-scrollbar flex flex-col items-center p-2 md:p-8">
        <div className="md:hidden mb-4 mt-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
          >
            <Maximize2 size={14} />
            Agrandir la matrice
          </button>
        </div>
        
        <div className="scale-[0.5] sm:scale-100 origin-top">
          <MatrixContent />
        </div>
      </div>

      {/* Full Screen Modal for Mobile */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-white flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100 shrink-0">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">Matrice Complète du Fâ</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black transition-colors"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 flex items-start justify-center bg-white cursor-grab active:cursor-grabbing">
              <div className="scale-[0.85] origin-top-left sm:scale-100">
                <MatrixContent isModal />
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-100 text-center">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                Glissez pour naviguer · Cliquez sur un signe pour voir les détails
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FaMatrix;
