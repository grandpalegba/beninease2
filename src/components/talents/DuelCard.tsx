"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import CandidateCard from "./CandidateCard";
import VoteSlider from "./VoteSlider";

interface DuelCardProps {
  duel: any;
  userId: string | null;
  isActive: boolean;
  onNext: () => void;
}

export default function DuelCard({ duel, userId, isActive, onNext }: DuelCardProps) {
  const [voteValue, setVoteValue] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVoteSubmit = async (finalValue: number) => {
    if (!userId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("votes_duels")
        .insert({
          duel_id: duel.id,
          user_id: userId,
          vote_value: finalValue,
          voted_at: new Date().toISOString()
        });

      if (error) throw error;

      // Succès : Passage au duel suivant
      onNext();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du vote:", err);
      // Optionnel : Notification d'erreur ici
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full bg-white flex flex-col overflow-hidden">
      <div className="flex-grow flex flex-col p-2 gap-2 overflow-hidden">
        <CandidateCard
          talent={duel.talent_left}
          score={100 - voteValue}
          color="#006b3f"
          isActive={isActive}
        />
        <CandidateCard
          talent={duel.talent_right}
          score={voteValue}
          color="#bd0020"
          isActive={isActive}
        />
      </div>

      <div className="bg-white px-6 pb-10 pt-4 flex flex-col gap-6">
        <VoteSlider
          value={voteValue}
          onChange={setVoteValue}
          onVoteSubmit={handleVoteSubmit}
          leftName={duel.talent_left?.prenom_talent}
          rightName={duel.talent_right?.prenom_talent}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}