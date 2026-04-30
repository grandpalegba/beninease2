"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

function getYoutubeID(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

interface EvaluationModuleProps {
  episode: {
    id: string;
    titre: string;
    video_url: string;
    episode_question?: string | null;
  };
  profilId: string;
  seriesInfo?: {
    episode_titre?: string | null;
    episode_question?: string | null;
  } | null;
}

export function EvaluationModule({ episode, profilId, seriesInfo }: EvaluationModuleProps) {
  // On utilise une échelle de 0 à 100 pour la fluidité
  const [scores, setScores] = useState({ originalite: 50, authenticite: 50, impact: 50 });
  const [loading, setLoading] = useState(false);

  const submitEvaluation = async () => {
    setLoading(true);
    try {
      // Conversion 0-100 vers 1-5 pour la base de données
      const toScale5 = (val: number) => Math.round((val / 25) + 1);

      const { error } = await supabase.from("evaluations_histoires").insert({
        video_url: episode.video_url,
        profil_id: profilId,
        originalite: toScale5(scores.originalite),
        authenticite: toScale5(scores.authenticite),
        impact: toScale5(scores.impact),
      });
      if (error) throw error;
      alert("Évaluation enregistrée !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const videoId = getYoutubeID(episode.video_url);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0` : episode.video_url;

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 items-center font-sans">
      {/* GAUCHE : VIDÉO */}
      <div className="bg-black relative aspect-video flex items-center justify-center group self-center lg:self-auto rounded-[2rem] overflow-hidden shadow-2xl m-4 lg:m-6">
        {videoId ? (
          <iframe 
            src={embedUrl} 
            className="w-full h-full" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video 
            src={episode.video_url} 
            className="w-full h-full object-cover pointer-events-none" 
            draggable={false}
            poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
          />
        )}
        {!videoId && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity z-10">
            <h3 className="text-xl md:text-2xl font-bold text-white text-center tracking-[0.2em] uppercase drop-shadow-2xl bg-black/40 px-8 py-4 rounded-[2rem] backdrop-blur-md mb-4">
              Épisode {episode.numero || 1}
            </h3>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 group-hover:opacity-0 transition-opacity">
              <Play fill="currentColor" size={32} />
            </div>
          </div>
        )}
      </div>

      {/* DROITE : ÉVALUATION */}
      <div className="p-10 md:p-12 flex flex-col justify-between min-h-full bg-white">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tighter leading-none mb-3">
            {episode.titre}
          </h2>
          <p className="text-[#008751] font-bold italic text-sm leading-relaxed opacity-80">
            {episode.episode_question || "Quelles leçons tirez-vous de ce récit ?"}
          </p>
        </div>

        <div className="space-y-4 py-4">
          {[
            { label: "Originalité", key: "originalite", className: "range-green", color: "text-[#008751]" },
            { label: "Authenticité", key: "authenticite", className: "range-yellow", color: "text-[#FCD116]" },
            { label: "Impact", key: "impact", className: "range-red", color: "text-[#E8112D]" }
          ].map((c) => (
            <div key={c.key} className="space-y-2">
              <div className="flex justify-between items-end font-black">
                <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400">{c.label}</span>
                <span className="text-[10px] font-black tabular-nums text-black">
                  {Math.round(scores[c.key as keyof typeof scores])}%
                </span>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="range" min="0" max="100" step="1"
                  value={scores[c.key as keyof typeof scores]}
                  onChange={(e) => setScores({...scores, [c.key]: parseInt(e.target.value)})}
                  className={cn("w-full range-slider h-1", c.className)}
                />
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={submitEvaluation}
          disabled={loading}
          className="w-full max-w-[300px] mx-auto bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 mt-6"
        >
          {loading ? "Transmission..." : "Valider l'évaluation"}
        </button>
      </div>
    </div>
  );
}
