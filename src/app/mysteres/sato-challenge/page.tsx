"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SatoChallengePage() {
  const [timeLeft, setTimeLeft] = useState(64);

  // Logique du Timer Okpele : 64 secondes total, décrémentation par paliers de 8s
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Détermine si une paire de noix (index 0 à 3, du haut vers le bas) est active
  // Chaque paire s'éteint toutes les 8 secondes
  const isPaireActive = (index: number) => {
    const threshold = (4 - index) * 8;
    return timeLeft > (64 - threshold);
  };

  return (
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Bloom pour adoucir le focus blanc */}
      <div className="absolute w-[600px] h-[600px] bg-[#a0412d]/5 rounded-full blur-[120px] -z-10"></div>

      <main className="w-full max-w-6xl px-6 flex flex-col items-center">
        
        {/* SECTION VISUELLE : L'Okpele et la Jarre Sato */}
        <div className="relative w-full flex justify-center items-center gap-24 mb-16 h-96">
          
          {/* OKPELE DIGITAL TIMER (Gauche) */}
          <div className="relative flex flex-col items-center">
            {/* Chaîne métallique (ouverte en bas) */}
            <div className="absolute top-0 w-[2px] h-[340px] bg-gradient-to-b from-gray-400 via-gray-300 to-transparent"></div>
            
            <div className="flex gap-12 relative z-10">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-6">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="relative w-12 h-16 bg-[#5d3a1a] rounded-[45%_45%_50%_50%] shadow-xl flex justify-center overflow-hidden border-b-4 border-black/30">
                      {/* Septum central par lequel passe la chaîne */}
                      <div className="w-[2px] h-full bg-black/40"></div>
                      
                      {/* LUMIÈRE DORÉE (ACTIVE) : Apparaît si le timer le permet */}
                      <AnimatePresence>
                        {isPaireActive(row) && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex justify-center items-center"
                          >
                            <div className="w-[4px] h-[80%] bg-[#ffd700] shadow-[0_0_15px_#ffae00,0_0_5px_white] rounded-full"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* LA JARRE SATO (Centre) - CODE EXACT REPRODUIT */}
          <div className="relative w-72 h-[360px] z-10 drop-shadow-2xl">
            {/* Col de la jarre */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-40 h-10 bg-[#3d1810] rounded-[50%] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] border-4 border-[#a0412d]/20 z-0"></div>
            
            {/* Corps Organique */}
            <div className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center"
              style={{
                borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
                background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
                boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.15)'
              }}>
              <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-black/30 to-transparent"></div>
              
              {/* Orifices sacrés */}
              <div className="relative w-full h-full">
                <div className="absolute top-[40%] left-[25%] w-14 h-14 rounded-full bg-[#2a100a] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6)] border border-black/10"></div>
                <div className="absolute top-[32%] left-[58%] w-12 h-12 rounded-full bg-[#2a100a] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6)] border border-black/10"></div>
                <div className="absolute top-[62%] left-[40%] w-16 h-16 rounded-full bg-[#2a100a] shadow-[inset_5px_5px_10px_rgba(0,0,0,0.6)] border border-black/10"></div>
                <div className="absolute top-[55%] left-[72%] w-10 h-10 rounded-full bg-[#2a100a] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)] border border-black/10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* QUESTION ET RÉPONSES */}
        <div className="text-center mb-12 max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#303333] mb-4">
            Quelle est la fonction principale du tambour Sato lors des rites agraires ?
          </h2>
          <div className="text-[#a0412d] font-bold tracking-widest uppercase text-sm">
            Temps restant : {timeLeft}s
          </div>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Purifier les récoltes', 'Appeler la pluie', 'Célébrer les mariages', 'Guérir les malades'].map((text, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
            >
              <span className="w-10 h-10 rounded-full bg-[#faf9f8] flex items-center justify-center font-bold text-[#a0412d] mr-5">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-lg font-medium">{text}</span>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
}