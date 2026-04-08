"use client";

import { useState, useEffect } from 'react';
import TalentVoteSlider from '@/components/talents/TalentVoteSlider';
import { supabase } from '@/lib/supabase/client';

export default function TalentsDuelPage() {
  const [duel, setDuel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger le prochain duel via la requête directe (jointures explicites)
  const fetchDuel = async () => {
    setLoading(true);
    try {
      // On utilise la jointure explicite comme demandé
      const { data, error } = await supabase
        .from('duels')
        .select(`
          id, 
          category, 
          mission_categorie,
          talent_left:talents!talent_left(*), 
          talent_right:talents!talent_right(*)
        `)
        .limit(1); // À adapter si besoin d'un filtrage plus complexe (non-votés)

      if (error) throw error;
      if (data && data.length > 0) {
        setDuel(data[0]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement du duel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDuel();
  }, []);

  // Gestion de l'enregistrement du vote et transition
  const handleVote = async (value: number) => {
    if (!duel) return;

    try {
      const { error } = await supabase.from('votes_duels').insert({
        duel_id: duel.id,
        user_id: (await supabase.auth.getUser()).data.user?.id, // Récupération de l'ID utilisateur
        vote_value: value,
      });

      if (error) throw error;

      // Transition fluide : on charge immédiatement le suivant
      fetchDuel();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du vote:", err);
    }
  };

  if (loading && !duel) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-[#006b3f]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
      </div>
    );
  }

  if (!duel) return <div className="text-white p-10">Aucun talent disponible pour le moment.</div>;

  return (
    <main className="min-h-screen bg-black pt-24 px-4 font-inter">
      <div className="max-w-6xl mx-auto">
        {/* Header de Contextualisation (Hiérarchie UX) */}
        <div className="text-center mb-12 max-w-4xl mx-auto space-y-3">
          {/* Niveau 1 : Nom de la catégorie */}
          <h1 className="text-white text-2xl md:text-4xl font-black uppercase tracking-tighter">
            {duel.category || duel.nom_categorie || "Catégorie Talent"}
          </h1>
          
          {/* Niveau 2 : Question de guidage */}
          <p className="text-white/50 text-xs md:text-sm font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
            Selon vous, lequel de ces deux Talents a réussi la mission de présenter dans une vidéo d'une minute 
          </p>

          {/* Niveau 3 : La Mission (Bleu Distinctif #052f98) */}
          <div className="pt-2">
            <p className="text-[#052f98] text-xl md:text-3xl font-black tracking-tight leading-tight">
              {duel.mission_categorie || "Mission d'Excellence"}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-12 h-[60vh] md:h-[50vh]">
          {/* Talent Gauche */}
          <CandidateCard
            prenom_talent={duel.talent_left?.prenom_talent}
            nom_talent={duel.talent_left?.nom_talent}
            signature={duel.talent_left?.signature}
            video={duel.talent_left?.video_url}
            image={duel.talent_left?.avatar_url}
            color="green"
            isActive={true}
            className="flex-1"
          />

          {/* Talent Droite */}
          <CandidateCard
            prenom_talent={duel.talent_right?.prenom_talent}
            nom_talent={duel.talent_right?.nom_talent}
            signature={duel.talent_right?.signature}
            video={duel.talent_right?.video_url}
            image={duel.talent_right?.avatar_url}
            color="red"
            isActive={true}
            className="flex-1"
          />
        </div>

        {/* Interface de Vote */}
        <div className="max-w-2xl mx-auto">
          <TalentVoteSlider
            onVoteSubmit={handleVote}
            leftName={duel.talent_left?.prenom_talent}
            rightName={duel.talent_right?.prenom_talent}
          />
        </div>
      </div>
    </main>
  );
}