"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import MysteryCard from "./canari/MysteryCard";
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
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragConstraints = useRef({ left: 0, right: 0 });

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    
    if (Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500) {
      if (offset.x > 0 && currentIndex > 0) {
        // Swipe vers la droite - carte précédente
        setDirection(-1);
        setCurrentIndex(prev => prev - 1);
      } else if (offset.x < 0 && currentIndex < mysteres.length - 1) {
        // Swipe vers la gauche - carte suivante
        setDirection(1);
        setCurrentIndex(prev => prev + 1);
      }
    }
    setIsDragging(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < mysteres.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, mysteres.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleComplete = useCallback(() => {
    // Passer au mystère suivant
    if (currentIndex < mysteres.length - 1) {
      handleNext();
    }
  }, [currentIndex, handleNext, mysteres.length]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? -45 : 45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? -45 : 45
    })
  };

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

      {/* Container de swipe */}
      <div className="relative h-screen pt-20 flex items-center justify-center">
        <div className="relative w-full max-w-md h-[80vh] perspective-1000">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
                rotateY: { duration: 0.6 }
              }}
              drag="x"
              dragConstraints={dragConstraints}
              dragElastic={0.2}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              style={{ 
                transformStyle: 'preserve-3d',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              {/* Carte Artefact */}
              <div className="w-full h-full bg-gradient-to-br from-terre-sombre to-black rounded-2xl border border-or-royal/20 shadow-2xl overflow-hidden">
                {currentMystere && (
                  <MysteryCard 
                    mystere={currentMystere} 
                    onComplete={handleComplete}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Contrôles de navigation */}
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
