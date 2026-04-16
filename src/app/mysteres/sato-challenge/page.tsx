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

  const handleDrop = (answerId: string) => {
    if (answerId === 'B') {
      const newHoles = holes.slice(1);
      setHoles(newHoles); 
      setShowExplanation(true);
      if (newHoles.length === 0) {
        setTimeout(() => {
            setShowExplanation(false);
            setIsFinished(true);
        }, 3000);
      }
    } else {
      setIsWrong(true);
      setAwaleSeeds(prev => Math.max(0, prev - 1));
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setTimeLeft(TOTAL_TIME);
  };

  const isNoixActive = (col: number, row: number) => {
    const index = col === 0 ? row + 1 : row + 5;
    return timeLeft > (TOTAL_TIME - (8 - index + 1) * 8);
  };

  return (
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center font-sans p-2 overflow-x-hidden">
      
      <main className="w-full max-w-md md:max-w-5xl flex flex-col items-center">
        
        {/* SECTION INSTRUMENTS : ALIGNEMENT 3 COLONNES */}
        <div className="w-full grid grid-cols-3 md:flex md:flex-row items-center justify-items-center gap-1 md:gap-4 mt-4 md:my-12 scale-[0.85] md:scale-100 origin-top">
          
          {/* OKPELE (GAUCHE) */}
          <div className="relative w-full flex flex-col items-center scale-[0.8] md:scale-100">
            <svg className="absolute -top-10 w-full h-16 z-0" viewBox="0 0 100 60">
              <path d="M 15 60 Q 50 10 85 60" stroke="#B8860B" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="2 4" />
            </svg>
            <div className="flex gap-3 md:gap-8 relative z-10">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-2">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="relative w-5 h-8 md:w-8 md:h-11 bg-[#5d3a1a] shadow-md flex justify-center overflow-hidden" style={{ borderRadius: '50% 50% 30% 30% / 80% 80% 20% 20%', borderBottom: '2px solid rgba(0,0,0,0.5)' }}>
                      <div className="w-[1px] h-full bg-black/20" />
                      {isNoixActive(col, row) && (
                        <div className="absolute inset-0 flex justify-center items-center">
                          <div className="w-[2px] h-[70%] bg-[#FFD700] shadow-[0_0_8px_#FFD700] rounded-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* JARRE SATO (CENTRE) */}
          <div className="relative w-full aspect-[2/3] max-h-[160px] md:max-h-[340px] z-10">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[70%] h-6 md:h-10 bg-[#3d1810] rounded-[50%] border-2 md:border-4 border-[#a0412d]/20 z-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(165deg, #a0412d 0%, #7a2a1b 100%)', borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%' }}>
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {holes.includes(0) && <motion.div key="h0" exit={{ opacity: 0, scale: 0 }} className="absolute top-[40%] left-[25%] w-7 h-7 md:w-14 md:h-14 rounded-full bg-[#2a100a] shadow-inner" />}
                  {holes.includes(1) && <motion.div key="h1" exit={{ opacity: 0, scale: 0 }} className="absolute top-[32%] left-[58%] w-5 h-5 md:w-12 md:h-12 rounded-full bg-[#2a100a] shadow-inner" />}
                  {holes.includes(2) && <motion.div key="h2" exit={{ opacity: 0, scale: 0 }} className="absolute top-[62%] left-[40%] w-9 h-9 md:w-16 md:h-16 rounded-full bg-[#2a100a] shadow-inner" />}
                  {holes.includes(3) && <motion.div key="h3" exit={{ opacity: 0, scale: 0 }} className="absolute top-[55%] left-[72%] w-4 h-4 md:w-10 md:h-10 rounded-full bg-[#2a100a] shadow-inner" />}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AWALE (DROITE) */}
          <motion.div animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} className="relative flex bg-[#3d1810] p-1.5 md:p-3 rounded-xl border-2 border-[#2a100a] scale-[0.8] md:scale-100">
            {[0, 1].map((col) => (
              <React.Fragment key={col}>
                <div className="flex flex-col gap-1.5 md:gap-3">
                  {[0, 1, 2, 3].map(row => {
                    const baseIdx = (col === 0 ? row : row + 4) * 2;
                    return (
                      <div key={row} className="w-6 h-6 md:w-10 md:h-10 bg-black/60 rounded-full flex items-center justify-center gap-0.5">
                        {awaleSeeds > baseIdx && <div className="w-1 h-1 md:w-2.5 md:h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_6px_#FFD700]" />}
                        {awaleSeeds > baseIdx + 1 && <div className="w-1 h-1 md:w-2.5 md:h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_6px_#FFD700]" />}
                      </div>
                    );
                  })}
                </div>
                {col === 0 && <div className="mx-1 md:mx-2 w-[1px] bg-[#2a100a]" />}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* SECTION TEXTE ET RÉSULTATS */}
        <div className="w-full mt-2 md:mt-4 px-4">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-base md:text-xl font-bold mb-4 text-center px-2">Quelle est la fonction principale du tambour Sato ?</h2>
                
                <div className="flex gap-4 mb-4 items-center bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Temps</span>
                    <span className={`text-xs font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-[#303333]'}`}>{timeLeft}{"s"}</span>
                  </div>
                  <div className="w-[1px] h-3 bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Graines</span>
                    <span className="text-xs font-bold text-[#7a2a1b]">{awaleSeeds}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full pb-6">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleDrop(id)} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center text-left active:scale-95 transition-transform">
                      <span className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-[10px] mr-3 shrink-0">{id}</span>
                      <span className="text-xs font-semibold leading-snug">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={nextQuestion} className="p-6 bg-[#faf9f8] rounded-2xl border border-[#a0412d]/20 text-center cursor-pointer shadow-sm">
                <h3 className="text-[#a0412d] font-bold mb-2 uppercase tracking-widest text-[10px]">Révélation</h3>
                <p className="text-gray-700 mb-3 text-xs font-medium leading-relaxed">Le Sato est un tambour sacré dont les vibrations purifient les récoltes.</p>
                <div className="text-[9px] text-[#a0412d]/50 font-bold animate-pulse">CLIQUER POUR CONTINUER ↓</div>
              </motion.div>
            )
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-black mb-2 uppercase text-[#303333]">Félicitations !</h2>
              <p className="text-[#a0412d] text-xs font-medium mb-6 italic">La jarre est désormais scellée de sagesse.</p>
              
              {/* LISTE DES RÉVÉLATIONS (CORRIGÉE POUR MOBILE) */}
              <div className="w-full bg-[#faf9f8] p-4 rounded-2xl border border-[#a0412d]/10 mb-6 text-left shadow-inner">
                <h4 className="text-[9px] font-bold text-[#a0412d] uppercase tracking-[0.2em] mb-3 text-center">Synthèse des secrets</h4>
                <div className="max-h-[160px] overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                  {revelations.map((text, i) => (
                    <div key={i} className="text-[11px] font-medium text-gray-700 flex items-start border-b border-gray-100/50 pb-2 last:border-0">
                      <span className="text-[#a0412d] mr-2">✦</span> {text}
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-4 bg-[#7a2a1b] text-white rounded-full font-bold shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-transform">
                Partager ma quête
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}