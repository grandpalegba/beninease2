"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPOSANTS DE DESIGN ---

const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className={`relative w-8 h-11 transition-all duration-700 ${active ? 'opacity-100' : 'opacity-20 grayscale'}`}>
    {/* Forme de cosse organique inspirée du design final */}
    <div className="absolute inset-0 rounded-t-[55%] rounded-b-[35%]"
         style={{ background: 'linear-gradient(145deg, #a0412d, #5d2216)', boxShadow: 'inset -1px -1px 3px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.3)' }} />
    <div className="absolute inset-1.5 rounded-t-[45%] rounded-b-[30%] bg-[#0f0803] shadow-inner flex justify-center overflow-hidden">
      <div className="w-[1px] h-full bg-white/5 opacity-40" />
      {active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.6, 0.3] }} 
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-[#FFD700] blur-[1px]" />
      )}
    </div>
  </div>
);

const AwaleSeed = ({ color = '#FFD700' }: { color?: string }) => (
  <div className="w-2 h-2 rounded-full shadow-inner" 
       style={{ background: color, boxShadow: 'inset -1px -1px 2px rgba(0,0,0,0.8)' }} />
);

// --- COMPOSANT PRINCIPAL ---

export default function SatoChallengePage() {
  const TOTAL_TIME = 64;
  const jarColor = '#a0412d'; 
  
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

  const activeSeedsCount = Math.ceil(timeLeft / 8);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center p-4 font-sans overflow-x-hidden">
      
      <main className="w-full max-w-6xl flex flex-col items-center mt-12">
        
        {/* SECTION INSTRUMENTS - ALIGNEMENT HORIZONTAL STRICT (CENTRE) */}
        <div className="w-full flex flex-row items-center justify-center gap-6 md:gap-20 h-[320px] md:h-[380px] relative mb-12 border-b border-gray-50 pb-8">
          
          {/* OKPÈLÈ (HAUTEUR 140PX) */}
          <div className="relative flex items-center justify-center h-[140px] shrink-0">
            <div className="flex gap-3 md:gap-5 relative z-10">
              <div className="flex flex-col gap-2">
                {[...Array(4)].map((_, i) => <OkpeleSeed key={`g-${i}`} active={activeSeedsCount > i} />)}
              </div>
              <div className="flex flex-col gap-2">
                {[...Array(4)].map((_, i) => <OkpeleSeed key={`d-${i}`} active={activeSeedsCount > i + 4} />)}
              </div>
            </div>
          </div>

          {/* LA JARRE SATO (FORME TRAPUE - RESTAURÉE) */}
          <div className="relative w-60 h-72 md:w-72 md:h-80 flex-shrink-0">
            {/* Col de la jarre */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 md:w-40 h-8 md:h-10 bg-[#3d1810] rounded-[50%] border-4 border-[#a0412d]/20 z-10 shadow-lg"></div>
            {/* Corps de la jarre - border-radius spécifique pour aspect "trapu" */}
            <div className="absolute inset-0 mt-3 overflow-hidden" 
                 style={{ 
                   background: 'linear-gradient(165deg, #a0412d 0%, #7a2a1b 100%)',
                   borderRadius: '45% 45% 35% 35% / 25% 25% 75% 75%',
                   boxShadow: 'inset -15px -15px 30px rgba(0,0,0,0.4), inset 10px 10px 25px rgba(255,255,255,0.1), 0 25px 50px -12px rgba(0,0,0,0.2)'
                 }}>
              <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black/30 to-transparent"></div>
              <div className="relative w-full h-full p-8">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div key={hIdx} exit={{ opacity: 0, scale: 0 }}
                      className={`absolute rounded-full bg-[#120604] shadow-[inset_0_5px_12px_rgba(0,0,0,0.9)] border border-white/5
                        ${hIdx === 0 ? 'top-[35%] left-[20%] w-12 h-12 md:w-16 md:h-16' : ''}
                        ${hIdx === 1 ? 'top-[28%] left-[58%] w-10 h-10 md:w-14 md:h-14' : ''}
                        ${hIdx === 2 ? 'top-[62%] left-[42%] w-14 h-14 md:w-20 md:h-20' : ''}
                        ${hIdx === 3 ? 'top-[52%] left-[72%] w-8 h-8 md:w-12 md:h-12' : ''}
                      `} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AWALÉ (MÊME HAUTEUR QUE OKPÈLÈ - SANS OMBRE PORTÉE) */}
          <motion.div animate={isWrong ? { x: [-3, 3, -3, 3, 0] } : {}} 
                      className="flex gap-2 p-3 rounded-[1.5rem] border-b-4 h-[140px] items-center shrink-0"
                      style={{ background: jarColor, borderColor: '#3d1810' }}>
            <div className="grid grid-cols-1 gap-1.5 pr-2 border-r border-black/10 relative z-10">
                {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="w-8 h-8 md:w-10 md:h-10 bg-black/40 rounded-full flex items-center justify-center gap-0.5">
                        {awaleSeeds > idx * 2 && <AwaleSeed color="#FFD700" />}
                        {awaleSeeds > idx * 2 + 1 && <AwaleSeed color="#3d1810" />}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-1.5 pl-2 relative z-10">
                {[...Array(4)].map((_, idx) => (
                    <div key={idx + 4} className="w-8 h-8 md:w-10 md:h-10 bg-black/40 rounded-full flex items-center justify-center gap-0.5">
                        {awaleSeeds > (idx + 4) * 2 && <AwaleSeed color="#3d1810" />}
                        {awaleSeeds > (idx + 4) * 2 + 1 && <AwaleSeed color="#FFD700" />}
                    </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* SECTION QUIZ OU FÉLICITATIONS */}
        <div className="w-full mt-10 px-4 max-w-3xl">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-bold mb-8 text-center text-[#1A1A1A] leading-tight tracking-tight">
                  Quelle est la fonction principale du tambour Sato ?
                </h2>
                
                {/* HUD COMPACT SOUS LA QUESTION */}
                <div className="flex gap-10 mb-10 items-center justify-center bg-gray-50/50 py-2.5 px-10 rounded-full border border-gray-100 shadow-inner">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Temps</span>
                    <span className={`font-black text-sm md:text-base ${timeLeft <= 8 ? 'text-red-600 animate-pulse' : 'text-[#a0412d]'}`}>{timeLeft}s</span>
                  </div>
                  <div className="w-[1px] h-6 bg-gray-200"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Graines</span>
                    <span className="text-[#a0412d] font-black text-sm md:text-base italic">{awaleSeeds}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleAnswer(id)} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center hover:bg-gray-50 transition-all group">
                      <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-base mr-4 shrink-0 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">{id}</span>
                      <span className="font-semibold text-gray-700 text-base">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setShowExplanation(false)} 
                          className="p-10 bg-white border border-[#a0412d]/10 rounded-[2.5rem] text-center cursor-pointer shadow-2xl max-w-md mx-auto">
                <p className="text-[#1A1A1A] text-lg font-medium italic italic">
                  "Le Sato est un tambour sacré dont les vibrations purifient les récoltes."
                </p>
                <div className="mt-8 text-[9px] text-gray-400 font-bold tracking-widest uppercase">Toucher pour continuer</div>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center py-6">
              <h2 className="text-3xl font-black mb-8 uppercase text-[#1A1A1A] italic tracking-tighter">Initiation Réussie</h2>
              <button className="px-12 py-4 bg-[#a0412d] text-white rounded-full font-bold shadow-lg uppercase tracking-widest text-[10px]">
                Partager mon initiation
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}