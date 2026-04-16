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
        
        {/* INSTRUMENTS : ÉCHELLE RÉDUITE À 0.6 POUR MOBILE POUR ÉVITER LE SCROLL */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 md:gap-4 mt-2 md:my-12 scale-[0.6] md:scale-100 origin-top">
          
          {/* OKPELE */}
          <div className="relative w-32 flex flex-col items-center">
            <svg className="absolute -top-14 w-32 h-20 z-0" viewBox="0 0 100 60">
              <path d="M 10 60 Q 50 0 90 60" stroke="#B8860B" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="2 4" />
            </svg>
            <div className="flex gap-8 relative z-10">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-3">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="relative w-8 h-11 bg-[#5d3a1a] shadow-md flex justify-center overflow-hidden" style={{ borderRadius: '50% 50% 30% 30% / 80% 80% 20% 20%', borderBottom: '3px solid rgba(0,0,0,0.5)' }}>
                      <div className="w-[1px] h-full bg-black/20" />
                      {isNoixActive(col, row) && (
                        <div className="absolute inset-0 flex justify-center items-center">
                          <div className="w-[2.5px] h-[70%] bg-[#FFD700] shadow-[0_0_10px_#FFD700] rounded-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* JARRE SATO */}
          <div className="relative w-48 h-[240px] md:w-72 md:h-[340px] z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#3d1810] rounded-[50%] border-4 border-[#a0412d]/20 z-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(165deg, #a0412d 0%, #7a2a1b 100%)', borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%' }}>
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {holes.includes(0) && <motion.div key="h0" exit={{ opacity: 0, scale: 0 }} className="absolute top-[40%] left-[25%] w-10 h-10 rounded-full bg-[#2a100a] shadow-inner" />}
                  {holes.includes(1) && <motion.div key="h1" exit={{ opacity: 0, scale: 0 }} className="absolute top-[32%] left-[58%] w-8 h-8 rounded-full bg-[#2a100a] shadow-inner" />}
                  {holes.includes(2) && <motion.div key="h2" exit={{ opacity: 0, scale: 0 }} className="absolute top-[62%] left-[40%] w-12 h-12 rounded-full bg-[#2a100a] shadow-inner" />}
                  {holes.includes(3) && <motion.div key="h3" exit={{ opacity: 0, scale: 0 }} className="absolute top-[55%] left-[72%] w-7 h-7 rounded-full bg-[#2a100a] shadow-inner" />}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AWALE */}
          <motion.div animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}} className="relative flex bg-[#3d1810] p-2 rounded-2xl border-2 border-[#2a100a]">
            {[0, 1].map((col) => (
              <React.Fragment key={col}>
                <div className="flex flex-col gap-2">
                  {[0, 1, 2, 3].map(row => {
                    const baseIdx = (col === 0 ? row : row + 4) * 2;
                    return (
                      <div key={row} className="w-8 h-8 md:w-10 md:h-10 bg-black/60 rounded-full flex items-center justify-center gap-1">
                        {awaleSeeds > baseIdx && <div className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
                        {awaleSeeds > baseIdx + 1 && <div className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
                      </div>
                    );
                  })}
                </div>
                {col === 0 && <div className="mx-2 w-[1px] bg-[#2a100a]" />}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* SECTION TEXTE ET QUIZ : REMONTÉE POUR ÊTRE VISIBLE SANS SCROLL */}
        <div className="w-full mt-[-60px] md:mt-4">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-base md:text-xl font-bold mb-4 text-center px-4 leading-tight">Quelle est la fonction principale du tambour Sato ?</h2>
                
                {/* HUD COMPACT (Correction du format de chaîne pour éviter l'erreur de build) */}
                <div className="flex gap-4 mb-6 items-center bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Temps</span>
                    <span className={`text-xs font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-[#303333]'}`}>
                      {timeLeft}{"s"}
                    </span>
                  </div>
                  <div className="w-[1px] h-3 bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Graines</span>
                    <span className="text-xs font-bold text-[#7a2a1b]">{awaleSeeds}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full px-6">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleDrop(id)} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center text-left active:scale-95 transition-transform">
                      <span className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-[10px] mr-3">{id}</span>
                      <span className="text-xs font-semibold">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={nextQuestion} className="mx-6 p-6 bg-[#faf9f8] rounded-2xl border border-[#a0412d]/20 text-center cursor-pointer shadow-sm">
                <h3 className="text-[#a0412d] font-bold mb-2 uppercase tracking-widest text-[10px]">Révélation</h3>
                <p className="text-gray-700 mb-3 text-xs font-medium leading-relaxed">Le Sato est un tambour sacré dont les vibrations purifient les récoltes.</p>
                <div className="text-[9px] text-[#a0412d]/50 font-bold animate-pulse tracking-widest">CLIQUER POUR CONTINUER</div>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center text-center px-6">
              <h2 className="text-xl font-black mb-4 uppercase text-[#303333]">Félicitations !</h2>
              <button className="px-8 py-3 bg-[#7a2a1b] text-white rounded-full font-bold shadow-lg uppercase tracking-wider text-xs">Partager</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}