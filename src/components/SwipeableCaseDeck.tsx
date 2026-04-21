'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { LifeCase } from '@/features/consultation/useLifeCases';
import CaseCard from './CaseCard';

interface SwipeableCaseDeckProps {
  cases: LifeCase[];
  initialCaseId?: string;
  onPickCase?: (picked: LifeCase, selectedOption: number | null) => void;
}

const SUPABASE_PROJECT_ID = "wtjhkqkqmexddroqwawk";
const STORAGE_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public`;

const SwipeableCaseDeck: React.FC<SwipeableCaseDeckProps> = ({ cases, initialCaseId, onPickCase }) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialCaseId) {
      const idx = cases.findIndex(c => c.id === initialCaseId);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  });

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const currentCase = cases[currentIndex];



  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    // Swipe Horizontal : Navigation entre les cas
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0 && currentIndex > 0) setCurrentIndex(prev => prev - 1);
      else if (info.offset.x < 0 && currentIndex < cases.length - 1) setCurrentIndex(prev => prev + 1);
    }
    // Swipe Vertical : Ouverture des détails (Drawer)
    if (info.offset.y < -50) {
      setIsDetailsOpen(true);
    }
  };

  if (!currentCase) return null;

  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center justify-start pt-2 md:pt-4 px-4 overflow-hidden">



      {/* ZONE DE LA CARTE */}
      <div className="relative w-full max-w-[450px] aspect-[3/4] md:aspect-[4/5] z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCase.id}
            style={{ x, opacity }}
            drag={isDetailsOpen ? false : "both"}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            className="w-full h-full rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-white shadow-[0_30px_60px_rgba(0,0,0,0.06)] border border-neutral-100 cursor-grab active:cursor-grabbing"
          >
            <CaseCard
              lifeCase={currentCase}
              isActive={!isDetailsOpen}
            />


          </motion.div>
        </AnimatePresence>

        {/* NAVIGATION DESKTOP : Flèches latérales style Talents */}
        <div className="hidden md:flex absolute top-1/2 -left-24 -right-24 -translate-y-1/2 justify-between pointer-events-none">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(v => v - 1)}
            className="p-5 rounded-full bg-white text-neutral-300 hover:text-black hover:shadow-xl transition-all pointer-events-auto border border-neutral-100 disabled:opacity-0"
            disabled={currentIndex === 0}
          >
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => currentIndex < cases.length - 1 && setCurrentIndex(v => v + 1)}
            className="p-5 rounded-full bg-white text-neutral-300 hover:text-black hover:shadow-xl transition-all pointer-events-auto border border-neutral-100 disabled:opacity-0"
            disabled={currentIndex === cases.length - 1}
          >
            <ArrowRight size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* FOOTER : Switcher d'application */}
      <footer className="mt-12 md:mt-20 w-full flex flex-col items-center gap-8">
        <div className="inline-flex p-1.5 bg-neutral-50 rounded-full border border-neutral-100 shadow-sm">
          <button className="px-8 py-3 bg-[#1a1a1a] text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-transform active:scale-95 shadow-lg">
            Matrice des choix
          </button>
          <button className="px-8 py-3 text-neutral-400 hover:text-black rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors">
            Mur des consultations
          </button>
        </div>
      </footer>

      {/* PANNEAU DE RÉVÉLATION (Drawer Swipe Haut) */}
      <AnimatePresence>
        {isDetailsOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col p-8 md:p-16"
          >
            {/* Bouton de fermeture / Drag handle */}
            <button
              onClick={() => setIsDetailsOpen(false)}
              className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"
            />

            <div className="overflow-y-auto flex-1 max-w-2xl mx-auto w-full pt-12 flex flex-col justify-center">
              <blockquote className="text-2xl md:text-3xl font-serif italic text-neutral-800 mb-12 leading-tight border-l-[6px] border-[#fcd116] pl-8">
                "{currentCase.quote}"
              </blockquote>

              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400 mb-10 text-center">
                Écoutez votre intuition avant d'interroger le Fâ
              </p>

              <div className="grid gap-4">
                {currentCase.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => onPickCase?.(currentCase, i)}
                    className="group w-full p-6 text-left rounded-[1.8rem] bg-neutral-50 hover:bg-neutral-100 transition-all flex items-center gap-6 border border-transparent hover:border-neutral-200"
                  >
                    <span className="font-bold text-sm text-black bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 text-sm md:text-base font-light text-neutral-600 leading-snug">
                      {opt}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={18} className="text-[#00693e]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};



export default SwipeableCaseDeck;