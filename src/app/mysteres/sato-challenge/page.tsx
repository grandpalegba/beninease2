"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SatoChallengePage() {
  const TOTAL_TIME = 64;
  const jarColor = "#a0412d";
  
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
      setAwaleSeeds((prev) => Math.max(0, prev - 1));
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const handleDragEnd = (event: any, info: any, id: string) => {
    // Détection de la zone de la jarre
    const thresholdY = typeof window !== 'undefined' ? window.innerHeight * 0.45 : 300;
    if (info.point.y < thresholdY) {
      validateAnswer(id);
    }
  };

  const isNoixActive = (col: number, row: number) => {
    const index = col === 0 ? row + 1 : row + 5;
    return timeLeft > (TOTAL_TIME - (8 - index + 1) * 8);
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center font-sans p-4 overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{ __html: `
        .clay-texture {
          background: linear-gradient(165deg, ${jarColor} 0%, #8b3422 45%, #7a2a1b 100%);
          box-shadow: inset -8px -8px 20px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.1);
        }
        .organic-jar {
          border-radius: 42% 38% 34% 36% / 45% 45% 32% 32%;
        }
      `}} />

      <main className="w-full max-w-5xl flex flex-col items-center">
        
        {/* SECTION INSTRUMENTS - TAILLES FIXES POUR EVITER LES DEFORMATIONS */}
        <div className="w-full flex flex-row items-end justify-center gap-4 md:gap-16 mt-10 mb-12 h-[380px]">
          
          {/* 1. OKPELE (Noix aux couleurs de la jarre) */}
          <div className="relative w-24 md:w-32 flex flex-col items-center shrink-0">
            <svg className="w-full h-12 mb-[-8px] opacity-40" viewBox="0 0 100 40">
              <path d="M 15 40 Q 50 0 85 40" stroke="#B8860B" strokeWidth="2" fill="none" strokeDasharray="4 4" />
            </svg>
            <div className="flex gap-2 md:gap-4">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-2">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="relative w-7 h-10 md:w-9 md:h-13 shadow-lg overflow-hidden rounded-t-full rounded-b-[40%]"
                         style={{ background: isNoixActive(col, row) ? jarColor : '#3d2410' }}>
                      <div className="w-[1px] h-full bg-black/20 mx-auto" />
                      {isNoixActive(col, row) && (
                        <div className="absolute inset-0 flex justify-center items-center">
                          <div className="w-[2px] h-[60%] bg-[#FFD700] shadow-[0_0_8px_#FFD700] rounded-full opacity-60" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 2. JARRE SATO (FIXE 280px / 360px) */}
          <div className="relative w-[220px] h-[280px] md:w-[280px] md:h-[360px] shrink-0 z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 md:w-40 h-8 md:h-10 bg-[#3d1810] rounded-[50%] shadow-inner border-4 border-white/10 z-0" />
            <div className="absolute inset-0 clay-texture organic-jar flex flex-col items-center justify-center overflow-hidden border-b-8 border-black/20">
              <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black/30 to-transparent" />
              <div className="relative w-full h-full p-6">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div key={hIdx} exit={{ scale: 0, opacity: 0 }}
                      className={`absolute rounded-full bg-[#1a0805] shadow-[inset_0_4px_12px_rgba(0,0,0,1)] border border-white/5
                        ${hIdx === 0 ? 'top-[40%] left-[22%] w-10 h-10 md:w-16 md:h-16' : ''}
                        ${hIdx === 1 ? 'top-[32%] left-[58%] w-8 h-8 md:w-14 md:h-14' : ''}
                        ${hIdx === 2 ? 'top-[62%] left-[42%] w-12 h-12 md:w-20 md:h-20' : ''}
                        ${hIdx === 3 ? 'top-[55%] left-[72%] w-7 h-7 md:w-10 md:h-10' : ''}
                      `} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 3. AWALE (Couleur jarre, Sans ombre externe) */}
          <motion.div animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} 
                      style={{ background: '#3d1810' }}
                      className="p-3 md:p-5 rounded-[2rem] border-b-4 border-black/40 flex shrink-0">
            {[0, 1].map((col) => (
              <React.Fragment key={col}>
                <div className="flex flex-col gap-3">
                  {[0, 1, 2, 3].map(row => {
                    const baseIdx = (col === 0 ? row : row + 4) * 2;
                    return (
                      <div key={row} className="w-8 h-8 md:w-12 md:h-12 bg-black/60 rounded-full flex items-center justify-center gap-1 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)]">
                        {awaleSeeds > baseIdx && <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
                        {awaleSeeds > baseIdx + 1 && <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
                      </div>
                    );
                  })}
                </div>
                {col === 0 && <div className="mx-2 md:mx-4 w-[1px] bg-white/5 self-stretch" />}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* SECTION QUIZ + DRAG AND DROP */}
        <div className="w-full max-w-2xl px-4">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-gray-800 leading-tight">
                  Quelle est la fonction principale du tambour Sato ?
                </h2>
                
                <div className="flex gap-8 mb-8 items-center bg-gray-50 px-8 py-2 rounded-full border border-gray-100">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Temps</span>
                    <span className={`font-black ${timeLeft < 10 ? 'text-red-500' : 'text-[#1A1A1A]'}`}>{timeLeft}s</span>
                  </div>
                  <div className="w-[1px] h-6 bg-gray-200" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Graines</span>
                    <span className="font-black text-[#a0412d]">{awaleSeeds}</span>
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
                      className="cursor-grab active:cursor-grabbing p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center group hover:border-[#a0412d]/30 transition-all"
                    >
                      <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] mr-4 border border-gray-100 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">
                        {id}
                      </span>
                      <span className="font-semibold text-gray-700">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </motion.div>
                  ))}
                </div>
                <p className="mt-4 text-[10px] text-gray-300 font-bold uppercase tracking-widest animate-pulse">
                  ↑ Glissez la réponse vers la jarre ↑
                </p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
                          className="p-10 bg-white border border-[#a0412d]/10 rounded-[3rem] text-center shadow-xl cursor-pointer"
                          onClick={() => { setShowExplanation(false); setTimeLeft(TOTAL_TIME); }}>
                <p className="text-gray-700 text-lg font-medium italic">"Le Sato est un tambour sacré dont les vibrations purifient les récoltes."</p>
                <div className="mt-6 text-[10px] text-[#a0412d]/40 font-bold tracking-widest uppercase">Toucher pour continuer</div>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center py-6">
              <h2 className="text-3xl font-black mb-8 uppercase text-center tracking-tighter">Initiation terminée</h2>
              <button className="px-12 py-4 bg-[#a0412d] text-white rounded-full font-bold shadow-lg uppercase tracking-widest text-xs">
                Partager mon score
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}