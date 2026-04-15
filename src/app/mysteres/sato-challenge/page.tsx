"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SatoChallengePage() {
  const TOTAL_TIME = 64;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [awaleBoard, setAwaleBoard] = useState<number[]>(Array(8).fill(0));
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (id: string) => {
    setSelectedAnswer(id);
    if (id !== 'B') {
      // Sato sème 4 graines dorées (une dans chaque trou du haut 4-7)
      setAwaleBoard(prev => prev.map((v, i) => i >= 4 ? v + 1 : v));
    }
  };

  const isNoixActive = (col: number, row: number) => {
    const index = col === 0 ? row + 1 : row + 5;
    return timeLeft > (TOTAL_TIME - (8 - index + 1) * 8);
  };

  return (
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center justify-center overflow-hidden font-sans p-6">
      
      {/* Background Bloom */}
      <div className="absolute w-[600px] h-[600px] bg-[#a0412d]/5 rounded-full blur-[120px] -z-10"></div>

      <main className="w-full max-w-6xl flex flex-col items-center">
        
        {/* SECTION TRIADE : OKPELE | JARRE | AWALE */}
        <div className="relative w-full flex justify-between items-center mb-20 px-4">
          
          {/* 1. OKPELE (Ajusté en taille) */}
          <div className="relative w-32 flex justify-center scale-90">
            <svg className="absolute top-[-15px] w-[100px] h-[300px] pointer-events-none z-0" fill="none">
              <path d="M 25 30 Q 50 0 75 30" stroke="#FFD700" strokeWidth="2" strokeDasharray="1 4"/>
              <line x1="25" y1="30" x2="25" y2="280" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="1 4" />
              <line x1="75" y1="30" x2="75" y2="280" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="1 4" />
            </svg>
            <div className="flex gap-8 relative z-10 pt-8">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-4">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="relative w-9 h-12 bg-[#5d3a1a] rounded-[45%_45%_50%_50%] shadow-lg border-b-[3px] border-black/30 flex justify-center overflow-hidden">
                      <div className="w-[1px] h-full bg-black/40"></div>
                      <AnimatePresence>
                        {isNoixActive(col, row) && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex justify-center items-center">
                            <div className="w-[2.5px] h-[70%] bg-[#ffd700] shadow-[0_0_8px_#ffae00] rounded-full"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 2. JARRE SATO (CENTRÉE) */}
          <div className="relative w-64 h-80 drop-shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-9 bg-[#3d1810] rounded-[50%] border-4 border-[#a0412d]/20 z-0 shadow-inner"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
              style={{
                borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
                background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
                boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.15)'
              }}>
              <div className="relative w-full h-full">
                <div className="absolute top-[35%] left-[25%] w-12 h-12 rounded-full bg-[#2a100a] shadow-[inset_2px_2px_6px_black]"></div>
                <div className="absolute top-[28%] left-[58%] w-10 h-10 rounded-full bg-[#2a100a] shadow-[inset_2px_2px_6px_black]"></div>
                <div className="absolute top-[58%] left-[42%] w-14 h-14 rounded-full bg-[#2a100a] shadow-[inset_2px_2px_6px_black]"></div>
                <div className="absolute top-[50%] left-[72%] w-8 h-8 rounded-full bg-[#2a100a] shadow-[inset_2px_2px_6px_black]"></div>
              </div>
            </div>
          </div>

          {/* 3. AWALÉ (Ajusté aux dimensions de l'Okpele) */}
          <div className="relative w-32 p-3 bg-[#3d1810] rounded-2xl shadow-xl border-2 border-[#2a100a] flex flex-col gap-3 scale-90">
             {/* Rangée Sato (Haut) */}
             <div className="grid grid-cols-2 gap-3">
              {[7, 6, 5, 4].map(i => (
                <div key={i} className="w-10 h-10 bg-black/50 rounded-full shadow-inner border border-black/20 flex flex-wrap p-1 items-center justify-center gap-0.5">
                  {[...Array(awaleBoard[i])].map((_, seed) => (
                    <div key={seed} className="w-2 h-2 rounded-full bg-[#ffd700] shadow-[0_0_4px_#ffae00]"></div>
                  ))}
                </div>
              ))}
            </div>
            {/* Séparateur */}
            <div className="w-full h-[1px] bg-white/5"></div>
            {/* Rangée Joueur (Bas) */}
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 bg-black/30 rounded-full shadow-inner border border-black/20"></div>
              ))}
            </div>
            <div className="text-[8px] text-[#ffd700]/60 font-mono text-center uppercase tracking-widest mt-1">Awalé de Sato</div>
          </div>

        </div>

        {/* QUESTION & RÉPONSES (Minimaliste) */}
        <div className="text-center mb-10 max-w-2xl">
          <h2 className="text-2xl font-extrabold text-[#303333] mb-4 leading-tight">
            Quelle est la fonction principale du tambour Sato lors des rites agraires ?
          </h2>
          <span className="text-[#a0412d] font-mono font-bold text-[10px] tracking-[0.2em] bg-[#faf9f8] px-4 py-1 rounded-full border border-[#a0412d]/10">
            {timeLeft} SECONDES RESTANTES
          </span>
        </div>

        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3 px-4">
          {['Purifier les récoltes', 'Appeler la pluie', 'Célébrer les mariages', 'Guérir les malades'].map((text, i) => (
            <motion.button
              key={i}
              onClick={() => handleAnswer(String.fromCharCode(65 + i))}
              whileHover={{ scale: 1.01 }}
              className={`p-5 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center text-left transition-all ${selectedAnswer === String.fromCharCode(65 + i) ? 'ring-2 ring-[#a0412d]/20 bg-[#faf9f8]' : ''}`}
            >
              <span className="w-8 h-8 rounded-full bg-[#faf9f8] flex items-center justify-center font-bold text-[#a0412d] text-xs mr-4 border border-[#a0412d]/5">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm font-medium">{text}</span>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
}