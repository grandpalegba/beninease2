"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Design des noix d'Okpèlè (Demi-coques boisées)
const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className="relative w-10 h-14 md:w-11 md:h-15 transition-all duration-700">
    <div className={`absolute inset-0 rounded-t-[50%] rounded-b-[40%] transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-20 grayscale'}`}
         style={{ 
           background: 'linear-gradient(145deg, #3d2410, #1a0f06)',
           boxShadow: 'inset -2px -2px 5px rgba(255,255,255,0.05), 0 5px 15px rgba(0,0,0,0.4)' 
         }}>
      <div className="absolute inset-2 rounded-t-[45%] rounded-b-[35%] bg-[#0f0803] shadow-inner flex justify-center">
        {active && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: [0.4, 0.8, 0.4] }} 
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-[60%] bg-[#FFD700] blur-[2px] rounded-full" 
          />
        )}
      </div>
    </div>
  </div>
);

export default function SatoChallengePage() {
  const [showExplanation, setShowExplanation] = useState(false);
  const [holes, setHoles] = useState([0, 1, 2, 3]); 
  const [awaleSeeds, setAwaleSeeds] = useState(16); 
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(64);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (showExplanation || isFinished) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (cycleCount < 2) {
            setAwaleSeeds(s => Math.max(0, s - 1));
            setIsWrong(true);
            setTimeout(() => setIsWrong(false), 500);
            setCycleCount(c => c + 1);
            return 64; 
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showExplanation, isFinished, cycleCount]);

  const handleAnswer = (answerId: string) => {
    if (answerId === 'B') {
      const newHoles = holes.slice(1);
      setHoles(newHoles); 
      setShowExplanation(true);
      setTimeLeft(64);
      setCycleCount(0);
      if (newHoles.length === 0) {
        setTimeout(() => { setShowExplanation(false); setIsFinished(true); }, 2500);
      }
    } else {
      setIsWrong(true);
      setAwaleSeeds(prev => Math.max(0, prev - 1));
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const activeSeedsCount = Math.ceil(timeLeft / 8);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center p-4 font-sans selection:bg-primary/10">
      
      <main className="w-full max-w-5xl flex flex-col items-center mt-10">
        
        {/* L'ARENE : OKPÈLÈ + SATO + AWALÉ */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 min-h-[450px]">
          
          {/* OKPÈLÈ (Vertical à gauche) */}
          <div className="relative flex flex-col items-center pt-10">
            <svg className="absolute top-[35px] w-32 h-16 z-0" viewBox="0 0 100 40">
              <path d="M 20 40 Q 50 5 80 40" stroke="#B8860B" strokeWidth="1.5" fill="none" strokeDasharray="2 2" />
            </svg>
            <div className="flex gap-6 relative z-10">
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => <OkpeleSeed key={`g-${i}`} active={activeSeedsCount > i} />)}
              </div>
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => <OkpeleSeed key={`d-${i}`} active={activeSeedsCount > i + 4} />)}
              </div>
            </div>
          </div>

          {/* SATO (Central, Trapu et Premium) */}
          <div className="relative w-64 h-72 md:w-80 md:h-80">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 md:w-48 h-10 md:h-14 bg-[#3d1810] rounded-[50%] shadow-2xl border-[6px] border-[#a0412d]/20 z-10"></div>
            <div className="absolute inset-0 mt-2" 
                 style={{ 
                   background: 'linear-gradient(165deg, #a0412d 0%, #7a2a1b 100%)',
                   borderRadius: '45% 45% 40% 40% / 25% 25% 75% 75%',
                   boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.5), inset 15px 15px 40px rgba(255,255,255,0.1), 0 40px 80px -20px rgba(0,0,0,0.4)'
                 }}>
              <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black/30 to-transparent opacity-60"></div>
              <div className="relative w-full h-full p-8">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div key={hIdx} exit={{ opacity: 0, scale: 0 }}
                      className={`absolute rounded-full bg-[#120604] shadow-[inset_0_8px_20px_rgba(0,0,0,0.9)] border border-white/5
                        ${hIdx === 0 ? 'top-[35%] left-[20%] w-10 h-10 md:w-18 md:h-18' : ''}
                        ${hIdx === 1 ? 'top-[25%] left-[60%] w-8 h-8 md:w-14 md:h-14' : ''}
                        ${hIdx === 2 ? 'top-[62%] left-[40%] w-12 h-12 md:w-22 md:h-22' : ''}
                        ${hIdx === 3 ? 'top-[50%] left-[75%] w-7 h-7 md:w-12 md:h-12' : ''}
                      `} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AWALÉ (Horizontal à droite, façon bois sculpté) */}
          <motion.div animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} 
                      className="flex flex-col gap-1 bg-[#4a2e15] p-6 rounded-[2.5rem] border-b-[10px] border-[#2a1a0a] shadow-2xl">
            <div className="grid grid-cols-4 gap-3">
                {[...Array(8)].map((_, idx) => (
                    <div key={idx} className="w-10 h-10 md:w-16 md:h-16 bg-[#1a0f06] rounded-full shadow-[inset_0_6px_15px_rgba(0,0,0,0.9)] flex items-center justify-center gap-1">
                        {awaleSeeds > idx * 2 && <div className="w-2 md:w-3.5 h-2 md:h-3.5 rounded-full bg-[#FFD700] shadow-[0_0_12px_#FFD700]" />}
                        {awaleSeeds > idx * 2 + 1 && <div className="w-2 md:w-3.5 h-2 md:h-3.5 rounded-full bg-[#FFD700] shadow-[0_0_12px_#FFD700]" />}
                    </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* SECTION QUESTION ET HUD */}
        <div className="w-full mt-12 px-4 max-w-2xl">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#1A1A1A] tracking-tight">
                  Quelle est la fonction principale du tambour Sato ?
                </h2>
                
                {/* HUD Intégré */}
                <div className="flex gap-10 mb-8 items-center justify-center bg-gray-50/80 backdrop-blur py-3 px-10 rounded-full border border-gray-100">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Temps Restant</span>
                    <span className={`font-black text-base ${timeLeft <= 8 ? 'text-red-600 animate-pulse' : 'text-[#a0412d]'}`}>{timeLeft}s</span>
                  </div>
                  <div className="w-[1px] h-6 bg-gray-200"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Graines Sacrées</span>
                    <span className="text-[#a0412d] font-black text-base italic">{awaleSeeds}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleAnswer(id)} className="p-6 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm flex items-center hover:bg-gray-50 hover:shadow-md transition-all active:scale-95 group">
                      <span className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-base mr-4 shrink-0 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">{id}</span>
                      <span className="font-semibold text-gray-700 text-base">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => setShowExplanation(false)} 
                          className="p-12 bg-white border border-[#a0412d]/10 rounded-[3.5rem] text-center cursor-pointer shadow-2xl max-w-md mx-auto">
                <h3 className="text-[#a0412d] font-bold mb-4 uppercase tracking-[0.4em] text-[10px]">Révélation</h3>
                <p className="text-[#1A1A1A] text-xl md:text-2xl font-medium leading-relaxed italic">
                  "Le Sato est un tambour sacré dont les vibrations purifient les récoltes."
                </p>
                <div className="mt-10 text-[9px] text-gray-300 font-bold animate-pulse tracking-[0.3em] uppercase">Toucher pour continuer</div>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center py-10">
              <h2 className="text-4xl font-black mb-10 uppercase text-[#1A1A1A] italic tracking-tighter">Félicitations initié !</h2>
              <button className="px-16 py-5 bg-[#a0412d] text-white rounded-full font-bold shadow-2xl uppercase tracking-[0.2em] text-[11px]">
                Partager mon initiation
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}