"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import TreasureCard from "./TreasureCard";
import QuizCard from "./QuizCard";
import type { Mystere } from "@/types/treasures";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TreasureSwiperProps {
  mysteres: Mystere[];
  loading?: boolean;
  onScrollEnd?: () => void;
}

export default function TreasureSwiper({ mysteres, loading = false, onScrollEnd }: TreasureSwiperProps) {
  console.log('🏺 TreasureSwiper render - mysteres:', mysteres.length, 'loading:', loading);
  
  const [selectedMystere, setSelectedMystere] = useState<Mystere | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  if (!mysteres || mysteres.length === 0) {
    console.log('❌ No mysteres to display');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-terre-sombre to-black">
        <p className="text-ivoire/60">Aucun trésor à découvrir.</p>
      </div>
    );
  }

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    startIndex: 0,
    containScroll: "trimSnaps"
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [hasTriggeredLoad, setHasTriggeredLoad] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    setCurrentIndex(currentIndex);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    
    // Trigger lazy loading when approaching end
    if (currentIndex >= mysteres.length - 3 && onScrollEnd && !hasTriggeredLoad) {
      setHasTriggeredLoad(true);
      onScrollEnd();
      // Reset trigger after delay to prevent multiple calls
      setTimeout(() => setHasTriggeredLoad(false), 2000);
    }
  }, [emblaApi, mysteres.length, onScrollEnd, hasTriggeredLoad]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleCardClick = useCallback((mystere: Mystere) => {
    setSelectedMystere(mystere);
    setShowQuiz(true);
  }, []);

  const handleQuizClose = useCallback(() => {
    setShowQuiz(false);
    setSelectedMystere(null);
  }, []);

  const handleQuizComplete = useCallback(() => {
    setShowQuiz(false);
    setSelectedMystere(null);
    // Passer au trésor suivant
    if (currentIndex < mysteres.length - 1) {
      setTimeout(() => {
        scrollNext();
      }, 500);
    }
  }, [currentIndex, mysteres.length, scrollNext]);

  // Si un quiz est affiché, montrer le QuizCard en plein écran
  if (showQuiz && selectedMystere) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <QuizCard 
          mystere={selectedMystere} 
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-terre-sombre to-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-terre-sombre/80 backdrop-blur-md border-b border-or-royal/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-or-royal text-2xl font-bold tracking-wider">Trésors</h1>
          <div className="text-ivoire/60">
            {currentIndex + 1} / {mysteres.length}
          </div>
        </div>
      </div>

      {/* INDICATEUR DE PROGRESSION */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {mysteres.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-or-royal w-8' 
                : index < currentIndex 
                  ? 'bg-or-royal/40' 
                  : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* CONTROLES NAVIGATION */}
      <div className="fixed bottom-10 right-6 z-40 flex flex-col gap-4">
        <button 
          onClick={scrollPrev} 
          disabled={!canScrollPrev}
          className="p-4 rounded-full bg-or-royal/10 border border-or-royal/30 text-or-royal disabled:opacity-30 shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={scrollNext} 
          disabled={!canScrollNext}
          className="p-4 rounded-full bg-or-royal/10 border border-or-royal/30 text-or-royal disabled:opacity-30 shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* CAROUSEL */}
      <div className="embla overflow-hidden h-screen pt-20" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {mysteres.map((mystere: Mystere, index) => {
            console.log(`🏺 Treasure ${index}:`, {
              id: mystere.id,
              title: mystere.title,
              subtitle: mystere.subtitle,
              theme: mystere.theme?.name,
              icon: mystere.icon
            });
            
            return (
              <div key={mystere.id} className="embla__slide flex-[0_0_100%] min-w-0 h-full overflow-y-auto pt-2">
                <TreasureCard 
                  mystere={mystere}
                  onClick={() => handleCardClick(mystere)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
