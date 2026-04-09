"use client";

import React, { useState } from "react";
import CandidateCard from "./CandidateCard";
import VoteSlider from "./VoteSlider";

export default function TalentsWeb({ currentDuel }: any) {
  const [voteValue, setVoteValue] = useState(50);

  return (
    <main className="min-h-screen bg-[#f9f9f9] font-manrope selection:bg-[#ffd31a]">
      {/* Header Spacer */}
      <div className="h-20" />

      <div className="max-w-[1440px] mx-auto px-12 flex flex-col items-center">
        {/* DUEL ARENA - Grid 2 colonnes sur Web */}
        <div className="w-full grid grid-cols-2 gap-16 mb-24">
          <CandidateCard
            talent={currentDuel?.talent_left}
            score={100 - voteValue}
            color="#006b3f"
          />
          <CandidateCard
            talent={currentDuel?.talent_right}
            score={voteValue}
            color="#715c00"
          />
        </div>

        {/* VOTE INTERFACE - Centrée en bas */}
        <div className="w-full max-w-4xl flex flex-col items-center">
          <VoteSlider
            value={voteValue}
            onChange={setVoteValue}
            onVoteSubmit={(val: number) => console.log("Vote:", val)}
          />
        </div>
      </div>
    </main>
  );
}