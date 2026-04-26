"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { Episode } from "@/data/series";
import { EvaluationModule } from "./EvaluationModule";

function getYoutubeID(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

interface EpisodeCarouselProps {
  episodes: Episode[];
  profilNom?: string;
  profilId?: string;
}

export function EpisodeCarousel({ episodes, profilNom, profilId }: EpisodeCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: "center" });

  if (!episodes || episodes.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-500">
        Aucun épisode disponible
      </div>
    );
  }

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {episodes.map((ep, idx) => (
          <div key={ep.id || idx} className="flex-[0_0_100%] min-w-0 pr-4">
            <div className="bg-white border border-gray-100 rounded-[20px] shadow-lg flex flex-col md:flex-row overflow-hidden">
              {/* Vidéo à gauche */}
              <div className="w-full md:w-1/2 aspect-video bg-black relative group">
                {ep.video_url && getYoutubeID(ep.video_url) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeID(ep.video_url)}`}
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={ep.video_url}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                  <h3 className="text-white font-bold text-lg">{ep.titre || `Épisode ${idx + 1}`}</h3>
                  <p className="text-white/80 text-xs">Séquence d'évaluation curatoriale</p>
                </div>
              </div>

              {/* Évaluation à droite */}
              <div className="w-full md:w-1/2 flex flex-col justify-center bg-white border-l border-gray-100">
                <EvaluationModule episodeId={ep.id} profilId={profilId || ""} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
