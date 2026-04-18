"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner";
import { confetti } from "tsparticles-confetti";

// Configuration Supabase
const SUPABASE_URL = "https://wtjhkqkqmexddroqwawk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0amhrcWtxbWV4ZGRyb3F3YXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDU3NzQsImV4cCI6MjA4OTg4MTc3NH0.TdaWEVQxKF6s2j-7QStHZaFbOqs4e3UHVUN7iGQL_vc";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonction Shuffle pour l'ordre aléatoire des 256 mystères
const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// --- COMPOSANT JARRE SATO ---
const SatoJar = ({ filledCount }: { filledCount: number }) => (
  <div className="relative w-40 h-52 mx-auto mb-8 shrink-0">
    <div
      className="absolute inset-0 shadow-2xl transition-all duration-700"
      style={{
        background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)',
        borderRadius: '42% 38% 34% 36% / 45% 45% 32% 32%',
        borderBottom: '6px solid #5d251a'
      }}
    >
      <div className="grid grid-cols-2 gap-4 p-10 h-full items-center justify-items-center">
        {[1, 2, 3, 4].map((h) => (
          <motion.div
            key={h}
            animate={{
              scale: h <= filledCount ? 1.3 : 1,
              backgroundColor: h <= filledCount ? "#fdb813" : "#1a0a07",
              boxShadow: h <= filledCount ? "0 0 15px #fdb813" : "none",
              opacity: h <= filledCount ? 1 : 0.3
            }}
            className="w-3.5 h-3.5 rounded-full"
          />
        ))}
      </div>
    </div>
  </div>
);

export default function MysteresPage() {
  const [mysteres, setMysteres] = useState<any[]>([]);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<"gallery" | "challenge" | "success">("gallery");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [seeds, setSeeds] = useState(16);
  const [explanations, setExplanations] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: mData } = await supabase.from('mysteres').select('*');
      const { data: qData } = await supabase.from('questions').select('*');
      if (mData) setMysteres(shuffleArray(mData));
      if (qData) setAllQuestions(qData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const currentM = mysteres[currentIndex];

  const currentQuestions = useMemo(() => {
    if (!currentM) return [];
    return allQuestions
      .filter(q => q.mystere_id === currentM.id)
      .sort((a, b) => a.question_number - b.question_number)
      .slice(0, 4);
  }, [allQuestions, currentM]);

  const getImageUrl = (id: string) => {
    const num = id.replace('m', '');
    return `${SUPABASE_URL}/storage/v1/object/public/mysteres-assets/m${num}.jpg`;
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setExplanations(prev => [...prev, currentQuestions[qIndex].explanation]);
      if (qIndex === 3) {
        setView("success");
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      } else {
        setQIndex(prev => prev + 1);
        toast.success("Énergie capturée...");
      }
    } else {
      setSeeds(s => Math.max(0, s - 1));
      toast.error("Vibration discordante");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#faf9f8]">
      <div className="w-10 h-10 border-4 border-[#a0412d] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#faf9f8] overflow-hidden relative touch-none font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap');
        .font-lato { font-family: 'Lato', sans-serif; }
      `}</style>

      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">

        {/* --- GALERIE : CARTES MYSTÈRES --- */}
        {view === "gallery" && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="h-full flex flex-col items-center justify-center p-6"
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) setCurrentIndex(prev => (prev + 1) % mysteres.length);
                if (info.offset.x > 60) setCurrentIndex(prev => (prev - 1 + mysteres.length) % mysteres.length);
              }}
              onClick={() => { setQIndex(0); setExplanations([]); setView("challenge"); }}
              className="w-full max-w-[340px] h-[600px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[6px] border-white cursor-pointer flex flex-col"
            >
              {/* Image haute (65%) pour éviter les coupes de têtes */}
              <div className="h-[65%] w-full overflow-hidden">
                <img
                  src={getImageUrl(currentM.id)}
                  className="h-full w-full object-cover pointer-events-none"
                  alt={currentM.title}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=Bénin'; }}
                />
              </div>

              {/* Contenu Texte avec Lato et Casse Normale */}
              <div className="p-7 flex flex-col flex-1 bg-white">
                <h2 className="font-lato text-[26px] font-black text-[#1a1a1a] leading-[1.1] tracking-tight">
                  {currentM.title}
                </h2>
                <p className="font-lato text-[12px] font-bold text-[#a0412d] mt-2 italic tracking-wide">
                  {currentM.subtitle}
                </p>
                <div className="mt-5 border-t border-gray-50 pt-5">
                  <p className="font-lato text-[14px] text-gray-500 italic leading-[1.8] line-clamp-3">
                    "{currentM.mise_en_abyme}"
                  </p>
                </div>
              </div>
            </motion.div>
            <p className="mt-8 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] animate-pulse font-lato">
              Swipe pour naviguer • Tap pour entrer
            </p>
          </motion.div>
        )}

        {/* --- CHALLENGE & SUCCÈS : SORTIE PAR SWIPE DOWN --- */}
        {(view === "challenge" || view === "success") && (
          <motion.div
            key="active-challenge"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => { if (info.offset.y > 120) setView("gallery"); }}
            className="absolute inset-0 bg-white z-50 flex flex-col overflow-hidden"
          >
            <div className="h-12 w-full flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-100 rounded-full" />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-10">
              {view === "challenge" ? (
                <div className="max-w-md mx-auto flex flex-col h-full font-lato">
                  <SatoJar filledCount={qIndex} />
                  <h1 className="text-2xl font-black text-center text-[#1a1a1a] mb-8 leading-snug">
                    {currentQuestions[qIndex]?.question}
                  </h1>

                  <div className="space-y-3">
                    {['A', 'B', 'C', 'D'].map((letter) => {
                      const choiceText = currentQuestions[qIndex]?.[`choice_${letter.toLowerCase()}`];
                      const isCorrect = letter === currentQuestions[qIndex]?.correct_answer;
                      return (
                        <motion.button
                          key={letter}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleAnswer(isCorrect)}
                          className="w-full p-5 bg-[#faf9f8] border border-gray-50 rounded-2xl flex items-center text-left"
                        >
                          <span className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-[#a0412d] mr-4">{letter}</span>
                          <span className="font-bold text-[#333] text-sm leading-snug">{choiceText}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="mt-auto pt-8 flex justify-between items-center opacity-30">
                    <span className="text-[10px] font-black uppercase tracking-widest">Graines : {seeds}/16</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Rituel {qIndex + 1}/4</span>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto h-full flex flex-col font-lato">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏺</div>
                    <h2 className="text-3xl font-black text-[#1a1a1a] leading-tight">{currentM.title}</h2>
                  </div>
                  <div className="space-y-6 flex-1">
                    <div className="p-7 bg-[#3d1810] rounded-[35px] italic text-center text-orange-50 border-2 border-[#fdb813] shadow-xl">
                      "{currentM.inspiration}"
                    </div>
                    <div className="space-y-4">
                      {explanations.map((text, i) => (
                        <motion.div key={i} className="p-5 bg-orange-50/50 border-l-4 border-[#a0412d] rounded-r-2xl">
                          <p className="text-[14px] leading-relaxed text-gray-700 font-medium">{text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => { setView("gallery"); setCurrentIndex(prev => (prev + 1) % mysteres.length); }}
                    className="mt-10 w-full py-5 bg-[#a0412d] text-white rounded-full font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-transform"
                  >
                    Mystère suivant
                  </button>
                </div>
              )}
            </div>
            <div className="pb-6 text-center shrink-0 opacity-20">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Glissez vers le bas pour quitter</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}