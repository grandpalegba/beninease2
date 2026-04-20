'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { LifeCase } from '@/features/consultation/useLifeCases';
import { Volume2, VolumeX, X } from 'lucide-react';

interface SwipeableCaseDeckProps {
  cases: LifeCase[];
  onChoice: (caseId: string, option: string) => void;
}

/**
 * SwipeableCaseDeck - A high-fidelity, minimalist swipeable card component.
 * Features a verdict state with deep black styling and auto-playing audio.
 */
const SwipeableCaseDeck: React.FC<SwipeableCaseDeckProps> = ({ cases, onChoice }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVerdict, setActiveVerdict] = useState<{ verdict: string, audioUrl: string } | null>(null);

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (currentIndex >= cases.length || activeVerdict) return;

    const currentCase = cases[currentIndex];
    let optionIndex = -1;
    if (direction === 'left') optionIndex = 0;
    if (direction === 'right') optionIndex = 1;
    if (direction === 'up') optionIndex = 2;
    if (direction === 'down') optionIndex = 3;

    if (optionIndex !== -1 && currentCase.options[optionIndex]) {
      const chosenOption = currentCase.options[optionIndex];
      const verdict = currentCase.verdicts[optionIndex];
      const audioUrl = currentCase.audioUrls[optionIndex];

      onChoice(currentCase.id, chosenOption);
      setActiveVerdict({ verdict, audioUrl });
    }
  };

  const nextCard = () => {
    setActiveVerdict(null);
    setCurrentIndex((prev) => prev + 1);
  };

  if (currentIndex >= cases.length) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center text-center p-8 bg-white h-full"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-300 font-light mb-4">
          Session Terminée
        </p>
        <h2 className="text-lg font-extralight text-black">Merci pour votre contribution.</h2>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full h-full perspective-1000">
      <AnimatePresence mode="wait">
        {activeVerdict ? (
          <VerdictCard 
            key="verdict" 
            data={activeVerdict} 
            onClose={nextCard} 
          />
        ) : (
          <div className="relative w-full h-full">
            {cases.slice(currentIndex, currentIndex + 2).reverse().map((item, index) => {
              const isTop = index === 1 || (cases.length - currentIndex === 1 && index === 0);
              return (
                <Card 
                  key={item.id} 
                  data={item} 
                  isTop={isTop} 
                  onSwipe={handleSwipe} 
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CardProps {
  data: LifeCase;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

const Card: React.FC<CardProps> = ({ data, isTop, onSwipe }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 80;
    if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
      if (info.offset.x < -threshold) onSwipe('left');
      else if (info.offset.x > threshold) onSwipe('right');
    } else {
      if (info.offset.y < -threshold) onSwipe('up');
      else if (info.offset.y > threshold) onSwipe('down');
    }
  };

  return (
    <motion.div
      style={{ x, y, rotate, opacity, zIndex: isTop ? 10 : 0 }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: 1 }}
      exit={{ x: x.get() < 0 ? -500 : 500, opacity: 0, transition: { duration: 0.3 } }}
      className="absolute inset-0 bg-white border border-neutral-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-3xl p-8 flex flex-col justify-between cursor-grab active:cursor-grabbing overflow-hidden"
    >
      <div>
        <div className="flex justify-between items-start mb-8">
          <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium px-2 py-1 border border-neutral-100 rounded-full">
            {data.label}
          </span>
          <span className="text-[10px] font-light text-neutral-300">
            {data.persona}
          </span>
        </div>
        
        <h3 className="text-xl font-light leading-tight text-black mb-6">
          {data.title}
        </h3>
        
        <div className="relative">
          <p className="text-sm font-light text-neutral-500 leading-relaxed italic border-l-2 border-neutral-50 pl-4">
            {data.quote}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.options.map((opt, i) => (
          <div key={i} className="p-3 rounded-xl bg-neutral-50/50 border border-neutral-100/30">
            <p className="text-[8px] uppercase tracking-wider text-neutral-300 mb-1">Opt. {i + 1}</p>
            <p className="text-[10px] font-normal text-neutral-600 line-clamp-2">{opt}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/**
 * VerdictCard - Deep black minimalist card with auto-playing audio.
 */
const VerdictCard = ({ data, onClose }: { data: { verdict: string, audioUrl: string }, onClose: () => void }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (data.audioUrl) {
      const audio = new Audio(data.audioUrl);
      audioRef.current = audio;
      audio.play().catch(e => console.log("Auto-play blocked or audio failed:", e));
      return () => {
        audio.pause();
        audio.src = "";
      };
    }
  }, [data.audioUrl]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -20, opacity: 0, scale: 0.95 }}
      className="absolute inset-0 bg-[#0A0A0A] text-white rounded-3xl p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20"
    >
      <div className="flex justify-between items-center">
        <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-500">Verdict</span>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <X size={16} className="text-neutral-400" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center py-8">
        <p className="text-lg font-extralight leading-relaxed text-center text-neutral-200 tracking-wide">
          {data.verdict || "L'analyse est enregistrée."}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        {/* Minimalist Sound Wave Animation */}
        <div className="flex items-end gap-[3px] h-4">
          <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} className="w-[2px] bg-white/40 rounded-full" />
          <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} className="w-[2px] bg-white/60 rounded-full" />
          <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }} className="w-[2px] bg-white/40 rounded-full" />
        </div>

        <button 
          onClick={toggleMute}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 hover:bg-white/5 transition-all"
        >
          {isMuted ? <VolumeX size={12} className="text-neutral-500" /> : <Volume2 size={12} className="text-white" />}
          <span className="text-[8px] uppercase tracking-widest text-neutral-400">
            {isMuted ? "Unmute" : "Audio Playback"}
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default SwipeableCaseDeck;