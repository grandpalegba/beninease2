'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { LifeCase } from '@/features/consultation/useLifeCases';
import { Play, Pause, ArrowRight } from 'lucide-react';

interface SwipeableCaseDeckProps {
  cases: LifeCase[];
  onChoice: (caseId: string, option: string) => void;
  initialCaseId?: string;
  onPickCase?: (picked: LifeCase, selectedOption: number | null) => void;
}

/**
 * SwipeableCaseDeck - Horizontal Swiper Redesign (Next.js 15 + Tailwind)
 * 
 * Ultra-minimalist horizontal scroll with snap-to-center cards.
 */
const SwipeableCaseDeck: React.FC<SwipeableCaseDeckProps> = ({ cases, initialCaseId, onPickCase }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleOpenMatrix = (currentCase: LifeCase, selectedOptionIdx: number | null) => {
    if (onPickCase) {
      onPickCase(currentCase, selectedOptionIdx);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Horizontal Swiper Container */}
      <div 
        ref={scrollRef}
        className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-12 gap-8 px-[10%] md:px-[25%]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cases.map((item, idx) => (
          <div 
            key={item.id}
            className="flex-shrink-0 w-full max-w-md snap-center"
          >
            <CaseCard 
              item={item} 
              onPick={(optionIdx) => handleOpenMatrix(item, optionIdx)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const CaseCard = ({ item, onPick }: { item: LifeCase; onPick: (idx: number | null) => void }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div 
      className="bg-white rounded-[2.5rem] overflow-hidden border border-neutral-100 flex flex-col h-full"
      style={{ boxShadow: '0 40px 100px -20px rgba(0,0,0,0.06)' }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
    >
      {/* Media Section */}
      <div className="relative aspect-[4/3] bg-neutral-50 overflow-hidden group">
        <img
          src={item.photoUrl || '/placeholder-face.jpg'}
          alt={item.persona}
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700" />
        
        {/* Simple Audio Button */}
        <button 
          onClick={toggleAudio}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-lg border border-white/30 text-white transition-all active:scale-90"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>

        <div className="absolute bottom-6 left-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-white uppercase opacity-80">
            {item.persona}
          </span>
        </div>

        <audio 
          ref={audioRef} 
          src={item.audioUrl} 
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* Content Section */}
      <div className="p-10 flex flex-col flex-grow">
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-neutral-300 uppercase mb-2 block">
            {item.label}
          </span>
          <h3 className="text-3xl font-serif italic text-black leading-tight">
            {item.title}
          </h3>
        </div>

        <p className="text-sm font-light text-neutral-400 leading-relaxed italic mb-10 border-l-2 border-neutral-100 pl-6">
          "{item.quote}"
        </p>

        {/* Options - Minimalist */}
        <div className="grid grid-cols-1 gap-2.5 mb-10">
          {item.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className={`text-left px-5 py-4 rounded-xl text-xs transition-all duration-300 flex items-center gap-4 ${
                selectedIdx === i 
                  ? 'bg-black text-white' 
                  : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border ${
                selectedIdx === i ? 'border-white/20' : 'border-neutral-200'
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 truncate">{opt}</span>
            </button>
          ))}
        </div>

        <button
          disabled={selectedIdx === null}
          onClick={() => onPick(selectedIdx)}
          className="mt-auto w-full py-5 rounded-2xl bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all disabled:opacity-20 disabled:grayscale"
        >
          Ouvrir la matrice
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default SwipeableCaseDeck;