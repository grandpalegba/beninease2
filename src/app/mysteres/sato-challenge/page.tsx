"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Configuration de ton bucket Supabase spécifique
const PROJECT_ID = "wtjhkqkqmexddroqwawk";
const BUCKET_URL = `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/Okpele`;

// Tableau des images renommées pour le cycle de 9 états
const OKPELE_TIMER_IMAGES = [
  `${BUCKET_URL}/Timer1.png`,
  `${BUCKET_URL}/Timer2.png`,
  `${BUCKET_URL}/Timer3.png`,
  `${BUCKET_URL}/Timer4.png`,
  `${BUCKET_URL}/Timer5.png`,
  `${BUCKET_URL}/Timer6.png`,
  `${BUCKET_URL}/Timer7.png`,
  `${BUCKET_URL}/Timer8.png`,
  `${BUCKET_URL}/Timer9.png`
];

export default function SatoChallengePage() {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [holes, setHoles] = useState([0, 1, 2, 3]); 
  const [awaleSeeds, setAwaleSeeds] = useState(16); 
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const revelations = [
    "Le Sato purifie les récoltes par ses vibrations sacrées.",
    "L'Okpèlè guide le choix des semences selon les signes d'Ifa.",
    "L'Awalé simule la gestion des réserves du village.",
    "La Jarre Sato protège l'esprit des ancêtres initiés."
  ];

  // Animation calée sur ton rythme de 8 secondes par état
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
        setTimeout(() => {
            setShowExplanation(false);
            setIsFinished(true);
        }, 2500);
      }
    } else {
      setIsWrong(true);
      setAwaleSeeds(prev => Math.max(0, prev - 1));
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center p-4">
      <main className="w-full max-w-md md:max-w-4xl flex flex-col items-center">
        
        {/* SECTION INSTRUMENTS (3 colonnes) */}
        <div className="w-full grid grid-cols-3 items-center justify-items-center gap-2 mt-8 md:mt-16 scale-[0.9] md:scale-100 transition-transform">
          
          {/* OKPÈLÈ (IMAGES SUPABASE) */}
          <div className="relative w-full flex justify-center h-[200px] md:h-[350px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentStateIndex}
                src={OKPELE_TIMER_IMAGES[currentStateIndex]}
                alt={`Okpele État ${currentStateIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="h-full object-contain pointer-events-none"
              />
            </AnimatePresence>
          </div>

          {/* JARRE SATO ALLONGÉE */}
          <div className="relative w-20 md:w-36 aspect-[2/5] z-10 shadow-2xl overflow-hidden" 
               style={{ background: 'linear-gradient(165deg, #a0412d 0%, #7a2a1b 100%)', borderRadius: '50% 50% 45% 45% / 15% 15% 85% 85%' }}>
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div 
                      key={hIdx}
                      exit={{ opacity: 0, scale: 0 }}
                      className={`absolute rounded-full bg-[#2a100a] shadow-inner 
                        ${hIdx === 0 ? 'top-[45%] left-[25%] w-6 h-6 md:w-10 md:h-10' : ''}
                        ${hIdx === 1 ? 'top-[35%] left-[55%] w-5 h-5 md:w-8 md:h-8' : ''}
                        ${hIdx === 2 ? 'top-[65%] left-[45%] w-8 h-8 md:w-12 md:h-12' : ''}
                        ${hIdx === 3 ? 'top-[58%] left-[70%] w-4 h-4 md:w-6 md:h-6' : ''}
                      `}
                    />
                  ))}
                </AnimatePresence>
              </div>
          </div>

          {/* AWALÉ HORIZONTAL */}
          <motion.div animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} 
                      className="relative grid grid-cols-2 gap-2 bg-[#3d1810] p-3 rounded-xl border-2 border-[#2a100a] shadow-xl">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="w-6 h-6 md:w-10 md:h-10 bg-black/60 rounded-full flex items-center justify-center gap-0.5 shadow-inner">
                  {awaleSeeds > idx * 2 && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#FFD700] shadow-[0_0_5px_#FFD700]" />}
                  {awaleSeeds > idx * 2 + 1 && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#FFD700] shadow-[0_0_5px_#FFD700]" />}
                </div>
              ))}
          </motion.div>
        </div>

        {/* SECTION INTERACTIVE */}
        <div className="w-full mt-10 px-4 max-w-2xl">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-bold mb-8 text-center text-gray-800">Quelle est la fonction principale du tambour Sato ?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleAnswer(id)} className="p-5 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center hover:border-[#a0412d]/30 transition-all active:scale-95 group">
                      <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-sm mr-4 shrink-0 border border-gray-100 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">{id}</span>
                      <span className="font-semibold text-gray-700">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onClick={() => setShowExplanation(false)} 
                          className="p-8 md:p-12 bg-[#faf9f8] border-2 border-[#a0412d]/10 rounded-[2.5rem] text-center cursor-pointer shadow-lg max-w-lg mx-auto">
                <h3 className="text-[#a0412d] font-bold mb-4 uppercase tracking-[0.3em] text-[10px]">Révélation Sacrée</h3>
                <p className="text-gray-800 text-lg font-medium leading-relaxed">
                  Le Sato est un tambour sacré dont les vibrations purifient les récoltes.
                </p>
                <div className="mt-8 text-[10px] text-[#a0412d]/40 font-bold animate-pulse tracking-widest uppercase">Toucher pour continuer ↓</div>
              </motion.div>
            )
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
              <h2 className="text-4xl font-black mb-10 uppercase text-[#1A1A1A] tracking-tighter italic">Félicitations !</h2>
              <div className="w-full bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 mb-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                {revelations.map((text, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl text-xs md:text-sm font-medium text-left flex items-start">
                        <span className="text-[#a0412d] mr-3">✦</span>{text}
                    </div>
                ))}
              </div>
              <button className="w-full md:w-auto px-14 py-4 bg-[#7a2a1b] text-white rounded-full font-bold shadow-2xl uppercase tracking-widest text-[10px]">
                Partager mon initiation
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}