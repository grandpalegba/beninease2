"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPOSANTS DE DESIGN ---

// Design des noix d'Okpèlè (demi-coques) inspiré des références
const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className={`relative w-8 h-12 md:w-10 md:h-14 transition-all duration-700 ${active ? 'opacity-100' : 'opacity-20 grayscale'}`}>
    {/* Cosse externe boisée (forme organique) */}
    <div className="absolute inset-0 rounded-t-[50%] rounded-b-[40%]"
         style={{ background: 'linear-gradient(145deg, #3d2410, #1a0f06)', boxShadow: 'inset -2px -2px 5px rgba(255,255,255,0.05), 0 5px 15px rgba(0,0,0,0.4)' }} />
    {/* Creux interne de la noix */}
    <div className="absolute inset-2 rounded-t-[45%] rounded-b-[35%] bg-[#0f0803] shadow-inner flex justify-center">
      <div className="w-[1px] h-full bg-white/5 opacity-50" />
      {/* Lueur spirituelle si active */}
      {active && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: [0.4, 0.8, 0.4] }} 
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-[65%] bg-[#FFD700] blur-[2px] rounded-full" />
      )}
    </div>
  </div>
);

// Composant pour une graine réaliste de l'Awalé
const AwaleSeed = ({ color = '#FFD700' }: { color?: string }) => (
  <div className="w-3 md:w-4 h-3 md:h-4 rounded-full shadow-inner" style={{ background: color, boxShadow: 'inset -2px -2px 5px rgba(0,0,0,0.5), inset 2px 2px 5px rgba(255,255,255,0.2)' }} />
);

// --- COMPOSANT PRINCIPAL ---

export default function SatoChallengePage() {
  const TOTAL_TIME = 64;
  const jarColor = '#a0412d'; // Belle couleur désirée unifiée
  
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showExplanation, setShowExplanation] = useState(false);
  const [holes, setHoles] = useState([0, 1, 2, 3]); 
  const [awaleSeeds, setAwaleSeeds] = useState(16); 
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Révélations des questions
  const revelations = [
    "Le Sato purifie les récoltes par ses vibrations sacrées.",
    "L'Okpele guide le choix des semences selon les signes d'Ifa.",
    "L'Awalé simule la gestion des réserves du village.",
    "La Jarre Sato protège l'esprit des ancêtres initiés."
  ];

  // Timer principal
  useEffect(() => {
    if (timeLeft <= 0 || showExplanation || isFinished) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showExplanation, isFinished]);

  // Validation des réponses
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

  // Calcul des noix actives
  const activeSeedsCount = Math.ceil(timeLeft / 8);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center p-4 font-sans overflow-x-hidden selection:bg-[#a0412d]/10">
      
      <main className="w-full max-w-6xl flex flex-col items-center mt-12">
        
        {/* SECTION INSTRUMENTS - Unifiée et Alignée */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center justify-items-center gap-10 md:gap-4 min-h-[350px] md:min-h-[420px] relative border-b border-gray-100 pb-12 mb-12">
          
          {/* OKPÈLÈ (VERTICAL) */}
          <div className="relative flex flex-col items-center justify-center shrink-0">
            {/* Chaine spirituelle */}
            <svg className="absolute -top-[50px] md:-top-[75px] w-full h-16 z-0" viewBox="0 0 100 40">
              <path d="M 15 40 Q 50 10 85 40" stroke="#B8860B" strokeWidth="2" fill="none" strokeDasharray="3 3" opacity="0.6" />
            </svg>
            <div className="flex gap-4 md:gap-8 relative z-10 pt-4">
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => <OkpeleSeed key={`g-${i}`} active={activeSeedsCount > i} />)}
              </div>
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => <OkpeleSeed key={`d-${i}`} active={activeSeedsCount > i + 4} />)}
              </div>
            </div>
          </div>

          {/* LA JARRE SATO PREMIUM (TRAPUE ET BELLE COULEUR) */}
          <div className="relative w-64 h-72 md:w-80 md:h-80 flex-shrink-0">
            {/* Col */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 md:w-44 h-10 md:h-14 bg-[#3d1810] rounded-[50%] shadow-2xl border-[6px] border-[#a0412d]/20 z-10"></div>
            {/* Corps */}
            <div className="absolute inset-0 mt-4 overflow-hidden" 
                 style={{ 
                   background: 'linear-gradient(165deg, #a0412d 0%, #7a2a1b 100%)',
                   borderRadius: '45% 45% 40% 40% / 30% 30% 70% 70%', // Forme trapue et premium
                   boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.5), inset 15px 15px 40px rgba(255,255,255,0.1), 0 40px 80px -20px rgba(0,0,0,0.4)'
                 }}>
              <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black/40 to-transparent opacity-60"></div>
              <div className="relative w-full h-full p-8">
                <AnimatePresence>
                  {holes.map((hIdx) => (
                    <motion.div key={hIdx} exit={{ opacity: 0, scale: 0 }}
                      className={`absolute rounded-full bg-[#120604] shadow-[inset_0_8px_20px_rgba(0,0,0,0.9)] border border-white/5
                        ${hIdx === 0 ? 'top-[35%] left-[20%] w-10 h-10 md:w-18 md:h-18' : ''}
                        ${hIdx === 1 ? 'top-[25%] left-[60%] w-8 h-8 md:w-14 md:h-14' : ''}
                        ${hIdx === 2 ? 'top-[62%] left-[40%] w-12 h-12 md:w-22 md:h-22' : ''}
                        ${hIdx === 3 ? 'top-[50%] left-[75%] w-7 h-7 md:w-12 md:h-12' : ''}
                      `} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* AWALÉ VERTICAL RÉDUIT (BELLES COULEURS, CREUX MOINS SOMBRES) */}
          <motion.div animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}} 
                      className="flex flex-col md:flex-row gap-2.5 p-5 rounded-[2.5rem] border-b-[10px] shadow-2xl relative shrink-0"
                      style={{ background: jarColor, borderColor: '#2a1a0a' }}>
            {/* Texture bois sculpté simulée */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '10px 10px' }} />
            
            <div className="grid grid-cols-1 gap-3.5 pr-4 border-r-2 border-black/30 relative z-10">
                {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="w-10 h-10 md:w-16 md:h-16 bg-[#1a0f06] rounded-full shadow-[inset_0_6px_15px_rgba(0,0,0,0.9)] flex items-center justify-center gap-1.5 p-2">
                        {awaleSeeds > idx * 2 && <AwaleSeed color="#FFD700" />}
                        {awaleSeeds > idx * 2 + 1 && <AwaleSeed />}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-3.5 pl-4 relative z-10">
                {[...Array(4)].map((_, idx) => (
                    <div key={idx + 4} className="w-10 h-10 md:w-16 md:h-16 bg-[#1a0f06] rounded-full shadow-[inset_0_6px_15px_rgba(0,0,0,0.9)] flex items-center justify-center gap-1.5 p-2">
                        {awaleSeeds > (idx + 4) * 2 && <AwaleSeed />}
                        {awaleSeeds > (idx + 4) * 2 + 1 && <AwaleSeed color="#FFD700" />}
                    </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* SECTION QUIZ ET STATS SOUS LA QUESTION */}
        <div className="w-full mt-10 px-4 max-w-3xl">
          {!isFinished ? (
            !showExplanation ? (
              <div className="flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#1A1A1A] leading-tight tracking-tight">
                  Quelle est la fonction principale du tambour Sato ?
                </h2>
                
                {/* HUD COMPACT SOUS LA QUESTION */}
                <div className="flex gap-10 mb-10 items-center justify-center bg-gray-50/50 py-3 px-10 rounded-full border border-gray-100 shadow-inner">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Temps Restant</span>
                    <span className={`font-black text-lg md:text-xl ${timeLeft <= 8 ? 'text-red-600 animate-pulse' : 'text-[#a0412d]'}`}>{timeLeft}s</span>
                  </div>
                  <div className="w-[1px] h-6 bg-gray-200"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Graines Sacrées</span>
                    <span className="text-[#a0412d] font-black text-lg md:text-xl italic">{awaleSeeds}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {['A', 'B', 'C', 'D'].map((id) => (
                    <button key={id} onClick={() => handleAnswer(id)} className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center hover:bg-gray-50 hover:shadow-lg transition-all active:scale-95 group">
                      <span className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#a0412d] text-base mr-4 shrink-0 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">{id}</span>
                      <span className="font-semibold text-gray-700 text-base">{id === 'B' ? 'Purifier les récoltes' : 'Réponse ' + id}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onClick={() => setShowExplanation(false)} 
                          className="p-12 bg-white border border-[#a0412d]/10 rounded-[3.5rem] text-center cursor-pointer shadow-2xl max-w-md mx-auto">
                <h3 className="text-[#a0412d] font-bold mb-4 uppercase tracking-[0.4em] text-[10px]">Révélation</h3>
                <p className="text-[#1A1A1A] text-xl md:text-2xl font-medium leading-relaxed italic">
                  "Le Sato est un tambour sacré dont les vibrations purifient les récoltes."
                </p>
                <div className="mt-10 text-[9px] text-gray-400 font-bold animate-pulse tracking-[0.2em] uppercase">Toucher pour continuer</div>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center py-10">
              <h2 className="text-4xl font-black mb-10 uppercase text-[#1A1A1A] italic tracking-tighter">Félicitations initié !</h2>
              
              {/* PANNEAU DE SYNTHÈSE DES RÉVÉLATIONS */}
              <div className="w-full bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl mb-10">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">Synthèse de votre savoir</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {revelations.map((text, i) => (
                    <div key={i} className="text-sm font-medium text-gray-700 flex items-start p-4 bg-gray-50 rounded-2xl border border-gray-50">
                      <span className="text-[#a0412d] mr-3 mt-1">✦</span> {text}
                    </div>
                  ))}
                </div>
                
                {/* INSPIRATION POUR ALLER PLUS LOIN */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-lg font-bold text-[#1A1A1A]">Le mystère ne fait que commencer.</p>
                    <p className="text-xs text-gray-400 mt-2 px-4 italic leading-relaxed">Continuez votre exploration pour débloquer les secrets les plus profonds d'Ifá.</p>
                </div>
              </div>
              
              <button className="px-16 py-5 bg-[#a0412d] text-white rounded-full font-bold shadow-2xl uppercase tracking-[0.2em] text-[11px] hover:bg-[#7a2a1b] transition-colors">
                Partager mon initiation
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}