"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner";
import { HourglassTimer } from "@/components/mysteres/HourglassTimer";

// ─── CONFIGURATION SUPABASE ─────────────────────────────────────────────────
const PROJECT_ID = "wtjhkqkqmexddroqwawk";
const SUPABASE_URL = `https://${PROJECT_ID}.supabase.co`;
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0amhrcWtxbWV4ZGRyb3F3YXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDU3NzQsImV4cCI6MjA4OTg4MTc3NH0.TdaWEVQxKF6s2j-7QStHZaFbOqs4e3UHVUN7iGQL_vc";
const BUCKET_NAME = "mysteres-assets";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const getImageUrl = (num: any) => {
  const cleanNum = String(num).trim();
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/image${cleanNum}.jpg`;
};

// Fonction utilitaire pour mélanger (Fisher-Yates Shuffle)
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
  
  const [view, setView] = useState<"gallery" | "game">("gallery");
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(8);
  const [filledHoles, setFilledHoles] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { data: mData } = await supabase.from('mysteres').select('*');
      const { data: qData } = await supabase.from('questions').select('*');
      
      if (mData) {
        // Appliquer le Shuffle ici pour que l'ordre soit différent à chaque refresh
        setMysteres(shuffleArray(mData));
      }
      if (qData) setQuestions(qData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const currentM = mysteres[currentIndex];

  const currentQuestions = useMemo(() => {
    if (!currentM) return [];
    return questions
      .filter(q => q.mystere_id === currentM.id)
      .sort((a, b) => parseInt(a.question_number) - parseInt(b.question_number));
  }, [questions, currentIndex, mysteres]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#faf9f8]"><div className="w-10 h-10 border-4 border-[#a0412d] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen w-screen bg-[#faf9f8] overflow-hidden touch-none relative">
      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">
        {view === "gallery" ? (
          /* ─── GALERIE : UNE SEULE CARTE SHUFFLE ─── */
          <motion.div 
            key={currentM?.id || 'empty'}
            initial={{ opacity: 0, x: 100, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -100, rotate: -5 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="h-full flex flex-col items-center justify-center p-6"
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -100) { // Swipe gauche -> Suivant
                  setCurrentIndex((prev) => (prev + 1) % mysteres.length);
                } else if (info.offset.x > 100) { // Swipe droite -> Précédent
                  setCurrentIndex((prev) => (prev - 1 + mysteres.length) % mysteres.length);
                }
              }}
              onClick={() => setView("game")}
              className="w-full max-w-[320px] h-[520px] bg-white rounded-[40px] shadow-2xl border-[8px] border-white overflow-hidden cursor-pointer flex flex-col"
            >
              <img 
                src={getImageUrl(currentM.mystere_number)} 
                className="h-1/2 w-full object-cover bg-gray-50 pointer-events-none" 
                alt={currentM.title}
              />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-black text-[#3d1810] uppercase leading-tight">{currentM.title}</h2>
                  <p className="text-sm font-bold text-[#a0412d] mt-1 italic">{currentM.subtitle}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-orange-50">
                  <p className="text-[14px] text-gray-500 leading-relaxed italic line-clamp-6">
                    "{currentM.mise_en_abyme}"
                  </p>
                </div>
              </div>
            </motion.div>
            
            <div className="mt-8 text-center">
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] animate-pulse">
                 Swipe pour le prochain mystère
               </p>
            </div>
          </motion.div>
        ) : (
          /* ─── MODE MYSTÈRE (Inchangé mais sans mise en abyme) ─── */
          <motion.div 
            key="game" 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }} 
            className="absolute inset-0 bg-white z-50 flex flex-col"
          >
            {/* ... (Reste du code de jeu Drag & Drop) ... */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}