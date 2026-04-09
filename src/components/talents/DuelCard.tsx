"use client";

import React, { useState } from "react";
import CandidateCard from "./CandidateCard";
import VoteSlider from "./VoteSlider";

export default function DuelCard({ duel, onNext }: any) {
  const [voteValue, setVoteValue] = useState(50);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center px-6 py-12">
      {/* HEADER SPACE */}
      <div className="h-12" />

      {/* DUAL DISPLAY */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 mb-16">
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

      {/* 2rem de respiration avant le slider */}
      <div className="h-8" />

      {/* VOTE INTERFACE */}
      <div className="w-full max-w-md">
        <VoteSlider
          value={voteValue}
          onChange={setVoteValue}
          onVoteSubmit={onNext}
        />
      </div>
    </div>
  );
}