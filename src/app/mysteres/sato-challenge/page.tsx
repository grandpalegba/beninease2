"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PROJECT_ID = "wtjhkqkqmexddroqwawk";
const BUCKET_URL = `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/Okpele`;

const OKPELE_TIMER_IMAGES = [
  `${BUCKET_URL}/Timer1.png`, `${BUCKET_URL}/Timer2.png`, `${BUCKET_URL}/Timer3.png`,
  `${BUCKET_URL}/Timer4.png`, `${BUCKET_URL}/Timer5.png`, `${BUCKET_URL}/Timer6.png`,
  `${BUCKET_URL}/Timer7.png`, `${BUCKET_URL}/Timer8.png`, `${BUCKET_URL}/Timer9.png`
];

export default function SatoChallengePage() {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [holes, setHoles] = useState([0, 1, 2, 3]); 
  const [awaleSeeds, setAwaleSeeds] = useState(16); 
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (showExplanation || isFinished) return;
    const timer = setInterval(() => {
      setCurrentStateIndex((prev) => (prev + 1) % OKPELE_TIMER_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [showExplanation, isFinished]);

  const handleAnswer = (answerId: string) => {
    if (answerId === 'B') {
      const newHoles = holes.slice(1);
      setHoles(newHoles); 
      setShowExplanation(true);
      if (newHoles.length === 0) {
        setTimeout(() => { setShowExplanation(false); setIsFinished(true); }, 2500);
      }
    } else {
      setIsWrong(true);
      setAwaleSeeds(prev => Math.max(0, prev - 1));
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center overflow-x-hidden font-sans">
      
      <div className="h-8 md:h-12" />

      <main className="w-full max-w-lg md:max-w-4xl flex flex-col items-center px-4 flex-1">
        
        {/* SECTION INSTRUMENTS */}
        <div className="w-full grid grid-cols-3 items-end justify-items-center gap-2 min-h-[300px] md:min-h-[450px] relative">
          
          {/* OKPÈLÈ + COMPTEUR D'ÉTAT */}
          <div className="relative w-full flex flex-col items-center h-[200px] md:h-[380px]">
            <div className="mb-2 text-[10px] font-black text-[#a0412d] bg-gray-50 px-3 py-1 rounded-full border border-gray-100 uppercase tracking-widest">
              État {currentStateIndex + 1} / 9
            </div>
            <div className="relative flex-1 w-full flex justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                <motion.img
                    key={currentStateIndex}
                    src={OKPELE_TIMER_IMAGES[currentStateIndex]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="h-full w-auto object-contain"
                />
                </AnimatePresence>
            </div>
          </div>

          {/* JARRE SATO */}
          <div className="relative w-16 md:w-32 aspect-[2/5] mb-4 shadow-xl overflow-hidden" 
               style={{ background: 'linear-gradient(165deg, #a0412d 0%, #7a2a1b 100%)', borderRadius: '50% 50% 45% 45% / 15% 15% 85% 85%' }}>
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div 
                      key={hIdx}
                      exit={{ opacity: 0, scale: 0 }}
                      className={`absolute rounded-full bg-[#2a100a] shadow-inner 
                        ${hIdx === 0 ? 'top-[45%] left-[25%] w-4 h-4 md:w-8 md:h-8' : ''}
                        ${hIdx === 1 ? 'top-[35%] left-[55%] w-3 h-3 md:w-6 md:h-6' : ''}
                        ${hIdx === 2 ? 'top-[65%] left-[45%] w-5 h-5 md:w-10 md:h-10' : ''}
                        ${hIdx === 3 ? 'top-[58%] left-[70%] w-3 h-3 md:w-5 md:h-5' : ''}
                      `}
                    />
                  ))}
                </AnimatePresence>
              </div>
          </div>

          {/* AWALÉ + COMPTEUR DE POINTS */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className={`text-[10px] font-bold uppercase tracking-tighter transition-colors ${isWrong ? 'text-red-500' : 'text-gray-400'}`}>
               Points : <span className="text-[#a0412d] text-xs">{awaleSeeds}</span>
            </div>
            <motion.div 
                animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} 
                className="flex flex-col gap-1 bg-[#3d1810] p-2 rounded-lg border border-[#2a100a] shadow-lg"
            >
                <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                {[...Array(8)].map((_, idx) => (
                    <div key={idx} className="w-5 h-5 md:w-10 md:h-10 bg-black/40 rounded-full flex items-center justify-center gap-0.5 shadow-inner">
                    {awaleSeeds > idx * 2 && <div className="w-1 md:w-2 h-1 md:h-2 rounded-full bg-[#FFD700] opacity-80" />}
                    {awaleSeeds > idx * 2 + 1 && <div className="w-1 md:w-2 h-1 md:h-2 rounded-full bg-[#FFD700] opacity-80" />}
                    </div>
                ))}
                </div>
            </motion.div>
          </div>
        </div>

        {/* SECTION QUIZ */}
        <div className="w-full mt-12 mb-10">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-bold mb-8 text-center px-4 leading-tight">
                  Quelle est la fonction principale du tambour Sato ?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md md:max-w-2xl">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleAnswer(id)} className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center hover:bg-gray-50 transition-all active:scale-95 group">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#a0412d] text-sm mr-4 shrink-0 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">{id}</span>
                      <span className="font-semibold text-gray-700">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => setShowExplanation(false)} 
                          className="p-10 bg-white border border-gray-100 rounded-[2.5rem] text-center cursor-pointer shadow-xl max-w-sm mx-auto">
                <h3 className="text-[#a0412d] font-bold mb-4 uppercase tracking-[0.2em] text-[10px]">Révélation</h3>
                <p className="text-[#1A1A1A] text-lg font-medium leading-relaxed">
                  Le Sato est un tambour sacré dont les vibrations purifient les récoltes.
                </p>
                <div className="mt-8 text-[9px] text-gray-400 font-bold animate-pulse tracking-widest uppercase italic">Toucher pour continuer ↓</div>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center py-6">
              <h2 className="text-3xl font-black mb-8 uppercase text-[#1A1A1A] italic">Félicitations !</h2>
              <button className="px-12 py-4 bg-[#7a2a1b] text-white rounded-full font-bold shadow-xl uppercase tracking-widest text-[10px]">
                Partager mon initiation
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}