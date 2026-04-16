"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Définition des 9 états de l'Okpèlè (reproduction du cycle visuel)
const OKPELE_STATES = [
  { gauche: [1,1,1,1], droite: [1,1,1,1] }, // État 1
  { gauche: [1,1,1,1], droite: [1,1,1,0] }, // État 2
  { gauche: [1,1,1,1], droite: [1,1,0,0] }, // État 3
  { gauche: [1,1,1,1], droite: [1,0,0,0] }, // État 4
  { gauche: [1,1,1,1], droite: [0,0,0,0] }, // État 5
  { gauche: [1,1,1,0], droite: [0,0,0,0] }, // État 6
  { gauche: [1,1,0,0], droite: [0,0,0,0] }, // État 7
  { gauche: [1,0,0,0], droite: [0,0,0,0] }, // État 8
  { gauche: [0,0,0,0], droite: [0,0,0,0] }  // État 9
];

// Composant Graine Okpèlè (SVG pour la performance et le réalisme)
const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className="relative w-7 h-11 md:w-9 md:h-13 transition-all duration-700">
    {/* Forme de la cosse (Graine) */}
    <div className={`absolute inset-0 bg-[#5d3a1a] shadow-lg border-b-2 border-black/20 rounded-t-full rounded-b-[45%] flex justify-center overflow-hidden`}>
      <div className="w-[1px] h-full bg-black/30" />
      {/* Reflet doré si active */}
      {active && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="absolute inset-0 flex justify-center items-center"
        >
          <div className="w-[3px] h-[70%] bg-[#FFD700] blur-[1px] shadow-[0_0_12px_#FFD700] rounded-full" />
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

  useEffect(() => {
    if (showExplanation || isFinished) return;
    const timer = setInterval(() => {
      setCurrentStateIndex((prev) => (prev + 1) % OKPELE_STATES.length);
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

  const currentState = OKPELE_STATES[currentStateIndex];

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center p-4 font-sans overflow-hidden">
      
      {/* HUD : États et Points */}
      <div className="w-full max-w-xl flex justify-between items-center mb-10 px-4 mt-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Initiation Ifá</span>
          <span className="text-[#a0412d] font-black text-sm italic">CYCLE {currentStateIndex + 1}/9</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Graines Awalé</span>
          <span className={`${isWrong ? 'text-red-500' : 'text-[#a0412d]'} font-black text-sm transition-colors`}>{awaleSeeds}</span>
        </div>
      </div>

      <main className="w-full max-w-4xl flex flex-col items-center">
        
        {/* SECTION INSTRUMENTS */}
        <div className="w-full grid grid-cols-3 items-end justify-items-center gap-2 md:gap-12 min-h-[320px] md:min-h-[420px]">
          
          {/* OKPÈLÈ (CODÉ) */}
          <div className="relative flex flex-col items-center justify-center h-full">
            <svg className="absolute -top-6 w-full h-12" viewBox="0 0 100 40">
              <path d="M 10 40 Q 50 0 90 40" stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 4" opacity="0.6" />
            </svg>
            <div className="flex gap-3 md:gap-6">
              <div className="flex flex-col gap-2">
                {currentState.gauche.map((val, i) => <OkpeleSeed key={`g-${i}`} active={val === 1} />)}
              </div>
              <div className="flex flex-col gap-2">
                {currentState.droite.map((val, i) => <OkpeleSeed key={`d-${i}`} active={val === 1} />)}
              </div>
            </div>
          </div>

          {/* LA JARRE SATO (ADAPTATION STITCH) */}
          <div className="relative w-28 h-64 md:w-48 md:h-[350px]">
            {/* Lip of the jar */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 md:w-32 h-6 md:h-10 bg-[#3d1810] rounded-[50%] shadow-inner border-4 border-[#a0412d]/20 z-10"></div>
            {/* Body with Clay Texture and Organic Shape */}
            <div className="absolute inset-0 shadow-2xl overflow-hidden" 
                 style={{ 
                   background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
                   borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
                   boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.15)'
                 }}>
              <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black/25 to-transparent"></div>
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div 
                      key={hIdx}
                      exit={{ opacity: 0, scale: 0 }}
                      className={`absolute rounded-full bg-[#2a100a] shadow-[inset_0_4px_10px_rgba(0,0,0,0.7)] border border-black/10
                        ${hIdx === 0 ? 'top-[40%] left-[25%] w-6 h-6 md:w-12 md:h-12' : ''}
                        ${hIdx === 1 ? 'top-[32%] left-[58%] w-5 h-5 md:w-10 md:h-10' : ''}
                        ${hIdx === 2 ? 'top-[62%] left-[40%] w-7 h-7 md:w-14 md:h-14' : ''}
                        ${hIdx === 3 ? 'top-[55%] left-[72%] w-4 h-4 md:w-9 md:h-9' : ''}
                      `}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AWALÉ (HORIZONTAL) */}
          <motion.div animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} 
                      className="mb-8 grid grid-cols-2 gap-2 bg-[#3d1810] p-3 rounded-2xl border-2 border-[#2a100a] shadow-xl">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="w-7 h-7 md:w-12 md:h-12 bg-black/60 rounded-full flex items-center justify-center gap-1 shadow-inner overflow-hidden">
                {awaleSeeds > idx * 2 && <div className="w-1.5 md:w-2.5 h-1.5 md:h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
                {awaleSeeds > idx * 2 + 1 && <div className="w-1.5 md:w-2.5 h-1.5 md:h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
              </div>
            ))}
          </motion.div>
        </div>

        {/* SECTION QUIZ */}
        <div className="w-full mt-12 px-4 max-w-2xl">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-bold mb-8 text-center text-gray-800 leading-tight">
                  Quelle est la fonction principale du tambour Sato ?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleAnswer(id)} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center hover:bg-gray-50 transition-all active:scale-95 group">
                      <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-sm mr-4 shrink-0 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">{id}</span>
                      <span className="font-semibold text-gray-700 text-sm md:text-base">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setShowExplanation(false)} 
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
              <button className="px-14 py-4 bg-[#7a2a1b] text-white rounded-full font-bold shadow-2xl uppercase tracking-[0.2em] text-[10px]">
                Partager mon savoir
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}