"use client";

/**
 * src/app/histoires/page.tsx
 *
 * Page Histoires — Section Beninease
 * Architecture calquée sur batisseurs/page.tsx :
 *  - useEffect / fetch Supabase via useHistoires()
 *  - Carrousel horizontal Embla par série
 *  - Navigation vers /profil/$profilId au clic
 *  - Loading / error states cohérents avec le reste du projet
 */

import { useMemo } from "react";
import { useHistoires } from "@/hooks/useHistoires";
import { ProfileCard } from "@/components/histoires/ProfileCard";
import useEmblaCarousel from "embla-carousel-react";
import { Loader2, AlertCircle, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProfilAvecSerie } from "@/data/series";

/* ──────────────────────────────────────────────
   Carrousel par série (une rangée Embla par série)
────────────────────────────────────────────── */
function SerieCarousel({ titre, profils }: { titre: string; profils: ProfilAvecSerie[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "x",
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  return (
    <section className="mb-12">
      {/* En-tête de série */}
      <div className="flex items-center justify-between px-5 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#008751]" />
          <h2 className="text-base font-black uppercase tracking-widest text-gray-900">
            {titre}
          </h2>
          <span className="text-[10px] text-gray-400 font-medium ml-1">
            {profils.length} profil{profils.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Boutons de navigation Embla */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#008751] hover:border-[#008751] transition-all"
            aria-label="Précédent"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#008751] hover:border-[#008751] transition-all"
            aria-label="Suivant"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Piste Embla */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 pl-5 pr-5">
          {profils.map((profil) => (
            <ProfileCard
              key={profil.id}
              profil={profil}
              serie={profil.serie}
            />
          ))}
        </div>
      </div>

      {/* Question de l'épisode (si disponible depuis la série) */}
      {profils[0]?.serie?.episode_question && (
        <p className="px-5 mt-4 text-xs text-gray-400 italic">
          « {profils[0].serie.episode_question} »
        </p>
      )}
    </section>
  );
}

/* ──────────────────────────────────────────────
   Page principale Histoires
────────────────────────────────────────────── */
export default function HistoiresPage() {
  const { profils, loading, error, refetch } = useHistoires();

  /* Grouper les profils par série */
  const grouped = useMemo(() => {
    const map = new Map<string, { titre: string; items: ProfilAvecSerie[] }>();

    profils.forEach((p) => {
      const key = p.series_id;
      const titre = p.serie?.titre ?? "Histoires sans titre";
      if (!map.has(key)) {
        map.set(key, { titre, items: [] });
      }
      map.get(key)!.items.push(p);
    });

    return Array.from(map.entries()).map(([id, { titre, items }]) => ({
      id,
      titre,
      items,
    }));
  }, [profils]);

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
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
    <div className="min-h-screen bg-[#F9F9F7] pb-32">
      {/* ── Hero ── */}
      <div className="pt-24 pb-8 px-5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#008751] font-bold mb-2">
          Section
        </p>
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          Histoires
        </h1>
        <p className="text-gray-400 text-sm mt-2 max-w-sm">
          Investissez en Noix Bénies dans les profils qui vous inspirent.
        </p>
      </div>

      {/* ── Carrousels par série ── */}
      {grouped.map((group) => (
        <SerieCarousel
          key={group.id}
          titre={group.titre}
          profils={group.items}
        />
      ))}
    </div>
  );
}
