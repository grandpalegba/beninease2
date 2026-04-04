"use client";

import { useState, useCallback } from "react";
import QuizCard from "./QuizCard";
import type { Mystere } from "@/types/treasures";

interface ArtefactSwiperProps {
  mysteres: Mystere[];
  loading?: boolean;
  onScrollEnd?: () => void;
}

export default function ArtefactSwiper({ 
  mysteres, 
  loading = false, 
  onScrollEnd 
}: ArtefactSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    if (currentIndex < mysteres.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, mysteres.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleQuizComplete = useCallback(() => {
    // Passer au mystère suivant
    if (currentIndex < mysteres.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, mysteres.length]);

  if (!mysteres || mysteres.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-terre-sombre to-black flex items-center justify-center">
        <p className="text-ivoire/60">Aucun trésor à découvrir.</p>
      </div>
    );
  }

  const currentMystere = mysteres[currentIndex];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-terre-sombre to-black overflow-hidden">
      {/* Header très fin */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-terre-sombre/80 backdrop-blur-md border-b border-or-royal/10 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-or-royal text-lg font-light tracking-wider">Trésors</h1>
          <div className="text-ivoire/60 text-sm">
            {currentIndex + 1} / {mysteres.length} Ambassadeurs
          </div>
        </div>
      </div>

      {/* Indicateurs de progression */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {mysteres.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-or-royal w-8' 
                : index < currentIndex 
                  ? 'bg-or-royal/40' 
                  : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Container principal */}
      <div className="relative h-screen pt-20 flex items-center justify-center">
        <div className="relative w-full max-w-md h-[80vh]">
          {/* QuizCard interactive */}
          {currentMystere && (
            <QuizCard 
              mystere={currentMystere} 
              onComplete={handleQuizComplete}
            />
          )}
        </div>
      </div>

      {/* Contrôles de navigation (désactivés pendant le quiz) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-or-royal/10 border border-or-royal/30 text-or-royal disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-or-royal/20"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === mysteres.length - 1}
          className="p-3 rounded-full bg-or-royal/10 border border-or-royal/30 text-or-royal disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-or-royal/20"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-terre-sombre/80 backdrop-blur-md border-t border-or-royal/10 px-4 py-2">
        <div className="max-w-4xl mx-auto text-center">
          <button className="text-or-royal/60 text-sm hover:text-or-royal transition-colors">
            Profil de l'Ambassadeur
          </button>
        </div>
      </div>
    </div>
  );
}
