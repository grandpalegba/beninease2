"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import CandidateCard from '@/components/talents/CandidateCard';
import TalentVoteSlider from '@/components/talents/VoteSlider';

export default function TalentsDuelPage() {
  const [duel, setDuel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);

  // Fonction pour charger le prochain duel via la requête directe (jointures explicites)
  const fetchDuel = async () => {
    setLoading(true);
    setSliderValue(50); // Reset le slider pour le nouveau duel
    try {
      const { data, error } = await supabase
        .from('duels')
        .select(`
          id, 
          category, 
          mission_categorie,
          talent_left:talents!talent_left(*), 
          talent_right:talents!talent_right(*)
        `)
        .limit(1);

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
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('votes_duels').insert({
        duel_id: duel.id,
        user_id: user?.id,
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

  if (!duel) return <div className="text-white p-10">Aucun duel disponible. Vérifiez la table 'duels'.</div>;

  return (
    <main className="min-h-screen bg-black pt-24 px-4 font-inter">
      <div className="max-w-6xl mx-auto">
        {/* Header de Contextualisation */}
        <div className="text-center mb-12 max-w-4xl mx-auto space-y-3">
          <h1 className="text-white text-2xl md:text-4xl font-black uppercase tracking-tighter">
            {duel.category || "Catégorie Talent"}
          </h1>
          <p className="text-white/50 text-xs md:text-sm font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
            Selon vous, lequel de ces deux Talents a réussi la mission de présenter dans une vidéo d'une minute 
          </p>
          <div className="pt-2">
            <p className="text-[#052f98] text-xl md:text-3xl font-black tracking-tight leading-tight">
              {duel.mission_categorie || "Mission d'Excellence"}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-12">
          {/* Talent Gauche */}
          <CandidateCard
            name={duel.talent_left?.prenom_talent || "Talent Gauche"}
            prenom_talent={duel.talent_left?.prenom_talent}
            nom_talent={duel.talent_left?.nom_talent}
            signature={duel.talent_left?.signature}
            video={duel.talent_left?.video_url}
            image={duel.talent_left?.avatar_url}
            color="green"
            isActive={true}
            className="flex-1 w-full max-w-sm aspect-[3/4]"
          />

          <div className="text-[#052f98] font-black text-4xl italic hidden md:block">VS</div>

          {/* Talent Droite */}
          <CandidateCard
            name={duel.talent_right?.prenom_talent || "Talent Droite"}
            prenom_talent={duel.talent_right?.prenom_talent}
            nom_talent={duel.talent_right?.nom_talent}
            signature={duel.talent_right?.signature}
            video={duel.talent_right?.video_url}
            image={duel.talent_right?.avatar_url}
            color="red"
            isActive={true}
            className="flex-1 w-full max-w-sm aspect-[3/4]"
          />
        </div>

        {/* Interface de Vote */}
        <div className="max-w-2xl mx-auto">
          <TalentVoteSlider
            value={sliderValue}
            onChange={setSliderValue}
            onVoteSubmit={handleVote}
            leftName={duel.talent_left?.prenom_talent}
            rightName={duel.talent_right?.prenom_talent}
          />
        </div>
      </div>
    </main>
  );
}