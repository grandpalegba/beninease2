"use client";

import { useMemo } from "react";
import type { Episode } from "@/data/series";

interface EpisodeCarouselProps {
  episodes: Episode[];
}

export function EpisodeCarousel({ episodes }: EpisodeCarouselProps) {
  if (!episodes || episodes.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-500">
        Aucun épisode disponible
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
      {episodes.map((ep, idx) => (
        <div
          key={ep.id || idx}
          className="flex-shrink-0 w-64 aspect-video bg-black rounded-xl overflow-hidden snap-center relative group"
        >
          {/* Simulation du lecteur vidéo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-8 border-b-8 border-l-[14px] border-y-transparent border-l-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white text-sm font-bold truncate">
              {ep.titre || `Épisode ${idx + 1}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
