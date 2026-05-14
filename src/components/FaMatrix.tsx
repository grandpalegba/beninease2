
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
  const hoverColor = isMeji ? "#E8112D" : "#0077C8";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: (rIndex + cIndex) * 0.005, duration: 0.3 }}
      className={cn(
        "w-5 h-5 md:w-8 md:h-8 flex items-center justify-center rounded-sm transition-all cursor-pointer border",
        isHovered 
          ? "scale-110 z-10 shadow-lg" 
          : "bg-[#043a82] border-white/5 hover:border-white/20"
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
  const [viewMode, setViewMode] = useState<'tradition' | 'feminine'>('tradition');

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
      // Fetch traditional data
      const { data: allSigns, error } = await supabase
        .from('signes_fa')
        .select('*');

      if (error) throw error;

      const traditional = allSigns?.find(s => {
        const dbSlug = cleanString(s.signe_nom).toLowerCase().replace('medji', 'meji');
        const searchSlug = cleanString(signName).toLowerCase().replace('medji', 'meji');
        return dbSlug === searchSlug;
      });

      // Fetch universal values
      const { data: allUniversal, error: uError } = await supabase
        .from('valeurs_universelles')
        .select('*');

      if (uError) {
        console.error("Error fetching universal values:", uError);
      }

      const universal = allUniversal?.find(s => {
        // Check both combination and signe_fa fields for a match
        const comboSlug = cleanString(s.combinaison || "").toLowerCase().replace('medji', 'meji');
        const signSlug = cleanString(s.signe_fa || "").toLowerCase().replace('medji', 'meji');
        const searchSlug = cleanString(signName).toLowerCase().replace('medji', 'meji');
        return comboSlug === searchSlug || signSlug === searchSlug;
      });
      
      // Merge data
      setSignData({
        ...(traditional || {}),
        // Map universal fields to the expected UI keys
        nom_universel: universal?.valeur,
        combinaison_universelle: universal?.combinaison,
        sous_titre_universel: universal?.rythme,
        description_universelle: universal?.recit,
        revelation: universal?.revelation,
        piege: universal?.piege,
        geste: universal?.geste,
        inspiration: universal?.inspiration
      });
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
            className="w-8 h-8 md:w-12 md:h-12 flex flex-col items-center justify-center flex-shrink-0 rounded-lg group relative overflow-hidden transition-all shadow-sm border border-white/10 bg-[#043a82]"
          >
            <BookOpen className="text-[#E9B113]" size={16} />
            <span className="text-[6px] md:text-[8px] font-bold text-white uppercase tracking-tighter mt-0.5">Bases</span>
          </motion.button>

          {/* Column Headers (Horizontal) */}
          <div className="flex gap-[2px]">
            {SIGNS.map((sign, i) => (
              <div key={i} className="w-5 h-6 md:w-8 md:h-12 flex items-center justify-center bg-transparent flex-shrink-0">
                <span className="text-[5px] md:text-[7px] font-bold text-[#1B2A4A] uppercase tracking-widest rotate-[-45deg] whitespace-nowrap">
                  {sign.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-[2px]">
          {/* Row Headers (Vertical) */}
          <div className="flex flex-col gap-[2px]">
            {SIGNS.map((sign, i) => (
              <div key={i} className="w-8 h-5 md:w-12 md:h-8 flex items-center justify-end pr-1 md:pr-2 bg-transparent flex-shrink-0">
                <span className="text-[5px] md:text-[7px] font-bold text-[#1B2A4A] uppercase tracking-widest text-right">
                  {sign.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-[2px]">
            {SIGNS.map((rowSign, rIndex) => (
              <div key={`r-${rIndex}`} className="flex gap-[2px]">
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
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-start select-none relative">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {/* Desktop View / Always visible but scaled on mobile if not in modal */}
      <div className="w-full flex flex-col items-center overflow-hidden py-4">
        {/* Mobile Button - Centered */}
        <div className="md:hidden mb-8 flex justify-center w-full px-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full max-w-xs flex items-center justify-center gap-3 bg-[#043a82] text-white py-4 rounded-full text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all hover:bg-[#2E5FA3]"
          >
            <Maximize2 size={18} />
            Agrandir la matrice
          </button>
        </div>
        
        {/* Matrix Preview Container - Fixed height for mobile to avoid layout shift/overflow */}
        <div className="relative w-full h-[300px] sm:h-[450px] md:h-auto flex justify-center items-center md:items-start">
          <div className="md:relative absolute md:scale-100 scale-[0.55] sm:scale-[0.75] origin-center md:origin-top transition-all duration-500">
            <MatrixContent />
          </div>
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
                className="absolute top-5 right-5 p-2 bg-gray-50 rounded-full text-gray-300 hover:text-black transition-all hover:rotate-90 z-10"
              >
                <CloseIcon size={20} />
              </button>

              <div className="flex-1 overflow-y-auto p-4 sm:p-10 no-scrollbar">
                <div className="flex flex-col items-center text-center">
                  {/* Ideogram */}
                  <div className="mb-4 md:mb-10 mt-4">
                    <SignIdeogram 
                      leftSign={selectedSign.left} 
                      rightSign={selectedSign.right} 
                      size={window.innerWidth < 640 ? 100 : 140} 
                      color="#1B2A4A" 
                    />
                  </div>

                  {/* Name & Toggle Section */}
                  <div className="flex flex-col items-center w-full mt-4">
                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-full mb-10">
                      <button 
                        onClick={() => setViewMode('tradition')}
                        className={cn(
                          "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                          viewMode === 'tradition' ? "bg-[#A34D35] text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        Tradition du Fâ
                      </button>
                      <button 
                        onClick={() => setViewMode('feminine')}
                        className={cn(
                          "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                          viewMode === 'feminine' ? "bg-[#0077C8] text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        Valeurs du Féminin
                      </button>
                    </div>

                    {loadingData ? (
                      <div className="animate-pulse space-y-4 w-full max-w-md pt-4">
                        <div className="h-4 bg-gray-100 rounded-full w-3/4 mx-auto" />
                        <div className="h-20 bg-gray-50 rounded-2xl w-full" />
                      </div>
                    ) : signData ? (
                      <div className="w-full flex flex-col items-center">
                        {viewMode === 'tradition' ? (
                          <>
                            <h2 className="text-3xl md:text-5xl font-sans font-bold text-[#1B2A4A] mb-4 tracking-tight">
                              {selectedSign.name}
                            </h2>
                            <p className="text-sm md:text-lg text-[#A34D35] font-serif italic mb-10 md:mb-14 leading-relaxed max-w-2xl px-2">
                              "{signData.devise?.replace(/\[cite:\s*[\d,\s]+\]/g, '').trim() || "Devise en cours..."}"
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left max-w-2xl">
                              <div className="bg-[#f2f6f4] p-6 rounded-[1.5rem] border border-emerald-100/50">
                                <div className="flex items-center gap-2 mb-3">
                                  <Target className="text-[#008751]" size={14} />
                                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#008751]">Avantages</h4>
                                </div>
                                <p className="text-[12px] md:text-[13px] text-gray-600 leading-relaxed font-light">
                                  {signData.avantages?.replace(/\[cite:\s*[\d,\s]+\]/g, '').trim() || "En attente..."}
                                </p>
                              </div>

                              <div className="bg-[#f9f5f4] p-6 rounded-[1.5rem] border border-rose-100/50">
                                <div className="flex items-center gap-2 mb-3">
                                  <Shield className="text-[#A34D35]" size={14} />
                                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#A34D35]">Défis</h4>
                                </div>
                                <p className="text-[12px] md:text-[13px] text-gray-600 leading-relaxed font-light">
                                  {signData.defis?.replace(/\[cite:\s*[\d,\s]+\]/g, '').trim() || "En attente..."}
                                </p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <h2 className="text-3xl md:text-5xl font-sans font-bold text-[#0077C8] mb-4 tracking-tight">
                              {signData.nom_universel || "Harmonie"}
                            </h2>
                            <p className="text-sm md:text-lg text-[#0077C8] font-serif italic mb-10 md:mb-14 leading-relaxed max-w-2xl px-2 opacity-70">
                              {signData.combinaison_universelle || "Unité Universelle"}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left max-w-2xl">
                              <div className="bg-[#f2f6f4] p-6 rounded-[1.5rem] border border-emerald-100/50">
                                <div className="flex items-center gap-2 mb-3">
                                  <Target className="text-[#008751]" size={14} />
                                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#008751]">Révélation</h4>
                                </div>
                                <p className="text-[12px] md:text-[13px] text-gray-600 leading-relaxed font-light">
                                  {signData.revelation || "La clarté s'installe quand l'esprit s'apaise."}
                                </p>
                              </div>

                              <div className="bg-[#f9f5f4] p-6 rounded-[1.5rem] border border-rose-100/50">
                                <div className="flex items-center gap-2 mb-3">
                                  <Shield className="text-[#A34D35]" size={14} />
                                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#A34D35]">Piège</h4>
                                </div>
                                <p className="text-[12px] md:text-[13px] text-gray-600 leading-relaxed font-light">
                                  {signData.piege || "L'attachement aux formes passées empêche le renouveau."}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="py-10 text-gray-400 italic text-sm">
                        Données en cours de préparation pour ce signe...
                      </div>
                    )}
                  </div>
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
