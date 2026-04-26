"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

interface Props {
  episodeId: string;
  profilId: string;
}

export function EvaluationModule({ episodeId, profilId }: Props) {
  // États pour les sliders (dynamique)
  const [scores, setScores] = useState({
    originalite: 85,
    authenticite: 92,
    impact: 78
  });

  const [loading, setLoading] = useState(false);

  const handleVote = async () => {
    setLoading(true);
    try {
      // Calcul de la moyenne pour l'impact sur le prix (Noix Bénies)
      const moyenne = (scores.originalite + scores.authenticite + scores.impact) / 3;
      
      // Simulation d'enregistrement dans Supabase
      const { error } = await supabase
        .from("votes_histoires")
        .insert({
          episode_id: episodeId,
          profil_id: profilId,
          score: moyenne,
          details: scores
        });

      if (error) throw error;
      alert("Évaluation validée !");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 w-full flex flex-col justify-center">
      <h2 className="text-2xl font-serif font-black text-gray-900 mb-2">Critères de Souveraineté</h2>
      <p className="text-sm text-gray-400 mb-8">Évaluez la pertinence culturelle et l'impact économique du projet présenté.</p>

      <div className="space-y-8">
        {/* Slider ORIGINALITÉ */}
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-green-600">Originalité</span>
            <span className="text-gray-900">{scores.originalite}%</span>
          </div>
          <input 
            type="range" 
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-500"
            value={scores.originalite}
            onChange={(e) => setScores({...scores, originalite: parseInt(e.target.value)})}
          />
        </div>

        {/* Slider AUTHENTICITÉ */}
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-amber-600">Authenticité</span>
            <span className="text-gray-900">{scores.authenticite}%</span>
          </div>
          <input 
            type="range" 
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            value={scores.authenticite}
            onChange={(e) => setScores({...scores, authenticite: parseInt(e.target.value)})}
          />
        </div>

        {/* Slider IMPACT */}
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-red-500">Impact</span>
            <span className="text-gray-900">{scores.impact}%</span>
          </div>
          <input 
            type="range" 
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-red-500"
            value={scores.impact}
            onChange={(e) => setScores({...scores, impact: parseInt(e.target.value)})}
          />
        </div>
      </div>

      <button 
        onClick={handleVote}
        disabled={loading}
        className="w-full mt-10 bg-[#0F172A] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-colors disabled:opacity-50"
      >
        {loading ? "Validation..." : "Valider l'évaluation"}
      </button>
    </div>
  );
}
