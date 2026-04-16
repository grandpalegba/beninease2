"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Correction du nom du bucket : minuscule impérative
const BUCKET_BASE = "https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/okpele";

const OKPELE_IMAGES = [
  `${BUCKET_BASE}/Timer1.png`, `${BUCKET_BASE}/Timer2.png`, `${BUCKET_BASE}/Timer3.png`,
  `${BUCKET_BASE}/Timer4.png`, `${BUCKET_BASE}/Timer5.png`, `${BUCKET_BASE}/Timer6.png`,
  `${BUCKET_BASE}/Timer7.png`, `${BUCKET_BASE}/Timer8.png`, `${BUCKET_BASE}/Timer9.png`
];

export default function SatoChallengePage() {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [holes, setHoles] = useState([0, 1, 2, 3]); 
  const [awaleSeeds, setAwaleSeeds] = useState(16); 
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (showExplanation || isFinished) return;
    const timer = setInterval(() => {
      setCurrentStateIndex((prev) => (prev + 1) % OKPELE_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [showExplanation, isFinished]);

  const handleAnswer = (answerId: string) => {
    if (answerId === 'B') {
      const newHoles = holes.slice(1);
      setHoles(newHoles); 
      setShowExplanation(true);
      if (newHoles.length === 0) {
        setTimeout(() => { setShowExplanation(false); setIsFinished(true); }, 2500);
      }
    } else {
      setIsWrong(true);
      setAwaleSeeds(prev => Math.max(0, prev - 1));
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center p-4 font-sans">
      
      {/* HUD : États et Points */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 px-2 mt-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">État du Cycle</span>
          <span className="text-[#a0412d] font-black text-sm italic">{currentStateIndex + 1} / 9</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Graines Awalé</span>
          <span className={`${isWrong ? 'text-red-500 scale-110' : 'text-[#a0412d]'} font-black text-sm transition-all`}>{awaleSeeds}</span>
        </div>
      </div>

      <main className="w-full max-w-4xl flex flex-col items-center">
        
        {/* SECTION INSTRUMENTS */}
        <div className="w-full grid grid-cols-3 items-end justify-items-center gap-4 min-h-[260px] md:min-h-[420px]">
          
          {/* OKPÈLÈ (Désormais visible avec 'okpele') */}
          <div className="relative w-full h-[200px] md:h-[350px] flex justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentStateIndex}
                src={OKPELE_IMAGES[currentStateIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full w-auto object-contain pointer-events-none"
              />
            </AnimatePresence>
          </div>

          {/* LA BELLE JARRE (Restaurée) */}
          <div className="relative w-24 md:w-44 aspect-[3/5] mb-4">
            {/* Col de la jarre */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[65%] h-6 md:h-10 bg-[#3d1810] rounded-t-full z-20 border-b border-[#a0412d]/20" />
            {/* Corps de la jarre */}
            <div className="absolute inset-0 mt-3 shadow-2xl overflow-hidden" 
                 style={{ 
                   background: 'radial-gradient(circle at 35% 35%, #a0412d 0%, #7a2a1b 100%)', 
                   borderRadius: '45% 45% 40% 40% / 15% 15% 85% 85%' 
                 }}>
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div 
                      key={hIdx}
                      exit={{ opacity: 0, scale: 0 }}
                      className={`absolute rounded-full bg-[#2a100a] shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] 
                        ${hIdx === 0 ? 'top-[42%] left-[25%] w-6 h-6 md:w-12 md:h-12' : ''}
                        ${hIdx === 1 ? 'top-[35%] left-[58%] w-5 h-5 md:w-10 md:h-10' : ''}
                        ${hIdx === 2 ? 'top-[65%] left-[45%] w-8 h-8 md:w-16 md:h-16' : ''}
                        ${hIdx === 3 ? 'top-[58%] left-[72%] w-4 h-4 md:w-8 md:h-8' : ''}
                      `}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AWALÉ (Horizontal) */}
          <motion.div 
            animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} 
            className="mb-8 grid grid-cols-2 gap-2 bg-[#3d1810] p-3 rounded-2xl border-2 border-[#2a100a] shadow-2xl"
          >
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="w-6 h-6 md:w-12 md:h-12 bg-black/60 rounded-full flex items-center justify-center gap-1 shadow-inner">
                {awaleSeeds > idx * 2 && <div className="w-1.5 md:w-2.5 h-1.5 md:h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
                {awaleSeeds > idx * 2 + 1 && <div className="w-1.5 md:w-2.5 h-1.5 md:h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
              </div>
            ))}
          </motion.div>
        </div>

        {/* SECTION QUIZ */}
        <div className="w-full mt-10 px-4 max-w-2xl">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-bold mb-8 text-center text-gray-800 leading-tight">
                  Quelle est la fonction principale du tambour Sato ?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleAnswer(id)} className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center hover:border-[#a0412d]/20 transition-all active:scale-95 group">
                      <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-sm mr-4 shrink-0 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">{id}</span>
                      <span className="font-semibold text-gray-700 text-sm md:text-base">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onClick={() => setShowExplanation(false)} 
                          className="p-10 bg-white border border-[#a0412d]/10 rounded-[3rem] text-center cursor-pointer shadow-2xl max-w-md mx-auto">
                <h3 className="text-[#a0412d] font-bold mb-4 uppercase tracking-[0.4em] text-[10px]">Révélation</h3>
                <p className="text-[#1A1A1A] text-lg md:text-xl font-medium leading-relaxed italic">
                  "Le Sato est un tambour sacré dont les vibrations purifient les récoltes."
                </p>
                <div className="mt-8 text-[9px] text-gray-400 font-bold animate-pulse tracking-[0.2em] uppercase">Toucher pour continuer</div>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center py-10">
              <h2 className="text-3xl font-black mb-8 uppercase text-[#1A1A1A] italic tracking-tight">Félicitations initié !</h2>
              <button className="px-14 py-5 bg-[#7a2a1b] text-white rounded-full font-bold shadow-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-[#a0412d] transition-colors">
                Partager mon savoir
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}