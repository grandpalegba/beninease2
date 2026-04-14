"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { toast, Toaster } from "sonner";
import { HourglassTimer } from "@/components/mysteres/HourglassTimer";

// Configuration Supabase
const PROJECT_ID = "wtjhkqkqmexddroqwawk";
const BUCKET_NAME = "mysteres-assets";
const getImageUrl = (num: string | number) => 
  `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/image${num}.jpg`;

export default function MystereSwipePage() {
  const [mysteres, setMysteres] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation
  const [view, setView] = useState<"gallery" | "game">("gallery");
  const [currentIndex, setCurrentIndex] = useState(0); // Index de la carte dans la galerie
  const [qIndex, setQIndex] = useState(0);

  useEffect(() => {
    // Simulation chargement CSV (à remplacer par ton fetch réel)
    const loadData = async () => {
      // ... tes fetchCSV ici
      setLoading(false);
    };
    loadData();
  }, []);

  // Handler pour le swipe dans la Galerie
  const handleGallerySwipe = (direction: number) => {
    if (direction > 0 && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    if (direction < 0 && currentIndex < mysteres.length - 1) setCurrentIndex(currentIndex + 1);
  };

  // Handler pour revenir (Swipe à l'intérieur du jeu)
  const handleExitSwipe = (event: any, info: any) => {
    // Si le swipe vers le bas est assez fort (> 100px)
    if (info.offset.y > 100 || Math.abs(info.offset.x) > 150) {
      setView("gallery");
    }
  };

  if (loading) return null;

  return (
    <div className="h-screen w-screen bg-[#faf9f8] overflow-hidden touch-none">
      <Toaster position="top-center" />

      <AnimatePresence mode="wait">
        {view === "gallery" ? (
          /* ─── GALERIE MODE SWIPE HORIZONTAL ─── */
          <motion.div 
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center"
          >
            <div className="relative w-full max-w-sm h-[500px] flex items-center justify-center">
              {mysteres.map((m, i) => {
                // Logique pour n'afficher que la carte courante, la précédente et la suivante
                if (Math.abs(i - currentIndex) > 1) return null;

                return (
                  <motion.div
                    key={m.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.x < -50) handleGallerySwipe(-1);
                      if (info.offset.x > 50) handleGallerySwipe(1);
                    }}
                    onClick={() => {
                        if (Math.abs(i - currentIndex) === 0) setView("game");
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      x: (i - currentIndex) * 320, 
                      scale: i === currentIndex ? 1 : 0.85,
                      opacity: i === currentIndex ? 1 : 0.4,
                      zIndex: i === currentIndex ? 10 : 0
                    }}
                    className="absolute w-[300px] h-[450px] bg-white rounded-[32px] shadow-2xl border-8 border-white overflow-hidden cursor-pointer"
                  >
                    <img src={getImageUrl(m.mystere_number)} className="h-2/3 w-full object-cover" />
                    <div className="p-6">
                      <h2 className="text-[#a0412d] font-black text-xl uppercase leading-tight">{m.title}</h2>
                      <p className="text-gray-400 text-sm mt-1">{m.subtitle}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">MYSTÈRE #{m.mystere_number}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <p className="mt-8 text-gray-400 text-xs font-medium animate-pulse">SWIPE POUR EXPLORER • CLICK POUR OUVRIR</p>
          </motion.div>

        ) : (
          /* ─── MODE JEU / MYSTÈRE OUVERT ─── */
          <motion.div 
            key="game"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={handleExitSwipe}
            className="absolute inset-0 bg-white z-50 flex flex-col p-6"
          >
            {/* Petit indicateur de swipe pour l'utilisateur */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
            
            <header className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-[#a0412d] font-black uppercase">{mysteres[currentIndex].title}</h3>
                <p className="text-xs text-gray-400">Glissez vers le bas pour quitter</p>
              </div>
              <div className="text-orange-500 font-bold">⭐ 0 pts</div>
            </header>

            {/* Contenu du jeu (Questions, Sablier, Jarre...) */}
            <div className="flex-1 overflow-y-auto">
               <p className="italic text-center text-gray-600 mb-8 px-4">
                 "{mysteres[currentIndex].mise_en_abyme}"
               </p>
               
               {/* Ici ta logique de SacredJar et Questions */}
               <div className="flex flex-col items-center gap-10">
                 <HourglassTimer timeLeft={60} isFlipping={false} />
                 {/* ... Logique des questions ... */}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}