"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner";
import { HourglassTimer } from "@/components/mysteres/HourglassTimer";

// ─── CONFIGURATION SUPABASE ─────────────────────────────────────────────────
const SUPABASE_URL = "https://wtjhkqkqmexddroqwawk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0amhrcWtxbWV4ZGRyb3F3YXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDU3NzQsImV4cCI6MjA4OTg4MTc3NH0.TdaWEVQxKF6s2j-7QStHZaFbOqs4e3UHVUN7iGQL_vc";
const BUCKET_NAME = "mysteres-assets";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const getImageUrl = (num: string | number) => 
  `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/image${num}.jpg`;

export default function MysterePage() {
  const [mysteres, setMysteres] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation & UI
  const [view, setView] = useState<"gallery" | "game" | "treasure" | "locked">("gallery");
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(8);
  const [filledHoles, setFilledHoles] = useState(0);

  // ─── FETCH SUPABASE ────────────────────────────────────────────────────────
  useEffect(() => {
    async function initData() {
      const { data: mData } = await supabase.from('mysteres').select('*').order('mystere_number', { ascending: true });
      const { data: qData } = await supabase.from('questions').select('*');
      
      if (mData) setMysteres(mData);
      if (qData) setQuestions(qData);
      setLoading(false);
    }
    initData();
  }, []);

  // ─── LOGIQUE DE NAVIGATION ──────────────────────────────────────────────────
  const handleGallerySwipe = (direction: number) => {
    if (direction < 0 && currentIndex < mysteres.length - 1) setCurrentIndex(c => c + 1);
    if (direction > 0 && currentIndex > 0) setCurrentIndex(c => c - 1);
  };

  const currentQuestions = useMemo(() => {
    if (!mysteres[currentIndex]) return [];
    return questions
      .filter(q => q.mystere_id === mysteres[currentIndex].id)
      .sort((a, b) => parseInt(a.question_number) - parseInt(b.question_number));
  }, [questions, currentIndex, mysteres]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#faf9f8]">
      <div className="w-8 h-8 border-4 border-[#a0412d] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#faf9f8] overflow-hidden touch-none relative">
      <Toaster position="top-center" />

      <AnimatePresence mode="wait">
        {view === "gallery" ? (
          /* ─── GALERIE SWIPE HORIZONTAL ─── */
          <motion.div 
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col items-center justify-center"
          >
            <div className="relative w-full max-w-sm h-[520px] flex items-center justify-center">
              {mysteres.map((m, i) => {
                const distance = Math.abs(i - currentIndex);
                if (distance > 2) return null; // Performance : n'affiche que les voisines

                return (
                  <motion.div
                    key={m.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.x < -60) handleGallerySwipe(-1);
                      if (info.offset.x > 60) handleGallerySwipe(1);
                    }}
                    onClick={() => i === currentIndex && setView("game")}
                    animate={{ 
                      x: (i - currentIndex) * 310, 
                      scale: i === currentIndex ? 1 : 0.8,
                      opacity: i === currentIndex ? 1 : 0.3,
                      rotate: (i - currentIndex) * 4,
                      zIndex: 10 - distance
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute w-[290px] h-[440px] bg-white rounded-[40px] shadow-2xl border-[8px] border-white overflow-hidden cursor-pointer select-none"
                  >
                    <div className="h-2/3 w-full bg-gray-100 overflow-hidden">
                      <img 
                        src={getImageUrl(m.mystere_number)} 
                        className="w-full h-full object-cover pointer-events-none" 
                        alt={m.title}
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-[10px] font-black text-[#a0412d] uppercase mb-1">Mystère #{m.mystere_number}</p>
                      <h2 className="text-xl font-black text-[#3d1810] uppercase leading-none truncate">{m.title}</h2>
                      <p className="text-xs text-gray-400 mt-2 italic line-clamp-2">{m.subtitle}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="absolute bottom-10 flex flex-col items-center gap-2">
                <div className="flex gap-1.5">
                    {Array.from({length: 5}).map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all ${Math.floor(currentIndex/51) === i ? 'w-6 bg-[#a0412d]' : 'w-1.5 bg-gray-200'}`} />
                    ))}
                </div>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Faites glisser pour explorer</p>
            </div>
          </motion.div>
        ) : (
          /* ─── MYSTÈRE OUVERT / JEU ─── */
          <motion.div 
            key="game"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(e, info) => info.offset.y > 150 && setView("gallery")}
            className="absolute inset-0 bg-white z-50 flex flex-col"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-6 shrink-0" />
            
            <div className="px-6 flex-1 overflow-y-auto pb-20">
               <header className="text-center mb-10">
                  <h1 className="text-3xl font-black text-[#a0412d] uppercase leading-tight">{mysteres[currentIndex].title}</h1>
                  <p className="text-sm text-gray-500 italic mt-4 px-6 leading-relaxed">
                    "{mysteres[currentIndex].mise_en_abyme}"
                  </p>
               </header>

               {/* Stats bar */}
               <div className="flex justify-around items-center mb-12 bg-[#faf9f8] p-6 rounded-[32px]">
                  <HourglassTimer timeLeft={60} isFlipping={false} />
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                      {Array.from({length: 8}).map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${i < lives ? "bg-[#fdb813]" : "bg-gray-200"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Graines de Vie</span>
                  </div>
               </div>

               {/* Questions */}
               <div className="max-w-md mx-auto">
                  {currentQuestions[qIndex] && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-center text-[#3d1810] leading-snug">
                            {currentQuestions[qIndex].question}
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {['A', 'B', 'C', 'D'].map(l => (
                                <button 
                                    key={l}
                                    className="p-5 border-2 border-gray-100 rounded-2xl text-left hover:border-[#a0412d] hover:bg-orange-50 transition-all group"
                                    onClick={() => {/* Logique de réponse ici */}}
                                >
                                    <span className="inline-block w-8 h-8 bg-gray-100 group-hover:bg-[#a0412d] group-hover:text-white rounded-lg text-center leading-8 font-black mr-4 transition-colors">{l}</span>
                                    <span className="font-semibold text-gray-700">{currentQuestions[qIndex][`choice_${l.toLowerCase()}`]}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}