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

// --- COMPOSANTS VISUELS AFFINÉS (Style Image 2) ---

const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className="flex flex-col items-center relative z-10">
    <div
      className="w-10 h-12 shadow-md relative overflow-hidden transition-all duration-500"
      style={{
        backgroundColor: '#833321',
        borderRadius: '50% 50% 45% 45% / 70% 70% 30% 30%',
        opacity: active ? 1 : 0.2
      }}
    >
      <div className={`absolute inset-0 ${active ? 'bg-gradient-to-br from-white/20 to-black/30' : 'bg-black/10'}`} />
      {active && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-7 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]"
        />
      )}
    </div>
  </div>
);

const OkpeleRitual = ({ activeSeeds }: { activeSeeds: number }) => (
  <div className="relative flex flex-col items-center scale-90">
    {/* Arche de connexion fine */}
    <div className="w-20 h-10 border-t-[1.2px] border-x-[1.2px] border-yellow-600/40 rounded-t-full absolute -top-6 left-1/2 -translate-x-1/2 z-0" />
    <div className="flex gap-10 relative z-10 pt-4">
      <div className="flex flex-col items-center">
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={`l-${i}`}>
            <OkpeleSeed active={activeSeeds > i} />
            {i < 3 && <div className="w-[1px] h-3 bg-yellow-600/40" />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex flex-col items-center">
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={`r-${i}`}>
            <OkpeleSeed active={activeSeeds > i + 4} />
            {i < 3 && <div className="w-[1px] h-3 bg-yellow-600/40" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

const SatoJar = ({ holesCount, isOver }: { holesCount: number[], isOver: boolean }) => (
  <div className={`relative w-64 h-80 md:w-72 md:h-96 shrink-0 transition-transform duration-500 ${isOver ? 'scale-105' : 'scale-100'}`}>
    {/* Col de la jarre (Sommet) */}
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-6 bg-[#3d1810] rounded-[50%_50%_20%_20%] z-20 shadow-lg border-b border-[#2d110b]" />

    <div className="absolute inset-0 mt-2 overflow-hidden"
      style={{
        background: isOver
          ? 'linear-gradient(165deg, #b34a35 0%, #8b3422 45%, #6a2418 100%)'
          : 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
        borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
        boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.2), 0 20px 40px rgba(0,0,0,0.15)',
      }}>
      <div className="relative w-full h-full p-8">
        <AnimatePresence>
          {holesCount.map((hIdx) => (
            <motion.div key={hIdx} exit={{ opacity: 0, scale: 1.5 }}
              className={`absolute rounded-full bg-[#1a0a07] shadow-inner
                ${hIdx === 0 ? 'top-[35%] left-[25%] w-8 h-8' : hIdx === 1 ? 'top-[28%] left-[55%] w-7 h-7' : hIdx === 2 ? 'top-[58%] left-[38%] w-10 h-10' : 'top-[52%] left-[68%] w-6 h-6'}`}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

const AwaleMini = ({ seedsCount, isWrong }: { seedsCount: number, isWrong: boolean }) => (
  <motion.div animate={isWrong ? { x: [-1, 1, -1, 1, 0] } : {}}
    className="relative w-32 bg-[#833321] rounded-[2rem] p-4 shadow-xl flex flex-row justify-center gap-4 border-[3px] border-[#652719] shrink-0"
  >
    {[...Array(2)].map((_, col) => (
      <div key={col} className="grid grid-cols-1 gap-3 z-10">
        {[...Array(4)].map((_, i) => (
          <div key={`${col}-${i}`} className="w-8 h-8 bg-[#532015] rounded-full shadow-inner flex items-center justify-center">
            <div className="flex gap-0.5 flex-wrap justify-center p-1">
              {seedsCount > (col * 4 + i) * 2 && <div className="w-2 h-2 rounded-full bg-yellow-400" />}
              {seedsCount > (col * 4 + i) * 2 + 1 && <div className="w-2 h-2 rounded-full bg-yellow-400" />}
            </div>
          </div>
        ))}
      </div>
    ))}
  </motion.div>
);

// --- PAGE PRINCIPALE ---

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
      try {
        const { data: mData } = await supabase.from('mysteres').select('*');
        const { data: qData } = await supabase.from('questions').select('*');
        const { data: tData } = await supabase.from('themes').select('id, name');
        if (tData) setThemes(tData.reduce((acc: any, t: any) => ({ ...acc, [t.id]: t.name }), {}));
        if (mData) setMysteres([...mData].sort(() => Math.random() - 0.5));
        if (qData) setAllQuestions(qData);
      } catch (e) {
        toast.error("Connexion interrompue");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const currentM = mysteres[currentIndex] || null;
  const currentQuestions = useMemo(() => {
    if (!currentM) return [];
    return allQuestions.filter(q => q.mystere_id === currentM.id).sort((a, b) => a.question_number - b.question_number);
  }, [allQuestions, currentM]);

  useEffect(() => {
    if (view !== "ritual" || isFinished || showExplanation || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [view, isFinished, showExplanation, timeLeft]);

  const startRitual = () => {
    if (currentQuestions.length > 0) {
      setHoles([0, 1, 2, 3]); setSeeds(16); setTimeLeft(64); setQIndex(0); setExplanations([]); setIsFinished(false); setView("ritual");
    } else {
      toast.error("Ce secret est encore scellé.");
    }
  };

  const handleDragEndChoice = (info: any, isCorrect: boolean) => {
    setIsOverJar(false);
    const jar = jarRef.current?.getBoundingClientRect();
    if (jar && info.point.x > jar.left && info.point.x < jar.right && info.point.y > jar.top && info.point.y < jar.bottom) {
      if (isCorrect) {
        const nextHoles = holes.slice(1);
        setHoles(nextHoles);
        setExplanations(prev => [...prev, currentQuestions[qIndex]?.explanation || "Sagesse acquise"]);
        if (nextHoles.length === 0) {
          setIsFinished(true);
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        } else {
          setShowExplanation(true);
        }
      } else {
        setIsWrong(true);
        setSeeds(s => Math.max(0, s - 2));
        toast.error("Vibration discordante");
        setTimeout(() => setIsWrong(false), 400);
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-[#a0412d] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen w-screen bg-white overflow-hidden relative touch-none font-sans text-[#1A1A1A]">
      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">
        {view === "gallery" ? (
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center p-6">
            <div className="relative w-full max-w-[340px] h-[620px] flex items-center justify-center">
              <AnimatePresence initial={false}>
                {mysteres.map((m, idx) => idx === currentIndex && (
                  <motion.div
                    key={m.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    // onTap est le déclencheur de clic le plus robuste avec drag
                    onTap={startRitual}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 80 && currentIndex > 0) setCurrentIndex(p => p - 1);
                      else if (info.offset.x < -80 && currentIndex < mysteres.length - 1) setCurrentIndex(p => p + 1);
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ x: 300, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -300, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute w-[320px] h-[580px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[6px] border-white cursor-pointer flex flex-col"
                  >
                    <div className="pt-6 pb-2 text-center pointer-events-none">
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.4em]">
                        {themes[m.theme_id] || "Bénin"}
                      </span>
                    </div>

                    <div className="h-[65%] w-full overflow-hidden pointer-events-none select-none">
                      <img
                        src={`https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/mysteres-assets/${m.id}.jpg`}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>

                    <div className="p-7 flex flex-col flex-1 pointer-events-none">
                      <h2 className="text-[22px] font-black leading-tight uppercase tracking-tight">{m.title}</h2>
                      <p className="text-[10px] font-bold text-[#a0412d] mt-1 italic uppercase tracking-wider">{m.subtitle}</p>
                      <div className="mt-4 flex-1">
                        <p className="text-[14px] text-gray-400 italic leading-relaxed">"{m.mise_en_abyme}"</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ritual"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            className="absolute inset-0 bg-white z-50 flex flex-col items-center p-6 overflow-y-auto no-scrollbar"
          >
            {/* ZONE VISUELLE HAUTE FIDÉLITÉ */}
            <div className="w-full max-w-5xl flex flex-row items-center justify-center gap-10 h-[400px] shrink-0 pt-4">
              <OkpeleRitual activeSeeds={Math.ceil(timeLeft / 8)} />
              <div ref={jarRef} className="z-10 relative pt-4">
                <SatoJar holesCount={holes} isOver={isOverJar} />
              </div>
              <AwaleMini seedsCount={seeds} isWrong={isWrong} />
            </div>

            <div className="w-full max-w-xl pb-10">
              {!isFinished ? (
                !showExplanation ? (
                  <div className="text-center">
                    <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold mb-10 text-gray-700 leading-relaxed px-4">
                      {currentQuestions[qIndex]?.question}
                    </motion.h2>
                    <div className="grid grid-cols-1 gap-3">
                      {['a', 'b', 'c', 'd'].map((l) => (
                        currentQuestions[qIndex]?.[`choice_${l}`] && (
                          <motion.div key={l} drag dragSnapToOrigin
                            onDrag={(_, info) => {
                              const jar = jarRef.current?.getBoundingClientRect();
                              if (jar) setIsOverJar(info.point.x > jar.left && info.point.x < jar.right && info.point.y > jar.top && info.point.y < jar.bottom);
                            }}
                            onDragEnd={(_, info) => handleDragEndChoice(info, l.toUpperCase() === currentQuestions[qIndex]?.correct_answer)}
                            className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-grab active:cursor-grabbing flex items-center touch-none z-50"
                          >
                            <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center font-bold text-[#a0412d] mr-4 uppercase">{l}</span>
                            <span className="font-bold text-gray-600 text-sm text-left">{currentQuestions[qIndex][`choice_${l}`]}</span>
                          </motion.div>
                        )
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    onClick={() => { setShowExplanation(false); setQIndex(p => p + 1); setTimeLeft(64); }}
                    className="p-8 bg-orange-50 rounded-[2rem] text-center cursor-pointer border border-orange-100 shadow-sm"
                  >
                    <p className="text-lg italic font-medium text-[#a0412d]">"{currentQuestions[qIndex]?.explanation}"</p>
                    <p className="text-[10px] mt-6 uppercase tracking-widest font-black text-gray-300">Toucher pour la suite</p>
                  </motion.div>
                )
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-black mb-4 uppercase text-[#a0412d]">Secret Révélé</h2>
                  <div className="bg-white p-6 rounded-[2rem] text-left mb-6 space-y-3 border border-gray-50 shadow-inner">
                    {explanations.map((exp, i) => <p key={i} className="text-sm text-gray-600 leading-relaxed"><span className="text-[#a0412d] mr-2">✦</span> {exp}</p>)}
                  </div>
                  <button onClick={() => setView("gallery")} className="w-full py-4 bg-[#a0412d] text-white rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-transform">Explorer d'autres visages</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}