"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner";
import { confetti } from "tsparticles-confetti";

// Configuration Supabase
const supabase = createClient(
  "https://wtjhkqkqmexddroqwawk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0amhrcWtxbWV4ZGRyb3F3YXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDU3NzQsImV4cCI6MjA4OTg4MTc3NH0.TdaWEVQxKF6s2j-7QStHZaFbOqs4e3UHVUN7iGQL_vc"
);

const clayGradient = "linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)";

// --- COMPOSANTS UI ---

const SatoJar = ({ holesCount, isOver }: { holesCount: number[], isOver: boolean }) => (
  <div className={`relative w-64 h-80 transition-transform duration-500 ${isOver ? 'scale-105' : 'scale-100'}`}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#3d1810] rounded-[50%] z-20" style={{ transform: 'translate(-50%, -40%)' }} />
    <div className="absolute inset-0 overflow-hidden" style={{ background: clayGradient, borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%', boxShadow: 'inset -8px -12px 20px rgba(0,0,0,0.3)' }}>
      <div className="relative w-full h-full p-8">
        <AnimatePresence>
          {holesCount.map((hIdx) => (
            <motion.div key={hIdx} exit={{ opacity: 0, scale: 2 }} className={`absolute rounded-full bg-[#1a0a07] shadow-inner ${hIdx === 0 ? 'top-[35%] left-[25%] w-10 h-10' : hIdx === 1 ? 'top-[28%] left-[55%] w-8 h-8' : hIdx === 2 ? 'top-[58%] left-[38%] w-12 h-12' : 'top-[52%] left-[68%] w-7 h-7'}`} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

// --- LOGIQUE PRINCIPALE ---

export default function MysteresPage() {
  const [loading, setLoading] = useState(true);
  const [mysteres, setMysteres] = useState<any[]>([]);
  const [themes, setThemes] = useState<Record<string, string>>({});
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [view, setView] = useState<"gallery" | "ritual">("gallery");
  const [qIndex, setQIndex] = useState(0);
  const [holes, setHoles] = useState([0, 1, 2, 3]);
  const [showExplanation, setShowExplanation] = useState(false);
  const jarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: tData } = await supabase.from('themes').select('*');
        const { data: mData } = await supabase.from('mysteres').select('*');
        const { data: qData } = await supabase.from('questions').select('*');

        if (tData) setThemes(tData.reduce((acc, t) => ({ ...acc, [t.id]: t.name }), {}));
        if (mData) setMysteres(mData.sort(() => Math.random() - 0.5));
        if (qData) setAllQuestions(qData);
      } catch (e) {
        toast.error("Erreur de connexion");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filtrage précis des questions pour le mystère actuel
  const currentQuestions = useMemo(() => {
    const currentM = mysteres[currentIndex];
    if (!currentM) return [];
    return allQuestions
      .filter(q => q.mystere_id === currentM.id)
      .sort((a, b) => a.question_number - b.question_number);
  }, [allQuestions, mysteres, currentIndex]);

  const handleStart = (mId: string) => {
    const questions = allQuestions.filter(q => q.mystere_id === mId);
    if (questions.length > 0) {
      setHoles([0, 1, 2, 3]);
      setQIndex(0);
      setView("ritual");
    } else {
      toast.error("Mystère bientôt disponible", { description: "Aucune question associée dans la base." });
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-[#a0412d] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen w-screen bg-white overflow-hidden relative">
      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">
        {view === "gallery" ? (
          <motion.div key="gallery" className="h-full flex items-center justify-center p-6">
            <div className="relative w-full max-w-[340px] h-[600px]">
              <AnimatePresence initial={false}>
                {mysteres.map((m, idx) => idx === currentIndex && (
                  <motion.div
                    key={m.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 80 && currentIndex > 0) setCurrentIndex(p => p - 1);
                      else if (info.offset.x < -80 && currentIndex < mysteres.length - 1) setCurrentIndex(p => p + 1);
                    }}
                    className="absolute inset-0 bg-white rounded-[40px] shadow-2xl overflow-hidden border-[6px] border-white flex flex-col"
                  >
                    {/* Layer de clic prioritaire */}
                    <div className="absolute inset-0 z-30 cursor-pointer" onClick={() => handleStart(m.id)} />

                    <div className="pt-6 pb-2 text-center">
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.4em]">
                        {themes[m.theme_id] || "Culture"}
                      </span>
                    </div>

                    <div className="h-[55%] w-full bg-gray-100">
                      <img src={`https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/mysteres-assets/${m.id}.jpg`} className="h-full w-full object-cover" alt="" />
                    </div>

                    <div className="p-7 bg-white flex-1">
                      <h2 className="text-[20px] font-black uppercase leading-tight">{m.title}</h2>
                      <p className="text-[11px] font-bold text-[#a0412d] uppercase italic mt-1">{m.subtitle}</p>
                      <p className="text-[14px] text-gray-500 italic mt-4 leading-relaxed line-clamp-3">"{m.mise_en_abyme}"</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div key="ritual" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="absolute inset-0 bg-white z-50 flex flex-col items-center p-6">
            <div className="mt-8 mb-12" ref={jarRef}><SatoJar holesCount={holes} isOver={false} /></div>

            <div className="w-full max-w-md flex-1">
              {!showExplanation ? (
                <div className="text-center">
                  <h2 className="text-lg font-bold mb-8 px-4">{currentQuestions[qIndex]?.question}</h2>
                  <div className="space-y-3">
                    {['a', 'b', 'c', 'd'].map((l) => currentQuestions[qIndex]?.[`choice_${l}`] && (
                      <button
                        key={l}
                        onClick={() => {
                          if (l.toUpperCase() === currentQuestions[qIndex].correct_answer) {
                            setHoles(h => h.slice(1));
                            if (holes.length === 1) confetti();
                            setShowExplanation(true);
                          } else {
                            toast.error("Mauvaise réponse");
                          }
                        }}
                        className="w-full p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center hover:bg-orange-50 transition-colors"
                      >
                        <span className="w-8 h-8 rounded-lg bg-orange-100 text-[#a0412d] font-bold flex items-center justify-center mr-4 uppercase">{l}</span>
                        <span className="font-bold text-gray-600 text-sm text-left">{currentQuestions[qIndex][`choice_${l}`]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-orange-50 rounded-[2.5rem]" onClick={() => {
                  setShowExplanation(false);
                  if (holes.length > 0) setQIndex(p => p + 1);
                  else setView("gallery");
                }}>
                  <p className="text-lg italic font-medium text-[#a0412d]">"{currentQuestions[qIndex]?.explanation}"</p>
                  <p className="text-[10px] mt-8 uppercase font-black text-gray-300">Toucher pour continuer</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}