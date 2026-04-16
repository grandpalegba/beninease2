"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPOSANTS DE DESIGN ---

const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className={`relative w-7 h-10 md:w-8 md:h-12 transition-all duration-700 ${active ? 'opacity-100' : 'opacity-20grayscale'}`}>
    {/* Forme de cosse boisée plus fine */}
    <div className="absolute inset-0 rounded-t-[50%] rounded-b-[40%]"
         style={{ background: 'linear-gradient(145deg, #3d2410, #1a0f06)', boxShadow: 'inset -1px -1px 3px rgba(255,255,255,0.05), 0 3px 8px rgba(0,0,0,0.3)' }} />
    <div className="absolute inset-1.5 rounded-t-[45%] rounded-b-[35%] bg-[#0f0803] flex justify-center overflow-hidden">
      <div className="w-[1px] h-full bg-white/5 opacity-50" />
      {/* Lueur spirituelle plus discrète */}
      {active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.6, 0.3] }} 
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-[65%] bg-[#FFD700] blur-[1px] rounded-full" />
      )}
    </div>
  </div>
);

const AwaleSeed = ({ color = '#FFD700' }: { color?: string }) => (
    <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full" style={{ background: color, boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.5), inset 1px 1px 3px rgba(255,255,255,0.2)' }} />
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
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center p-4 font-sans overflow-x-hidden selection:bg-[#a0412d]/10 relative">
      
      {/* CSS CUSTOM POUR LA JARRE Organique (Injected for React) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .clay-texture {
          background: linear-gradient(165deg, #a0412d 0%, #7a2a1b 100%);
          box-shadow: inset -8px -8px 20px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.1);
        }
        .organic-shape {
          border-radius: 42% 38% 34% 36% / 45% 45% 32% 32%;
        }
      `}} />

      <main className="w-full max-w-6xl flex flex-col items-center mt-12">
        
        {/* L'ARENE : ALIGNEMENT STRICT ITEMS-CENTER POUR RESPECTER L'IMAGE 2 */}
        <div className="w-full flex items-center justify-center gap-6 md:gap-20 h-[320px] md:h-[380px] mb-12 border-b border-gray-50 pb-8">
          
          {/* 1. OKPÈLÈ (HAUTEUR FIXE 130PX - SOUDÉ ET FIN) */}
          <div className="relative flex flex-col items-center justify-center h-[130px] shrink-0">
            <svg className="absolute -top-10 md:-top-12 w-full h-12 z-0 opacity-40" viewBox="0 0 100 40">
              <path d="M 15 40 Q 50 10 85 40" stroke="#B8860B" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 3" />
            </svg>
            <div className="flex gap-4 md:gap-6 relative z-10 pt-2">
              <div className="flex flex-col gap-1.5 md:gap-2">
                {[...Array(4)].map((_, i) => <OkpeleSeed key={`g-${i}`} active={activeSeedsCount > i} />)}
              </div>
              <div className="flex flex-col gap-1.5 md:gap-2">
                {[...Array(4)].map((_, i) => <OkpeleSeed key={`d-${i}`} active={activeSeedsCount > i + 4} />)}
              </div>
            </div>
          </div>

          {/* 2. LA JARRE SATO PREMIUM (RESTREINTE ET COHÉRENTE) */}
          <div className="relative w-56 h-64 md:w-64 md:h-80 shrink-0 z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 md:w-40 h-8 md:h-10 bg-[#3d1810] rounded-[50%] shadow-2xl border-[6px] border-[#a0412d]/20 z-10"></div>
            <div className="absolute inset-0 clay-texture organic-shape flex flex-col items-center justify-center overflow-hidden border-b-8 border-black/20">
              <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black/25 to-transparent"></div>
              <div className="relative w-full h-full p-8">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div key={hIdx} exit={{ scale: 0, opacity: 0 }}
                      className={`absolute rounded-full bg-[#120604] shadow-[inset_0_4px_10px_rgba(0,0,0,1)] border border-white/5
                        ${hIdx === 0 ? 'top-[40%] left-[22%] w-8 h-8 md:w-16 md:h-16' : ''}
                        ${hIdx === 1 ? 'top-[30%] left-[58%] w-7 h-7 md:w-14 md:h-14' : ''}
                        ${hIdx === 2 ? 'top-[60%] left-[40%] w-10 h-10 md:w-20 md:h-20' : ''}
                        ${hIdx === 3 ? 'top-[52%] left-[72%] w-6 h-6 md:w-12 md:h-12' : ''}
                      `} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 3. AWALÉ RÉDUIT (TAILLE ÉQUIVALENTE À L'OKPÈLÈ - SANS OMBRE) */}
          <motion.div animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} 
                      className="mb-8 flex gap-2.5 p-3 md:p-4 rounded-[1.5rem] border-b-4 h-[130px] items-center shrink-0"
                      style={{ background: jarColor, borderColor: '#2a1a0a' }}>
            <div className="grid grid-cols-1 gap-1.5 md:gap-2 pr-3 border-r-2 border-black/30 relative z-10">
                {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="w-7 h-7 md:w-10 md:h-10 bg-[#1a0f06] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.9)] flex items-center justify-center gap-0.5 p-1.5">
                        {awaleSeeds > idx * 2 && <AwaleSeed color="#FFD700" />}
                        {awaleSeeds > idx * 2 + 1 && <AwaleSeed color="#4a2e15" />}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-1.5 md:gap-2 pl-3 relative z-10">
                {[...Array(4)].map((_, idx) => (
                    <div key={idx + 4} className="w-7 h-7 md:w-10 md:h-10 bg-[#1a0f06] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.9)] flex items-center justify-center gap-0.5 p-1.5">
                        {awaleSeeds > (idx + 4) * 2 && <AwaleSeed color="#4a2e15" />}
                        {awaleSeeds > (idx + 4) * 2 + 1 && <AwaleSeed color="#FFD700" />}
                    </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* SECTION QUIZ ET STATS SOUS LA QUESTION */}
        <div className="w-full mt-10 px-4 max-w-3xl">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-[#1A1A1A] leading-tight tracking-tight">
                  Quelle est la fonction principale du tambour Sato ?
                </h2>
                
                {/* HUD COMPACT SOUS LA QUESTION */}
                <div className="flex gap-10 mb-10 items-center justify-center bg-gray-50/50 py-3 px-10 rounded-full border border-gray-100 shadow-inner">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Temps Restant</span>
                    <span className={`font-black text-lg md:text-xl ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-[#a0412d]'}`}>{timeLeft}s</span>
                  </div>
                  <div className="w-[1px] h-6 bg-gray-200"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Graines Sacrées</span>
                    <span className="text-[#a0412d] font-black text-lg md:text-xl italic">{awaleSeeds}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleAnswer(id)} className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center group active:scale-95 transition-all">
                      <span className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-base mr-4 shrink-0 group-hover:bg-[#a0412d] group-hover:text-white transition-colors border border-gray-100">{id}</span>
                      <span className="font-semibold text-gray-700 text-base">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onClick={() => setShowExplanation(false)} 
                          className="p-10 md:p-14 bg-[#faf9f8] rounded-[3rem] border border-[#a0412d]/10 text-center shadow-2xl max-w-md mx-auto cursor-pointer">
                <h3 className="text-[#a0412d] font-bold mb-4 uppercase tracking-[0.4em] text-[10px]">Révélation</h3>
                <p className="text-[#1A1A1A] text-xl md:text-2xl font-medium leading-relaxed italic">
                  "Le Sato est un tambour sacré dont les vibrations purifient les récoltes."
                </p>
                <div className="mt-10 text-[9px] text-gray-400 font-bold animate-pulse tracking-[0.2em] uppercase">Toucher pour continuer</div>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center py-10">
              <h2 className="text-4xl font-black mb-8 uppercase text-[#1A1A1A] italic tracking-tighter">Félicitations initié !</h2>
              <div className="w-full bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {revelations.map((text, i) => (
                    <div key={i} className="text-sm font-medium text-gray-700 flex items-start p-4 bg-gray-50 rounded-2xl border border-gray-50">
                      <span className="text-[#a0412d] mr-3 mt-1">✦</span> {text}
                    </div>
                  ))}
                </div>
              </div>
              <button className="px-12 py-5 bg-[#a0412d] text-white rounded-full font-bold shadow-2xl uppercase tracking-[0.2em] text-[11px] hover:bg-[#7a2a1b] transition-colors">
                Partager mon initiation
              </button>
            </div>
          )}
        </div>
      </main>
      
      {/* Subtle Aesthetic Ambient Detail */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#a0412d]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </div>
  );
}