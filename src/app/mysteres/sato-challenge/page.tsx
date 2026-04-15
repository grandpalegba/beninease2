"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SatoChallengePage() {
  const TOTAL_TIME = 64;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const isNoixActive = (col: number, row: number) => {
    const index = col === 0 ? row + 1 : row + 5;
    const threshold = (8 - index + 1) * 8;
    return timeLeft > (TOTAL_TIME - threshold);
  };

  return (
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center justify-center overflow-hidden font-sans">
      
      <main className="w-full max-w-6xl px-6 flex flex-col items-center">
        
        <div className="relative w-full flex justify-center items-end gap-24 mb-16 h-80">
          
          {/* OKPELE VERSION MINIATURE */}
          <div className="relative mb-4 scale-75 origin-bottom"> 
            {/* La Chaîne Dorée ajustée */}
            <svg className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-[110px] h-[280px] pointer-events-none z-0" fill="none">
              <path 
                d="M 30 30 Q 55 0 80 30" 
                stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 4"
                className="drop-shadow-[0_0_2px_rgba(218,165,32,0.6)]"
              />
              <line x1="30" y1="30" x2="30" y2="250" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="1 4" />
              <line x1="80" y1="30" x2="80" y2="250" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="1 4" />
            </svg>

            <div className="flex gap-10 relative z-10">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-4 pt-8">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="relative w-9 h-12 bg-[#5d3a1a] rounded-[45%_45%_50%_50%] shadow-lg flex justify-center overflow-hidden border-b-[3px] border-black/30">
                      <div className="w-[1px] h-full bg-black/40"></div>
                      
                      <AnimatePresence>
                        {isNoixActive(col, row) && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute inset-0 flex justify-center items-center"
                          >
                            <div className="w-[2.5px] h-[70%] bg-[#ffd700] shadow-[0_0_8px_#ffae00,0_0_3px_white] rounded-full"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* JARRE SATO (Taille conservée pour le focus) */}
          <div className="relative w-64 h-[320px] drop-shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-9 bg-[#3d1810] rounded-[50%] shadow-[inset_0_4px_8px_rgba(0,0,0,0.5)] border-4 border-[#a0412d]/20 z-0"></div>
            <div className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center"
              style={{
                borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
                background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
                boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.15)'
              }}>
              <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black/30 to-transparent"></div>
              <div className="relative w-full h-full">
                <div className="absolute top-[40%] left-[25%] w-12 h-12 rounded-full bg-[#2a100a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6)] border border-black/10"></div>
                <div className="absolute top-[32%] left-[58%] w-10 h-10 rounded-full bg-[#2a100a] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6)] border border-black/10"></div>
                <div className="absolute top-[62%] left-[40%] w-14 h-14 rounded-full bg-[#2a100a] shadow-[inset_5px_5px_10px_rgba(0,0,0,0.6)] border border-black/10"></div>
                <div className="absolute top-[48%] left-[72%] w-8 h-8 rounded-full bg-[#2a100a] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)] border border-black/10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* QUESTION ET TIMER */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-[#303333] mb-4 max-w-2xl mx-auto leading-snug">
            Quelle est la fonction principale du tambour Sato lors des rites agraires ?
          </h2>
          <div className="inline-block px-4 py-1 bg-[#faf9f8] rounded-full border border-[#a0412d]/10">
             <span className="text-[#a0412d] font-mono font-bold uppercase tracking-widest text-[10px]">
              Temps restant : {timeLeft}s
            </span>
          </div>
        </div>

        {/* RÉPONSES MINIMALISTES */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-3">
          {['Purifier les récoltes', 'Appeler la pluie', 'Célébrer les mariages', 'Guérir les malades'].map((text, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.01, backgroundColor: '#fdfcfb' }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all text-left"
            >
              <span className="w-9 h-9 rounded-full bg-[#faf9f8] flex items-center justify-center font-bold text-[#a0412d] text-sm shadow-sm mr-4">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-base font-medium">{text}</span>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
}