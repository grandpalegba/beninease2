"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';

export default function SatoChallengePage() {
  const [timeLeft, setTimeLeft] = useState(64);
  const [showExplanation, setShowExplanation] = useState(false);
  const [holes, setHoles] = useState([0, 1, 2, 3]); // Index des trous visibles
  const [awaleSeeds, setAwaleSeeds] = useState(8); // Nombre de graines restantes
  const [isWrong, setIsWrong] = useState(false);

  // Timer actif seulement si l'explication n'est pas affichée
  useEffect(() => {
    if (timeLeft <= 0 || showExplanation) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showExplanation]);

  const handleDrop = (answerId: string) => {
    if (answerId === 'B') {
      // BONNE RÉPONSE
      canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setHoles(prev => prev.slice(1)); // Bouche un trou
      setShowExplanation(true);
    } else {
      // MAUVAISE RÉPONSE
      setIsWrong(true);
      setAwaleSeeds(prev => Math.max(0, prev - 1)); // Perd une graine
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setTimeLeft(64);
    // Ici vous pourriez charger la data de la question suivante
  };

  return (
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center justify-center p-6 overflow-hidden">
      <main className="w-full max-w-5xl flex flex-col items-center">
        
        {/* INSTRUMENTS */}
        <div className="w-full flex justify-between items-center mb-20 px-10 h-[400px]">
          {/* OKPELE */}
          <div className="relative w-36 flex flex-col items-center scale-[0.85]">
             <div className="flex gap-8">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-3">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="w-8 h-11 bg-[#5d3a1a] rounded-full" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* JARRE SATO AVEC TROUS DYNAMIQUES */}
          <div className="relative w-72 h-[360px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(165deg, #a0412d 0%, #7a2a1b 100%)',
              borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
            }}>
            {/* Trous de la jarre */}
            <div className="absolute top-[40%] left-[25%] w-14 h-14 rounded-full bg-[#2a100a] transition-opacity duration-500" 
                 style={{ opacity: holes.includes(0) ? 1 : 0 }}></div>
            <div className="absolute top-[32%] left-[58%] w-12 h-12 rounded-full bg-[#2a100a] transition-opacity duration-500" 
                 style={{ opacity: holes.includes(1) ? 1 : 0 }}></div>
            <div className="absolute top-[62%] left-[40%] w-16 h-16 rounded-full bg-[#2a100a] transition-opacity duration-500" 
                 style={{ opacity: holes.includes(2) ? 1 : 0 }}></div>
            <div className="absolute top-[55%] left-[72%] w-10 h-10 rounded-full bg-[#2a100a] transition-opacity duration-500" 
                 style={{ opacity: holes.includes(3) ? 1 : 0 }}></div>
          </div>

          {/* AWALÉ AVEC GRAINES DYNAMIQUES */}
          <motion.div animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}} 
            className="relative flex bg-[#3d1810] p-3 rounded-2xl border-2 border-[#2a100a] scale-[0.85]">
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center">
                  {awaleSeeds > i && <div className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
                </div>
              ))}
            </div>
            <div className="mx-2.5 w-[1.5px] bg-black/20"></div>
            <div className="flex flex-col gap-3">
              {[4, 5, 6, 7].map(i => (
                <div key={i} className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center">
                  {awaleSeeds > i && <div className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* INTERACTION : QUESTION OU EXPLICATION */}
        <div className="w-full max-w-3xl text-center">
          {!showExplanation ? (
            <>
              <h2 className="text-2xl font-bold mb-8">Quelle est la fonction principale du tambour Sato ?</h2>
              <div className="mb-8 font-mono text-[#a0412d]">TEMPS RESTANT : {timeLeft}S</div>
              <div className="grid grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map((choice) => (
                  <motion.div
                    key={choice}
                    drag
                    dragSnapToOrigin
                    onDragEnd={(_, info) => {
                      // Détection simplifiée du drop sur la zone centrale (jarre)
                      if (Math.abs(info.point.y) < 200) handleDrop(choice);
                    }}
                    className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm cursor-grab active:cursor-grabbing font-bold hover:bg-gray-50"
                  >
                    {choice === 'B' ? 'Purifier les récoltes' : 'Option ' + choice}
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            /* EXPLICATION */
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              onClick={nextQuestion}
              className="p-8 bg-[#faf9f8] rounded-2xl border border-[#a0412d]/20 cursor-pointer hover:shadow-md transition-shadow"
            >
              <h3 className="text-[#a0412d] font-bold mb-4">Bonne réponse !</h3>
              <p className="text-sm leading-relaxed text-gray-700">
                Le Sato est un tambour sacré dont les vibrations sont censées purifier les récoltes 
                et appeler la protection des ancêtres avant la saison des pluies.
              </p>
              <div className="mt-6 text-xs text-gray-400 animate-bounce">Cliquer pour continuer ↓</div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}