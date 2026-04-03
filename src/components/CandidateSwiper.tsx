"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import TalentProfileClient from "@/app/talents/[slug]/TalentProfileClient";
import type { Talent } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CandidateSwiperProps {
  talents: Talent[];
  loading?: boolean;
  onScrollEnd?: () => void;
}

export default function CandidateSwiper({ talents, loading = false, onScrollEnd }: CandidateSwiperProps) {
  
  if (!talents || talents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <p className="text-gray-600">Aucun talent à afficher.</p>
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
    if (currentIndex >= talents.length - 3 && onScrollEnd && !hasTriggeredLoad) {
      setHasTriggeredLoad(true);
      onScrollEnd();
      // Reset trigger after delay to prevent multiple calls
      setTimeout(() => setHasTriggeredLoad(false), 1000);
    }
  }, [emblaApi, talents.length, onScrollEnd, hasTriggeredLoad]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="relative min-h-screen bg-[#F9F9F7]">
      {/* HEADER DU SWIPER */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#F2EDE4] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Spacer for header content from parent */}
          <div className="w-10" />
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#008751] rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Chargement...</span>
            </div>
          )}
          
          {/* Spacer */}
          <div className="w-10" />
        </div>
      </div>

      {/* CONTROLES NAVIGATION */}
      <div className="fixed bottom-10 right-6 z-40 flex flex-col gap-4">
        <button 
          onClick={scrollPrev} 
          disabled={!canScrollPrev}
          className="p-4 rounded-full bg-[#008751] text-white disabled:opacity-30 shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={scrollNext} 
          disabled={!canScrollNext}
          className="p-4 rounded-full bg-[#008751] text-white disabled:opacity-30 shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* CAROUSEL */}
      <div className="embla overflow-hidden h-screen pt-20" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {talents.map((talent: Talent) => (
            <div key={talent.id} className="embla__slide flex-[0_0_100%] min-w-0 h-full overflow-y-auto pt-4">
              <TalentProfileClient 
                candidate={{
                  id: talent.id,
                  slug: talent.slug || `talent-${talent.id}`,
                  prenom: talent.prenom || 'Prénom',
                  nom: talent.nom || 'Nom',
                  portrait: talent.avatar_url || '/placeholder-avatar.png',
                  city: talent.city || 'Bénin',
                  univers: talent.univers || 'Non spécifié',
                  categorie: talent.categorie || 'Non spécifié',
                  tabs: {}
                }}
                initialVotesCount={talent.votes || 0}
                profileId={talent.id}
                avatarUrl={talent.avatar_url || '/placeholder-avatar.png'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}