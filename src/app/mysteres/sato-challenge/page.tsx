"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Design des noix d'Okpèlè codé-dessiné, photoréaliste et performant
const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className="relative w-12 h-16 transition-all duration-700">
    {/* Demi-coque externe boisée sculptée */}
    <div className={`absolute inset-0 rounded-t-[50%] rounded-b-[40%] transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-20 grayscale'}`}
         style={{ 
           background: 'linear-gradient(145deg, #3d2410, #1a0f06)',
           boxShadow: 'inset -2px -2px 5px rgba(255,255,255,0.05), 0 5px 15px rgba(0,0,0,0.4)' 
         }}>
      {/* Creux de la noix (partie interne) sculpté */}
      <div className="absolute inset-2 rounded-t-[45%] rounded-b-[35%] bg-[#0f0803] shadow-inner flex justify-center">
        <div className="w-[1px] h-full bg-white/5 opacity-50" />
        {/* Lueur spirituelle dorée dramatique */}
        {active && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: [0.4, 0.8, 0.4] }} 
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-[65%] bg-[#FFD700] blur-[2px] rounded-full" 
          />
        )}
      </div>
    </div>
  </div>
);

// Composant pour une perle réaliste de l'Awalé
const AwaleSeed = ({ color = '#FFD700' }: { color?: string }) => (
    <div className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ background: color, boxShadow: 'inset -2px -2px 5px rgba(0,0,0,0.5), inset 2px 2px 5px rgba(255,255,255,0.2)' }} />
);

export default function SatoChallengePage() {
  const [showExplanation, setShowExplanation] = useState(false);
  const [holes, setHoles] = useState([0, 1, 2, 3]); 
  const [awaleSeeds, setAwaleSeeds] = useState(16); 
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Nouveau système de temps : Chrono Ifá (64s)
  const [timeLeft, setTimeLeft] = useState(64);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (showExplanation || isFinished) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (cycleCount < 2) { // Maximum 3 cycles de 64s par question
            // Pénalité
            setAwaleSeeds(s => Math.max(0, s - 1));
            setIsWrong(true);
            setTimeout(() => setIsWrong(false), 500);
            setCycleCount(c => c + 1);
            return 64; // Reset pour le prochain cycle
          }
          return 0; // Bloqué à 0 après 3 cycles
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
      setTimeLeft(64); // Reset le chrono principal à chaque nouvelle question
      setCycleCount(0); // Reset le décompte de cycles
      if (newHoles.length === 0) {
        setTimeout(() => { setShowExplanation(false); setIsFinished(true); }, 2500);
      }
    } else {
      setIsWrong(true);
      setAwaleSeeds(prev => Math.max(0, prev - 1));
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  // Calculer quelles graines de l'Okpèlè sont allumées (1 graine par tranche de 8s)
  const activeSeedsCount = Math.ceil(timeLeft / 8);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center p-4 font-sans overflow-hidden">
      
      <main className="w-full max-w-6xl flex flex-col items-center mt-6">
        
        {/* SECTION INSTRUMENTS */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 items-end justify-items-center gap-12 md:gap-4 min-h-[420px] relative">
          
          {/* OKPÈLÈ (NOIX RÉALISTES CODÉES) */}
          <div className="relative flex flex-col items-center justify-center h-full pt-16">
            <svg className="absolute top-[65px] md:top-[90px] w-full h-16 z-0" viewBox="0 0 100 40">
              <path d="M 20 40 Q 50 10 80 40" stroke="#B8860B" strokeWidth="1.5" fill="none" strokeDasharray="3 3" opacity="0.6" />
            </svg>
            <div className="flex gap-6 md:gap-10 relative z-10">
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => <OkpeleSeed key={`g-${i}`} active={activeSeedsCount > i} />)}
              </div>
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => <OkpeleSeed key={`d-${i}`} active={activeSeedsCount > i + 4} />)}
              </div>
            </div>
          </div>

          {/* LA JARRE SATO PREMIUMAllongée et Réaliste */}
          <div className="relative w-56 h-72 md:w-64 md:h-[400px]">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 md:w-44 h-10 md:h-14 bg-[#3d1810] rounded-[50%] shadow-2xl border-[6px] border-[#a0412d]/20 z-10"></div>
            <div className="absolute inset-0 mt-3 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]" 
                 style={{ 
                   background: 'linear-gradient(165deg, #a0412d 0%, #7a2a1b 100%)',
                   borderRadius: '45% 45% 40% 40% / 15% 15% 85% 85%',
                   boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.5), inset 15px 15px 40px rgba(255,255,255,0.1), 0 30px 60px -15px rgba(0,0,0,0.4)'
                 }}>
              <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black/30 to-transparent"></div>
              <div className="relative w-full h-full p-8">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div key={hIdx} exit={{ opacity: 0, scale: 0 }}
                      className={`absolute rounded-full bg-[#120604] shadow-[inset_0_8px_20px_rgba(0,0,0,0.9)] border border-white/5
                        ${hIdx === 0 ? 'top-[35%] left-[20%] w-10 h-10 md:w-20 md:h-20' : ''}
                        ${hIdx === 1 ? 'top-[25%] left-[60%] w-8 h-8 md:w-16 md:h-16' : ''}
                        ${hIdx === 2 ? 'top-[62%] left-[40%] w-12 h-12 md:w-24 md:h-24' : ''}
                        ${hIdx === 3 ? 'top-[50%] left-[75%] w-7 h-7 md:w-14 md:h-14' : ''}
                      `} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AWALÉ PREMIUM ET VERTICAL */}
          <motion.div animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} 
                      className="mb-8 flex flex-col md:flex-row gap-2.5 bg-[#4a2e15] p-5 rounded-[2.5rem] border-b-[10px] border-[#2a1a0a] shadow-2xl relative overflow-hidden">
            {/* Texture boisée sculptée simulée */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '10px 10px' }} />
            
            {/* Colonne Gauche */}
            <div className="grid grid-cols-1 gap-3.5 pr-4 border-r-2 border-black/30 relative z-10">
                {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="w-10 h-10 md:w-16 md:h-16 bg-[#1a0f06] rounded-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] flex items-center justify-center gap-1.5 p-2">
                        {awaleSeeds > idx * 2 && <AwaleSeed />}
                        {awaleSeeds > idx * 2 + 1 && <AwaleSeed color="#FFE066" />}
                    </div>
                ))}
            </div>
            {/* Colonne Droite */}
            <div className="grid grid-cols-1 gap-3.5 pl-4 relative z-10">
                {[...Array(4)].map((_, idx) => (
                    <div key={idx + 4} className="w-10 h-10 md:w-16 md:h-16 bg-[#1a0f06] rounded-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] flex items-center justify-center gap-1.5 p-2">
                        {awaleSeeds > (idx + 4) * 2 && <AwaleSeed color="#FFD700" />}
                        {awaleSeeds > (idx + 4) * 2 + 1 && <AwaleSeed />}
                    </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* SECTION QUIZ */}
        <div className="w-full mt-10 px-4 max-w-3xl">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-[#1A1A1A] leading-tight">
                  Quelle est la fonction principale du tambour Sato ?
                </h2>
                
                {/* HUD Intégré Compact */}
                <div className="flex gap-10 mb-8 items-center justify-center bg-gray-50/50 py-3 px-10 rounded-full border border-gray-100">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Chrono Ifá</span>
                    <span className={`font-black text-lg md:text-xl transition-all ${timeLeft <= 8 ? 'text-red-600 animate-pulse' : 'text-[#a0412d]'}`}>{timeLeft}s</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Graines Sacrées</span>
                    <span className="text-[#a0412d] font-black text-lg md:text-xl italic">{awaleSeeds}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleAnswer(id)} className="p-6 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm flex items-center hover:bg-gray-50 transition-all hover:shadow-lg active:scale-95 group">
                      <span className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-base mr-4 shrink-0 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">{id}</span>
                      <span className="font-semibold text-gray-700 text-base">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => setShowExplanation(false)} 
                          className="p-12 bg-white border border-[#a0412d]/10 rounded-[4rem] text-center cursor-pointer shadow-2xl max-w-lg mx-auto">
                <h3 className="text-[#a0412d] font-bold mb-4 uppercase tracking-[0.4em] text-[11px]">Révélation</h3>
                <p className="text-[#1A1A1A] text-xl md:text-2xl font-medium leading-relaxed italic">
                  "Le Sato est un tambour sacré dont les vibrations purifient les récoltes."
                </p>
                <div className="mt-10 text-[9px] text-gray-300 font-bold animate-pulse tracking-[0.3em] uppercase">Toucher pour continuer</div>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center py-10">
              <h2 className="text-4xl font-black mb-10 uppercase text-[#1A1A1A] italic tracking-tighter">Félicitations initié !</h2>
              <button className="px-16 py-5 bg-[#a0412d] text-white rounded-full font-bold shadow-2xl uppercase tracking-[0.2em] text-[11px] hover:bg-[#7a2a1b] transition-colors">
                Partager mon initiation
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}