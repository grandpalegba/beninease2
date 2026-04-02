"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import TalentProfileClient from "@/app/talents/[slug]/TalentProfileClient";
import type { Talent } from "@/types";
import { ChevronLeft, ChevronRight, X, Filter, Settings } from "lucide-react";

interface CandidateSwiperProps {
  talents: Talent[];
  onBack: () => void; // 1. On déclare que le composant DOIT recevoir cette fonction
}

export default function CandidateSwiper({ talents, onBack }: CandidateSwiperProps) {
  // 2. On récupère "onBack" ici
  
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
  const [showFilters, setShowFilters] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

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
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F2EDE4] px-6 py-4 flex items-center justify-between">
        
        {/* 3. LE BOUTON RETOUR QUI UTILISE LA PROP */}
        <button
          onClick={onBack} // Quand on clique, on appelle la fonction onBack
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex items-center gap-4">
          {/* Bouton Filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
            title="Filtrer les talents"
          >
            <Settings className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-[#008751] uppercase tracking-widest">Expérience Swipe</span>
            <h2 className="text-sm font-bold text-black">
              {currentIndex + 1} / {talents.length}
            </h2>
          </div>
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
      <div className="embla overflow-hidden h-screen" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {talents.map((talent: Talent) => (
            <div key={talent.id} className="embla__slide flex-[0_0_100%] min-w-0 h-full overflow-y-auto pt-20">
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