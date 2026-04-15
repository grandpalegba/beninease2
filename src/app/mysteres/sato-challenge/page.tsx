"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SatoChallengePage() {
  const TOTAL_TIME = 64;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showExplanation, setShowExplanation] = useState(false);
  const [holes, setHoles] = useState([0, 1, 2, 3]); 
  const [awaleSeeds, setAwaleSeeds] = useState(8); 
  const [isWrong, setIsWrong] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || showExplanation) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showExplanation]);

  const handleDrop = (answerId: string) => {
    if (answerId === 'B') {
      // SUCCÈS : On bouche un trou et on affiche l'explication
      setHoles(prev => prev.slice(1)); 
      setShowExplanation(true);
    } else {
      // ERREUR : Shake de l'awalé et perte d'une graine
      setIsWrong(true);
      setAwaleSeeds(prev => Math.max(0, prev - 1));
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setTimeLeft(TOTAL_TIME);
  };

  return (
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center justify-center font-sans p-6 overflow-hidden">
      <main className="w-full max-w-5xl flex flex-col items-center">
        
        {/* SECTION INSTRUMENTS (DESIGN FIGÉ & SANCTUARISÉ) */}
        <div className="w-full flex justify-between items-center mb-20 px-10 h-[400px]">
          
          {/* 1. OKPELE */}
          <div className="relative w-36 flex flex-col items-center scale-[0.85] origin-center">
            <svg className="absolute -top-12 w-28 h-16 z-0" viewBox="0 0 100 60">
              <path d="M 15 60 Q 50 5 85 60" stroke="#FFD700" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="1 3" />
            </svg>
            <div className="flex gap-8 relative z-10">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-3 items-center">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="relative w-8 h-11 bg-[#5d3a1a] shadow-md rounded-full border-b-2 border-black/40">
                       <div className="w-[1px] h-full bg-black/20 mx-auto" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 2. JARRE SATO */}
          <div className="relative w-72 h-[360px] z-10">
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(165deg, #a0412d 0%, #7a2a1b 100%)',
                borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
              }}>
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {holes.includes(0) && <motion.div key="h0" exit={{ opacity: 0, scale: 0 }} className="absolute top-[40%] left-[25%] w-14 h-14 rounded-full bg-[#2a100a] shadow-inner" />}
                  {holes.includes(1) && <motion.div key="h1" exit={{ opacity: 0, scale: 0 }} className="absolute top-[32%] left-[58%] w-12 h-12 rounded-full bg-[#2a100a] shadow-inner" />}
                  {holes.includes(2) && <motion.div key="h2" exit={{ opacity: 0, scale: 0 }} className="absolute top-[62%] left-[40%] w-16 h-16 rounded-full bg-[#2a100a] shadow-inner" />}
                  {holes.includes(3) && <motion.div key="h3" exit={{ opacity: 0, scale: 0 }} className="absolute top-[55%] left-[72%] w-10 h-10 rounded-full bg-[#2a100a] shadow-inner" />}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 3. AWALÉ */}
          <motion.div 
            animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative flex bg-[#3d1810] p-3 rounded-2xl shadow-xl border-2 border-[#2a100a] scale-[0.85] origin-center"
          >
            {[0, 1].map((col) => (
              <React.Fragment key={col}>
                <div className="flex flex-col gap-3">
                  {[0, 1, 2, 3].map(row => {
                    const idx = col === 0 ? row : row + 4;
                    return (
                      <div key={row} className="w-10 h-10 bg-black/60 rounded-full shadow-inner flex items-center justify-center">
                        {awaleSeeds > idx && <div className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
                      </div>
                    );
                  })}
                </div>
                {col === 0 && <div className="mx-2.5 w-[1.5px] bg-gradient-to-b from-transparent via-[#2a100a] to-transparent" />}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* INTERACTION : DRAG AND DROP */}
        <div className="w-full max-w-3xl flex flex-col items-center min-h-[300px]">
          {!showExplanation ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-8 text-center leading-tight text-[#303333]">
                Quelle est la fonction principale du tambour Sato lors des rites agraires ?
              </h2>
              <div className="mb-8 px-6 py-2 rounded-full border border-[#a0412d]/10 font-mono text-xs uppercase tracking-widest text-[#a0412d]">
                TEMPS RESTANT : {timeLeft}S
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                {['A', 'B', 'C', 'D'].map((id) => (
                  <motion.div
                    key={id}
                    drag
                    dragSnapToOrigin
                    onDragEnd={(_, info) => {
                      // Détection du drop sur la jarre (zone centrale approximative)
                      if (Math.abs(info.point.y - 300) < 200) handleDrop(id);
                    }}
                    className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-[#a0412d]/30 transition-all flex items-center select-none"
                  >
                    <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-xs mr-4">{id}</span>
                    <span className="text-sm font-semibold">
                      {id === 'B' ? 'Purifier les récoltes' : id === 'A' ? 'Appeler la pluie' : id === 'C' ? 'Célébrer les mariages' : 'Guérir les malades'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* EXPLICATION APPRÈS BONNE RÉPONSE */
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              onClick={nextQuestion}
              className="w-full p-8 bg-[#faf9f8] rounded-2xl border border-[#a0412d]/20 cursor-pointer hover:shadow-lg transition-all text-center"
            >
              <h3 className="text-[#a0412d] font-bold text-lg mb-4">Bonne réponse !</h3>
              <p className="text-gray-700 leading-relaxed max-w-xl mx-auto mb-6">
                Le Sato est un tambour sacré dont les vibrations sont censées purifier les récoltes et appeler la protection des ancêtres avant la saison des pluies.
              </p>
              <div className="text-[#a0412d]/50 text-xs animate-pulse font-bold tracking-widest uppercase">Cliquer pour continuer ↓</div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}