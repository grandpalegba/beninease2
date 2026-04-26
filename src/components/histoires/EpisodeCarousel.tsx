"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { Episode } from "@/data/series";

interface EpisodeCarouselProps {
  episodes: Episode[];
  profilNom?: string;
  profilId?: string;
}

export function EpisodeCarousel({ episodes, profilNom }: EpisodeCarouselProps) {
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
                <video
                  src={ep.video_url}
                  className="w-full h-full object-cover"
                  controls
                />
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                  <h3 className="text-white font-bold text-lg">{ep.titre || `Épisode ${idx + 1}`}</h3>
                  <p className="text-white/80 text-xs">Séquence d'évaluation curatoriale</p>
                </div>
              </div>

              {/* Évaluation à droite */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Critères de Souveraineté</h3>
                <p className="text-sm text-gray-500 mb-8">
                  Évaluez la pertinence culturelle et l'impact économique du projet présenté.
                </p>

                <div className="space-y-6 mb-10">
                  {/* Slider 1 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-green-700 uppercase tracking-widest">Originalité</span>
                      <span className="text-green-700">85%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full relative">
                      <div className="absolute top-0 left-0 h-full bg-green-400 rounded-full w-[85%]"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-[85%] w-4 h-4 bg-white border-2 border-green-600 rounded-full shadow-sm -ml-2"></div>
                    </div>
                  </div>

                  {/* Slider 2 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-amber-700 uppercase tracking-widest">Authenticité</span>
                      <span className="text-amber-700">92%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full relative">
                      <div className="absolute top-0 left-0 h-full bg-amber-400 rounded-full w-[92%]"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-[92%] w-4 h-4 bg-white border-2 border-amber-600 rounded-full shadow-sm -ml-2"></div>
                    </div>
                  </div>

                  {/* Slider 3 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-red-700 uppercase tracking-widest">Impact</span>
                      <span className="text-red-700">78%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full relative">
                      <div className="absolute top-0 left-0 h-full bg-red-400 rounded-full w-[78%]"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-[78%] w-4 h-4 bg-white border-2 border-red-600 rounded-full shadow-sm -ml-2"></div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                  VALIDER L'ÉVALUATION
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
