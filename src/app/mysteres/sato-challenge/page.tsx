"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SatoChallengePage() {
  const TOTAL_TIME = 64;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  
  // 2 graines par trou (16 chances au total)
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
      // Une graine disparaît en cas de mauvaise réponse
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
        
        {/* SECTION INSTRUMENTS : OKPELE | JARRE | AWALE */}
        <div className="w-full flex justify-between items-center mb-24 px-10">
          
          {/* 1. OKPELE AVEC CHAÎNE DORÉE */}
          <div className="relative w-32 scale-95 flex flex-col items-center">
            {/* La Chaîne Dorée supérieure */}
            <svg className="w-20 h-10 mb-[-10px] z-0" viewBox="0 0 100 40">
              <path 
                d="M 10 40 Q 50 0 90 40" 
                stroke="#FFD700" 
                strokeWidth="3" 
                fill="none" 
                strokeLinecap="round"
                strokeDasharray="1 4"
              />
            </svg>
            
            <div className="flex gap-8 relative z-10">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-4">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="relative w-9 h-12 bg-[#5d3a1a] rounded-[45%_45%_50%_50%] shadow-md border-b-2 border-black/30 flex justify-center overflow-hidden">
                      <div className="w-[1.5px] h-full bg-black/30"></div>
                      <AnimatePresence>
                        {isNoixActive(col, row) && (
                          <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 flex justify-center items-center"
                          >
                            {/* Couleur harmonisée avec les graines de l'Awalé */}
                            <div className="w-[3px] h-[70%] bg-[#FFD700] shadow-[0_0_10px_#FFD700] rounded-full"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 2. JARRE SATO CENTRÉE (COL RESTAURÉ) */}
          <div className="relative w-64 h-80 drop-shadow-2xl">
            {/* Le haut/col de la jarre */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-36 h-8 bg-[#8b3422] rounded-[50%] border-t-4 border-[#7a2a1b] z-10 shadow-inner overflow-hidden">
               <div className="w-full h-full bg-black/40"></div>
            </div>
            
            <div className="absolute inset-0 z-0"
              style={{
                borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
                background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
                boxShadow: 'inset -10px -10px 25px rgba(0,0,0,0.3), 0 20px 40px rgba(0,0,0,0.15)'
              }}>
              <div className="relative w-full h-full">
                <div className="absolute top-[35%] left-[25%] w-12 h-12 rounded-full bg-[#2a100a] shadow-[inset_2px_2px_8px_black]"></div>
                <div className="absolute top-[30%] left-[58%] w-10 h-10 rounded-full bg-[#2a100a] shadow-[inset_2px_2px_8px_black]"></div>
                <div className="absolute top-[60%] left-[42%] w-14 h-14 rounded-full bg-[#2a100a] shadow-[inset_2px_2px_8px_black]"></div>
                <div className="absolute top-[52%] left-[72%] w-9 h-9 rounded-full bg-[#2a100a] shadow-[inset_2px_2px_8px_black]"></div>
              </div>
            </div>
          </div>

          {/* 3. AWALÉ VERTICAL (GRAINES DORÉES) */}
          <div className="relative flex bg-[#3d1810] p-4 rounded-2xl shadow-xl border-2 border-[#2a100a] scale-95 items-stretch">
            {/* Colonne Gauche (4 trous) */}
            <div className="flex flex-col gap-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-11 h-11 bg-black/60 rounded-full shadow-inner border border-black/30 flex items-center justify-center gap-1 px-1">
                  {[...Array(awaleBoard[i])].map((_, s) => (
                    <motion.div 
                      key={s} 
                      layout 
                      className="w-3 h-3 rounded-full bg-[#FFD700] shadow-[0_0_6px_#FFD700]" 
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Séparation verticale */}
            <div className="mx-3 w-[2px] bg-gradient-to-b from-transparent via-[#2a100a] to-transparent"></div>

            {/* Colonne Droite (4 trous) */}
            <div className="flex flex-col gap-4">
              {[4, 5, 6, 7].map(i => (
                <div key={i} className="w-11 h-11 bg-black/60 rounded-full shadow-inner border border-black/30 flex items-center justify-center gap-1 px-1">
                  {[...Array(awaleBoard[i])].map((_, s) => (
                    <motion.div 
                      key={s} 
                      layout 
                      className="w-3 h-3 rounded-full bg-[#FFD700] shadow-[0_0_6px_#FFD700]" 
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUESTION ET RÉPONSES */}
        <div className="text-center mb-12 max-w-2xl">
          <h2 className="text-2xl font-bold text-[#303333] mb-6 leading-tight">
            Quelle est la fonction principale du tambour Sato lors des rites agraires ?
          </h2>
          <div className="inline-flex items-center gap-3 bg-[#faf9f8] px-6 py-2 rounded-full border border-[#a0412d]/10">
            <span className="text-[#a0412d] font-mono font-bold text-xs uppercase tracking-widest">{timeLeft}S</span>
            <div className="w-[1px] h-4 bg-gray-200"></div>
            <span className="text-[#303333] font-mono text-xs uppercase tracking-widest">
              {awaleBoard.reduce((a, b) => a + b, 0)} Graines Restantes
            </span>
          </div>
        </div>

        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
          {[
            { id: 'A', text: 'Purifier les récoltes' },
            { id: 'B', text: 'Appeler la pluie' },
            { id: 'C', text: 'Célébrer les mariages' },
            { id: 'D', text: 'Guérir les malades' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleAnswer(item.id)}
              className={`p-6 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center text-left hover:border-[#a0412d]/30 transition-all group ${selectedAnswer === item.id ? 'bg-[#faf9f8] border-[#a0412d]/40 ring-1 ring-[#a0412d]/10' : ''}`}
            >
              <span className="w-8 h-8 rounded-full bg-[#faf9f8] flex items-center justify-center font-bold text-[#a0412d] text-xs mr-4 border border-[#a0412d]/5 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">
                {item.id}
              </span>
              <span className="text-sm font-semibold">{item.text}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}