"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPOSANTS DE DESIGN ---

const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className={`relative w-10 h-14 transition-all duration-700 ${active ? 'opacity-100' : 'opacity-20 grayscale'}`}>
    <div className="absolute inset-0 rounded-t-[50%] rounded-b-[40%]"
         style={{ background: 'linear-gradient(145deg, #3d2410, #1a0f06)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
      <div className="absolute inset-1.5 rounded-t-[45%] rounded-b-[35%] bg-[#0f0803] flex justify-center">
        {active && (
          <motion.div animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute top-1/2 w-1 h-[60%] bg-[#FFD700] blur-[1px] rounded-full -translate-y-1/2" />
        )}
      </div>
    </div>
  </div>
);

const AwaleSeed = ({ color = '#FFD700' }: { color?: string }) => (
  <div className="w-3 h-3 rounded-full shadow-inner" 
       style={{ background: color, boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.5)' }} />
);

// --- COMPOSANT PRINCIPAL ---

export default function SatoChallenge() {
  const [holes, setHoles] = useState([0, 1, 2, 3]);
  const [awaleSeeds, setAwaleSeeds] = useState(16);
  const [timeLeft, setTimeLeft] = useState(64);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  // Mécanique du Timer
  useEffect(() => {
    if (showExplanation || holes.length === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showExplanation, holes]);

  // Gestion du Drag & Drop
  const handleDragEnd = (event: any, info: any, answerId: string) => {
    // Vérification sommaire de la zone de collision avec la jarre (zone centrale)
    const isOverJarre = Math.abs(info.point.x - window.innerWidth / 2) < 150 && 
                        Math.abs(info.point.y - 300) < 200;

    if (isOverJarre) {
      if (answerId === 'B') {
        setHoles(prev => prev.slice(1));
        setShowExplanation(true);
      } else {
        setIsWrong(true);
        setAwaleSeeds(s => Math.max(0, s - 1));
        setTimeout(() => setIsWrong(false), 500);
      }
    }
  };

  const activeSeedsCount = Math.ceil(timeLeft / 8);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center justify-start p-4 font-sans overflow-x-hidden">
      
      {/* HEADER / HUD */}
      <div className="w-full max-w-xl flex justify-between items-center mb-8 px-6 pt-4">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Initiation Ifá</p>
          <p className="text-[#a0412d] font-black text-xl">Cycle {9 - activeSeedsCount}/9</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Graines Sacrées</p>
          <p className="text-[#a0412d] font-black text-xl">{awaleSeeds}</p>
        </div>
      </div>

      {/* ZONE DE JEU - ÉQUIDISTANCE GARANTIE */}
      <div className="flex items-center justify-center gap-4 md:gap-16 min-h-[400px] w-full max-w-5xl">
        
        {/* 1. OKPÈLÈ (Largeur fixe) */}
        <div className="w-24 md:w-32 flex flex-col items-center">
          <svg className="w-16 h-8 mb-[-5px]" viewBox="0 0 100 40">
            <path d="M 10 40 Q 50 0 90 40" stroke="#B8860B" strokeWidth="2" fill="none" strokeDasharray="3 3" />
          </svg>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              {[...Array(4)].map((_, i) => <OkpeleSeed key={`l-${i}`} active={activeSeedsCount > i} />)}
            </div>
            <div className="flex flex-col gap-2">
              {[...Array(4)].map((_, i) => <OkpeleSeed key={`r-${i}`} active={activeSeedsCount > i + 4} />)}
            </div>
          </div>
        </div>

        {/* 2. LA JARRE (Design Organique) */}
        <div className="relative w-64 h-80 md:w-72 md:h-[380px] flex-shrink-0">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 md:w-40 h-8 md:h-10 bg-[#3d1810] rounded-[50%] shadow-inner border-4 border-[#a0412d]/20 z-10" />
          <div className="absolute inset-0 overflow-hidden shadow-2xl"
               style={{ 
                 background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
                 borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
                 boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.1)'
               }}>
            <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black/25 to-transparent" />
            <div className="relative w-full h-full">
              <AnimatePresence>
                {holes.map((id, i) => (
                  <motion.div key={id} exit={{ scale: 0, opacity: 0 }}
                    className="absolute rounded-full bg-[#2a100a] shadow-inner border border-black/10"
                    style={{
                      width: i === 0 ? '60px' : i === 1 ? '50px' : '70px',
                      height: i === 0 ? '60px' : i === 1 ? '50px' : '70px',
                      top: i === 0 ? '35%' : i === 1 ? '25%' : '55%',
                      left: i === 0 ? '20%' : i === 1 ? '55%' : '35%',
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 3. AWALÉ (Largeur fixe) */}
        <motion.div animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
                    className="w-24 md:w-32 flex flex-col gap-2 bg-[#4a2e15] p-3 rounded-[2rem] border-b-8 border-[#2a1a0a] shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-8 h-8 md:w-10 md:h-10 bg-[#1a0f06] rounded-full shadow-inner flex flex-wrap items-center justify-center p-1 gap-0.5">
                {awaleSeeds > i * 2 && <AwaleSeed />}
                {awaleSeeds > i * 2 + 1 && <AwaleSeed color="#FFE066" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* SECTION QUESTIONS & DRAG AND DROP */}
      <div className="w-full max-w-2xl mt-12 px-4">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-8">
          Quelle est la fonction principale du tambour Sato ?
        </h2>

        {!showExplanation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['A', 'B', 'C', 'D'].map((id) => (
              <motion.div
                key={id}
                drag
                dragSnapToOrigin
                onDragEnd={(e, info) => handleDragEnd(e, info, id)}
                whileDrag={{ scale: 1.05, zIndex: 50 }}
                className="cursor-grab active:cursor-grabbing p-5 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center hover:shadow-md transition-shadow group"
              >
                <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] mr-4 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">
                  {id}
                </span>
                <span className="font-semibold text-gray-700">
                  {id === 'B' ? 'Purifier les récoltes' : `Réponse ${id}`}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="p-8 bg-white border-2 border-[#a0412d]/20 rounded-[3rem] text-center shadow-2xl">
            <p className="text-[#a0412d] font-bold text-xs uppercase tracking-[0.3em] mb-4">Sagesse</p>
            <p className="text-xl italic font-medium leading-relaxed">
              "Le Sato est un tambour sacré dont les vibrations purifient les récoltes."
            </p>
            <button onClick={() => setShowExplanation(false)} className="mt-6 text-[10px] font-bold uppercase text-gray-400 hover:text-[#a0412d]">
              Continuer l'initiation
            </button>
          </motion.div>
        )}
      </div>

      <p className="mt-8 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
        Glissez la réponse vers la jarre
      </p>
    </div>
  );
}