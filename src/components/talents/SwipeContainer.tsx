"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import DuelCard from "./DuelCard";
import { supabase } from "@/lib/supabase/client";

interface SwipeContainerProps {
  initialDuels: any[];
  userId: string | null;
  categoryId: string;
}

export default function SwipeContainer({ initialDuels, userId, categoryId }: SwipeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [duels, setDuels] = useState(initialDuels);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  // 1. Chargement infini des duels disponibles
  const loadMoreDuels = useCallback(async () => {
    if (isFetching || hasReachedEnd || !userId) return;

    setIsFetching(true);
    try {
      const { data, error } = await supabase.rpc('get_available_duels', {
        p_user_id: userId,
        p_categorie_duels: categoryId
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setDuels(prev => {
          const newDuels = (data as any[]).filter((d: any) => !prev.some(p => p.id === d.id));
          return [...prev, ...newDuels];
        });
      } else {
        setHasReachedEnd(true);
      }
    } catch (err) {
      console.error("Erreur chargement duels:", err);
    } finally {
      setIsFetching(false);
    }
  }, [userId, categoryId, isFetching, hasReachedEnd]);

  // 2. Navigation automatique vers le duel suivant après vote
  const scrollToNext = () => {
    if (!containerRef.current) return;
    const nextIndex = activeIndex + 1;

    if (nextIndex < duels.length) {
      const children = containerRef.current.children;
      const nextChild = children[nextIndex] as HTMLElement;
      if (nextChild) {
        // Scroll fluide vers le prochain duel
        nextChild.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // 3. Intersection Observer pour détecter le duel actif et charger la suite
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);

            // Charger plus de duels quand on approche de la fin (buffer de 2)
            if (index >= duels.length - 2) {
              loadMoreDuels();
            }
          }
        });
      },
      { root: el, threshold: 0.6 } // Se déclenche quand 60% de la carte est visible
    );

    Array.from(el.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [duels, loadMoreDuels]);

  return (
    <main
      ref={containerRef}
      className="h-full w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-black no-scrollbar"
      style={{
        WebkitOverflowScrolling: "touch",
        height: "100%" // Occupe 100% du parent flex-grow de TalentsClient
      }}
    >
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {duels.map((duel, i) => (
        <section
          key={`${duel.id}-${i}`}
          data-index={i}
          className="snap-start snap-always h-full w-full flex-shrink-0 overflow-hidden relative"
        >
          {/* DuelCard reçoit maintenant l'état actif. 
              C'est lui qui affichera les images des deux talents et le VoteSlider.
          */}
          <DuelCard
            duel={duel}
            userId={userId}
            isActive={activeIndex === i}
            onNext={scrollToNext}
          />
        </section>
      ))}

      {/* Loader de fin de liste */}
      {!hasReachedEnd && (
        <section className="h-[20vh] flex items-center justify-center bg-black">
          <div className="w-6 h-6 border-2 border-white/10 border-t-[#006b3f] rounded-full animate-spin" />
        </section>
      )}

      {/* État de fin de catégorie */}
      {hasReachedEnd && duels.length > 0 && (
        <section className="h-full flex flex-col items-center justify-center p-12 text-center bg-black">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <div className="w-2 h-2 bg-[#006b3f] rounded-full animate-pulse" />
          </div>
          <p className="text-white/40 font-manrope font-black text-[10px] uppercase tracking-[0.3em] leading-relaxed">
            Vous avez exploré tous les talents de cette arène
          </p>
        </section>
      )}
    </main>
  );
}