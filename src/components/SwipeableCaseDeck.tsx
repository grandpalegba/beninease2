'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeCase } from '@/features/consultation/useLifeCases';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeableCaseDeckProps {
  cases: LifeCase[];
  onChoice: (caseId: string, option: string) => void;
  initialCaseId?: string;
  onPickCase?: (picked: LifeCase, selectedOption: number | null) => void;
}

/**
 * SwipeableCaseDeck - High-Fidelity Split Layout Redesign
 * 
 * Matches the provided mockup with Image on Left and Content on Right.
 */
const SwipeableCaseDeck: React.FC<SwipeableCaseDeckProps> = ({ cases, initialCaseId, onPickCase }) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialCaseId) {
      const idx = cases.findIndex(c => c.id === initialCaseId);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  });

  const currentCase = cases[currentIndex];

  const handleNext = () => {
    if (currentIndex < cases.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  if (!currentCase) return null;

  return (
    <div className="relative w-full flex items-center justify-center group">
      {/* Navigation Arrows (Visible on hover) */}
      {currentIndex > 0 && (
        <button 
          onClick={handlePrev}
          className="absolute left-[-60px] top-1/2 -translate-y-1/2 p-4 text-neutral-200 hover:text-black transition-colors hidden md:block"
        >
          <ChevronLeft size={40} strokeWidth={1} />
        </button>
      )}
      {currentIndex < cases.length - 1 && (
        <button 
          onClick={handleNext}
          className="absolute right-[-60px] top-1/2 -translate-y-1/2 p-4 text-neutral-200 hover:text-black transition-colors hidden md:block"
        >
          <ChevronRight size={40} strokeWidth={1} />
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCase.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-[2rem] overflow-hidden"
          style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.08)' }}
        >
          {/* Left Column: Visual */}
          <section className="relative w-full md:w-[45%] aspect-[3/4] md:aspect-auto overflow-hidden">
            <img
              src={currentCase.photoUrl || '/assets/profile-aicha.jpg'}
              alt={currentCase.persona}
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
            />
            
            {/* Persona Badge */}
            <div className="absolute bottom-10 left-10">
              <div className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/30">
                <span className="text-white text-sm font-light italic">
                  {currentCase.persona}
                </span>
              </div>
            </div>

            {/* Play Button */}
            <div className="absolute bottom-10 right-10">
              <AudioTrigger audioUrl={currentCase.audioUrl} />
            </div>

            {/* Sound Wave Decor */}
            <div className="absolute bottom-4 left-44 flex items-end gap-1 h-6 opacity-40">
              {[3, 6, 8, 4, 7, 5, 9, 4].map((h, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-[#fcd116] rounded-full" 
                  style={{ height: `${h * 2}px` }} 
                />
              ))}
            </div>
          </section>

          {/* Right Column: Content */}
          <section className="w-full md:w-[55%] p-8 md:p-12 flex flex-col bg-white relative">
            <div className="flex justify-between items-start mb-8">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-400">
                {currentCase.label || 'SAGESSE'}
              </span>
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#008751' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#fcd116' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#e8112d' }} />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-5xl md:text-6xl font-serif text-[#00693e] leading-[0.9] mb-6">
                {currentCase.title}
              </h2>

              <blockquote className="text-lg md:text-xl font-light text-neutral-500 leading-relaxed italic border-l-4 border-[#fcd116] pl-6 md:pl-8 mb-8">
                "{currentCase.quote}"
              </blockquote>

              <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-neutral-400 mb-4">
                CHOISISSEZ UNE OPTION SELON VOTRE INTUITION ET OUVREZ LA MATRICE DES CHOIX
              </p>

              <OptionList 
                options={currentCase.options} 
                onSelect={(idx) => onPickCase?.(currentCase, idx)}
              />
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const AudioTrigger = ({ audioUrl }: { audioUrl: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(console.error);
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <button 
        onClick={toggle}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md text-white transition-transform active:scale-90"
      >
        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
      </button>
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        playsInline
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </>
  );
};

const OptionList = ({ options, onSelect }: { options: string[]; onSelect: (idx: number) => void }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelectedIdx(i)}
            className={`text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center gap-4 ${
              selectedIdx === i 
                ? 'bg-neutral-100 ring-1 ring-black/5 shadow-sm' 
                : 'bg-neutral-50 hover:bg-neutral-100'
            }`}
          >
            <span className="text-[11px] font-bold text-black min-w-[20px]">
              {String.fromCharCode(65 + i)}:
            </span>
            <span className="text-[13px] font-light text-neutral-600 leading-snug">
              {opt}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-6">
        <button
          disabled={selectedIdx === null}
          onClick={() => onSelect(selectedIdx!)}
          className="w-full py-5 rounded-2xl bg-[#00693e] text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-20 disabled:grayscale"
        >
          OUVRIR LA MATRICE DES CHOIX
        </button>
      </div>
    </div>
  );
};

export default SwipeableCaseDeck;