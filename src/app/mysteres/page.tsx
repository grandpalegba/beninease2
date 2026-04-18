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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-7 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]"
        />
      )}
    </div>
  </div>
);

const SatoJar = ({ holesCount, isOver }: { holesCount: number[], isOver: boolean }) => (
  <div className={`relative w-48 h-60 md:w-56 md:h-72 shrink-0 transition-transform duration-500 ${isOver ? 'scale-110' : 'scale-100'}`}>
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 blur-xl rounded-[50%] z-0" />
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 md:w-40 h-10 z-20">
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
          : 'inset -8px -8px 20px rgba(0,0,0,0.2), 0 20px 40px rgba(0,0,0,0.15)',
      }}>
      <div className="relative w-full h-full p-6">
        <AnimatePresence>
          {holesCount.map((hIdx) => (
            <motion.div key={hIdx} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0, scale: 2 }}
              className={`absolute rounded-full bg-[#1a0a07] shadow-inner
                ${hIdx === 0 ? 'top-[35%] left-[25%] w-8 h-8' : ''}
                ${hIdx === 1 ? 'top-[28%] left-[55%] w-7 h-7' : ''}
                ${hIdx === 2 ? 'top-[58%] left-[38%] w-10 h-10' : ''}
                ${hIdx === 3 ? 'top-[52%] left-[68%] w-6 h-6' : ''}
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
  <motion.div animate={isWrong ? { x: [-3, 3, -3, 3, 0] } : {}}
    className="w-28 bg-[#833321] rounded-[2rem] p-3 shadow-xl flex flex-row justify-center gap-3 border-[3px] border-[#652719] shrink-0"
  >
    <div className="grid grid-cols-1 gap-2">
      {[...Array(4)].map((_, i) => (
        <div key={`l-${i}`} className="w-8 h-8 bg-[#532015] rounded-full shadow-inner flex items-center justify-center">
          {seedsCount > i * 2 && <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_4px_#facc15]" />}
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 gap-2">
      {[...Array(4)].map((_, i) => (
        <div key={`r-${i}`} className="w-8 h-8 bg-[#532015] rounded-full shadow-inner flex items-center justify-center">
          {seedsCount > (i + 4) * 2 && <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_4px_#facc15]" />}
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
      if (tData) setThemes(tData.reduce((acc: any, t: any) => ({ ...acc, [t.id]: t.name }), {}));
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
    if (jar && info.point.x > jar.left && info.point.x < jar.right && info.point.y > jar.top && info.point.y < jar.bottom) {
      if (isCorrect) {
        const nextHoles = holes.slice(1);
        setHoles(nextHoles);
        setExplanations(prev => [...prev, currentQuestions[qIndex].explanation]);
        if (nextHoles.length === 0) {
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
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-[#a0412d] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen w-screen bg-[#faf9f8] overflow-hidden relative font-sans text-[#1a1a1a] touch-none">
      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">
        {view === "gallery" ? (
          <motion.div key="gallery" className="h-full flex flex-col items-center justify-center p-6">
            <motion.div
              onClick={() => { setHoles([0, 1, 2, 3]); setSeeds(16); setTimeLeft(64); setQIndex(0); setExplanations([]); setIsFinished(false); setView("ritual"); }}
              className="w-full max-w-[320px] h-[580px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[6px] border-white cursor-pointer flex flex-col"
            >
              <div className="h-1/2 w-full"><img src={`https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/mysteres-assets/${currentM.id}.jpg`} className="h-full w-full object-cover" /></div>
              <div className="p-8 text-center flex flex-col justify-center flex-1 bg-white">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{themes[currentM.theme_id]}</span>
                <h2 className="text-2xl font-black uppercase mt-2">{currentM.title}</h2>
                <p className="text-gray-500 text-sm mt-4 italic">"{currentM.mise_en_abyme}"</p>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="ritual" initial={{ y: "100%" }} animate={{ y: 0 }} className="absolute inset-0 bg-white flex flex-col">

            {/* --- 1. SECTION HAUT : OBJETS RITUELS (Okpele, Jarre, Awale) --- */}
            <div className="pt-12 pb-8 flex flex-col items-center shrink-0 border-b border-gray-50 bg-[#faf9f8]">
              <div className="flex items-center justify-center gap-6 md:gap-16 w-full max-w-2xl px-4">

                {/* Oukpélé avec chaîne dorée */}
                <div className="relative flex flex-col items-center scale-90">
                  <svg className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-16 z-0 overflow-visible" viewBox="0 0 100 50">
                    <path d="M 10 50 C 10 0, 90 0, 90 50" fill="none" stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                    <circle cx="10" cy="50" r="3" fill="#ca8a04" /><circle cx="90" cy="50" r="3" fill="#ca8a04" />
                  </svg>
                  <div className="flex gap-5 pt-6">
                    <div className="flex flex-col gap-2">{[...Array(4)].map((_, i) => (
                      <React.Fragment key={`l-${i}`}>
                        <OkpeleSeed active={activeOkpeleSeeds > i} />
                        {i < 3 && <div className="w-0.5 h-3 bg-yellow-600/40 self-center" />}
                      </React.Fragment>
                    ))}</div>
                    <div className="flex flex-col gap-2">{[...Array(4)].map((_, i) => (
                      <React.Fragment key={`r-${i}`}>
                        <OkpeleSeed active={activeOkpeleSeeds > i + 4} />
                        {i < 3 && <div className="w-0.5 h-3 bg-yellow-600/40 self-center" />}
                      </React.Fragment>
                    ))}</div>
                  </div>
                </div>

                {/* Jarre Sato */}
                <div ref={jarRef} className="z-10">
                  <SatoJar holesCount={holes} isOver={isOverJar} />
                </div>

                {/* Awalé */}
                <AwaleMini seedsCount={seeds} isWrong={isWrong} />
              </div>
            </div>

            {/* --- 2. SECTION BAS : QUESTIONS & INTERACTIONS --- */}
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar px-6 py-8">
              {!isFinished ? (!showExplanation ? (
                <div className="w-full max-w-md mx-auto flex flex-col h-full">

                  {/* Stats & Question */}
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#a0412d] animate-pulse" /> {timeLeft}s</div>
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> {seeds}/16 graines</div>
                  </div>

                  <h2 className="text-xl font-black text-center mb-8 leading-tight min-h-[4.5rem] flex items-center justify-center">
                    {currentQuestions[qIndex]?.question || "Chargement..."}
                  </h2>

                  {/* Réponses Drag and Drop */}
                  <div className="grid grid-cols-1 gap-3">
                    {['a', 'b', 'c', 'd'].map((l) => (
                      <motion.div key={l} drag dragSnapToOrigin
                        onDrag={(_, info) => {
                          const jar = jarRef.current?.getBoundingClientRect();
                          setIsOverJar(!!jar && info.point.x > jar.left && info.point.x < jar.right && info.point.y > jar.top && info.point.y < jar.bottom);
                        }}
                        onDragEnd={(_, info) => handleDragEnd(info, l.toUpperCase() === currentQuestions[qIndex]?.correct_answer)}
                        className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center touch-none z-[100] cursor-grab active:scale-95 shadow-sm active:shadow-lg"
                      >
                        <span className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center font-bold text-[#a0412d] mr-4 uppercase">{l}</span>
                        <span className="text-[15px] font-bold text-gray-700 text-left leading-snug">{currentQuestions[qIndex]?.[`choice_${l}`]}</span>
                      </motion.div>
                    ))}
                  </div>
                  <p className="mt-auto py-6 text-[10px] text-center font-black text-gray-300 uppercase tracking-[0.3em]">Glissez la réponse vers la Jarre</p>
                </div>
              ) : (
                /* Explications */
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={() => { setShowExplanation(false); setQIndex(p => p + 1); }}
                  className="my-auto p-10 bg-orange-50 rounded-[3rem] border border-orange-100 text-center cursor-pointer shadow-xl max-w-sm mx-auto"
                >
                  <p className="text-xl italic font-serif text-[#a0412d] leading-relaxed">"{currentQuestions[qIndex]?.explanation}"</p>
                  <p className="text-[10px] mt-8 uppercase font-black text-gray-400 tracking-widest animate-pulse">Cliquez pour continuer</p>
                </motion.div>
              )) : (
                /* Fin */
                <div className="my-auto text-center px-4 max-w-md mx-auto">
                  <h2 className="text-3xl font-black mb-8 uppercase text-[#a0412d] tracking-widest">Initié</h2>
                  <div className="space-y-4 mb-10 text-left bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
                    {explanations.map((exp, i) => (
                      <p key={i} className="text-sm text-gray-600 leading-relaxed flex gap-3 italic">
                        <span className="text-[#a0412d] font-bold">✦</span> {exp}
                      </p>
                    ))}
                  </div>
                  <button onClick={() => setView("gallery")} className="w-full py-5 bg-[#a0412d] text-white rounded-full font-black uppercase tracking-[0.2em] text-[11px] shadow-xl">
                    Autre Mystère
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}