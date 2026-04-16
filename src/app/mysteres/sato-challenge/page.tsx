"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPOSANTS DE DESIGN (RECONSTRUITS SELON TES CODES) ---

const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className="flex flex-col items-center">
    <div 
      className={`w-10 h-12 shadow-md relative overflow-hidden ring-1 ring-black/5 transition-all duration-500`}
      style={{ 
        backgroundColor: '#833321', 
        borderRadius: '50% 50% 45% 45% / 70% 70% 30% 30%', // pear-seed-inverted
        opacity: active ? 1 : 0.4
      }}
    >
      <div className={`absolute inset-0 ${active ? 'bg-gradient-to-br from-white/20 to-black/30' : 'bg-black/20'}`} />
      {active && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-7 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15,0_0_4px_#facc15]" 
        />
      )}
    </div>
  </div>
);

const SatoJar = ({ holesCount }: { holesCount: number[] }) => (
  <div className="relative w-56 h-72 md:w-64 md:h-80 shrink-0">
    {/* Lip of the jar */}
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#3d1810] rounded-[50%] shadow-inner border-2 border-[#a0412d]/20 z-10" />
    
    {/* Body of the jar (clay-texture + organic-shape) */}
    <div className="absolute inset-0 overflow-hidden" 
         style={{ 
           background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
           borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
           boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.15)'
         }}>
      <div className="absolute top-0 w-full h-12 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="relative w-full h-full">
        <AnimatePresence>
          {holesCount.map((hIdx) => (
            <motion.div 
              key={hIdx}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.9, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className={`absolute rounded-full bg-[#2a100a] shadow-inner
                ${hIdx === 0 ? 'top-[35%] left-[25%] w-10 h-10' : ''}
                ${hIdx === 1 ? 'top-[28%] left-[55%] w-8 h-8' : ''}
                ${hIdx === 2 ? 'top-[58%] left-[38%] w-12 h-12' : ''}
                ${hIdx === 3 ? 'top-[52%] left-[68%] w-7 h-7' : ''}
              `} 
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

const AwaleBoard = ({ seedsCount, isWrong }: { seedsCount: number, isWrong: boolean }) => (
  <motion.div 
    animate={isWrong ? { x: [-2, 2, -2, 2, 0] } : {}}
    className="relative w-48 bg-[#833321] rounded-[2.5rem] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.3)] flex flex-col items-center gap-4 border-4 border-[#652719] shrink-0"
  >
    <div className="absolute left-1/2 top-8 bottom-8 w-[1.5px] bg-black/20 -translate-x-1/2 z-0 rounded-full" />
    <div className="grid grid-cols-2 gap-x-4 gap-y-4 z-10">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="w-14 h-14 bg-[#652719] rounded-full shadow-inner flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="flex gap-0.5 flex-wrap justify-center p-2">
             {seedsCount > i * 2 && (
               <div className="w-3.5 h-3.5 rounded-full" 
                    style={{ background: 'radial-gradient(circle at 30% 30%, #FFEB3B, #FBC02D)', boxShadow: '0 0 6px rgba(255, 235, 59, 0.4)' }} />
             )}
             {seedsCount > i * 2 + 1 && (
               <div className="w-3.5 h-3.5 rounded-full" 
                    style={{ background: 'radial-gradient(circle at 30% 30%, #FFEB3B, #FBC02D)', boxShadow: '0 0 6px rgba(255, 235, 59, 0.4)' }} />
             )}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- MAIN PAGE ---

export default function SatoRitualPage() {
  const [timeLeft, setTimeLeft] = useState(64);
  const [holes, setHoles] = useState([0, 1, 2, 3]);
  const [seeds, setSeeds] = useState(16);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || isFinished || showExplanation) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished, showExplanation]);

  const activeOkpeleSeeds = Math.ceil(timeLeft / 8);

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      const newHoles = holes.slice(1);
      setHoles(newHoles);
      setShowExplanation(true);
      if (newHoles.length === 0) {
        setTimeout(() => { setShowExplanation(false); setIsFinished(true); }, 2000);
      }
    } else {
      setIsWrong(true);
      setSeeds(s => Math.max(0, s - 2));
      setTimeout(() => setIsWrong(false), 400);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center justify-center p-6 font-sans">
      
      {/* ARENA : L'ALIGNEMENT HORIZONTAL PRÉCIS */}
      <div className="w-full max-w-6xl flex flex-row items-center justify-center gap-4 md:gap-16 mb-16 h-[400px]">
        
        {/* OKPÈLÈ (Gauche) */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-12 border-t-[3px] border-x-[3px] border-yellow-600/50 rounded-t-full mb-2" />
          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5">
              {[...Array(4)].map((_, i) => <OkpeleSeed key={i} active={activeOkpeleSeeds > i} />)}
            </div>
            <div className="flex flex-col gap-1.5">
              {[...Array(4)].map((_, i) => <OkpeleSeed key={i+4} active={activeOkpeleSeeds > i + 4} />)}
            </div>
          </div>
        </div>

        {/* JARRE SATO (Centre) */}
        <SatoJar holesCount={holes} />

        {/* AWALÉ (Droite) */}
        <AwaleBoard seedsCount={seeds} isWrong={isWrong} />
      </div>

      {/* INTERFACE DE JEU (STYLE MINIMALISTE) */}
      <div className="w-full max-w-2xl">
        {!isFinished ? (
          !showExplanation ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-8 tracking-tight">Quelle est la fonction du tambour Sato ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'A', text: "Appeler la pluie", correct: false },
                  { id: 'B', text: "Purifier les récoltes", correct: true },
                  { id: 'C', text: "Marier les initiés", correct: false },
                  { id: 'D', text: "Déclarer la guerre", correct: false }
                ].map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => handleAnswer(opt.correct)}
                    className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center group"
                  >
                    <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] mr-4 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">
                      {opt.id}
                    </span>
                    <span className="font-semibold text-gray-600">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => setShowExplanation(false)}
              className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 text-center cursor-pointer shadow-xl"
            >
              <p className="text-lg italic font-medium">"Correct. Les vibrations du Sato purifient la terre et les premières récoltes."</p>
              <div className="mt-4 text-[10px] uppercase tracking-widest text-gray-400">Cliquez pour continuer l'initiation</div>
            </motion.div>
          )
        ) : (
          <div className="text-center py-10">
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter italic">Rituel Accompli</h2>
            <div className="h-1 w-20 bg-[#a0412d] mx-auto mb-8" />
            <button className="px-10 py-4 bg-[#a0412d] text-white rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg">
              Voir mon score de Sagesse
            </button>
          </div>
        )}
      </div>

      {/* AMBIANCE SUBTILE (BACKDROP) */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#a0412d]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  );
}