"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SatoChallengePage() {
  const TOTAL_TIME = 64;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  
  // 16 graines sacrées (2 par trou)
  const [awaleBoard, setAwaleBoard] = useState<number[]>(Array(8).fill(2));
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (id: string) => {
    setSelectedAnswer(id);
    if (id !== 'B') {
      setAwaleBoard(prev => {
        const nextBoard = [...prev];
        for (let i = 0; i < nextBoard.length; i++) {
          if (nextBoard[i] > 0) {
            nextBoard[i] -= 1;
            break; 
          }
        }
        return nextBoard;
      });
    }
  };

  const isNoixActive = (col: number, row: number) => {
    const index = col === 0 ? row + 1 : row + 5;
    return timeLeft > (TOTAL_TIME - (8 - index + 1) * 8);
  };

  return (
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center justify-center font-sans p-6 overflow-hidden">
      
      {/* Background Bloom (Stitch style) */}
      <div className="absolute w-[500px] h-[500px] bg-[#a0412d]/5 rounded-full blur-[100px] -z-20"></div>

      <main className="w-full max-w-5xl flex flex-col items-center">
        
        {/* SECTION INSTRUMENTS */}
        <div className="w-full flex justify-between items-center mb-20 px-10">
          
          {/* 1. OKPELE (Corrigé : base fine en haut, chaîne passante) */}
          <div className="relative w-32 flex flex-col items-center scale-95">
            {/* Chaîne dorée passante entre les noix */}
            <svg className="w-24 h-12 mb-[-15px] z-0" viewBox="0 0 100 40">
              <path 
                d="M 20 40 Q 50 10 80 40" 
                stroke="#FFD700" 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinecap="round"
                strokeDasharray="1 3"
              />
            </svg>
            
            <div className="flex gap-8 relative z-10">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-4 items-center">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} 
                      className="relative w-9 h-12 bg-[#5d3a1a] shadow-md flex justify-center overflow-hidden"
                      style={{ 
                        borderRadius: '35% 35% 50% 50% / 15% 15% 85% 85%', // Base fine en haut
                        borderBottom: '2px solid rgba(0,0,0,0.4)'
                      }}
                    >
                      <div className="w-[1px] h-full bg-black/20"></div>
                      <AnimatePresence>
                        {isNoixActive(col, row) && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex justify-center items-center">
                            {/* Jaune doré */}
                            <div className="w-[3px] h-[70%] bg-[#FFD700] shadow-[0_0_12px_#FFD700] rounded-full"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 2. JARRE SATO (Modèle Stitch à la lettre) */}
          <div className="relative w-72 h-[360px] z-10">
            {/* Lip / Haut fin de la jarre */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-40 h-10 bg-[#3d1810] rounded-[50%] shadow-inner border-4 border-[#a0412d]/20 z-0"></div>
            
            {/* Body of the jar (Clay Texture & Organic Shape) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
                borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
                boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.15)'
              }}>
              <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black/25 to-transparent"></div>
              
              {/* Decorative Circles / Holes */}
              <div className="relative w-full h-full">
                <div className="absolute top-[40%] left-[25%] w-14 h-14 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"></div>
                <div className="absolute top-[32%] left-[58%] w-12 h-12 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"></div>
                <div className="absolute top-[62%] left-[40%] w-16 h-16 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"></div>
                <div className="absolute top-[55%] left-[72%] w-10 h-10 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"></div>
              </div>
            </div>
          </div>

          {/* 3. AWALE VERTICAL (Graines Jaune Doré) */}
          <div className="relative flex bg-[#3d1810] p-4 rounded-2xl shadow-xl border-2 border-[#2a100a] scale-95">
            <div className="flex flex-col gap-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-11 h-11 bg-black/60 rounded-full shadow-inner border border-black/30 flex items-center justify-center gap-1">
                  {[...Array(awaleBoard[i])].map((_, s) => (
                    <div key={s} className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />
                  ))}
                </div>
              ))}
            </div>
            <div className="mx-3 w-[2px] bg-gradient-to-b from-transparent via-[#2a100a] to-transparent"></div>
            <div className="flex flex-col gap-4">
              {[4, 5, 6, 7].map(i => (
                <div key={i} className="w-11 h-11 bg-black/60 rounded-full shadow-inner border border-black/30 flex items-center justify-center gap-1">
                  {[...Array(awaleBoard[i])].map((_, s) => (
                    <div key={s} className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUESTIONS */}
        <div className="text-center mb-12 max-w-2xl">
          <h2 className="text-2xl font-bold text-[#303333] mb-8 leading-tight">
            Quelle est la fonction principale du tambour Sato lors des rites agraires ?
          </h2>
          <div className="inline-flex items-center gap-3 bg-[#faf9f8] px-6 py-2 rounded-full border border-[#a0412d]/10 font-mono text-xs uppercase tracking-widest text-[#a0412d]">
            TEMPS RESTANT : {timeLeft}S
          </div>
        </div>

        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Purifier les récoltes', 'Appeler la pluie', 'Célébrer les mariages', 'Guérir les malades'].map((text, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(String.fromCharCode(65 + i))}
              className={`p-6 bg-white border rounded-xl shadow-sm flex items-center text-left hover:border-[#a0412d]/30 transition-all ${selectedAnswer === String.fromCharCode(65 + i) ? 'bg-[#faf9f8] border-[#a0412d]/40 ring-1 ring-[#a0412d]/10' : 'border-gray-100'}`}
            >
              <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-xs mr-4 border border-[#a0412d]/5">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm font-semibold">{text}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}