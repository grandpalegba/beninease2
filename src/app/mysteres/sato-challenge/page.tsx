"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SatoChallengePage() {
  const TOTAL_TIME = 64;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showExplanation, setShowExplanation] = useState(false);
  const [holes, setHoles] = useState([0, 1, 2, 3]); 
  const [awaleSeeds, setAwaleSeeds] = useState(16); 
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const revelations = [
    "Le Sato purifie les récoltes par ses vibrations sacrées.",
    "L'Okpele guide le choix des semences selon les signes d'Ifa.",
    "L'Awalé simule la gestion des réserves du village.",
    "La Jarre Sato protège l'esprit des ancêtres initiés."
  ];

  useEffect(() => {
    if (timeLeft <= 0 || showExplanation || isFinished) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showExplanation, isFinished]);

  const validateAnswer = (answerId: string) => {
    if (answerId === 'B') {
      const newHoles = holes.slice(1);
      setHoles(newHoles); 
      setShowExplanation(true);
      if (newHoles.length === 0) {
        setTimeout(() => {
          setShowExplanation(false);
          setIsFinished(true);
        }, 2500);
      }
    } else {
      setIsWrong(true);
      // Correction ici : On s'assure que prevSeeds est bien utilisé
      setAwaleSeeds((prevSeeds) => Math.max(0, prevSeeds - 1));
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const handleDragEnd = (event: any, info: any, id: string) => {
    const thresholdY = typeof window !== 'undefined' ? window.innerHeight * 0.4 : 300;
    if (info.point.y < thresholdY) {
      validateAnswer(id);
    }
  };

  const isNoixActive = (col: number, row: number) => {
    const index = col === 0 ? row + 1 : row + 5;
    return timeLeft > (TOTAL_TIME - (8 - index + 1) * 8);
  };

  return (
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center font-sans p-4 overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{ __html: `
        .clay-texture {
          background: linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%);
          box-shadow: inset -8px -8px 20px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.1);
        }
        .organic-shape {
          border-radius: 42% 38% 34% 36% / 45% 45% 32% 32%;
        }
      `}} />

      <main className="w-full max-w-5xl flex flex-col items-center">
        
        {/* SECTION INSTRUMENTS */}
        <div className="w-full flex flex-row items-end justify-center gap-6 md:gap-20 mt-10 mb-12 h-[380px]">
          
          {/* OKPELE */}
          <div className="relative w-24 md:w-32 flex flex-col items-center shrink-0">
            <svg className="w-full h-12 mb-[-8px] opacity-60" viewBox="0 0 100 40">
              <path d="M 15 40 Q 50 0 85 40" stroke="#B8860B" strokeWidth="3" fill="none" strokeDasharray="4 4" />
            </svg>
            <div className="flex gap-3 md:gap-5">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-2">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="relative w-6 h-9 md:w-8 md:h-12 bg-[#5d3a1a] shadow-lg overflow-hidden rounded-t-full rounded-b-[40%]">
                      <div className="w-[1px] h-full bg-black/30 mx-auto" />
                      {isNoixActive(col, row) && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex justify-center items-center">
                          <div className="w-[3px] h-[65%] bg-[#FFD700] shadow-[0_0_10px_#FFD700] rounded-full" />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* JARRE SATO */}
          <div className="relative w-48 h-[280px] md:w-72 md:h-[360px] shrink-0 z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-40 h-10 bg-[#3d1810] rounded-[50%] shadow-inner border-4 border-[#a0412d]/20 z-0" />
            <div className="absolute inset-0 clay-texture organic-shape flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black/25 to-transparent" />
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div 
                      key={hIdx}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`absolute rounded-full bg-[#2a100a] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] border border-black/10
                        ${hIdx === 0 ? 'top-[40%] left-[25%] w-10 h-10 md:w-14 md:h-14' : ''}
                        ${hIdx === 1 ? 'top-[32%] left-[58%] w-8 h-8 md:w-12 md:h-12' : ''}
                        ${hIdx === 2 ? 'top-[62%] left-[40%] w-12 h-12 md:w-16 md:h-16' : ''}
                        ${hIdx === 3 ? 'top-[55%] left-[72%] w-7 h-7 md:w-10 md:h-10' : ''}
                      `}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AWALE */}
          <motion.div animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} 
                      className="bg-[#3d1810] p-3 md:p-5 rounded-3xl border-b-8 border-[#2a100a] shadow-2xl flex shrink-0">
            {[0, 1].map((col) => (
              <React.Fragment key={col}>
                <div className="flex flex-col gap-3">
                  {[0, 1, 2, 3].map(row => {
                    const baseIdx = (col === 0 ? row : row + 4) * 2;
                    return (
                      <div key={row} className="w-8 h-8 md:w-12 md:h-12 bg-black/50 rounded-full flex items-center justify-center gap-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                        {awaleSeeds > baseIdx && <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
                        {awaleSeeds > baseIdx + 1 && <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
                      </div>
                    );
                  })}
                </div>
                {col === 0 && <div className="mx-2 md:mx-4 w-[2px] bg-[#2a100a]/30 self-stretch" />}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* SECTION QUIZ */}
        <div className="w-full max-w-2xl px-4">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-bold mb-8 text-center text-gray-800">
                  Quelle est la fonction principale du tambour Sato ?
                </h2>
                
                <div className="flex gap-8 mb-10 items-center bg-gray-50/80 backdrop-blur px-8 py-3 rounded-full border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Temps</span>
                    <span className={`text-lg font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-[#303333]'}`}>{timeLeft}s</span>
                  </div>
                  <div className="w-[1px] h-6 bg-gray-200" />
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Esprit</span>
                    <span className="text-lg font-black text-[#a0412d]">{awaleSeeds}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <motion.div
                      key={id}
                      drag
                      dragSnapToOrigin
                      onDragEnd={(e, info) => handleDragEnd(e, info, id)}
                      whileDrag={{ scale: 1.05, zIndex: 50 }}
                      className="cursor-grab active:cursor-grabbing p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center hover:border-[#a0412d]/20 hover:shadow-md transition-all group"
                    >
                      <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] mr-4 border border-gray-100 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">
                        {id}
                      </span>
                      <span className="font-semibold">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} 
                          className="p-10 md:p-14 bg-[#faf9f8] rounded-[3rem] border border-[#a0412d]/10 text-center shadow-2xl cursor-pointer"
                          onClick={() => { setShowExplanation(false); setTimeLeft(TOTAL_TIME); }}>
                <h3 className="text-[#a0412d] font-bold mb-4 uppercase tracking-[0.4em] text-xs">Révélation Sacrée</h3>
                <p className="text-gray-700 text-lg md:text-xl font-medium italic leading-relaxed">
                  "Le Sato est un tambour sacré dont les vibrations purifient les récoltes."
                </p>
                <div className="mt-10 text-[10px] text-[#a0412d]/40 font-bold animate-pulse tracking-widest uppercase">Toucher pour continuer</div>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center py-6">
              <h2 className="text-4xl font-black mb-4 uppercase text-[#303333] tracking-tighter italic text-center">Félicitations !</h2>
              <div className="w-full bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {revelations.map((text, i) => (
                    <div key={i} className="text-sm font-medium text-gray-700 flex items-start p-4 bg-gray-50 rounded-2xl">
                      <span className="text-[#a0412d] mr-3 mt-1">✦</span> {text}
                    </div>
                  ))}
                </div>
              </div>
              <button className="px-12 py-5 bg-[#7a2a1b] text-white rounded-full font-bold shadow-lg uppercase tracking-widest text-xs hover:bg-[#a0412d] transition-all">
                Partager mon initiation
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}