"use client";

import React, { useState } from "react";
import CandidateCard from "./CandidateCard";
import VoteSlider from "./VoteSlider";

export default function DuelCard({ duel, onNext }: any) {
  const [voteValue, setVoteValue] = useState(50);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center text-[#1a1c1c] select-none overflow-x-hidden pt-12 md:pt-16">
      {/* Category pill (Optional, placeholder space if no category) */}
      <div className="mt-8 mb-10 md:mb-16">
        <span className="bg-[#1a1c1c] text-white px-8 py-3 md:px-12 md:py-4 rounded-full font-display text-sm md:text-lg font-bold tracking-[0.2em] uppercase">
          {duel?.categorie_duels || "CULTURE DUELS"}
        </span>
      </div>

      {/* Swipable duel area equivalent */}
      <div className="w-full max-w-5xl px-4 mb-8 md:mb-12 flex items-center justify-center">
        <div className="flex-1 grid grid-cols-2 gap-4 md:gap-10">
          <CandidateCard
            talent={duel?.talent_left}
            score={100 - voteValue}
            color="#006b3f"
          />
          <CandidateCard
            talent={duel?.talent_right}
            score={voteValue}
            color="#ffd31a"
          />
        </div>
      </div>

      {/* Points & Voting Interface */}
      <div className="w-full max-w-lg md:max-w-2xl px-6 mb-10 flex flex-col items-center gap-4">
        <VoteSlider
          value={voteValue}
          onChange={setVoteValue}
          onVoteSubmit={onNext}
        />
      </div>
    </div>
  );
}