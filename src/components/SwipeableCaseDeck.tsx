'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeCase } from '@/features/consultation/useLifeCases';
import { Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface SwipeableCaseDeckProps {
  cases: LifeCase[];
  onChoice: (caseId: string, option: string) => void;
  initialCaseId?: string;
  onPickCase?: (picked: LifeCase, selectedOption: number | null) => void;
}

/**
 * SwipeableCaseDeck - Bi-Column Layout with Storage Audio Integration
 */
const SwipeableCaseDeck: React.FC<SwipeableCaseDeckProps> = ({ cases, onChoice, initialCaseId, onPickCase }) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialCaseId) {
      const idx = cases.findIndex(c => c.id === initialCaseId);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentCase = cases[currentIndex];

  const handleNext = () => {
    if (currentIndex < cases.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(false);
      setSelectedOptionIdx(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(false);
      setSelectedOptionIdx(null);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleOptionSelect = (idx: number, option: string) => {
    setSelectedOptionIdx(idx);
    onChoice(currentCase.id, option);
  };

  const handleOpenMatrix = () => {
    if (onPickCase) {
      onPickCase(currentCase, selectedOptionIdx);
    }
  };

  if (!currentCase) return null;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[80vh] bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 border border-neutral-100">
      {/* Left Column: Visual & Audio */}
      <section className="relative w-full lg:w-1/2 h-[400px] lg:h-auto bg-neutral-50 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentCase.photoUrl}
            src={currentCase.photoUrl || '/placeholder-face.jpg'}
            alt={currentCase.persona}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group">
          <button 
            onClick={toggleAudio}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transform transition-all duration-500 hover:scale-110 hover:bg-white/30"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
        </div>

        {/* Persona Badge */}
        <div className="absolute top-8 left-8">
          <div className="bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-sm border border-white/50">
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold mb-0.5">Identité</p>
            <p className="text-sm font-medium text-black">{currentCase.persona}</p>
          </div>
        </div>

        {/* Sound Wave Indicator */}
        <div className="absolute bottom-8 left-8 flex items-end gap-1.5 h-8">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? { height: [4, Math.random() * 24 + 8, 4] } : { height: 4 }}
              transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, ease: "easeInOut" }}
              className="w-1.5 bg-white/60 rounded-full"
            />
          ))}
        </div>

        <audio 
          ref={audioRef} 
          src={currentCase.audioUrl} 
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </section>

      {/* Right Column: Content */}
      <section className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between bg-white relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCase.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#006838]">
                {currentCase.label}
              </span>
              <div className="flex-1 h-[1px] bg-neutral-100"></div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-serif text-black leading-[1.1] mb-8">
              {currentCase.title}
            </h2>

            <p className="text-lg font-light text-neutral-500 leading-relaxed mb-12 italic border-l-4 border-neutral-100 pl-8">
              {currentCase.quote}
            </p>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {currentCase.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx, option)}
                  className={`flex items-start gap-4 p-5 rounded-2xl border transition-all text-left group ${
                    selectedOptionIdx === idx 
                      ? 'border-[#006838] bg-[#006838]/5' 
                      : 'bg-neutral-50 border-neutral-100 hover:border-[#006838]/30 hover:bg-white'
                  }`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-lg border text-[11px] font-bold transition-colors ${
                    selectedOptionIdx === idx 
                      ? 'bg-[#006838] border-[#006838] text-white' 
                      : 'bg-white border-neutral-200 text-neutral-400 group-hover:text-[#006838]'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <p className={`text-[13px] font-medium leading-snug transition-colors ${
                    selectedOptionIdx === idx ? 'text-black' : 'text-neutral-600 group-hover:text-black'
                  }`}>
                    {option}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action Controls */}
        <div className="flex items-center justify-between mt-auto pt-8 border-t border-neutral-50">
          <div className="flex gap-4">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-4 rounded-full border border-neutral-100 text-neutral-400 hover:text-black hover:border-black disabled:opacity-20 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext}
              disabled={currentIndex === cases.length - 1}
              className="p-4 rounded-full border border-neutral-100 text-neutral-400 hover:text-black hover:border-black disabled:opacity-20 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <button 
            onClick={handleOpenMatrix}
            className="flex items-center gap-4 bg-[#006838] text-white px-8 py-5 rounded-2xl font-bold text-xs tracking-[0.2em] shadow-lg shadow-[#006838]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
            disabled={selectedOptionIdx === null}
          >
            OUVRIR LA MATRICE DES CHOIX
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
    </div>
  );
};

export default SwipeableCaseDeck;