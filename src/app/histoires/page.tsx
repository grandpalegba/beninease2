"use client";

import { useHistoires } from "@/hooks/useHistoires";
import { ProfileCard } from "@/components/histoires/ProfileCard";
import useEmblaCarousel from "embla-carousel-react";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function HistoiresPage() {
  const { profils, loading, error, refetch } = useHistoires();

  const [emblaRef] = useEmblaCarousel({
    axis: "x",
    align: "center",
    loop: true,
    containScroll: false,
    dragFree: true,
  });

  /* ── État : chargement ── */
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F4F4F2]">
        <Loader2 className="w-10 h-10 animate-spin text-[#008751] mb-4" />
        <p className="text-gray-400 uppercase tracking-widest text-xs">
          Chargement des Histoires...
        </p>
      </div>
    );
  }

  /* ── État : erreur ── */
  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-gray-900">Oups&nbsp;!</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Impossible de charger les Histoires.
          </p>
          <button
            onClick={refetch}
            className="text-[#008751] font-bold hover:underline text-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  /* ── État : aucun profil ── */
  if (profils.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-bold mb-2 text-gray-700">
            Aucune histoire disponible
          </h2>
          <p className="text-gray-400 text-sm">
            Les histoires arrivent bientôt. Revenez plus tard.
          </p>
        </div>
      </div>
    );
  }

  /* ── Rendu principal ── */
  return (
    <div className="min-h-screen bg-[#F9F9F7] flex flex-col pt-24 pb-32">
      {/* ── Titre Centré ── */}
      <div className="text-center mb-8 px-5">
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          Histoires du Bénin
        </h1>
      </div>

      {/* ── Carrousel Infini ── */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 sm:gap-6 pl-[5vw] sm:pl-[50vw] sm:-ml-[170px]">
          {profils.map((profil) => (
            <ProfileCard
              key={profil.id}
              profil={profil}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
