"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPOSANTS DE DESIGN ---

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
  <div className={`relative w-64 h-80 md:w-72 md:h-96 shrink-0 transition-transform duration-500 ${isOver ? 'scale-105' : 'scale-100'}`}>
    
    {/* COL ÉVASÉ (The Lip) - Plus large et texturé */}
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-44 md:w-52 h-12 z-20">
      {/* Bord extérieur du col */}
      <div className="absolute inset-0 bg-[#3d1810] rounded-[50%] border-b-4 border-[#5d251a] shadow-lg"></div>
      {/* Ouverture sombre (profondeur) */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[85%] h-[70%] bg-[#1a0a07] rounded-[50%] shadow-inner"></div>
    </div>
    
    {/* CORPS DE LA JARRE - Forme d'urne avec épaules larges */}
    <div className="absolute inset-0 mt-2 overflow-hidden" 
         style={{ 
           background: isOver 
            ? 'radial-gradient(circle at 30% 30%, #b34a35 0%, #8b3422 60%, #5a1d12 100%)' 
            : 'radial-gradient(circle at 30% 30%, #a0412d 0%, #8b3422 60%, #5a1d12 100%)',
           // Forme spécifique : Épaules hautes et larges, base étroite
           borderRadius: '50% 50% 40% 40% / 40% 40% 60% 60%',
           boxShadow: isOver 
            ? '0 0 40px rgba(160,65,45,0.5), inset -15px -15px 30px rgba(0,0,0,0.4)' 
            : 'inset -15px -15px 30px rgba(0,0,0,0.3), inset 10px 10px 20px rgba(255,255,255,0.1), 0 30px 50px rgba(0,0,0,0.2)'
         }}>
      
      {/* Texture d'argile / Grain */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
      
      <div className="relative w-full h-full p-8">
        <AnimatePresence>
          {holesCount.map((hIdx) => (
            <motion.div key={hIdx} exit={{ opacity: 0, scale: 1.5 }}
              className={`absolute rounded-full bg-[#1a0a07] shadow-inner border-b border-white/10
                ${hIdx === 0 ? 'top-[30%] left-[22%] w-12 h-12' : ''}
                ${hIdx === 1 ? 'top-[25%] left-[58%] w-10 h-10' : ''}
                ${hIdx === 2 ? 'top-[55%] left-[35%] w-14 h-14' : ''}
                ${hIdx === 3 ? 'top-[48%] left-[65%] w-9 h-9' : ''}
              `}>
                {/* Effet d'épaisseur de la paroi du trou */}
                <div className="absolute inset-0 rounded-full border-t-2 border-black/40"></div>
              </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

const AwaleMini = ({ seedsCount, isWrong }: { seedsCount: number, isWrong: boolean }) => (
  <motion.div animate={isWrong ? { x: [-1, 1, -1, 1, 0] } : {}}
    // Structure à 2 colonnes séparées par une ligne centrale
    className="relative w-44 bg-[#833321] rounded-[2.5rem] p-6 shadow-2xl flex flex-row justify-center gap-8 border-[4px] border-[#652719] shrink-0"
  >
    {/* LIGNE DE SÉPARATION CENTRALE */}
    <div className="absolute left-1/2 top-6 bottom-6 w-[2px] bg-[#652719] -translate-x-1/2 opacity-50"></div>

    {/* COLONNE GAUCHE */}
    <div className="grid grid-cols-1 gap-4 z-10">
      {[...Array(4)].map((_, i) => (
        <div key={`left-${i}`} className="w-12 h-12 bg-[#532015] rounded-full shadow-inner flex items-center justify-center relative overflow-hidden">
          <div className="flex gap-1 flex-wrap justify-center p-2">
             {seedsCount > i * 2 && <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_5px_#facc15]" />}
             {seedsCount > i * 2 + 1 && <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_5px_#facc15]" />}
          </div>
        </div>
      ))}
    </div>

    {/* COLONNE DROITE */}
    <div className="grid grid-cols-1 gap-4 z-10">
      {[...Array(4)].map((_, i) => (
        <div key={`right-${i}`} className="w-12 h-12 bg-[#532015] rounded-full shadow-inner flex items-center justify-center relative overflow-hidden">
          <div className="flex gap-1 flex-wrap justify-center p-2">
             {seedsCount > (i + 4) * 2 && <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_5px_#facc15]" />}
             {seedsCount > (i + 4) * 2 + 1 && <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_5px_#facc15]" />}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

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
      <div className="w-full max-w-6xl flex flex-row items-center justify-center gap-8 md:gap-24 mb-12 h-[450px]">
        
        {/* OKPÈLÈ */}
        <div className="flex flex-col items-center relative pt-10 scale-90 origin-center shrink-0"> 
          <div className="w-[56px] h-10 border-t-[2.5px] border-x-[2.5px] border-yellow-600/60 rounded-t-full absolute top-0 left-1/2 -translate-x-1/2 z-0" />
          <div className="flex gap-4 relative z-10">
            <div className="flex flex-col items-center">
              {[...Array(4)].map((_, i) => (
                <React.Fragment key={`left-${i}`}>
                  <OkpeleSeed active={activeOkpeleSeeds > i} />
                  {i < 3 && <div className="w-[2px] h-3 bg-yellow-600/50 shadow-sm" />}
                </React.Fragment>
              ))}
            </div>
            <div className="flex flex-col items-center">
              {[...Array(4)].map((_, i) => (
                <React.Fragment key={`right-${i}`}>
                  <OkpeleSeed active={activeOkpeleSeeds > i + 4} />
                  {i < 3 && <div className="w-[2px] h-3 bg-yellow-600/50 shadow-sm" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* JARRE SATO CENTRALE */}
        <div ref={jarRef}>
          <SatoJar holesCount={holes} isOver={isOverJar} />
        </div>

        {/* AWALÉ À 2 COLONNES */}
        <AwaleMini seedsCount={seeds} isWrong={isWrong} />
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center">
        {!isFinished ? (
          !showExplanation ? (
            <div className="text-center w-full">
              <h2 className="text-2xl font-bold mb-4">Glissez la bonne réponse dans la jarre :</h2>
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
            <div onClick={() => setShowExplanation(false)} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 text-center cursor-pointer shadow-xl">
              <p className="text-lg italic font-medium">"Correct. Les vibrations du Sato purifient la terre."</p>
              <p className="text-[10px] mt-4 uppercase tracking-tighter text-gray-400">Cliquez pour continuer</p>
            </div>
          )
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4 w-full">
            <h2 className="text-3xl font-black mb-6 uppercase italic tracking-tighter text-[#303333]">Initiation Terminée</h2>
            <div className="bg-gray-50 p-6 rounded-[2rem] text-left mb-8 border border-gray-100">
              <div className="grid grid-cols-1 gap-3">
                {explanations.map((exp, i) => (
                  <p key={i} className="text-sm text-gray-600 flex items-start">
                    <span className="text-[#a0412d] mr-2">✦</span> {exp}
                  </p>
                ))}
              </div>
            </div>
            <div className="mb-10 p-5 border-l-4 border-[#a0412d] bg-[#a0412d]/5 text-left">
              <p className="text-xs font-bold uppercase text-[#a0412d] mb-1">Inspiration</p>
              <p className="text-sm italic text-gray-700">
                "Doguicimi" de **Paul Hazoumé**.
              </p>
            </div>
            <button className="w-full py-4 bg-[#a0412d] text-white rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg">
              Partager mon score
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}