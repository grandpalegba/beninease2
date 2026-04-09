"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import CandidateCard from "./CandidateCard";
import VoteSlider from "./VoteSlider";

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
        voted_at: new Date().toISOString()
      });

      if (error) throw error;
      onNext(); // Passage au slide suivant après insertion
    } catch (e) {
      console.error("Erreur vote:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-white flex flex-col font-manrope">
      {/* 2rem Respiratory Space */}
      <div className="h-8 bg-white" />

      {/* CARDS SECTION (Top) */}
      <div className="flex-grow flex flex-col px-5 gap-8">
        <CandidateCard
          talent={duel?.talent_left}
          score={100 - voteValue}
          color="#006b3f"
          isActive={isActive}
        />
        <CandidateCard
          talent={duel?.talent_right}
          score={voteValue}
          color="#bd0020"
          isActive={isActive}
        />
      </div>

      {/* Divider Rule : 2rem Space */}
      <div className="h-12 bg-white" />

      {/* VOTE SECTION (Bottom) */}
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