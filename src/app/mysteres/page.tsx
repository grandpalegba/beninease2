"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner";
import { confetti } from "tsparticles-confetti";

const SUPABASE_URL = "https://wtjhkqkqmexddroqwawk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0amhrcWtxbWV4ZGRyb3F3YXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDU3NzQsImV4cCI6MjA4OTg4MTc3NH0.TdaWEVQxKF6s2j-7QStHZaFbOqs4e3UHVUN7iGQL_vc";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- COMPOSANTS VISUELS ---

const OkpeleSeed = ({ active }: { active: boolean }) => (
  <div className="flex flex-col items-center relative">
    <div
      className="w-10 h-12 shadow-md relative overflow-hidden transition-all duration-500"
      style={{
        backgroundColor: '#a0412d', // Couleur Clay unifiée
        borderRadius: '50% 50% 45% 45% / 70% 70% 30% 30%',
        opacity: active ? 1 : 0.2
      }}
    >
      <div className={`absolute inset-0 ${active ? 'bg-gradient-to-br from-white/20 to-black/30' : 'bg-black/10'}`} />
      {active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-7 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]"
        />
      )}
    </div>
  </div>
);

const SatoJar = ({ holesCount, isOver }: { holesCount: number[], isOver: boolean }) => (
  <div className={`relative w-64 h-80 md:w-72 md:h-96 transition-transform duration-500 ${isOver ? 'scale-105' : 'scale-100'}`}>
    {/* Col de la jarre (Lip) - Inspiré de ton code HTML */}
    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#3d1810] rounded-[50%] shadow-inner border-2 border-[#a0412d]/20 z-20" />

    {/* Corps de la jarre */}
    <div className="absolute inset-0"
      style={{
        background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
        borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
        boxShadow: 'inset -12px -12px 30px rgba(0,0,0,0.4), 0 25px 50px rgba(0,0,0,0.25)',
      }}>
      {/* Ombre supérieure interne */}
      <div className="absolute top-0 w-full h-12 bg-gradient-to-b from-black/30 to-transparent rounded-t-[45%]" />

      <div className="relative w-full h-full p-8">
        <AnimatePresence>
          {holesCount.map((hIdx) => (
            <motion.div key={hIdx} exit={{ opacity: 0, scale: 2, filter: "blur(4px)" }}
              className={`absolute rounded-full bg-[#1a0a07] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.9)]
                ${hIdx === 0 ? 'top-[35%] left-[25%] w-10 h-10' : hIdx === 1 ? 'top-[28%] left-[55%] w-8 h-8' : hIdx === 2 ? 'top-[58%] left-[38%] w-12 h-12' : 'top-[52%] left-[68%] w-7 h-7'}`}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

const AwaleMini = ({ seedsCount, isWrong }: { seedsCount: number, isWrong: boolean }) => (
  <motion.div animate={isWrong ? { x: [-2, 2, -2, 2, 0] } : {}}
    className="w-28 bg-[#a0412d] rounded-[2rem] p-3 shadow-xl flex justify-center gap-3 border-[3px] border-[#7a2a1b] scale-90 opacity-80"
  >
    {[0, 1].map((col) => (
      <div key={col} className="grid grid-cols-1 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-[#3d1810] rounded-full shadow-inner flex flex-wrap justify-center items-center p-1 gap-0.5">
            {seedsCount > (col * 4 + i) * 2 && <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]" />}
            {seedsCount > (col * 4 + i) * 2 + 1 && <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]" />}
          </div>
        ))}
      </div>
    ))}
  </motion.div>
);

// --- COMPOSANT RITUEL (Container) ---
const OkpeleRitual = ({ activeSeeds }: { activeSeeds: number }) => (
  <div className="relative flex flex-col items-center scale-75 md:scale-90 opacity-80">
    <div className="w-20 h-10 border-t-[1.5px] border-x-[1.5px] border-yellow-600/30 rounded-t-full absolute -top-6 left-1/2 -translate-x-1/2" />
    <div className="flex gap-10 relative pt-4">
      {[0, 4].map((start) => (
        <div key={start} className="flex flex-col items-center">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <OkpeleSeed active={activeSeeds > start + i} />
              {i < 3 && <div className="w-[1.5px] h-3 bg-yellow-600/20" />}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  </div>
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
        if (tData) setThemes(tData.reduce((acc, t) => ({ ...acc, [t.id]: t.name }), {}));
        if (mData) setMysteres([...mData].sort(() => Math.random() - 0.5));
        if (qData) setAllQuestions(qData);
      } catch (e) { toast.error("Erreur réseau"); } finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const currentQuestions = useMemo(() => {
    const currentM = mysteres[currentIndex];
    return currentM ? allQuestions.filter(q => q.mystere_id === currentM.id).sort((a, b) => a.question_number - b.question_number) : [];
  }, [allQuestions, mysteres, currentIndex]);

  useEffect(() => {
    if (view !== "ritual" || isFinished || showExplanation || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [view, isFinished, showExplanation, timeLeft]);

  const handleNextMystery = () => {
    setCurrentIndex((prev) => (prev + 1) % mysteres.length);
    setView("gallery");
    setExplanations([]);
    setIsFinished(false);
    setQIndex(0);
  };

  const handleDragEndChoice = (info: any, isCorrect: boolean) => {
    setIsOverJar(false);
    const jar = jarRef.current?.getBoundingClientRect();
    if (jar && info.point.x > jar.left && info.point.x < jar.right && info.point.y > jar.top && info.point.y < jar.bottom) {
      if (isCorrect) {
        const nextHoles = holes.slice(1);
        setHoles(nextHoles);
        setExplanations(prev => [...prev, currentQuestions[qIndex]?.explanation || ""]);
        if (nextHoles.length === 0) {
          setIsFinished(true);
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        } else { setShowExplanation(true); }
      } else {
        setIsWrong(true);
        setSeeds(s => Math.max(0, s - 1)); // Modification : Seulement 1 graine perdue
        setTimeout(() => setIsWrong(false), 400);
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-[#a0412d] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen w-screen bg-white overflow-hidden relative touch-none font-sans text-[#1A1A1A]">
      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">
        {view === "gallery" ? (
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center p-6">
            <div className="relative w-full max-w-[340px] h-[600px] flex items-center justify-center">
              <AnimatePresence initial={false}>
                {mysteres.map((m, idx) => idx === currentIndex && (
                  <motion.div
                    key={m.id}
                    drag="x" dragConstraints={{ left: 0, right: 0 }}
                    onTap={() => currentQuestions.length > 0 ? (setHoles([0, 1, 2, 3]), setView("ritual"), setTimeLeft(64)) : toast.error("Mystère bientôt disponible")}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 80 && currentIndex > 0) setCurrentIndex(p => p - 1);
                      else if (info.offset.x < -80 && currentIndex < mysteres.length - 1) setCurrentIndex(p => p + 1);
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}
                    className="absolute w-[320px] h-[580px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[6px] border-white cursor-pointer flex flex-col"
                  >
                    <div className="pt-6 pb-2 text-center pointer-events-none">
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.4em]">{themes[m.theme_id]}</span>
                    </div>
                    <div className="h-[60%] w-full overflow-hidden pointer-events-none">
                      <img src={`https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/mysteres-assets/${m.id}.jpg`} className="h-full w-full object-cover" alt="" />
                    </div>
                    <div className="p-7 flex flex-col flex-1 pointer-events-none">
                      <h2 className="text-[20px] font-black leading-tight uppercase">{m.title}</h2>
                      <p className="text-[10px] font-bold text-[#a0412d] mt-1 uppercase italic">{m.subtitle}</p>
                      <p className="text-[14px] text-gray-400 italic mt-4 leading-relaxed">"{m.mise_en_abyme}"</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ritual"
            drag="y" dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => { if (info.offset.y > 120) handleNextMystery(); }}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            className="absolute inset-0 bg-white z-50 flex flex-col items-center p-6 overflow-hidden"
          >
            <div className="w-full flex flex-row items-center justify-center gap-4 md:gap-12 h-[350px] shrink-0 pt-4">
              <OkpeleRitual activeSeeds={Math.ceil(timeLeft / 8)} />
              <div ref={jarRef} className="z-10"><SatoJar holesCount={holes} isOver={isOverJar} /></div>
              <AwaleMini seedsCount={seeds} isWrong={isWrong} />
            </div>

            <div className="w-full max-w-xl mt-16 flex-1">
              {!isFinished ? (
                !showExplanation ? (
                  <div className="text-center px-4">
                    <h2 className="text-lg font-bold mb-10 text-gray-700 leading-relaxed">{currentQuestions[qIndex]?.question}</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {['a', 'b', 'c', 'd'].map((l) => currentQuestions[qIndex]?.[`choice_${l}`] && (
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
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    onClick={() => { setShowExplanation(false); setQIndex(p => p + 1); setHoles([0, 1, 2, 3]); setTimeLeft(64); }}
                    className="p-8 bg-orange-50 rounded-[2.5rem] text-center cursor-pointer border border-orange-100 shadow-sm mx-4"
                  >
                    <p className="text-lg italic font-medium text-[#a0412d]">"{currentQuestions[qIndex]?.explanation}"</p>
                    <p className="text-[10px] mt-8 uppercase tracking-widest font-black text-gray-300 animate-pulse">Toucher pour la suite</p>
                  </motion.div>
                )
              ) : (
                <div className="text-center px-4">
                  <h2 className="text-2xl font-black mb-4 uppercase text-[#a0412d]">Secret Révélé</h2>
                  <div className="bg-white p-6 rounded-[2.5rem] text-left mb-6 space-y-4 border border-gray-50 shadow-inner max-h-[250px] overflow-y-auto no-scrollbar">
                    {explanations.map((exp, i) => <p key={i} className="text-sm text-gray-600 leading-relaxed"><span className="text-[#a0412d] mr-2">✦</span> {exp}</p>)}
                  </div>
                  <button onClick={handleNextMystery} className="w-full py-5 bg-[#a0412d] text-white rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-transform">Découvrir le suivant</button>
                </div>
              )}
            </div>
            <p className="text-[8px] mb-4 text-gray-300 uppercase font-bold tracking-[0.3em]">Glisser vers le bas pour quitter</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}