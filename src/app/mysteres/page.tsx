"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner";
import { confetti } from "tsparticles-confetti";

// --- CONFIGURATION SUPABASE ---
const SUPABASE_URL = "https://wtjhkqkqmexddroqwawk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0amhrcWtxbWV4ZGRyb3F3YXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDU3NzQsImV4cCI6MjA4OTg4MTc3NH0.TdaWEVQxKF6s2j-7QStHZaFbOqs4e3UHVUN7iGQL_vc";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- COMPOSANTS DE RITUEL ---

const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className="flex flex-col items-center relative z-10">
    <div
      className="w-12 h-14 shadow-md relative overflow-hidden ring-1 ring-black/5 transition-all duration-500"
      style={{
        backgroundColor: '#833321',
        borderRadius: '50% 50% 45% 45% / 70% 70% 30% 30%', // pear-seed-inverted
        opacity: active ? 1 : 0.2
      }}
    >
      <div className={`absolute inset-0 ${active ? 'bg-gradient-to-br from-white/20 to-black/30' : 'bg-black/60'}`} />
      {active && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15,0_0_4px_#facc15]"
        />
      )}
    </div>
  </div>
);

const SatoJar = ({ holesCount, isOver }: { holesCount: number[], isOver: boolean }) => (
  <div className={`relative w-64 h-80 md:w-72 md:h-96 shrink-0 transition-transform duration-500 ${isOver ? 'scale-105' : 'scale-100'}`}>
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 blur-xl rounded-[50%] z-0" />
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-44 md:w-52 h-12 z-20">
      <div className="absolute inset-0 bg-[#3d1810] rounded-[50%] border-b-4 border-[#5d251a] shadow-lg"></div>
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[85%] h-[70%] bg-[#1a0a07] rounded-[50%] shadow-inner"></div>
    </div>
    <div className="absolute inset-0 mt-2 overflow-hidden"
      style={{
        background: isOver
          ? 'linear-gradient(165deg, #b34a35 0%, #8b3422 45%, #6a2418 100%)'
          : 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
        borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
        boxShadow: isOver
          ? '0 0 40px rgba(160,65,45,0.4), inset -8px -8px 20px rgba(0,0,0,0.3)'
          : 'inset -8px -8px 20px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.15)',
      }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
      <div className="relative w-full h-full p-8">
        <AnimatePresence>
          {holesCount.map((hIdx) => (
            <motion.div key={hIdx} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0, scale: 1.5 }}
              className={`absolute rounded-full bg-[#1a0a07] shadow-inner
                ${hIdx === 0 ? 'top-[35%] left-[25%] w-10 h-10' : ''}
                ${hIdx === 1 ? 'top-[28%] left-[55%] w-8 h-8' : ''}
                ${hIdx === 2 ? 'top-[58%] left-[38%] w-12 h-12' : ''}
                ${hIdx === 3 ? 'top-[52%] left-[68%] w-7 h-7' : ''}
              `}>
              <div className="absolute inset-0 rounded-full border-t border-black/50"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

const AwaleMini = ({ seedsCount, isWrong }: { seedsCount: number, isWrong: boolean }) => (
  <motion.div animate={isWrong ? { x: [-2, 2, -2, 2, 0] } : {}}
    className="relative w-36 bg-[#833321] rounded-[2rem] p-4 shadow-xl flex flex-row justify-center gap-5 border-[3px] border-[#652719] shrink-0"
  >
    <div className="grid grid-cols-1 gap-3 z-10">
      {[...Array(4)].map((_, i) => (
        <div key={`left-${i}`} className="w-10 h-10 bg-[#532015] rounded-full shadow-inner flex items-center justify-center relative">
          <div className="flex gap-0.5 flex-wrap justify-center p-1">
            {seedsCount > i * 2 && <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_4px_#facc15]" />}
            {seedsCount > i * 2 + 1 && <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_4px_#facc15]" />}
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 gap-3 z-10">
      {[...Array(4)].map((_, i) => (
        <div key={`right-${i}`} className="w-10 h-10 bg-[#532015] rounded-full shadow-inner flex items-center justify-center relative">
          <div className="flex gap-0.5 flex-wrap justify-center p-1">
            {seedsCount > (i + 4) * 2 && <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_4px_#facc15]" />}
            {seedsCount > (i + 4) * 2 + 1 && <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_4px_#facc15]" />}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- COMPOSANT PRINCIPAL ---

export default function MysteresPage() {
  const [loading, setLoading] = useState(true);
  const [mysteres, setMysteres] = useState<any[]>([]);
  const [themes, setThemes] = useState<Record<string, string>>({});
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [view, setView] = useState<"gallery" | "ritual">("gallery");
  const [timeLeft, setTimeLeft] = useState(64);
  const [holes, setHoles] = useState([0, 1, 2, 3]);
  const [seeds, setSeeds] = useState(16);
  const [qIndex, setQIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isOverJar, setIsOverJar] = useState(false);
  const [explanations, setExplanations] = useState<string[]>([]);

  const jarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: mData } = await supabase.from('mysteres').select('*');
      const { data: qData } = await supabase.from('questions').select('*');
      const { data: tData } = await supabase.from('themes').select('id, name');

      if (tData) {
        const themeMap = tData.reduce((acc: any, t: any) => ({ ...acc, [t.id]: t.name }), {});
        setThemes(themeMap);
      }
      if (mData) setMysteres(mData.sort(() => Math.random() - 0.5));
      if (qData) setAllQuestions(qData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const currentM = mysteres[currentIndex];

  const currentQuestions = useMemo(() => {
    if (!currentM || allQuestions.length === 0) return [];
    return allQuestions
      .filter(q => q.mystere_id === currentM.id)
      .sort((a, b) => a.question_number - b.question_number);
  }, [allQuestions, currentM]);

  useEffect(() => {
    if (timeLeft <= 0 || isFinished || showExplanation || view !== "ritual") return;
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished, showExplanation, view]);

  const activeOkpeleSeeds = Math.ceil(timeLeft / 8);

  const handleDragEnd = (info: any, isCorrect: boolean) => {
    setIsOverJar(false);
    const jar = jarRef.current?.getBoundingClientRect();
    if (jar) {
      const isInside = info.point.x > jar.left && info.point.x < jar.right &&
        info.point.y > jar.top && info.point.y < jar.bottom;

      if (isInside) {
        if (isCorrect) {
          const newHoles = holes.slice(1);
          setHoles(newHoles);
          setExplanations(prev => [...prev, currentQuestions[qIndex].explanation]);
          if (newHoles.length === 0) {
            setIsFinished(true);
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          } else {
            setShowExplanation(true);
          }
        } else {
          setIsWrong(true);
          setSeeds(s => Math.max(0, s - 1));
          toast.error("Vibration discordante");
          setTimeout(() => setIsWrong(false), 400);
        }
      }
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-[#a0412d] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#faf9f8] overflow-hidden relative touch-none font-sans text-[#1a1a1a]">
      <Toaster position="top-center" richColors />
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');
        .font-lato { font-family: 'Lato', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <AnimatePresence mode="wait">
        {view === "gallery" ? (
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center p-6">
            <motion.div
              drag="x" dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) setCurrentIndex(prev => (prev + 1) % mysteres.length);
                if (info.offset.x > 60) setCurrentIndex(prev => (prev - 1 + mysteres.length) % mysteres.length);
              }}
              onClick={() => { setHoles([0, 1, 2, 3]); setSeeds(16); setTimeLeft(64); setQIndex(0); setExplanations([]); setIsFinished(false); setView("ritual"); }}
              className="w-full max-w-[340px] h-[610px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[6px] border-white cursor-pointer flex flex-col"
            >
              <div className="pt-5 pb-3 px-7 text-center">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.35em]">{themes[currentM.theme_id] || "Bénin Éternel"}</span>
              </div>
              <div className="h-[55%] w-full overflow-hidden">
                <img src={`https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/mysteres-assets/${currentM.id}.jpg`} className="h-full w-full object-cover" alt={currentM.title} />
              </div>
              <div className="p-7 flex flex-col flex-1 bg-white">
                <h2 className="text-[24px] font-black leading-[1.1] tracking-[0.05em] uppercase">{currentM.title}</h2>
                <p className="text-[11px] font-bold text-[#a0412d] mt-1 italic tracking-[0.12em] uppercase">{currentM.subtitle}</p>
                <div className="mt-3 pt-3 border-t border-gray-50 flex-1 overflow-y-auto no-scrollbar">
                  <p className="text-[15px] text-gray-500 italic leading-[1.6]">"{currentM.mise_en_abyme}"</p>
                </div>
              </div>
            </motion.div>
            <p className="mt-8 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] animate-pulse">Swipe pour naviguer • Tap pour l'initiation</p>
          </motion.div>
        ) : (
          <motion.div key="ritual" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="absolute inset-0 bg-white z-50 flex flex-col items-center p-6 overflow-y-auto no-scrollbar">

            {/* --- BLOC OKPELE & RITUAL ELEMENTS --- */}
            <div className="w-full flex flex-col items-center mt-12 mb-8 shrink-0">
              <div className="relative flex flex-col items-center">

                {/* La Chaîne Arc (96px large pour aligner les centres des graines de 48px) */}
                <div className="w-24 h-16 border-t-[3px] border-x-[3px] border-yellow-600/70 rounded-t-full absolute -top-14 left-1/2 -translate-x-1/2 z-0">
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-600 rounded-full"></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-600 rounded-full"></div>
                </div>

                <div className="flex gap-12 relative z-10">
                  {/* Colonne Gauche */}
                  <div className="flex flex-col items-center">
                    {[...Array(4)].map((_, i) => (
                      <React.Fragment key={`l-${i}`}>
                        <OkpeleSeed active={activeOkpeleSeeds > i} />
                        {i < 3 && <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm" />}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Colonne Droite */}
                  <div className="flex flex-col items-center">
                    {[...Array(4)].map((_, i) => (
                      <React.Fragment key={`r-${i}`}>
                        <OkpeleSeed active={activeOkpeleSeeds > i + 4} />
                        {i < 3 && <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gray-300 mt-12 font-light">Okpele</span>
            </div>

            {/* --- ZONE INTERACTIVE (QUESTIONS, JARRE, AWALE) --- */}
            <div className="w-full max-w-2xl pb-10 flex flex-col items-center">
              {!isFinished ? (
                !showExplanation ? (
                  <div className="text-center w-full">
                    {/* Intitulé Question */}
                    <div className="min-h-[5rem] flex items-center justify-center mb-6">
                      <h2 className="text-[22px] font-black leading-tight px-4 text-[#1a1a1a]">
                        {currentQuestions[qIndex]?.question || "Chargement du mystère..."}
                      </h2>
                    </div>

                    {/* Choix Glissables */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 w-full px-4">
                      {['a', 'b', 'c', 'd'].map((l) => (
                        <motion.div
                          key={l}
                          drag
                          dragSnapToOrigin
                          onDrag={(_, info) => {
                            const jar = jarRef.current?.getBoundingClientRect();
                            if (jar) {
                              const over = info.point.x > jar.left && info.point.x < jar.right && info.point.y > jar.top && info.point.y < jar.bottom;
                              setIsOverJar(over);
                            }
                          }}
                          onDragEnd={(_, info) => handleDragEnd(info, l.toUpperCase() === currentQuestions[qIndex]?.correct_answer)}
                          className="p-5 bg-[#faf9f8] border border-gray-100 rounded-[24px] shadow-sm cursor-grab active:cursor-grabbing flex items-center touch-none z-50 group transition-colors hover:border-orange-200"
                        >
                          <span className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-[#a0412d] mr-4 uppercase border border-orange-50">{l}</span>
                          <span className="font-bold text-gray-700 text-[15px] text-left leading-snug">{currentQuestions[qIndex]?.[`choice_${l}`]}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Ritual Objects Area (Jarre & Awale) */}
                    <div className="flex flex-row items-end justify-center gap-8 md:gap-16 mt-4 w-full">
                      <div ref={jarRef} className="z-10">
                        <SatoJar holesCount={holes} isOver={isOverJar} />
                      </div>
                      <div className="flex flex-col items-center gap-4 mb-4">
                        <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Graines de vie</div>
                        <AwaleMini seedsCount={seeds} isWrong={isWrong} />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-10 justify-center mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#a0412d] animate-pulse"></span>
                        Temps : {timeLeft}s
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        Protection : {seeds}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Feedback Explanation */
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    onClick={() => { setShowExplanation(false); setQIndex(p => p + 1); }}
                    className="p-10 bg-white rounded-[3rem] border border-orange-100 text-center cursor-pointer shadow-2xl mt-12 max-w-md relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#a0412d] to-transparent" />
                    <p className="text-xl italic font-serif text-[#a0412d] leading-relaxed">"{currentQuestions[qIndex]?.explanation}"</p>
                    <div className="mt-8 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center animate-bounce mb-4">
                        <span className="text-[#a0412d]">↓</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400">Cliquez pour continuer l'initiation</p>
                    </div>
                  </motion.div>
                )
              ) : (
                /* Completion Screen */
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full px-6">
                  <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 blur-2xl bg-orange-200/50 rounded-full" />
                    <h2 className="text-[28px] font-black uppercase text-[#a0412d] tracking-[0.15em] relative">Mystère Révélé</h2>
                  </div>

                  <div className="bg-[#faf9f8] p-8 rounded-[2.5rem] text-left mb-10 space-y-5 border border-gray-100 shadow-inner max-w-lg mx-auto">
                    {explanations.map((exp, i) => (
                      <motion.p initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.2 }} key={i} className="text-[15px] text-gray-600 flex items-start leading-relaxed">
                        <span className="text-[#a0412d] mr-4 mt-1 font-bold">✦</span> {exp}
                      </motion.p>
                    ))}
                  </div>

                  <button
                    onClick={() => setView("gallery")}
                    className="w-full max-w-xs py-5 bg-[#a0412d] text-white rounded-full font-black uppercase tracking-[0.25em] text-[11px] shadow-xl hover:bg-[#8b3422] active:scale-95 transition-all"
                  >
                    Découvrir un autre secret
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}