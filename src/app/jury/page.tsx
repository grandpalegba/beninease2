"use client";

import { Suspense } from "react";

function JuryList() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1A1A1A]">
          Le Jury
        </h1>
        <p className="mt-3 text-sm md:text-base text-[#8E8E8E]">
          Dévoilement du Grand Jury prochainement.
        </p>
      </div>

      <div className="mb-8 rounded-[30px] border border-[#F2EDE4] bg-white p-8 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold text-[#C5A267] uppercase tracking-[0.25em]">
            Lancement imminent
          </p>
          <p className="mt-4 font-display text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            Dévoilement du Grand Jury prochainement
          </p>
          <p className="mt-3 text-sm text-[#8E8E8E]">
            Une sélection prestigieuse de personnalités et d’experts sera annoncée très bientôt.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="relative rounded-[28px] border border-[#F2EDE4] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden"
          >
            <div className="relative aspect-[4/3] bg-[#F8F5F0] animate-pulse" />
            <div className="p-5">
              <div className="h-4 w-40 rounded-full bg-[#F2EDE4] animate-pulse" />
              <div className="mt-3 h-3 w-56 rounded-full bg-[#F2EDE4] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JuryListPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-10 md:py-14">
      <Suspense fallback={<div className="text-center text-[#8E8E8E]">Chargement du jury...</div>}>
        <JuryList />
      </Suspense>
    </div>
  );
}
