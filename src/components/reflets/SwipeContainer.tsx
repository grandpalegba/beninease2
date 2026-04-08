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

  // 1. Fonction pour charger les prochains duels non votés
  const loadMoreDuels = useCallback(async () => {
    if (isFetching || hasReachedEnd || !userId) return;

    setIsFetching(true);
    try {
      // Appel à la fonction RPC qui exclut les duels déjà votés
      const { data, error } = await supabase.rpc('get_available_duels', {
        p_user_id: userId,
        p_category_id: categoryId
      });

      if (error) throw error;

      if (data && data.length > 0) {
        // On filtre pour éviter les doublons si la requête random renvoie un duel déjà en liste
        setDuels(prev => {
          const newDuels = data.filter(d => !prev.some(p => p.id === d.id));
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

  // 2. Scroll automatique vers le bas (appelé par DuelCard après validation)
  const scrollToNext = () => {
    if (!containerRef.current) return;
    const nextIndex = activeIndex + 1;

    if (nextIndex < duels.length) {
      const children = containerRef.current.children;
      const nextChild = children[nextIndex] as HTMLElement;
      if (nextChild) {
        nextChild.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // 3. Détection du duel actif (Intersection Observer)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);

            // Si on arrive à 2 cartes de la fin, on anticipe le chargement suivant
            if (index >= duels.length - 2) {
              loadMoreDuels();
            }
          }
        });
      },
      { root: el, threshold: 0.7 }
    );

    Array.from(el.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [duels, loadMoreDuels]);

  return (
    <main
      ref={containerRef}
      className="h-[100dvh] w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-black no-scrollbar"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {duels.map((duel, i) => (
        <section
          key={duel.id}
          data-index={i}
          className="snap-start snap-always h-[100dvh] w-full flex-shrink-0 overflow-hidden"
        >
          <DuelCard
            duel={duel}
            userId={userId}
            isActive={activeIndex === i}
            onNext={scrollToNext}
          />
        </section>
      ))}

      {/* Loader discret en fin de liste */}
      {!hasReachedEnd && (
        <section className="h-20 flex items-center justify-center bg-black">
          <div className="w-5 h-5 border-2 border-[#ffd31a]/30 border-t-[#ffd31a] rounded-full animate-spin" />
        </section>
      )}

      {/* État vide / Fin de catégorie */}
      {hasReachedEnd && duels.length === 0 && (
        <div className="h-screen flex flex-col items-center justify-center p-8 text-center bg-black">
          <p className="text-white font-manrope font-bold uppercase tracking-widest opacity-50">
            Tous les reflets de cette catégorie ont été explorés
          </p>
        </div>
      )}
    </main>
  );
}