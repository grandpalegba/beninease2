"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SatoChallengePage() {
  const TOTAL_TIME = 64;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showExplanation, setShowExplanation] = useState(false);
  const [holes, setHoles] = useState([0, 1, 2, 3]); // Index des trous de la jarre visibles
  const [awaleSeeds, setAwaleSeeds] = useState(8); 
  const [isWrong, setIsWrong] = useState(false);

  // Timer actif si l'explication est masquée
  useEffect(() => {
    if (timeLeft <= 0 || showExplanation) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showExplanation]);

  const handleDrop = (answerId: string) => {
    if (answerId === 'B') {
      // SUCCÈS : Confettis (simulés par scale/opacity) et on bouche un trou
      setHoles(prev => prev.slice(1)); 
      setShowExplanation(true);
    } else {
      // ERREUR : Secousse et perte d'une graine
      setIsWrong(true);
      setAwaleSeeds(prev => Math.max(0, prev - 1));
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setTimeLeft(TOTAL_TIME);
  };

  // Logique pour déterminer si une noix doit être allumée
  const isNoixActive = (col: number, row: number) => {
    const index = col === 0 ? row + 1 : row + 5;
    return timeLeft > (TOTAL_TIME - (8 - index + 1) * 8);
  };

  return (
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center justify-center font-sans p-6 overflow-hidden">
      
      {/* Background Bloom (Stitch style) */}
      <div className="absolute w-[500px] h-[500px] bg-[#a0412d]/5 rounded-full blur-[100px] -z-20"></div>

      <main className="w-full max-w-5xl flex flex-col items-center">
        
        {/* SECTION INSTRUMENTS : Centrage vertical par rapport à la Jarre */}
        <div className="w-full flex justify-between items-center mb-20 px-10 h-[400px]">
          
          {/* 1. OKPELE (Corrigé : Lumière intérieure restaurée) */}
          <div className="relative w-36 flex flex-col items-center scale-[0.85] origin-center">
            {/* Chaîne arquée au-dessus du trait d'alignement */}
            <svg className="absolute -top-12 w-28 h-16 z-0" viewBox="0 0 100 60">
              <path 
                d="M 15 60 Q 50 5 85 60" 
                stroke="#FFD700" 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinecap="round"
                strokeDasharray="1 3"
              />
            </svg>
            
            <div className="flex gap-8 relative z-10">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-3 items-center">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} 
                      className="relative w-8 h-11 bg-[#5d3a1a] shadow-md flex justify-center overflow-hidden"
                      // Forme de noix : Base plus large que le haut
                      style={{ 
                        borderRadius: '50% 50% 35% 35% / 85% 85% 15% 15%', 
                        borderBottom: '2px solid rgba(0,0,0,0.4)'
                      }}
                    >
                      <div className="w-[1px] h-full bg-black/20"></div>
                      <AnimatePresence>
                        {isNoixActive(col, row) && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex justify-center items-center">
                            {/* Lumière jaune dorée RESTAURÉE */}
                            <div className="w-[2.5px] h-[70%] bg-[#FFD700] shadow-[0_0_10px_#FFD700] rounded-full"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 2. JARRE SATO (Pivot de centrage, Corrigé : Rebord supérieur restauré) */}
          <div className="relative w-72 h-[360px] z-10">
            {/* Lip / Haut fin de la jarre RESTAURÉ */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-40 h-10 bg-[#3d1810] rounded-[50%] shadow-inner border-4 border-[#a0412d]/20 z-0"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
                borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
                boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.15)'
              }}>
              <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black/25 to-transparent"></div>
              
              {/* Decorative Circles / Holes DYNAMIQUES */}
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {holes.includes(0) && (
                    <motion.div key="hole0" exit={{ opacity: 0, scale: 0 }} 
                      className="absolute top-[40%] left-[25%] w-14 h-14 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"
                    />
                  )}
                  {holes.includes(1) && (
                    <motion.div key="hole1" exit={{ opacity: 0, scale: 0 }} 
                      className="absolute top-[32%] left-[58%] w-12 h-12 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"
                    />
                  )}
                  {holes.includes(2) && (
                    <motion.div key="hole2" exit={{ opacity: 0, scale: 0 }} 
                      className="absolute top-[62%] left-[40%] w-16 h-16 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"
                    />
                  )}
                  {holes.includes(3) && (
                    <motion.div key="hole3" exit={{ opacity: 0, scale: 0 }} 
                      className="absolute top-[55%] left-[72%] w-10 h-10 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 3. AWALE VERTICAL (Dimensions parfaites restaurées, position verticale centrée) */}
          <motion.div 
            animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative flex bg-[#3d1810] p-3 rounded-2xl shadow-xl border-2 border-[#2a100a] scale-[0.85] origin-center"
          >
            {[0, 1].map((col) => (
              <React.Fragment key={col}>
                {/* Trou G / D */}
                <div className="flex flex-col gap-3">
                  {[0, 1, 2, 3].map(row => {
                    const idx = col === 0 ? row : row + 4;
                    return (
                      <div key={row} className="w-10 h-10 bg-black/60 rounded-full shadow-inner border border-black/30 flex items-center justify-center gap-1">
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

        {/* QUESTIONS OU EXPLICATION */}
        <div className="w-full max-w-3xl flex flex-col items-center min-h-[300px]">
          {!showExplanation ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-8 text-center leading-tight">
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
                      // Détection simplifiée du drop sur la zone centrale (jarre)
                      if (Math.abs(info.point.y - 300) < 200 && Math.abs(info.point.x - window.innerWidth/2) < 150) handleDrop(id);
                    }}
                    className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-[#a0412d]/30 transition-all flex items-center select-none"
                  >
                    <span className="