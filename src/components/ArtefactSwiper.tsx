"use client";

import { useState, useCallback } from "react";
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
          {/* Carte Artefact statique */}
          <div className="w-full h-full bg-gradient-to-br from-terre-sombre to-black rounded-2xl border border-or-royal/20 shadow-2xl overflow-hidden">
            {currentMystere && (
              <div className="h-full flex flex-col">
                {/* Header de la carte */}
                <div className="p-4 border-b border-or-royal/20 flex justify-between bg-terre-sombre/90">
                  <span className="text-or-royal font-bold uppercase tracking-wider">
                    {currentMystere.title}
                  </span>
                  <div className="flex gap-1 items-center">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full transition-all ${
                          i < 6 ? 'bg-or-royal shadow-lg shadow-or-royal/50' : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Contenu principal */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Image/Icon de l'artefact */}
                  <div className="w-full h-48 bg-gradient-to-br from-or-royal/20 to-terre-sombre rounded-xl flex items-center justify-center mb-6">
                    <div className="text-6xl">{currentMystere.icon || '🏺'}</div>
                  </div>

                  {/* Informations */}
                  <div className="text-center mb-8">
                    <h2 className="text-ivoire text-2xl font-bold mb-2">{currentMystere.title}</h2>
                    <p className="text-or-royal/80 text-sm mb-4">{currentMystere.subtitle}</p>
                    <div className="text-ivoire/60 text-sm bg-terre-sombre/50 p-4 rounded-lg">
                      <p className="italic">"{currentMystere.mise_en_abyme}"</p>
                    </div>
                  </div>

                  {/* Thème */}
                  <div className="text-center">
                    <div className="inline-block bg-or-royal/10 border border-or-royal/30 px-4 py-2 rounded-full">
                      <span className="text-or-royal text-sm font-medium">
                        {currentMystere.theme?.name || 'Thème'}
                      </span>
                    </div>
                  </div>

                  {/* Mini Jarre Trouée (statique pour l'instant) */}
                  <div className="mt-8 flex justify-center">
                    <div className="w-24 h-32 bg-gradient-to-b from-or-royal/20 to-terre-sombre rounded-lg border border-or-royal/30 flex items-center justify-center">
                      <span className="text-3xl">🏺</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contrôles de navigation simplifiés */}
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
