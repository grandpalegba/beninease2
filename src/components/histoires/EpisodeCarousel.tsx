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
  const [emblaRef] = useEmblaCarousel({ loop: false, align: "center" });

  if (!episodes || episodes.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-500 font-sans">
        Aucun épisode disponible
      </div>
    );
  }

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex -ml-6">
        {episodes.map((ep, idx) => (
          <div key={ep.id || idx} className="flex-[0_0_100%] min-w-0 pl-6">
            <EvaluationModule episode={ep} profilId={profilId || ""} seriesInfo={seriesInfo} />
          </div>
        ))}
      </div>
    </div>
  );
}
