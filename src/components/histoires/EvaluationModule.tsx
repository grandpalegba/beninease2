"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

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
  const [scores, setScores] = useState({ originalite: 3, authenticite: 3, impact: 3 });
  const [loading, setLoading] = useState(false);

  const submitEvaluation = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("evaluations_histoires").insert({
        video_url: episode.video_url,
        profil_id: profilId,
        originalite: scores.originalite,
        authenticite: scores.authenticite,
        impact: scores.impact,
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
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 font-sans">
      {/* GAUCHE : VIDÉO */}
      <div className="bg-black relative aspect-video flex items-center justify-center group">
        {videoId ? (
          <iframe 
            src={embedUrl} 
            className="w-full h-full" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={episode.video_url} controls className="w-full h-full object-cover" />
        )}
        <div className="absolute bottom-6 left-8 text-white pointer-events-none group-hover:opacity-0 transition-opacity">
          <p className="font-bold text-lg uppercase tracking-tight">{episode.titre}</p>
          <p className="text-sm opacity-70">Documentaire • 12:45</p>
        </div>
      </div>

      {/* DROITE : ÉVALUATION */}
      <div className="p-10 md:p-12 flex flex-col justify-between h-full bg-white">
        <div>
          <h2 className="text-3xl font-black text-black uppercase tracking-tighter leading-none mb-1">
            {episode.titre}
          </h2>
          <p className="text-gray-400 font-medium italic text-sm">
            {episode.episode_question || "Analyse de la souveraineté culturelle"}
          </p>
        </div>

        <div className="space-y-6 py-4">
          {[
            { label: "Originalité", key: "originalite", className: "range-green", color: "text-[#008751]" },
            { label: "Authenticité", key: "authenticite", className: "range-yellow", color: "text-[#FCD116]" },
            { label: "Impact", key: "impact", className: "range-red", color: "text-[#E8112D]" }
          ].map((c) => (
            <div key={c.key} className="space-y-2">
              <div className="flex justify-between items-end font-black">
                <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400">{c.label}</span>
                <span className={cn("text-lg", c.color)}>
                  {(scores[c.key as keyof typeof scores] - 1) * 25}%
                </span>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="range" min="1" max="5" 
                  value={scores[c.key as keyof typeof scores]}
                  onChange={(e) => setScores({...scores, [c.key]: parseInt(e.target.value)})}
                  className={cn("w-full range-slider", c.className)}
                />
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={submitEvaluation}
          disabled={loading}
          className="w-full bg-[#0F172A] text-white py-4 rounded-[20px] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? "Transmission..." : "Valider l'évaluation"}
        </button>
      </div>
    </div>
  );
}
