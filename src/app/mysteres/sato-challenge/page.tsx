"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION VISUELLE ---
const jarColor = "#a0412d";

// --- COMPOSANTS DE DESIGN ---

const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className={`relative w-7 h-11 transition-all duration-700 ${active ? 'opacity-100' : 'opacity-20 grayscale'}`}>
    {/* Cosse externe boisée */}
    <div className="absolute inset-0 rounded-t-[50%] rounded-b-[40%]"
         style={{ background: `linear-gradient(145deg, ${jarColor}, #4a1d15)`, boxShadow: 'inset -1px -1px 3px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.3)' }} />
    {/* Intérieur de la noix */}
    <div className="absolute inset-1.5 rounded-t-[45%] rounded-b-[35%] bg-[#0f0803] flex justify-center overflow-hidden">
      <div className="w-[1px] h-full bg-white/5" />
      {active && (
        <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute top-1/2 w-1 h-1/2 bg-[#FFD700] blur-[1px] rounded-full" />
      )}
    </div>
  </div>
);

const AwaleSeed = ({ highlighted = false }) => (
  <div className={`w-2.5 h-2.5 rounded-full shadow-inner ${highlighted ? 'bg-[#FFD700]' : 'bg-[#4a2e15]'}`} 
       style={{ boxShadow: 'inset -1px -1px 2px rgba(0,0,0,0.6)' }} />
);

// --- COMPOSANT PRINCIPAL ---

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
    "L'Okpèlè guide le choix des semences selon les signes d'Ifá.",
    "L'Awalé simule la gestion stratégique des réserves.",
    "La Jarre Sato abrite l'écho des ancêtres fondateurs."
  ];

  useEffect(() => {
    if (timeLeft <= 0 || showExplanation || isFinished) return;
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showExplanation, isFinished]);

  const handleDragEnd = (event: any, info: any, id: string) => {
    const thresholdY = typeof window !== 'undefined' ? window.innerHeight * 0.4 : 300;
    if (info.point.y < thresholdY) {
      if (id === 'B') {
        const newHoles = holes.slice(1);
        setHoles(newHoles); 
        setShowExplanation(true);
        if (newHoles.length === 0) {
          setTimeout(() => { setShowExplanation(false); setIsFinished(true); }, 2500);
        }
      } else {
        setIsWrong(true);
        setAwaleSeeds(p => Math.max(0, p - 1));
        setTimeout(() => setIsWrong(false), 500);
      }
    }
  };

  const activeNoix = Math.ceil(timeLeft / 8);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center p-4 font-sans">
      
      <main className="w-full max-w-5xl flex flex-col items-center mt-12">
        
        {/* L'ARENE : ALIGNEMENT ET PROPORTIONS HARMONISÉES */}
        <div className="w-full flex items-center justify-center gap-6 md:gap-20 h-[320px] md:h-[380px] mb-12">
          
          {/* OKPÈLÈ (HAUTEUR FIXE) */}
          <div className="flex gap-2 md:gap-4 h-[120px] md:h-[150px] items-center">
            <div className="flex flex-col gap-2">
              {[...Array(4)].map((_, i) => <OkpeleSeed key={i} active={activeNoix > i} />)}
            </div>
            <div className="flex flex-col gap-2">
              {[...Array(4)].map((_, i) => <OkpeleSeed key={i} active={activeNoix > i + 4} />)}
            </div>
          </div>

          {/* JARRE SATO (TRAPUE - RESTAURÉE) */}
          <div className="relative w-[220px] h-[260px] md:w-[280px] md:h-[320px] shrink-0">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 md:w-40 h-8 md:h-10 bg-[#3d1810] rounded-[50%] border-4 border-[#a0412d]/20 z-10 shadow-lg" />
            <div className="absolute inset-0 mt-3 overflow-hidden" 
                 style={{ 
                   background: `linear-gradient(165deg, ${jarColor} 0%, #7a2a1b 100%)`,
                   borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
                   boxShadow: 'inset -12px -12px 25px rgba(0,0,0,0.4), inset 10px 10px 25px rgba(255,255,255,0.1), 0 25px 50px -12px rgba(0,0,0,0.3)'
                 }}>
              <div className="relative w-full h-full p-6">
                <AnimatePresence>
                  {holes.map((h) => (
                    <motion.div key={h} exit={{ scale: 0, opacity: 0 }}
                      className={`absolute rounded-full bg-[#120604] shadow-[inset_0_4px_10px_rgba(0,0,0,0.9)] border border-white/5
                        ${h === 0 ? 'top-[35%] left-[20%] w-12 h-12 md:w-16 md:h-16' : ''}
                        ${h === 1 ? 'top-[30%] left-[58%] w-10 h-10 md:w-14 md:h-14' : ''}
                        ${h === 2 ? 'top-[62%] left-[42%] w-14 h-14 md:w-20 md:h-20' : ''}
                        ${h === 3 ? 'top-[55%] left-[72%] w-8 h-8 md:w-12 md:h-12' : ''}
                      `} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AWALÉ (RÉDUIT - MÊME TAILLE QUE OKPÈLÈ - SANS OMBRE) */}
          <motion.div animate={isWrong ? { x: [-4, 4, -4, 4, 0] } : {}} 
                      className="flex gap-2 p-3 rounded-[1.5rem] border-b-4 h-[120px] md:h-[150px] items-center"
                      style={{ background: jarColor, borderColor: '#3d1810' }}>
            <div className="grid grid-cols-1 gap-1.5 pr-2 border-r border-black/20">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 md:w-10 md:h-10 bg-black/30 rounded-full flex items-center justify-center gap-1">
                  <AwaleSeed highlighted={awaleSeeds > i * 2} />
                  <AwaleSeed highlighted={awaleSeeds > i * 2 + 1} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-1.5 pl-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 md:w-10 md:h-10 bg-black/30 rounded-full flex items-center justify-center gap-1">
                  <AwaleSeed highlighted={awaleSeeds > (i+4)*2} />
                  <AwaleSeed highlighted={awaleSeeds > (i+4)*2+1} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* SECTION QUIZ */}
        <div className="w-full max-w-2xl px-4">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-bold mb-8 text-center text-gray-800">
                  Quelle est la fonction principale du tambour Sato ?
                </h2>
                
                <div className="flex gap-8 mb-10 items-center bg-gray-50/50 py-2 px-8 rounded-full border border-gray-100">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Temps</span>
                    <span className={`font-black ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-[#a0412d]'}`}>{timeLeft}s</span>
                  </div>
                  <div className="w-[1px] h-6 bg-gray-200" />
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Graines</span>
                    <span className="text-[#a0412d] font-black italic">{awaleSeeds}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <motion.div
                      key={id} drag dragSnapToOrigin
                      onDragEnd={(e, info) => handleDragEnd(e, info, id)}
                      whileDrag={{ scale: 1.05, zIndex: 50 }}
                      className="cursor-grab active:cursor-grabbing p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center group transition-all"
                    >
                      <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] mr-4 shrink-0 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">{id}</span>
                      <span className="font-semibold text-gray-700">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </motion.div>
                  ))}
                </div>
                <p className="mt-6 text-[10px] text-gray-300 font-bold uppercase tracking-widest animate-pulse">
                  ↑ Glissez la réponse vers la jarre ↑
                </p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setShowExplanation(false)} 
                          className="p-10 bg-white border border-[#a0412d]/10 rounded-[2.5rem] text-center shadow-2xl cursor-pointer">
                <p className="text-[#1A1A1A] text-lg font-medium italic italic">"Le Sato est un tambour sacré dont les vibrations purifient les récoltes."</p>
                <div className="mt-8 text-[9px] text-gray-300 font-bold tracking-widest uppercase">Toucher pour continuer</div>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center py-6">
              <h2 className="text-3xl font-black mb-10 uppercase text-[#1A1A1A] italic tracking-tighter">Initiation Réussie</h2>
              
              <div className="w-full bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {revelations.map((text, i) => (
                    <div key={i} className="text-xs font-medium text-gray-600 flex items-start p-4 bg-gray-50/50 rounded-xl">
                      <span className="text-[#a0412d] mr-3 mt-0.5 opacity-70">✦</span> {text}
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-gray-100 text-center">
                  <p className="text-base font-bold text-[#1A1A1A]">L'écho du passé forge votre futur.</p>
                  <p className="text-xs text-gray-400 mt-2 px-4 italic leading-relaxed">Le savoir est une graine, continuez votre quête pour qu'elle devienne une forêt.</p>
                </div>
              </div>
              
              <button className="px-12 py-4 bg-[#a0412d] text-white rounded-full font-bold shadow-lg uppercase tracking-[0.2em] text-[10px]">
                Partager mon initiation
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}