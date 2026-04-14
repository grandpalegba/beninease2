"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner";
import { confetti } from "tsparticles-confetti";
import { HourglassTimer } from "@/components/mysteres/HourglassTimer";

// ─── CONFIGURATION SUPABASE ─────────────────────────────────────────────────
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
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState<"gallery" | "game" | "locked" | "tresor">("gallery");
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(8);
  const [points, setPoints] = useState(0);
  const [filledHoles, setFilledHoles] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data: mData } = await supabase.from('mysteres').select('*');
      const { data: qData } = await supabase.from('questions').select('*');
      if (mData) setMysteres(shuffleArray(mData));
      if (qData) setQuestions(qData);
      const savedPoints = localStorage.getItem("beninease_points");
      if (savedPoints) setPoints(parseInt(savedPoints));
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (view !== "game" || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    if (timeLeft === 1) handleFailure();
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  const currentM = mysteres[currentIndex];
  const currentQuestions = useMemo(() => {
    if (!currentM) return [];
    return questions
      .filter(q => q.mystere_id === currentM.id)
      .sort((a, b) => parseInt(a.question_number) - parseInt(b.question_number));
  }, [questions, currentIndex, mysteres]);

  const handleFailure = () => {
    toast.error("La jarre rejette votre offrande...");
    setLives(l => {
      if (l <= 1) { setView("locked"); return 0; }
      return l - 1;
    });
  };

  const handleDrop = (choiceLetter: string, info: any) => {
    if (info.point.y < 350) {
      const correct = currentQuestions[qIndex].correct_answer;
      if (choiceLetter === correct) {
        setFilledHoles(h => h + 1);
        setPoints(p => {
          const np = p + 10;
          localStorage.setItem("beninease_points", String(np));
          return np;
        });
        if (qIndex < 3) {
          toast.success("L'esprit est satisfait.");
          setTimeout(() => { setQIndex(i => i + 1); setTimeLeft(60); }, 800);
        } else {
          confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
          setTimeout(() => setView("tresor"), 600);
        }
      } else {
        handleFailure();
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#faf9f8]"><div className="w-12 h-12 border-4 border-[#a0412d] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen w-screen bg-[#faf9f8] overflow-hidden touch-none relative font-sans">
      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">
        {/* --- GALERIE --- */}
        {view === "gallery" && (
          <motion.div key="gallery" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="h-full flex flex-col items-center justify-center p-6">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -80) setCurrentIndex(prev => (prev + 1) % mysteres.length);
                if (info.offset.x > 80) setCurrentIndex(prev => (prev - 1 + mysteres.length) % mysteres.length);
              }}
              onClick={() => setView("game")}
              className="w-full max-w-[320px] h-[550px] bg-white rounded-[45px] shadow-2xl border-[10px] border-white overflow-hidden cursor-pointer flex flex-col"
            >
              <img 
                src={currentM.cover_image_url || `https://via.placeholder.com/320x240/3d1810/ffffff?text=Mystère+${currentM.mystere_number}`} 
                className="h-1/2 w-full object-cover bg-orange-50" 
                alt={currentM.title}
                onError={(e) => { 
                  console.log('Image error:', currentM.cover_image_url);
                  e.currentTarget.src = `https://via.placeholder.com/320x240/3d1810/ffffff?text=Mystère+${currentM.mystere_number}`;
                }}
              />
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-black text-[#3d1810] uppercase leading-tight">{currentM.title}</h2>
                  <p className="text-[11px] font-bold text-[#a0412d] mt-1 italic">{currentM.subtitle}</p>
                </div>
                <div className="mt-4 pt-5 border-t border-orange-50">
                  <p className="text-[13px] text-gray-500 leading-relaxed italic line-clamp-6">"{currentM.mise_en_abyme}"</p>
                </div>
              </div>
            </motion.div>
            <div className="mt-8 flex flex-col items-center gap-2">
                <span className="text-[14px] font-black text-[#a0412d]">⭐ {points} pts</span>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest animate-pulse">Swipe pour explorer</p>
            </div>
          </motion.div>
        )}

        {/* --- JEU --- */}
        {view === "game" && (
          <motion.div key="game" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="absolute inset-0 bg-white z-50 flex flex-col">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4" onClick={() => setView("gallery")} />
            <div className="px-6 flex-1 flex flex-col items-center overflow-y-auto pb-10">
               <h1 className="text-2xl font-black text-[#a0412d] uppercase text-center mt-6">{currentM.title}</h1>
               <div className="mt-6 flex justify-between w-full max-w-sm px-4">
                  <HourglassTimer timeLeft={timeLeft} isFlipping={false} />
                  <div className="flex flex-col items-end">
                    <div className="flex gap-1">{Array.from({length: 8}).map((_, i) => (<div key={i} className={`w-2.5 h-2.5 rounded-full ${i < lives ? 'bg-[#fdb813]' : 'bg-gray-100'}`} />))}</div>
                    <span className="text-[9px] font-black text-gray-300 uppercase mt-1">Graines de Vie</span>
                  </div>
               </div>
               <div className="relative my-8">
                 <div className="w-36 h-48 bg-[#a0412d] rounded-t-[55px] rounded-b-[30px] shadow-2xl flex flex-col items-center justify-center border-b-8 border-[#7a2a1b]">
                    <div className="mt-10 grid grid-cols-2 gap-4">
                        {[1,2,3,4].map(h => (<motion.div key={h} animate={h <= filledHoles ? { scale: [1, 1.3, 1], opacity: 1 } : { opacity: 0.1 }} className={`w-4 h-4 rounded-full ${h <= filledHoles ? 'bg-[#fdb813] shadow-[0_0_15px_#fdb813]' : 'bg-black'}`} />))}
                    </div>
                 </div>
               </div>
               <div className="w-full max-w-md space-y-3 px-2">
                  <p className="text-center font-bold text-[#3d1810] text-lg mb-4">{currentQuestions[qIndex]?.question}</p>
                  {['A', 'B', 'C', 'D'].map(l => (
                    <motion.div key={l} drag dragSnapToOrigin onDragEnd={(e, info) => handleDrop(l, info)} whileDrag={{ scale: 1.05, zIndex: 100 }} className="p-4 bg-[#faf9f8] border-2 border-gray-50 rounded-[25px] flex items-center cursor-grab active:cursor-grabbing group touch-none shadow-sm">
                      <span className="w-10 h-10 bg-white text-[#a0412d] shadow-sm rounded-xl flex items-center justify-center font-black mr-4">{l}</span>
                      <span className="text-sm font-bold text-gray-700 leading-snug">{currentQuestions[qIndex]?.[`choice_${l.toLowerCase()}`]}</span>
                    </motion.div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {/* --- TRÉSOR --- */}
        {view === "tresor" && (
          <motion.div key="tresor" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-[#1a0f0a] z-[60] flex flex-col items-center justify-center p-8 text-center text-white">
            <h2 className="text-[#fdb813] font-black tracking-[0.4em] uppercase mb-8 text-xs">Trésor Découvert</h2>
            <img 
              src={currentM.tresor_image_url} 
              className="w-72 h-72 object-contain mb-8 drop-shadow-[0_0_30px_rgba(253,184,19,0.3)]" 
              alt="Trésor" 
            />
            <h3 className="text-3xl font-black mb-2 uppercase">{currentM.title}</h3>
            <div className="bg-white/5 p-6 rounded-3xl text-sm leading-relaxed max-w-sm mb-8 italic text-gray-300">
              {currentM.inspiration || "Félicitations pour cette découverte."}
            </div>
            <button onClick={() => { setView("gallery"); setFilledHoles(0); setQIndex(0); setCurrentIndex(prev => (prev + 1) % mysteres.length); }} className="px-10 py-4 bg-[#fdb813] text-[#3d1810] rounded-full font-black uppercase text-xs tracking-widest">Retourner à l'Oracle</button>
          </motion.div>
        )}

        {/* --- VERROUILLÉ --- */}
        {view === "locked" && (
          <div className="absolute inset-0 bg-white z-[100] flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-black text-[#a0412d] mb-8 uppercase">La Jarre est scellée</h2>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de Pouvoir" className="w-full max-w-xs p-4 border rounded-full mb-4 text-center outline-none focus:border-[#a0412d]" />
            <button onClick={() => { if(password.toLowerCase() === "benin"){ setLives(8); setView("gallery"); toast.success("Libéré !"); }}} className="w-full max-w-xs bg-[#a0412d] text-white p-4 rounded-full font-black">Invoquer</button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}