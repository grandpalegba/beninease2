"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPOSANTS DE DESIGN (INCHANGÉS) ---

const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className="flex flex-col items-center relative">
    <div 
      className="w-10 h-12 shadow-md relative overflow-hidden ring-1 ring-black/5 transition-all duration-500"
      style={{ 
        backgroundColor: '#833321', 
        borderRadius: '50% 50% 45% 45% / 70% 70% 30% 30%',
        opacity: active ? 1 : 0.4
      }}
    >
      <div className={`absolute inset-0 ${active ? 'bg-gradient-to-br from-white/20 to-black/30' : 'bg-black/20'}`} />
      {active && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-7 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]" 
        />
      )}
    </div>
  </div>
);

const SatoJar = ({ holesCount, isOver }: { holesCount: number[], isOver: boolean }) => (
  <div className={`relative w-56 h-72 md:w-64 md:h-80 shrink-0 transition-transform ${isOver ? 'scale-105' : 'scale-100'}`}>
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#3d1810] rounded-[50%] shadow-inner border-2 border-[#a0412d]/20 z-10" />
    <div className="absolute inset-0 overflow-hidden" 
         style={{ 
           background: isOver ? 'linear-gradient(165deg, #b34a35 0%, #8b3422 45%, #7a2a1b 100%)' : 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
           borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
           boxShadow: isOver ? '0 0 30px rgba(160,65,45,0.4)' : 'inset -8px -8px 20px rgba(0,0,0,0.2), 0 20px 40px rgba(0,0,0,0.15)'
         }}>
      <div className="relative w-full h-full">
        <AnimatePresence>
          {holesCount.map((hIdx) => (
            <motion.div key={hIdx} exit={{ opacity: 0, scale: 1.5 }}
              className={`absolute rounded-full bg-[#2a100a] shadow-inner
                ${hIdx === 0 ? 'top-[35%] left-[25%] w-10 h-10' : ''}
                ${hIdx === 1 ? 'top-[28%] left-[55%] w-8 h-8' : ''}
                ${hIdx === 2 ? 'top-[58%] left-[38%] w-12 h-12' : ''}
                ${hIdx === 3 ? 'top-[52%] left-[68%] w-7 h-7' : ''}
              `} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

const AwaleMini = ({ seedsCount, isWrong }: { seedsCount: number, isWrong: boolean }) => (
  <motion.div animate={isWrong ? { x: [-1, 1, -1, 1, 0] } : {}}
    className="relative w-32 bg-[#833321] rounded-[1.5rem] p-3 shadow-xl flex flex-col items-center gap-2 border-[3px] border-[#652719] shrink-0"
  >
    <div className="grid grid-cols-2 gap-2 z-10">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="w-10 h-10 bg-[#652719] rounded-full shadow-inner flex items-center justify-center relative overflow-hidden">
          <div className="flex gap-0.5 flex-wrap justify-center p-1">
             {seedsCount > i * 2 && <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_4px_rgba(255,235,59,0.4)]" />}
             {seedsCount > i * 2 + 1 && <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_4px_rgba(255,235,59,0.4)]" />}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- MAIN PAGE ---

export default function SatoRitualPage() {
  const [timeLeft, setTimeLeft] = useState(64);
  const [holes, setHoles] = useState([0, 1, 2, 3]);
  const [seeds, setSeeds] = useState(16);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isOverJar, setIsOverJar] = useState(false);
  const jarRef = useRef<HTMLDivElement>(null);

  const explanations = [
    "Le Sato purifie la terre pour les récoltes.",
    "Il est le lien entre le visible et l'invisible.",
    "Ses vibrations chassent les ondes négatives du village.",
    "Il ne peut être touché que par les initiés choisis."
  ];

  useEffect(() => {
    if (timeLeft <= 0 || isFinished || showExplanation) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished, showExplanation]);

  const activeOkpeleSeeds = Math.ceil(timeLeft / 8);

  const handleDragEnd = (event: any, info: any, isCorrect: boolean) => {
    setIsOverJar(false);
    const jar = jarRef.current?.getBoundingClientRect();
    if (jar) {
      const isInside = 
        info.point.x > jar.left && info.point.x < jar.right &&
        info.point.y > jar.top && info.point.y < jar.bottom;

      if (isInside) {
        if (isCorrect) {
          const newHoles = holes.slice(1);
          setHoles(newHoles);
          if (newHoles.length === 0) {
            setIsFinished(true);
          } else {
            setShowExplanation(true);
          }
        } else {
          setIsWrong(true);
          setSeeds(s => Math.max(0, s - 1));
          setTimeout(() => setIsWrong(false), 400);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#303333] flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      
      <div className="w-full max-w-6xl flex flex-row items-center justify-center gap-6 md:gap-16 mb-8 h-[350px]">
        {/* OKPÈLÈ (DESIGN INCHANGÉ) */}
        <div className="flex flex-col items-center relative pt-10 scale-75 origin-center shrink-0"> 
          <div className="w-[56px] h-10 border-t-[2.5px] border-x-[2.5px] border-yellow-600/60 rounded-t-full absolute top-0 left-1/2 -translate-x-1/2 z-0" />
          <div className="flex gap-4 relative z-10">
            <div className="flex flex-col items-center">
              {[...Array(4)].map((_, i) => (
                <React.Fragment key={i}>
                  <OkpeleSeed active={activeOkpeleSeeds > i} />
                  {i < 3 && <div className="w-[2px] h-3 bg-yellow-600/50 shadow-sm" />}
                </React.Fragment>
              ))}
            </div>
            <div className="flex flex-col items-center">
              {[...Array(4)].map((_, i) => (
                <React.Fragment key={i}>
                  <OkpeleSeed active={activeOkpeleSeeds > i + 4} />
                  {i < 3 && <div className="w-[2px] h-3 bg-yellow-600/50 shadow-sm" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* JARRE SATO (ZONE DE DROP) */}
        <div ref={jarRef}>
          <SatoJar holesCount={holes} isOver={isOverJar} />
        </div>

        {/* AWALÉ MINIATURE */}
        <AwaleMini seedsCount={seeds} isWrong={isWrong} />
      </div>

      {/* INTERFACE DE QUIZ */}
      <div className="w-full max-w-2xl flex flex-col items-center">
        {!isFinished ? (
          !showExplanation ? (
            <div className="text-center w-full">
              <h2 className="text-2xl font-bold mb-4">Glissez la bonne réponse dans la jarre :</h2>
              
              {/* STATS SOUS LA QUESTION */}
              <div className="flex gap-8 justify-center mb-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <p>Temps : <span className="text-[#a0412d]">{timeLeft}s</span></p>
                <p>Graines : <span className="text-[#a0412d]">{seeds}/16</span></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'A', t: "Appeler la pluie", c: false }, 
                  { id: 'B', t: "Purifier les récoltes", c: true }, 
                  { id: 'C', t: "Marier les initiés", c: false }, 
                  { id: 'D', t: "Déclarer la guerre", c: false }
                ].map((opt) => (
                  <motion.div
                    key={opt.id}
                    drag
                    dragSnapToOrigin
                    onDrag={(e, info) => {
                        const jar = jarRef.current?.getBoundingClientRect();
                        if(jar) {
                            setIsOverJar(info.point.x > jar.left && info.point.x < jar.right && info.point.y > jar.top && info.point.y < jar.bottom);
                        }
                    }}
                    onDragEnd={(e, info) => handleDragEnd(e, info, opt.c)}
                    className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-grab active:cursor-grabbing flex items-center group touch-none z-50"
                  >
                    <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] mr-4">{opt.id}</span>
                    <span className="font-semibold text-gray-600">{opt.t}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div onClick={() => setShowExplanation(false)} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 text-center cursor-pointer shadow-xl animate-in fade-in zoom-in">
              <p className="text-lg italic font-