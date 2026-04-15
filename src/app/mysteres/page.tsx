"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner";
import { confetti } from "tsparticles-confetti";
import { HourglassTimer } from "@/components/mysteres/HourglassTimer";

const SUPABASE_URL = "https://wtjhkqkqmexddroqwawk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0amhrcWtxbWV4ZGRyb3F3YXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDU3NzQsImV4cCI6MjA4OTg4MTc3NH0.TdaWEVQxKF6s2j-7QStHZaFbOqs4e3UHVUN7iGQL_vc";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function MysterePage() {
  const [mysteres, setMysteres] = useState<any[]>([]);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState<"gallery" | "game" | "locked" | "success">("gallery");
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(8);
  const [points, setPoints] = useState(0);
  const [filledHoles, setFilledHoles] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [password, setPassword] = useState("");
  
  const [explanations, setExplanations] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: mData } = await supabase.from('mysteres').select('*');
      const { data: qData } = await supabase.from('questions').select('*');
      if (mData) setMysteres(shuffleArray(mData));
      if (qData) setAllQuestions(qData);
      const savedPoints = localStorage.getItem("beninease_points");
      if (savedPoints) setPoints(parseInt(savedPoints));
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (view !== "game" || timeLeft <= 0 || filledHoles === 4) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    if (timeLeft === 1) handleFailure();
    return () => clearInterval(timer);
  }, [view, timeLeft, filledHoles]);

  const currentM = mysteres[currentIndex];

  const currentQuestions = useMemo(() => {
    if (!currentM || !allQuestions.length) return [];
    return allQuestions
      .filter(q => q.mystere_id === currentM.id)
      .sort((a, b) => (a.question_number || 0) - (b.question_number || 0))
      .slice(0, 4); 
  }, [allQuestions, currentM]);

  const updatePoints = (amount: number) => {
    setPoints(prev => {
      const total = prev + amount;
      localStorage.setItem("beninease_points", String(total));
      return total;
    });
  };

  const handleFailure = () => {
    toast.error("L'énergie s'échappe...");
    setLives(l => {
      if (l <= 1) { setView("locked"); return 0; }
      return l - 1;
    });
  };

  const handleChoice = (choiceLetter: string, info: any) => {
    if (info.point.y < 350) {
      const currentQ = currentQuestions[qIndex];
      if (choiceLetter === currentQ?.correct_answer) {
        const isLast = qIndex === 3;
        
        setFilledHoles(h => h + 1);
        updatePoints(isLast ? 20 : 10);
        
        if (currentQ.explanation) {
          setExplanations(prev => [...prev, currentQ.explanation]);
        }

        if (!isLast) {
          toast.success("Correct !");
          setTimeout(() => { 
            setQIndex(prev => prev + 1); 
            setTimeLeft(60); 
          }, 600);
        } else {
          toast.success("Mystère résolu ! Bonus +10 pts");
          confetti({ 
            particleCount: 200, 
            spread: 90, 
            origin: { y: 0.6 }, 
            colors: ['#fdb813', '#a0412d', '#ffffff'] 
          });
          // On reste dans la vue game pour le récapitulatif final
        }
      } else {
        handleFailure();
      }
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#faf9f8]">
      <div className="w-12 h-12 border-4 border-[#a0412d] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#faf9f8] overflow-hidden touch-none relative">
      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">
        
        {/* GALERIE : Navigation entre les 256 mystères */}
        {view === "gallery" && (
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center p-6">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onTap={() => {
                setView("game");
                setExplanations([]);
                setFilledHoles(0);
                setQIndex(0);
              }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -60) setCurrentIndex(prev => (prev + 1) % mysteres.length);
                else if (info.offset.x > 60) setCurrentIndex(prev => (prev - 1 + mysteres.length) % mysteres.length);
              }}
              className="w-full max-w-[320px] h-[520px] bg-white rounded-[45px] shadow-2xl border-[10px] border-white overflow-hidden cursor-pointer flex flex-col"
            >
              <img src={currentM?.cover_image_url} className="h-1/2 w-full object-cover pointer-events-none" alt={currentM?.title}/>
              <div className="p-7 flex flex-col justify-between h-1/2 pointer-events-none">
                <div>
                  <h2 className="text-2xl font-black text-[#3d1810] uppercase leading-tight">{currentM?.title}</h2>
                  <p className="text-[11px] font-bold text-[#a0412d] mt-1 italic uppercase tracking-wider">{currentM?.subtitle}</p>
                </div>
                <p className="text-[13px] text-gray-500 italic leading-relaxed line-clamp-4">"{currentM?.mise_en_abyme}"</p>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-300 uppercase">Mystère</span>
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[10px]">🏺</div>
                </div>
              </div>
            </motion.div>
            <div className="mt-8 text-center">
                <span className="text-xl font-black text-[#a0412d]">⭐ {points} XP</span>
                <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mt-2 animate-pulse">Swipe pour naviguer • Tap pour entrer</p>
            </div>
          </motion.div>
        )}

        {/* JEU ET RÉVÉLATIONS FINALES */}
        {view === "game" && (
          <motion.div key="game" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="absolute inset-0 bg-white z-50 flex flex-col overflow-hidden">
            <div className="h-14 flex items-center justify-center shrink-0 cursor-pointer" onClick={() => setView("gallery")}>
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            <div ref={scrollContainerRef} className="px-6 flex-1 overflow-y-auto no-scrollbar pb-24">
               <h1 className="text-xl font-black text-[#a0412d] uppercase text-center mb-6">{currentM?.title}</h1>
               
               {/* UI STATS : Masquées une fois le quiz fini */}
               {filledHoles < 4 && (
                 <div className="flex justify-between w-full max-w-xs mx-auto items-center mb-8">
                    <HourglassTimer timeLeft={timeLeft} isFlipping={false} />
                    <div className="flex gap-1">
                      {Array.from({length: 8}).map((_, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < lives ? 'bg-[#fdb813]' : 'bg-gray-100'}`} />
                      ))}
                    </div>
                 </div>
               )}

               {/* LA JARRE */}
               <div className="flex justify-center mb-10">
                 <div className="w-28 h-36 bg-[#a0412d] rounded-t-[45px] rounded-b-[20px] shadow-2xl flex items-center justify-center border-b-4 border-[#7a2a1b]">
                    <div className="grid grid-cols-2 gap-3">
                        {[1,2,3,4].map(h => (
                          <motion.div key={h} animate={h <= filledHoles ? { scale: 1.3, opacity: 1 } : { opacity: 0.1 }} className={`w-3 h-3 rounded-full ${h <= filledHoles ? 'bg-[#fdb813] shadow-[0_0_10px_#fdb813]' : 'bg-black'}`} />
                        ))}
                    </div>
                 </div>
               </div>

               {/* PHASE 1 : LE QUIZ */}
               <AnimatePresence mode="wait">
                 {filledHoles < 4 ? (
                    <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md mx-auto">
                      <p className="text-center font-bold text-[#3d1810] text-lg px-4 mb-8 leading-snug">
                        {currentQuestions[qIndex]?.question}
                      </p>
                      <div className="space-y-3">
                        {['A', 'B', 'C', 'D'].map(l => (
                          <motion.div 
                            key={l} 
                            drag dragConstraints={{ left: 0, right: 0, top: -400, bottom: 0 }}
                            dragSnapToOrigin 
                            onDragEnd={(e, info) => handleChoice(l, info)} 
                            className="p-4 bg-[#faf9f8] border border-gray-100 rounded-2xl flex items-center cursor-grab active:scale-95 shadow-sm"
                          >
                            <span className="w-9 h-9 bg-white text-[#a0412d] rounded-xl flex items-center justify-center font-black mr-4 shadow-inner">{l}</span>
                            <span className="text-sm font-semibold text-gray-700 leading-snug">
                              {currentQuestions[qIndex]?.[`choice_${l.toLowerCase()}`]}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                 ) : (
                    /* PHASE 2 : LE PARCHEMIN DES RÉVÉLATIONS */
                    <motion.div key="recap" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md mx-auto space-y-8">
                      <div className="bg-[#3d1810] p-6 rounded-[35px] shadow-2xl border-2 border-[#fdb813] text-center">
                        <span className="text-[10px] font-black text-[#fdb813] uppercase tracking-[0.3em]">Inspiration Sacrée</span>
                        <p className="text-white italic text-base mt-3 leading-relaxed">
                          "{currentM?.inspiration}"
                        </p>
                      </div>

                      <div className="space-y-4 pb-8">
                        <h3 className="text-[#a0412d] font-black text-xs uppercase tracking-widest text-center mb-4">Les 4 Savoirs Débloqués</h3>
                        {explanations.map((exp, i) => (
                          <motion.div 
                            initial={{ x: -20, opacity: 0 }} 
                            animate={{ x: 0, opacity: 1 }} 
                            transition={{ delay: i * 0.15 }} 
                            key={i} 
                            className="bg-orange-50/50 p-5 rounded-2xl border-l-4 border-[#a0412d]"
                          >
                            <p className="text-[9px] font-black text-[#a0412d] uppercase mb-1">Révélation #{i+1}</p>
                            <p className="text-[13px] text-gray-700 leading-relaxed font-medium">{exp}</p>
                          </motion.div>
                        ))}
                      </div>

                      <button 
                        onClick={() => {
                          setView("gallery");
                          setCurrentIndex(prev => (prev + 1) % mysteres.length);
                        }}
                        className="w-full py-5 bg-[#a0412d] text-white rounded-full font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
                      >
                        Passer au Mystère Suivant
                      </button>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* MODE POWER (BLOQUÉ) */}
        {view === "locked" && (
          <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white z-[100] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6">🏺</div>
            <h2 className="text-3xl font-black text-[#a0412d] mb-4 uppercase">Source Épuisée</h2>
            <p className="text-gray-400 text-sm mb-10 max-w-xs">Votre force vitale est vide. Prononcez le mot de pouvoir pour restaurer la jarre.</p>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Mot de Pouvoir" 
              className="w-full max-w-xs p-5 bg-gray-50 border-none rounded-3xl mb-4 text-center font-bold text-xl outline-none" 
            />
            <button 
              onClick={() => { if(password.toLowerCase() === "benin"){ setLives(8); setView("gallery"); setPassword(""); }}} 
              className="w-full max-w-xs bg-[#3d1810] text-white p-5 rounded-3xl font-black uppercase text-sm tracking-widest shadow-xl"
            >
              Restaurer la Vie
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}