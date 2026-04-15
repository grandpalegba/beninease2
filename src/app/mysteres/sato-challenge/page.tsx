"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SatoChallengePage() {
  const TOTAL_TIME = 64;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  
  // Initialisation avec 2 graines par trou (16 au total)
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
      // Mauvaise réponse : une graine disparaît d'un trou (décompte des 16 chances)
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
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center justify-center font-sans p-6">
      
      <main className="w-full max-w-5xl flex flex-col items-center">
        
        {/* TRIADE SYMÉTRIQUE */}
        <div className="w-full flex justify-between items-center mb-24 px-10">
          
          {/* OKPELE (Gauche) */}
          <div className="relative w-24 scale-90">
            <div className="flex gap-6 pt-4">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-4">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="relative w-8 h-11 bg-[#5d3a1a] rounded-[40%] shadow-md border-b-2 border-black/30 flex justify-center overflow-hidden">
                      <div className="w-[1px] h-full bg-black/30"></div>
                      <AnimatePresence>
                        {isNoixActive(col, row) && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex justify-center items-center">
                            <div className="w-[2px] h-[65%] bg-[#ffd700] shadow-[0_0_8px_#ffae00] rounded-full"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* JARRE SATO (Centre) */}
          <div className="relative w-56 h-72 drop-shadow-2xl">
            <div className="absolute inset-0"
              style={{
                borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
                background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
                boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.2), 0 15px 35px rgba(0,0,0,0.1)'
              }}>
              <div className="relative w-full h-full">
                <div className="absolute top-[35%] left-[25%] w-10 h-10 rounded-full bg-[#2a100a] shadow-inner"></div>
                <div className="absolute top-[30%] left-[55%] w-8 h-8 rounded-full bg-[#2a100a] shadow-inner"></div>
                <div className="absolute top-[55%] left-[40%] w-12 h-12 rounded-full bg-[#2a100a] shadow-inner"></div>
                <div className="absolute top-[48%] left-[70%] w-7 h-7 rounded-full bg-[#2a100a] shadow-inner"></div>
              </div>
            </div>
          </div>

          {/* AWALÉ VERTICAL (Droite) */}
          <div className="relative flex bg-[#3d1810] p-3 rounded-xl shadow-xl border-2 border-[#2a100a] scale-90">
            {/* Colonne Gauche (4 trous) */}
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 bg-black/50 rounded-full shadow-inner border border-black/20 flex items-center justify-center gap-1">
                  {[...Array(awaleBoard[i])].map((_, s) => (
                    <motion.div key={s} layoutId={`seed-${i}-${s}`} className="w-2.5 h-2.5 rounded-full bg-[#ffd700] shadow-[0_0_5px_#ffae00]" />
                  ))}
                </div>
              ))}
            </div>

            {/* SÉPARATION VERTICALE RÉALISTE */}
            <div className="mx-2 w-[2px] bg-gradient-to-b from-transparent via-[#2a100a] to-transparent self-stretch"></div>

            {/* Colonne Droite (4 trous) */}
            <div className="flex flex-col gap-3">
              {[4, 5, 6, 7].map(i => (
                <div key={i} className="w-10 h-10 bg-black/50 rounded-full shadow-inner border border-black/20 flex items-center justify-center gap-1">
                  {[...Array(awaleBoard[i])].map((_, s) => (
                    <motion.div key={s} layoutId={`seed-${i}-${s}`} className="w-2.5 h-2.5 rounded-full bg-[#ffd700] shadow-[0_0_5px_#ffae00]" />
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CONTENU TEXTUEL */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[#303333] mb-6">
            Quelle est la fonction principale du tambour Sato lors des rites agraires ?
          </h2>
          <div className="text-[#a0412d] font-mono text-xs tracking-widest bg-[#faf9f8] px-5 py-2 rounded-full border border-[#a0412d]/10 inline-block uppercase">
            {timeLeft}s restantes • {awaleBoard.reduce((a, b) => a + b, 0)} graines sacrées
          </div>
        </div>

        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
          {['Purifier les récoltes', 'Appeler la pluie', 'Célébrer les mariages', 'Guérir les malades'].map((text, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(String.fromCharCode(65 + i))}
              className={`p-5 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center text-left hover:border-[#a0412d]/30 transition-all ${selectedAnswer === String.fromCharCode(65 + i) ? 'bg-[#faf9f8] border-[#a0412d]/40' : ''}`}
            >
              <span className="w-8 h-8 rounded-full bg-[#faf9f8] flex items-center justify-center font-bold text-[#a0412d] text-xs mr-4 border border-[#a0412d]/5">
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