
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SIGNS, type FongbeSign } from '@/data/fongbe';
import { useRouter } from 'next/navigation';
import { BookOpen, Maximize2, X as CloseIcon, ArrowLeft, Shield, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import BeninFrame from './BeninFrame';
import { supabase } from '@/lib/supabase/client';

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
        "w-5 h-5 md:w-8 md:h-8 flex items-center justify-center rounded-sm transition-all cursor-pointer border",
        isHovered 
          ? "scale-110 z-10 shadow-lg" 
          : "bg-[#1B2A4A] border-white/5 hover:border-white/20"
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
          size={0.6} 
        />
      </motion.div>
    </motion.div>
  );
};

const FaMatrix = ({ useModal = false }: { useModal?: boolean }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBasesModalOpen, setIsBasesModalOpen] = useState(false);
  const [selectedSign, setSelectedSign] = useState<{ left: FongbeSign, right: FongbeSign, name: string } | null>(null);
  const [signData, setSignData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s-]/g, "");
  };

  const cleanString = (s: string) => {
    return s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s-]/g, "");
  };

  const fetchSignData = async (signName: string) => {
    setLoadingData(true);
    try {
      const { data: allSigns, error } = await supabase
        .from('signes_fa')
        .select('*');

      if (error) throw error;

      const foundSign = allSigns?.find(s => {
        const dbSlug = cleanString(s.signe_nom).toLowerCase().replace('medji', 'meji');
        const searchSlug = cleanString(signName).toLowerCase().replace('medji', 'meji');
        return dbSlug === searchSlug;
      });
      
      setSignData(foundSign || null);
    } catch (err) {
      console.error("Error fetching sign data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCellClick = (rIndex: number, cIndex: number) => {
    const leftSign = SIGNS[rIndex];
    const rightSign = SIGNS[cIndex];
    const combinedName = rIndex === cIndex 
      ? `${leftSign.name} Meji` 
      : `${leftSign.name} ${rightSign.name}`;
    
    if (useModal) {
      setSelectedSign({ left: leftSign, right: rightSign, name: combinedName });
      setIsDetailsModalOpen(true);
      fetchSignData(combinedName);
    } else {
      const slug = generateSlug(combinedName);
      setIsModalOpen(false);
      router.push(`/sagesses/cours/${slug}`);
    }
  };

  const MatrixContent = ({ isModal = false }: { isModal?: boolean }) => (
    <div className={cn(
      "relative inline-block min-w-fit",
      isModal ? "p-4 sm:p-8" : "p-1 sm:p-2"
    )}>
        <div className={cn(
          "relative",
          isModal ? "p-4 sm:p-8" : "p-2 sm:p-8"
        )}>
          {/* Top Header */}
          <div className="flex gap-[2px]">
            {/* Intersection Cell: Bases (The Join) */}
            <motion.button
              onClick={() => {
                if (useModal) {
                  setIsBasesModalOpen(true);
                } else {
                  router.push('/sagesses/generalites');
                }
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-8 h-8 md:w-12 md:h-12 flex flex-col items-center justify-center flex-shrink-0 rounded-lg group relative overflow-hidden transition-all shadow-sm border border-white/10 bg-[#1B2A4A]"
            >
              <BookOpen className="text-[#E9B113]" size={16} />
              <span className="text-[6px] md:text-[8px] font-bold text-white uppercase tracking-tighter mt-0.5">Bases</span>
            </motion.button>

            {/* Column Headers (Horizontal) */}
            <div className="flex gap-[2px]">
              {SIGNS.map((sign, i) => (
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

  return (
    <div className="w-full h-full flex flex-col items-center justify-start select-none relative">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {/* Desktop View / Always visible but scaled on mobile if not in modal */}
      <div className="w-full h-full overflow-auto no-scrollbar flex flex-col items-center p-2 md:p-8">
        <div className="md:hidden mb-4 mt-0">
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
            
            <div className="flex-1 overflow-auto p-4 flex items-start justify-center bg-white cursor-grab active:cursor-grabbing no-scrollbar">
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

      {/* Details Modal (Sign Info) */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedSign && (
          <div className="fixed inset-0 z-[1100] bg-[#1B2A4A]/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="absolute top-5 right-5 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black transition-all hover:rotate-90 z-10"
              >
                <CloseIcon size={20} />
              </button>

              <div className="flex-1 overflow-y-auto p-6 sm:p-10 no-scrollbar">
                <div className="flex flex-col items-center text-center">
                  {/* Ideogram */}
                  <div className="mb-6">
                    <SignIdeogram leftSign={selectedSign.left} rightSign={selectedSign.right} size={80} color="#1B2A4A" />
                  </div>

                  {/* Name */}
                  <h2 className="text-2xl md:text-4xl font-sans font-bold text-[#1B2A4A] mb-2 md:mb-3 tracking-tight">
                    {selectedSign.name}
                  </h2>

                  {/* Motto / Devise */}
                  {loadingData ? (
                    <div className="animate-pulse space-y-4 w-full max-w-md pt-4">
                      <div className="h-4 bg-gray-100 rounded-full w-3/4 mx-auto" />
                      <div className="h-20 bg-gray-50 rounded-2xl w-full" />
                    </div>
                  ) : signData ? (
                    <>
                      <p className="text-sm md:text-lg text-[#A34D35] font-serif italic mb-5 md:mb-6 leading-relaxed max-w-2xl px-2">
                        "{signData.devise}"
                      </p>

                      <p className="text-[12px] md:text-[13px] text-gray-500 leading-relaxed mb-8 md:mb-10 max-w-xl px-4">
                        {signData.introduction || "Découvrez la sagesse ancestrale à travers ce signe majeur de la géomancie du Fâ."}
                      </p>

                      {/* Cards Grid */}
                      <div className="grid gap-4 w-full text-left max-w-2xl">
                        {/* Avantages */}
                        <div className="bg-[#f2f6f4] p-5 sm:p-6 rounded-2xl border border-emerald-100/50">
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="text-[#008751]" size={14} />
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#008751]">Avantages</h4>
                          </div>
                          <p className="text-[12px] md:text-[13px] text-gray-600 leading-relaxed font-light">
                            {signData.avantages}
                          </p>
                        </div>

                        {/* Défis */}
                        <div className="bg-[#f9f5f4] p-5 sm:p-6 rounded-2xl border border-rose-100/50">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="text-[#A34D35]" size={14} />
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#A34D35]">Défis</h4>
                          </div>
                          <p className="text-[12px] md:text-[13px] text-gray-600 leading-relaxed font-light">
                            {signData.defis}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-10 text-gray-400 italic text-sm">
                      Données en cours de préparation pour ce signe...
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bases Modal (Presentation) */}
      <AnimatePresence>
        {isBasesModalOpen && (
          <div className="fixed inset-0 z-[1100] bg-[#1B2A4A]/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsBasesModalOpen(false)}
                className="absolute top-5 right-5 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black transition-all hover:rotate-90 z-10"
              >
                <CloseIcon size={20} />
              </button>

              <div className="p-8 sm:p-12 text-center">
                <div className="w-16 h-16 bg-[#1B2A4A]/5 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <BookOpen className="text-[#1B2A4A]" size={32} />
                </div>

                <h2 className="text-3xl font-sans font-bold text-[#1B2A4A] mb-6 tracking-tight">
                  Présentation du Fâ
                </h2>

                <p className="text-base text-gray-600 leading-relaxed font-light">
                  Le Fâ est un système de connaissance et de sagesse originaire du Bénin et d’Afrique de l’Ouest, fondé sur un vaste corpus de signes, de récits et d’enseignements. Interprété par des spécialistes, il transmet des repères de compréhension et des sources d’inspiration.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FaMatrix;
