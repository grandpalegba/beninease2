"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OKPELE_STATES = [
  { gauche: [1,1,1,1], droite: [1,1,1,1] }, { gauche: [1,1,1,1], droite: [1,1,1,0] },
  { gauche: [1,1,1,1], droite: [1,1,0,0] }, { gauche: [1,1,1,1], droite: [1,0,0,0] },
  { gauche: [1,1,1,1], droite: [0,0,0,0] }, { gauche: [1,1,1,0], droite: [0,0,0,0] },
  { gauche: [1,1,0,0], droite: [0,0,0,0] }, { gauche: [1,0,0,0], droite: [0,0,0,0] },
  { gauche: [0,0,0,0], droite: [0,0,0,0] }
];

const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className="relative w-8 h-12 md:w-10 md:h-14 transition-all duration-700">
    <div className={`absolute inset-0 bg-[#4a2e15] shadow-[inset_0_-4px_8px_rgba(0,0,0,0.4)] rounded-t-full rounded-b-[48%] flex justify-center overflow-hidden border-b border-black/30`}>
      <div className="w-[1px] h-full bg-black/40 opacity-50" />
      {active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex justify-center items-center">
          <div className="w-[4px] h-[75%] bg-[#FFD700] blur-[1px] shadow-[0_0_15px_#FFD700] rounded-full opacity-90" />
        </motion.div>
      )}
    </div>
  </div>
);

export default function SatoChallengePage() {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [holes, setHoles] = useState([0, 1, 2, 3]); 
  const [awaleSeeds, setAwaleSeeds] = useState(16); 
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8);

  useEffect(() => {
    if (showExplanation || isFinished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCurrentStateIndex((idx) => (idx + 1) % OKPELE_STATES.length);
          return 8;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
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

  const currentState = OKPELE_STATES[currentStateIndex];

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center p-4 font-sans overflow-hidden">
      
      <main className="w-full max-w-4xl flex flex-col items-center mt-8">
        
        {/* SECTION INSTRUMENTS */}
        <div className="w-full grid grid-cols-3 items-end justify-items-center gap-2 min-h-[350px] md:min-h-[450px] relative">
          
          {/* OKPÈLÈ (RELIÉ PAR LE SOMMET) */}
          <div className="relative flex flex-col items-center justify-center h-full pt-10">
            <svg className="absolute top-[42px] md:top-[68px] w-full h-12 z-0" viewBox="0 0 100 40">
              <path d="M 22 40 Q 50 10 78 40" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="1 3" />
            </svg>
            <div className="flex gap-4 md:gap-8 relative z-10">
              <div className="flex flex-col gap-2">
                {currentState.gauche.map((val, i) => <OkpeleSeed key={`g-${i}`} active={val === 1} />)}
              </div>
              <div className="flex flex-col gap-2">
                {currentState.droite.map((val, i) => <OkpeleSeed key={`d-${i}`} active={val === 1} />)}
              </div>
            </div>
          </div>

          {/* LA JARRE SATO PREMIUM */}
          <div className="relative w-32 h-72 md:w-56 md:h-[400px]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 md:w-36 h-8 md:h-12 bg-[#3d1810] rounded-[50%] shadow-2xl border-4 border-[#a0412d]/30 z-10"></div>
            <div className="absolute inset-0 mt-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden" 
                 style={{ 
                   background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
                   borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
                   boxShadow: 'inset -12px -12px 25px rgba(0,0,0,0.3), inset 10px 10px 25px rgba(255,255,255,0.1)'
                 }}>
              <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-black/30 to-transparent"></div>
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div key={hIdx} exit={{ opacity: 0, scale: 0 }}
                      className={`absolute rounded-full bg-[#1a0a07] shadow-[inset_0_6px_12px_rgba(0,0,0,0.8)] border border-white/5
                        ${hIdx === 0 ? 'top-[42%] left-[22%] w-7 h-7 md:w-14 md:h-14' : ''}
                        ${hIdx === 1 ? 'top-[33%] left-[56%] w-6 h-6 md:w-12 md:h-12' : ''}
                        ${hIdx === 2 ? 'top-[64%] left-[42%] w-9 h-9 md:w-18 md:h-18' : ''}
                        ${hIdx === 3 ? 'top-[56%] left-[74%] w-5 h-5 md:w-10 md:h-10' : ''}
                      `} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AWALÉ HORIZONTAL */}
          <motion.div animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} 
                      className="mb-10 grid grid-cols-2 gap-2.5 bg-[#3d1810] p-4 rounded-3xl border-2 border-[#2a100a] shadow-2xl">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="w-8 h-8 md:w-14 md:h-14 bg-black/60 rounded-full flex items-center justify-center gap-1 shadow-inner overflow-hidden">
                {awaleSeeds > idx * 2 && <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" />}
                {awaleSeeds > idx * 2 + 1 && <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" />}
              </div>
            ))}
          </motion.div>
        </div>

        {/* SECTION QUIZ ET STATS SOUS LA QUESTION */}
        <div className="w-full mt-10 px-4 max-w-2xl">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-xl md:text-3xl font-bold mb-4 text-center text-[#1A1A1A] tracking-tight">
                  Quelle est la fonction principale du tambour Sato ?
                </h2>
                
                {/* HUD COMPACT SOUS LA QUESTION */}
                <div className="flex gap-6 mb-8 items-center justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Prochain État</span>
                    <span className="text-[#a0412d] font-black text-sm">{timeLeft}s</span>
                  </div>
                  <div className="w-[1px] h-6 bg-gray-100"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Graines Sacrées</span>
                    <span className="text-[#a0412d] font-black text-sm">{awaleSeeds}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleAnswer(id)} className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center hover:bg-gray-50 transition-all active:scale-95 group">
                      <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-sm mr-4 shrink-0 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">{id}</span>
                      <span className="font-semibold text-gray-700">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setShowExplanation(false)} 
                          className="p-12 bg-white border border-[#a0412d]/10 rounded-[3rem] text-center cursor-pointer shadow-2xl max-w-md mx-auto">
                <h3 className="text-[#a0412d] font-bold mb-4 uppercase tracking-[0.4em] text-[10px]">Révélation</h3>
                <p className="text-[#1A1A1A] text-xl font-medium leading-relaxed italic">
                  "Le Sato est un tambour sacré dont les vibrations purifient les récoltes."
                </p>
                <div className="mt-10 text-[9px] text-gray-400 font-bold animate-pulse tracking-[0.3em] uppercase">Toucher pour continuer</div>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center py-10">
              <h2 className="text-4xl font-black mb-10 uppercase text-[#1A1A1A] italic tracking-tighter">Félicitations initié !</h2>
              <button className="px-16 py-5 bg-[#7a2a1b] text-white rounded-full font-bold shadow-2xl uppercase tracking-widest text-[10px]">
                Partager mon initiation
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}