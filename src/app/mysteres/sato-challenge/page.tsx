"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Structure fondamentale des 9 états (non négociable)
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

export default function SatoChallengePage() {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [holes, setHoles] = useState([0, 1, 2, 3]); 
  const [awaleSeeds, setAwaleSeeds] = useState(16); 
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const revelations = [
    "Le Sato purifie les récoltes par ses vibrations sacrées.",
    "L'Okpèlè guide le choix des semences selon les signes d'Ifa.",
    "L'Awalé simule la gestion des réserves du village.",
    "La Jarre Sato protège l'esprit des ancêtres initiés."
  ];

  // Animation des 9 états : intervalle de 8s par état
  useEffect(() => {
    if (showExplanation || isFinished) return;
    
    const timer = setInterval(() => {
      setCurrentStateIndex((prev) => (prev + 1) % OKPELE_STATES.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [showExplanation, isFinished]);

  const handleDrop = (answerId: string) => {
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
      setAwaleSeeds(prev => Math.max(0, prev - 1));
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
  };

  const currentState = OKPELE_STATES[currentStateIndex];

  return (
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center font-sans p-2 overflow-x-hidden">
      
      <main className="w-full max-w-md md:max-w-4xl flex flex-col items-center">
        
        {/* SECTION INSTRUMENTS (Grille 3 colonnes) */}
        <div className="w-full grid grid-cols-3 md:flex md:flex-row items-center justify-items-center gap-1 md:gap-12 mt-4 md:mt-16 scale-[0.85] md:scale-110 origin-top transition-transform">
          
          {/* OKPÈLÈ (REPRODUCTION EXACTE) */}
          <div className="relative w-full flex flex-col items-center scale-[0.8] md:scale-100">
            <svg className="absolute -top-10 w-full h-16 z-0" viewBox="0 0 100 60">
              <path d="M 15 60 Q 50 10 85 60" stroke="#D4AF37" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="2 3" />
            </svg>
            <div className="flex gap-4 md:gap-8 relative z-10">
              {/* Colonne Gauche */}
              <div className="flex flex-col gap-2">
                {currentState.gauche.map((val, i) => (
                  <div key={`g-${i}`} className="relative w-6 h-9 md:w-8 md:h-11 bg-[#5d3a1a] shadow-md flex justify-center overflow-hidden rounded-t-full rounded-b-[40%] transition-colors duration-1000">
                    <div className="w-[1px] h-full bg-black/20" />
                    {val === 1 && (
                      <div className="absolute inset-0 flex justify-center items-center">
                        <div className="w-[3px] h-[75%] bg-[#FFD700] shadow-[0_0_12px_#FFD700] rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Colonne Droite */}
              <div className="flex flex-col gap-2">
                {currentState.droite.map((val, i) => (
                  <div key={`d-${i}`} className="relative w-6 h-9 md:w-8 md:h-11 bg-[#5d3a1a] shadow-md flex justify-center overflow-hidden rounded-t-full rounded-b-[40%] transition-colors duration-1000">
                    <div className="w-[1px] h-full bg-black/20" />
                    {val === 1 && (
                      <div className="absolute inset-0 flex justify-center items-center">
                        <div className="w-[3px] h-[75%] bg-[#FFD700] shadow-[0_0_12px_#FFD700] rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* JARRE SATO */}
          <div className="relative w-full aspect-[2/3] max-h-[160px] md:max-h-[300px] z-10">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[70%] h-6 md:h-10 bg-[#3d1810] rounded-[50%] border-2 md:border-4 border-[#a0412d]/20 z-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(165deg, #a0412d 0%, #7a2a1b 100%)', borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%' }}>
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div 
                      key={hIdx}
                      exit={{ opacity: 0, scale: 0 }}
                      className={`absolute rounded-full bg-[#2a100a] shadow-inner 
                        ${hIdx === 0 ? 'top-[40%] left-[25%] w-7 h-7 md:w-14 md:h-14' : ''}
                        ${hIdx === 1 ? 'top-[32%] left-[58%] w-6 h-6 md:w-12 md:h-12' : ''}
                        ${hIdx === 2 ? 'top-[62%] left-[40%] w-9 h-9 md:w-16 md:h-16' : ''}
                        ${hIdx === 3 ? 'top-[55%] left-[72%] w-4 h-4 md:w-10 md:h-10' : ''}
                      `}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AWALE */}
          <motion.div animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} className="relative flex bg-[#3d1810] p-1.5 md:p-4 rounded-xl border-2 border-[#2a100a] scale-[0.8] md:scale-100 shadow-xl">
            {[0, 1].map((col) => (
              <React.Fragment key={col}>
                <div className="flex flex-col gap-1.5 md:gap-3">
                  {[0, 1, 2, 3].map(row => {
                    const baseIdx = (col === 0 ? row : row + 4) * 2;
                    return (
                      <div key={row} className="w-6 h-6 md:w-10 md:h-10 bg-black/60 rounded-full flex items-center justify-center gap-0.5 shadow-inner">
                        {awaleSeeds > baseIdx && <div className="w-1 h-1 md:w-2.5 md:h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_6px_#FFD700]" />}
                        {awaleSeeds > baseIdx + 1 && <div className="w-1 h-1 md:w-2.5 md:h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_6px_#FFD700]" />}
                      </div>
                    );
                  })}
                </div>
                {col === 0 && <div className="mx-1 md:mx-3 w-[1px] bg-[#2a100a]/50" />}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* SECTION INTERACTIVE */}
        <div className="w-full mt-6 md:mt-12 px-4 max-w-2xl">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-lg md:text-2xl font-bold mb-6 text-center text-gray-800">Quelle est la fonction principale du tambour Sato ?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleDrop(id)} className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center text-left hover:border-[#a0412d]/30 transition-all active:scale-95">
                      <span className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-xs mr-4 shrink-0 border border-gray-100">{id}</span>
                      <span className="text-sm md:text-base font-semibold">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={nextQuestion} className="p-8 md:p-12 bg-[#faf9f8] rounded-3xl border border-[#a0412d]/10 text-center cursor-pointer shadow-lg">
                <h3 className="text-[#a0412d] font-bold mb-4 uppercase tracking-[0.3em] text-[10px] md:text-xs">Révélation Sacrée</h3>
                <p className="text-gray-700 mb-6 text-base md:text-lg font-medium leading-relaxed">Le Sato est un tambour sacré dont les vibrations purifient les récoltes.</p>
                <div className="text-[10px] text-[#a0412d]/40 font-bold animate-pulse tracking-widest">TOUCHER POUR CONTINUER ↓</div>
              </motion.div>
            )
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
              <h2 className="text-3xl font-black mb-8 uppercase text-[#303333]">Félicitations !</h2>
              <div className="w-full bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 mb-8 shadow-xl">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Synthèse des secrets du Sato</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {revelations.map((text, i) => (
                    <div key={i} className="text-xs md:text-sm font-medium text-gray-700 flex items-start p-3 bg-gray-50/50 rounded-xl">
                      <span className="text-[#a0412d] mr-3">✦</span>{text}
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full md:w-auto md:px-12 py-4 bg-[#7a2a1b] text-white rounded-full font-bold shadow-lg uppercase text-xs">Partager mon initiation</button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}