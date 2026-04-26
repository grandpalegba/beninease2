"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

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
}

export function EvaluationModule({ episode, profilId }: EvaluationModuleProps) {
  // Valeur par défaut 3 sur 5 (soit 50% / 3 sur 5 dans la DB)
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
    <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-3xl shadow-sm font-sans">
      {/* GAUCHE : VIDÉO */}
      <div className="w-full md:w-1/2 aspect-video bg-black rounded-2xl overflow-hidden">
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
      <div className="w-full md:w-1/2 space-y-6 flex flex-col justify-center">
        <div>
          <h2 className="text-2xl font-black text-black uppercase">{episode.titre}</h2>
          <p className="text-gray-500 italic mt-1">{episode.episode_question || "Qu'avez-vous pensé de cet épisode ?"}</p>
        </div>

        <div className="space-y-4">
          {[
            { label: "Originalité", key: "originalite", color: "bg-green-500" },
            { label: "Authenticité", key: "authenticite", color: "bg-yellow-500" },
            { label: "Impact", key: "impact", color: "bg-orange-500" }
          ].map((c) => (
            <div key={c.key} className="space-y-1">
              <label className="text-black text-xs font-bold uppercase">{c.label}</label>
              <input 
                type="range" min="1" max="5" 
                value={scores[c.key as keyof typeof scores]}
                onChange={(e) => setScores({...scores, [c.key]: parseInt(e.target.value)})}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${c.color} accent-white`}
              />
            </div>
          ))}
        </div>

        <button 
          onClick={submitEvaluation}
          disabled={loading}
          className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? "Validation..." : "Valider l'évaluation"}
        </button>
      </div>
    </div>
  );
}
