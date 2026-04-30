"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { Episode } from "@/data/series";
import { EvaluationModule } from "./EvaluationModule";

interface EpisodeCarouselProps {
  episodes: Episode[];
  profilId?: string;
  seriesInfo?: {
    episode_titre?: string | null;
    episode_question?: string | null;
  } | null;
}

export function EpisodeCarousel({ episodes, profilId, seriesInfo }: EpisodeCarouselProps) {
  if (!episodes || episodes.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-500 font-sans">
        Aucun épisode disponible
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8">
      {episodes.map((ep, idx) => (
        <div key={ep.id || idx} className="w-full">
          <EvaluationModule episode={ep} profilId={profilId || ""} seriesInfo={seriesInfo} />
        </div>
      ))}
    </div>
  );
}
