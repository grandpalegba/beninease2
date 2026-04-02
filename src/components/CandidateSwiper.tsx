"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter, useSearchParams } from "next/navigation";
import TalentProfileClient from "@/app/talents/[slug]/TalentProfileClient";
import type { Talent } from "@/types";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

interface CandidateSwiperProps {
  talents: Talent[];
  initialSlug?: string;
}

export default function CandidateSwiper({ talents, initialSlug }: CandidateSwiperProps) {
  // Protection défensive - éviter le crash si pas de talents
  if (!talents || talents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des talents...</p>
        </div>
      </div>
    );
  }

  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Find initial index based on slug
  const initialIndex = initialSlug 
    ? talents.findIndex(t => t.slug === initialSlug) 
    : 0;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    startIndex: initialIndex !== -1 ? initialIndex : 0,
    containScroll: "trimSnaps"
  });

  const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setCurrentIndex(index);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    
    // Update URL without full page reload
    const talent = talents[index];
    if (talent) {
      window.history.replaceState(null, "", `/talents/swipe?slug=${talent.slug}`);
    }
  }, [emblaApi, talents]);

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
      {/* Custom Header for Swiper */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#F2EDE4] px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#008751] uppercase tracking-widest">Expérience Swipe</span>
          <h2 className="text-sm font-display font-bold text-black">
            {currentIndex + 1} sur {talents.length} Ambassadeurs
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="p-2 rounded-full bg-[#F9F9F7] text-black disabled:opacity-30 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="p-2 rounded-full bg-[#F9F9F7] text-black disabled:opacity-30 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Swipe Hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none md:hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-lg animate-bounce">
          <ChevronLeft className="w-3 h-3" />
          Swiper pour découvrir
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>

      {/* Carousel Container */}
      <div className="embla overflow-hidden pt-20" ref={emblaRef}>
        <div className="embla__container flex">
          {talents.map((talent: Talent) => {
            // Protection défensive pour chaque talent
            if (!talent || !talent.id) return null;

            return (
              <div key={talent.id} className="embla__slide flex-[0_0_100%] min-w-0">
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
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .embla__slide {
          transition: transform 0.5s cubic-bezier(0.2, 0, 0, 1);
        }
        /* Bounce effect logic is handled by Embla default behavior with friction */
      `}</style>
    </div>
  );
}
