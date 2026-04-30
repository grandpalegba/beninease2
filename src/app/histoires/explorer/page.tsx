"use client";

import { useHistoires } from "@/hooks/useHistoires";
import { ProfileCard } from "@/components/histoires/ProfileCard";
import CardDeck from "@/components/ui/CardDeck";
import { Loader2, AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";

export default function HistoiresPage() {
  const router = useRouter();
  const { profils, loading, error, refetch } = useHistoires();

  // SHUFFLE : On mélange les profils une seule fois grâce à useMemo
  const shuffledProfils = useMemo(() => {
    if (!profils) return [];
    return [...profils].sort(() => Math.random() - 0.5);
  }, [profils]);

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
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden relative">
      
      {/* BOUTON RETOUR */}
      <BackButton href="/histoires" />

      {/* --- CARROUSEL FAÇON TINDER/BUMBLE --- */}
      <div className="flex-1 overflow-hidden">
        <CardDeck
          items={shuffledProfils}
          className="bg-white h-full"
          renderItem={(profil) => (
            <ProfileCard profil={profil} serie={profil.serie} />
          )}
        />
      </div>
      
      {/* INDICATION DE SWIPE */}
      <div className="pb-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-300 animate-pulse">
          Swipe latéral pour découvrir
        </p>
      </div>
    </div>
  );
}