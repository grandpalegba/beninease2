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
      className="w-8 h-10 md:w-10 md:h-12 shadow-md relative overflow-hidden ring-1 ring-black/5 transition-all duration-500"
      style={{
        backgroundColor: '#833321',
        borderRadius: '50% 50% 45% 45% / 70% 70% 30% 30%',
        opacity: active ? 1 : 0.15
      }}
    >
      <div className={`absolute inset-0 ${active ? 'bg-gradient-to-br from-white/20 to-black/30' : 'bg-black/20'}`} />
      {active && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-5 md:w-1.5 md:h-7 bg-yellow-400 rounded-full shadow-[0_0_8px_#facc15]"
        />
      )}
    </div>
  </div>
);

const OkpeleRitual = ({ activeSeeds }: { activeSeeds: number }) => (
  <div className="relative flex flex-col items-center scale-[0.5] md:scale-[0.7] origin-center">
    <div className="w-[64px] md:w-[80px] h-10 border-t-[1.5px] border-x-[1.5px] border-yellow-700/40 rounded-t-[40px] absolute top-[2px] left-1/2 -translate-x-1/2 z-0" />
    <div className="flex gap-8 md:gap-10 relative z-10 pt-10">
      <div className="flex flex-col items-center">
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={`l-${i}`}>
            <OkpeleSeed active={activeSeeds > i} />
            {i < 3 && <div className="w-[1.5px] h-2 md:h-3 bg-gradient-to-b from-yellow-700/40 to-yellow-800/40" />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex flex-col items-center">
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={`r-${i}`}>
            <OkpeleSeed active={activeSeeds > i + 4} />
            {i < 3 && <div className="w-[1.5px] h-2 md:h-3 bg-gradient-to-b from-yellow-700/40 to-yellow-800/40" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

const SatoJar = ({ holesCount, isOver }: { holesCount: number[], isOver: boolean }) => (
  <div className={`relative w-32 h-44 md:w-56 md:h-72 shrink-0 transition-transform duration-500 ${isOver ? 'scale-105' : 'scale-100'}`}>
    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-5 bg-black/5 blur-xl rounded-[50%] z-0" />
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 md:w-40 h-8 z-20">
      <div className="absolute inset-0 bg-[#3d1810] rounded-[50%] border-b-4 border-[#5d251a] shadow-lg"></div>
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[85%] h-[70%] bg-[#1a0a07] rounded-[50%] shadow-inner"></div>
    </div>
    <div className="absolute inset-0 mt-2 overflow-hidden"
      style={{
        background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
        borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
        boxShadow: isOver ? '0 0 30px rgba(160,65,45,0.4)' : 'inset -4px -4px 15px rgba(0,0,0,0.2)',
      }}>
      <div className="relative w-full h-full p-4">
        <AnimatePresence>
          {holesCount.map((hIdx) => (
            <motion.div key={hIdx} exit={{ opacity: 0, scale: 1.5 }}
              className={`absolute rounded-full bg-[#1a0a07] shadow-inner
                ${hIdx === 0 ? 'top-[35%] left-[25%] w-6 h-6 md:w-10 md:h-10' : ''}
                ${hIdx === 1 ? 'top-[28%] left-[55%] w-5 h-5 md:w-8 md:h-8' : ''}
                ${hIdx === 2 ? 'top-[58%] left-[38%] w-7 h-7 md:w-12 md:h-12' : ''}
                ${hIdx === 3 ? 'top-[52%] left-[68%] w-4 h-4 md:w-7 md:h-7' : ''}
              `}>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

const AwaleMini = ({ seedsCount, isWrong }: { seedsCount: number, isWrong: boolean }) => (
  <motion.div animate={isWrong ? { x: [-1, 1, -1, 1, 0] } : {}}
    className="relative w-20 md:w-32 bg-[#833321] rounded-[1.2rem] md:rounded-[2rem] p-2 md:p-4 shadow-xl flex flex-row justify-center gap-1.5 md:gap-4 border-[2px] md:border-[3px] border-[#652719] shrink-0"
  >
    <div className="grid grid-cols-1 gap-1.5 md:gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={`al-${i}`} className="w-5 h-5 md:w-8 md:h-8 bg-[#532015] rounded-full shadow-inner flex items-center justify-center relative">
          <div className="flex gap-0.5 flex-wrap justify-center">
            {seedsCount > i * 2 && <div className="w-1 md:w-2 h-1 md:h-2 rounded-full bg-yellow-400" />}
            {seedsCount > i * 2 + 1 && <div className="w-1 md:w-2 h-1 md:h-2 rounded-full bg-yellow-400" />}
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 gap-1.5 md:gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={`ar-${i}`} className="w-5 h-5 md:w-8 md:h-8 bg-[#532015] rounded-full shadow-inner flex items-center justify-center relative">
          <div className="flex gap-0.5 flex-wrap justify-center">
            {seedsCount > (i + 4) * 2 && <div className="w-1 md:w-2 h-1 md:h-2 rounded-full bg-yellow-400" />}
            {seedsCount > (i + 4) * 2 + 1 && <div className="w-1 md:w-2 h-1 md:h-2 rounded-full bg-yellow-400" />}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function SavoirsPage() {
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
    let timer: NodeJS.Timeout;
    if (view === "ritual" && !isFinished && !showExplanation && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0 && !isFinished) {
      toast.error("Le temps est écoulé..."); setView("gallery");
    }
    return () => clearInterval(timer);
  }, [view, isFinished, showExplanation, timeLeft]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: tData } = await supabase.from('themes').select('id, name');
        if (tData) setThemes(tData.reduce((acc: any, t: any) => ({ ...acc, [t.id]: t.name }), {}));
        const { data: mData } = await supabase.from('mysteres').select('*');
        if (mData) setMysteres(mData.sort(() => Math.random() - 0.5));
        const [q1, q2] = await Promise.all([
          supabase.from('questions').select('*').range(0, 999),
          supabase.from('questions').select('*').range(1000, 1999)
        ]);
        setAllQuestions([...(q1.data || []), ...(q2.data || [])]);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const currentM = mysteres[currentIndex];
  const currentQuestions = useMemo(() => {
    if (!currentM || allQuestions.length === 0) return [];
    return allQuestions.filter(q => String(q.mystere_id) === String(currentM.id)).sort((a, b) => a.question_number - b.question_number);
  }, [allQuestions, currentM]);

  const startRitual = () => {
    if (currentQuestions.length > 0) {
      setHoles([0, 1, 2, 3]); setSeeds(16); setTimeLeft(64); setQIndex(0); setExplanations([]); setIsFinished(false); setView("ritual");
    } else { toast.error("Rituel en préparation..."); }
  };

  const handleDragEndChoice = (info: any, isCorrect: boolean) => {
    setIsOverJar(false);
    const jar = jarRef.current?.getBoundingClientRect();
    if (jar && info.point.x > jar.left && info.point.x < jar.right && info.point.y > jar.top && info.point.y < jar.bottom) {
      if (isCorrect) {
        const nextHoles = holes.slice(1);
        setHoles(nextHoles);
        setExplanations(prev => [...prev, currentQuestions[qIndex].explanation]);
        if (nextHoles.length === 0) {
          setIsFinished(true); confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        } else { setShowExplanation(true); }
      } else {
        setIsWrong(true); setSeeds(s => Math.max(0, s - 1)); toast.error("Vibration discordante"); setTimeout(() => setIsWrong(false), 400);
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-[#a0412d] border-t-transparent rounded-full animate-spin" /></div>;
  if (!currentM) return null;

  return (
    <div className="h-screen w-screen bg-white overflow-hidden relative touch-none font-sans text-[#1a1a1a]">
      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">
        {view === "gallery" ? (
          <motion.div key={currentM.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="h-full flex flex-col items-center justify-center p-6">
            <motion.div
              drag="both" dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.4}
              onDragEnd={(e, info) => {
                if (Math.abs(info.offset.x) > 50) setCurrentIndex((p) => (info.offset.x < 0 ? (p + 1) : (p - 1 + mysteres.length)) % mysteres.length);
                else if (info.offset.y < -50) startRitual();
              }}
              onClick={startRitual}
              className="w-full max-w-lg h-full max-h-[82vh] -mt-12 md:-mt-20 bg-white rounded-[40px] shadow-2xl overflow-hidden border-[6px] border-white cursor-pointer flex flex-col"
            >

              <div className="h-[50%] md:h-[55%] w-full overflow-hidden bg-gray-100 pointer-events-none">
                <img src={`https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/mysteres-assets/${currentM.id}.jpg`} className="h-full w-full object-cover" alt="" />
              </div>
              <div className="p-6 md:p-7 flex flex-col flex-1 bg-white select-none pointer-events-none">
                <h2 className="text-[15px] md:text-[17px] font-bold font-display uppercase tracking-[0.15em] text-[#1a1a1a] leading-tight">
                  {currentM.title}
                </h2>
                <p className="text-[10px] md:text-[11px] font-sans font-bold text-[#a0412d] mt-2 italic uppercase">
                  {currentM.subtitle}
                </p>
                <div className="mt-6 pt-4 border-t border-gray-50 flex-1 overflow-y-auto no-scrollbar">
                  <p className="text-[14px] md:text-[15px] text-gray-500 italic leading-[1.8]">"{currentM.mise_en_abyme}"</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="ritual" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="absolute inset-0 bg-white z-[150] flex flex-col items-center p-4 overflow-hidden">
            <button 
              onClick={() => setView("gallery")}
              className="absolute top-6 left-6 z-[160] px-4 py-2 bg-[#faf9f8] rounded-full flex items-center gap-2 shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a0412d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#a0412d]">Retour</span>
            </button>
            <div className="w-12 h-1 bg-gray-100 rounded-full mb-8 shrink-0" />

            {/* ZONE VISUELLE */}
            <div className="w-full max-w-5xl flex flex-row items-center justify-center gap-4 md:gap-20 h-[160px] mb-12 md:mb-20 shrink-0">
              <OkpeleRitual activeSeeds={Math.ceil(timeLeft / 8)} />
              <div ref={jarRef} className="z-10 flex items-center justify-center">
                <SatoJar holesCount={holes} isOver={isOverJar} />
              </div>
              <AwaleMini seedsCount={seeds} isWrong={isWrong} />
            </div>

            {/* ZONE QUESTION ET LABELS */}
            <div className="w-full max-w-xl flex-1 flex flex-col justify-start pt-0 md:pt-2 pb-4">
              {!isFinished ? (
                !showExplanation ? (
                  <div className="text-center flex flex-col gap-3 md:gap-5">
                    {/* QUESTION EN SANS SERIF */}
                    <h2 className="font-display font-bold text-gray-700 text-base md:text-xl leading-snug px-4 tracking-tight">
                      {currentQuestions[qIndex]?.question}
                    </h2>

                    <div className="flex justify-center items-center gap-10 -mt-2 mb-2">
                      <p className="text-[9px] md:text-[11px] font-sans font-bold uppercase text-gray-400 tracking-wider">
                        Temps : {timeLeft}s
                      </p>
                      <p className="text-[9px] md:text-[11px] font-sans font-bold uppercase text-gray-400 tracking-wider">
                        Graines sacrées : {seeds} / 16
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {['a', 'b', 'c', 'd'].map((l) => (
                        <motion.div key={l} drag dragSnapToOrigin
                          onDrag={(_, info) => {
                            const jar = jarRef.current?.getBoundingClientRect();
                            if (jar) setIsOverJar(info.point.x > jar.left && info.point.x < jar.right && info.point.y > jar.top && info.point.y < jar.bottom);
                          }}
                          onDragEnd={(_, info) => handleDragEndChoice(info, l.toUpperCase() === currentQuestions[qIndex]?.correct_answer)}
                          className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center touch-none z-50 active:scale-95 transition-transform"
                        >
                          <span className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center font-bold text-[#a0412d] mr-3 uppercase text-xs">{l}</span>
                          <span className="font-sans font-bold text-gray-700 text-xs md:text-sm text-left flex-1">{currentQuestions[qIndex]?.[`choice_${l}`]}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div onClick={() => { setShowExplanation(false); setQIndex(p => p + 1); setTimeLeft(64); }} className="p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100/50 text-center cursor-pointer">
                    <p className="text-sm md:text-lg italic font-sans font-medium text-[#a0412d]">"{currentQuestions[qIndex]?.explanation}"</p>
                    <p className="text-[9px] mt-4 uppercase tracking-widest font-sans font-black text-gray-300">Tapoter pour continuer</p>
                  </div>
                )
              ) : (
                <div className="text-center px-4">
                  <h2 className="text-xl md:text-2xl font-sans font-black mb-2 uppercase text-[#a0412d]">Mystère Révélé</h2>
                  <div className="bg-white p-4 rounded-[2rem] text-left mb-4 space-y-2 border border-gray-50 max-h-40 overflow-y-auto no-scrollbar">
                    {explanations.map((exp, i) => <p key={i} className="text-[11px] font-sans text-gray-500 flex items-start"><span className="text-[#a0412d] mr-2">✦</span> {exp}</p>)}
                  </div>
                  <button onClick={() => setView("gallery")} className="w-full py-3 bg-[#a0412d] text-white rounded-full font-sans font-bold uppercase tracking-widest text-[10px] shadow-lg">Autre mystère</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}