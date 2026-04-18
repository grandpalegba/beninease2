"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner";
import { confetti } from "tsparticles-confetti";

// Configuration Supabase blindée
const supabase = createClient(
  "https://wtjhkqkqmexddroqwawk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0amhrcWtxbWV4ZGRyb3F3YXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDU3NzQsImV4cCI6MjA4OTg4MTc3NH0.TdaWEVQxKF6s2j-7QStHZaFbOqs4e3UHVUN7iGQL_vc"
);

const CLAY_GRADIENT = "linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)";

// --- COMPOSANTS ATOMIQUES ---

const SatoJar = ({ holesCount }: { holesCount: number[] }) => (
  <div className="relative w-64 h-80 transition-all duration-700">
    {/* Col (Lip) conforme à ton HTML */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#3d1810] rounded-[50%] z-20" style={{ transform: 'translate(-50%, -40%)' }} />

    <div className="absolute inset-0 overflow-hidden"
      style={{
        background: CLAY_GRADIENT,
        borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
        boxShadow: 'inset -8px -12px 20px rgba(0,0,0,0.3)'
      }}>
      <div className="relative w-full h-full p-8">
        <AnimatePresence>
          {holesCount.map((hIdx) => (
            <motion.div
              key={hIdx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ opacity: 0, scale: 2, filter: "blur(8px)" }}
              className={`absolute rounded-full bg-[#1a0a07] shadow-inner ${hIdx === 0 ? 'top-[35%] left-[25%] w-10 h-10' :
                  hIdx === 1 ? 'top-[28%] left-[55%] w-8 h-8' :
                    hIdx === 2 ? 'top-[58%] left-[38%] w-12 h-12' :
                      'top-[52%] left-[68%] w-7 h-7'
                }`}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

// --- PAGE PRINCIPALE ---

export default function MysteresPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    mysteres: any[],
    questions: any[],
    themes: Record<string, string>
  }>({ mysteres: [], questions: [], themes: {} });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<"gallery" | "ritual">("gallery");
  const [qIndex, setQIndex] = useState(0);
  const [holes, setHoles] = useState([0, 1, 2, 3]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Fetch unique des données au montage
  useEffect(() => {
    async function init() {
      try {
        const [t, m, q] = await Promise.all([
          supabase.from('themes').select('*'),
          supabase.from('mysteres').select('*'),
          supabase.from('questions').select('*')
        ]);

        setData({
          themes: t.data?.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.name }), {}) || {},
          mysteres: m.data?.sort((a, b) => a.mystere_number - b.mystere_number) || [],
          questions: q.data || []
        });
      } catch (e) {
        toast.error("Erreur de synchronisation Supabase");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Questions filtrées pour le mystère actif
  const currentQuestions = useMemo(() => {
    const currentM = data.mysteres[currentIndex];
    if (!currentM) return [];
    return data.questions
      .filter(q => q.mystere_id === currentM.id)
      .sort((a, b) => a.question_number - b.question_number);
  }, [data.questions, data.mysteres, currentIndex]);

  const handleOpenMystere = (mId: string) => {
    const checkQuestions = data.questions.filter(q => q.mystere_id === mId);
    if (checkQuestions.length > 0) {
      setHoles([0, 1, 2, 3]);
      setQIndex(0);
      setShowExplanation(false);
      setView("ritual");
    } else {
      toast.error("Mystère en préparation", { description: "Revenez plus tard !" });
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-[#a0412d] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-screen w-screen bg-white overflow-hidden relative font-sans text-[#1A1A1A]">
      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">
        {view === "gallery" ? (
          <motion.div key="gallery" exit={{ opacity: 0, scale: 0.9 }} className="h-full flex items-center justify-center p-6">
            <div className="relative w-full max-w-[340px] h-[600px]">
              <AnimatePresence initial={false}>
                {data.mysteres.map((m, idx) => idx === currentIndex && (
                  <motion.div
                    key={m.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 80 && currentIndex > 0) setCurrentIndex(p => p - 1);
                      else if (info.offset.x < -80 && currentIndex < data.mysteres.length - 1) setCurrentIndex(p => p + 1);
                    }}
                    className="absolute inset-0 bg-white rounded-[40px] shadow-2xl overflow-hidden border-[6px] border-white flex flex-col cursor-grab active:cursor-grabbing"
                  >
                    {/* HIT ZONE: Couche de clic prioritaire pour mobile */}
                    <div
                      className="absolute inset-0 z-50"
                      onClick={() => handleOpenMystere(m.id)}
                    />

                    <div className="pt-6 pb-2 text-center pointer-events-none">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">
                        {data.themes[m.theme_id] || "Bénin"}
                      </span>
                    </div>

                    <div className="h-[55%] w-full bg-gray-50 pointer-events-none">
                      <img
                        src={`https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/mysteres-assets/${m.id}.jpg`}
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x600?text=Les+Visages+du+Benin")}
                        alt={m.title}
                      />
                    </div>

                    <div className="p-7 flex flex-col flex-1 pointer-events-none">
                      <h2 className="text-[20px] font-black uppercase leading-tight">{m.title}</h2>
                      <p className="text-[11px] font-bold text-[#a0412d] uppercase italic mt-1">{m.subtitle}</p>
                      <div className="mt-4 border-l-2 border-[#a0412d]/10 pl-4">
                        <p className="text-[13px] text-gray-500 italic leading-relaxed line-clamp-4">
                          "{m.mise_en_abyme}"
                        </p>
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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute inset-0 bg-white z-[100] flex flex-col items-center p-6 overflow-hidden"
          >
            {/* Header Ritual */}
            <div className="w-full flex justify-between items-center mb-6">
              <button onClick={() => setView("gallery")} className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Retour</button>
              <div className="flex gap-1">
                {holes.map(h => <div key={h} className="w-1.5 h-1.5 rounded-full bg-[#a0412d]" />)}
              </div>
            </div>

            <div className="mt-4 mb-10"><SatoJar holesCount={holes} /></div>

            <div className="w-full max-w-md flex-1">
              {!showExplanation ? (
                <div className="text-center px-4">
                  <h2 className="text-lg font-bold mb-8 text-gray-700 leading-snug">
                    {currentQuestions[qIndex]?.question}
                  </h2>
                  <div className="grid gap-3">
                    {['a', 'b', 'c', 'd'].map((l) => {
                      const choiceText = currentQuestions[qIndex]?.[`choice_${l}`];
                      if (!choiceText) return null;
                      return (
                        <button
                          key={l}
                          onClick={() => {
                            if (l.toUpperCase() === currentQuestions[qIndex].correct_answer) {
                              setHoles(h => h.slice(1));
                              if (holes.length === 1) confetti({ particleCount: 150, spread: 70, origin: { y: 0.7 } });
                              setShowExplanation(true);
                            } else {
                              toast.error("Ce n'est pas tout à fait ça...");
                            }
                          }}
                          className="w-full p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center active:scale-95 active:bg-orange-50 transition-all"
                        >
                          <span className="w-8 h-8 rounded-lg bg-orange-100 text-[#a0412d] font-bold flex items-center justify-center mr-4 uppercase">{l}</span>
                          <span className="font-bold text-gray-600 text-sm text-left">{choiceText}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => {
                    setShowExplanation(false);
                    if (holes.length > 0) {
                      setQIndex(p => p + 1);
                    } else {
                      setView("gallery");
                    }
                  }}
                  className="p-8 bg-orange-50 rounded-[2.5rem] text-center cursor-pointer border border-orange-100 shadow-sm mx-4"
                >
                  <p className="text-[10px] mb-4 uppercase tracking-[0.2em] font-black text-[#a0412d]/40">La Vérité</p>
                  <p className="text-lg italic font-medium text-[#a0412d] leading-relaxed">
                    "{currentQuestions[qIndex]?.explanation}"
                  </p>
                  <p className="text-[10px] mt-8 uppercase font-black text-gray-300 animate-pulse">Continuer</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}