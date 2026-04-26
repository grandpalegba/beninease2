"use client";

import { useHistoires } from "@/hooks/useHistoires";
import { ProfileCard } from "@/components/histoires/ProfileCard";
import useEmblaCarousel from "embla-carousel-react";
import { Loader2, AlertCircle } from "lucide-react";
import { useMemo } from "react";

export default function HistoiresPage() {
  const { profils, loading, error, refetch } = useHistoires();

  // 1. SHUFFLE : On mélange les profils une seule fois grâce à useMemo 
  // pour éviter la boucle infinie de rendus (Error #185).
  const shuffledProfils = useMemo(() => {
    if (!profils) return [];
    return [...profils].sort(() => Math.random() - 0.5);
  }, [profils]);

  // 2. CONFIG EMBLA : "align: center" + "containScroll: false" pour une seule carte à la fois
  const [emblaRef] = useEmblaCarousel({
    axis: "x",
    align: "center",
    loop: true,
    skipSnaps: false,
    dragFree: false, // On force l'arrêt sur une carte (snap)
  });

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#008751] mb-4" />
        <p className="text-gray-400 uppercase tracking-widest text-xs">Chargement...</p>
      </div>
    );
  }

  if (error || shuffledProfils.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">Oups !</h2>
        <button onClick={refetch} className="text-[#008751] font-bold hover:underline">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      {/* --- TITRE --- */}
      <div className="pt-12 pb-6 text-center z-10">
        <h1 className="text-2xl font-serif font-black text-gray-900">
          Histoires du Bénin
        </h1>
      </div>

      {/* --- CARROUSEL PLEIN ÉCRAN --- */}
      <div className="flex-1 flex items-center justify-center" ref={emblaRef}>
        <div className="flex h-full items-center">
          {shuffledProfils.map((profil) => (
            <div
              key={profil.id}
              className="relative flex-[0_0_85%] sm:flex-[0_0_400px] px-4 h-[75vh]"
            >
              <ProfileCard profil={profil} serie={profil.serie} />
            </div>
          ))}
        </div>
      </div>

      {/* INDICATION DE SWIPE */}
      <div className="pb-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-300 animate-pulse">
          Swipe latéral pour découvrir
        </p>
      </div>
    </div>
  );
}