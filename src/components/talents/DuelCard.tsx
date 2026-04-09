"use client";

import React, { useState } from "react";
import CandidateCard from "./CandidateCard";
import VoteSlider from "./VoteSlider";
import { supabase } from "@/lib/supabase/client";

export default function DuelCard({ duel, userId, isActive, onNext }: any) {
  const [voteValue, setVoteValue] = useState(50);
  const [loading, setLoading] = useState(false);

  const handleVoteSubmit = async (val: number) => {
    if (!userId || loading) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("votes_duels").insert({
        duel_id: duel.id,
        user_id: userId,
        vote_value: val,
      });
      if (!error) onNext();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-white flex flex-col font-manrope">
      {/* Espace de respiration supérieur */}
      <div className="h-4 bg-white" />

      {/* ZONE CANDIDATS : Flex-grow pour occuper l'espace dynamique */}
      <div className="flex-grow flex flex-col px-4 gap-8">
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

      {/* ESPACE BLANC (Divider Rule: 2rem) */}
      <div className="h-12 bg-white" />

      {/* ZONE DE VOTE : Bas de l'écran */}
      <div className="bg-white px-8 pb-12">
        <VoteSlider
          value={voteValue}
          onChange={setVoteValue}
          onVoteSubmit={handleVoteSubmit}
          disabled={loading}
        />
      </div>
    </div>
  );
}