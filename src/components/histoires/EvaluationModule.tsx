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
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : episode.video_url;

  return (
    <div className="bg-white p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 font-sans">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        {/* GAUCHE : VIDÉO */}
        <div className="w-full lg:w-1/2 aspect-video bg-black rounded-[2rem] overflow-hidden shadow-xl border-[6px] border-gray-50">
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
        </div>

        {/* DROITE : ÉVALUATION */}
        <div className="w-full lg:w-1/2 space-y-10">
          <div>
            <h2 className="text-3xl font-black text-black uppercase tracking-tight">
              {seriesInfo?.episode_titre || episode.titre}
            </h2>
            <p className="text-gray-400 italic mt-2 font-medium text-base">
              {seriesInfo?.episode_question || episode.episode_question || "Qu'avez-vous pensé de cet épisode ?"}
            </p>
          </div>

          <div className="space-y-10">
            {[
              { label: "Originalité", key: "originalite", className: "range-green" },
              { label: "Authenticité", key: "authenticite", className: "range-yellow" },
              { label: "Impact", key: "impact", className: "range-red" }
            ].map((c) => (
              <div key={c.key} className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-black text-[10px] font-black uppercase tracking-[0.3em]">{c.label}</label>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{scores[c.key as keyof typeof scores] * 20}%</span>
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
            className="w-full bg-[#0F172A] text-white py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Transmission..." : "Valider l'évaluation"}
          </button>
        </div>
      </div>
    </div>
  );
}
