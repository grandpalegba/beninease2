"use client";

import { ShieldCheck } from "lucide-react";

export default function ClassementPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-10 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-[10px] font-bold text-[#C5A267] uppercase tracking-[0.25em]">
            Hall of Fame
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold text-[#1A1A1A]">
            Classement
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#8E8E8E]">
            Le classement sera activé dès l&apos;ouverture des votes.
          </p>
        </div>

        <div className="rounded-[30px] border border-[#F2EDE4] bg-white p-8 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
          <div className="text-center">
            <p className="text-[10px] font-bold text-[#C5A267] uppercase tracking-[0.25em]">
              Top 4
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-[#1A1A1A]">
              Découvrez bientôt les 4 Talents de l&apos;Excellence
            </h2>
            <p className="mt-3 text-sm md:text-base text-[#8E8E8E]">
              Le classement sera activé dès l&apos;ouverture officielle des votes.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="relative overflow-hidden rounded-[30px] border border-[#F2EDE4] bg-[#FFFDF9] p-5 shadow-[0_8px_22px_rgba(0,0,0,0.03)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70 animate-pulse" />
                <div className="relative">
                  <div className="inline-flex items-center rounded-full border border-[#E9E2D6] bg-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-[#8E8E8E]">
                    {n}ᵉ
                  </div>
                  <div className="mt-6 h-24 rounded-[22px] bg-[#F2EDE4] animate-pulse" />
                  <div className="mt-4 h-3 w-3/4 rounded-full bg-[#F2EDE4] animate-pulse" />
                  <div className="mt-2 h-3 w-2/3 rounded-full bg-[#F2EDE4] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[30px] border border-[#F2EDE4] bg-white p-8 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-[#FFFDF9] border border-[#E9E2D6] flex items-center justify-center text-[#C5A267]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-[#C5A267] uppercase tracking-[0.25em]">
                Comment ça marche ?
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-[#1A1A1A]">
                Vote sécurisé par WhatsApp
              </h3>
              <div className="mt-4 grid gap-3 text-sm text-[#8E8E8E]">
                <p>
                  1) Vous saisissez votre prénom et votre numéro WhatsApp lors du premier vote.
                </p>
                <p>
                  2) Un message de validation s&apos;ouvre dans WhatsApp avec un code unique Beninease.
                </p>
                <p>
                  3) Un numéro WhatsApp ne peut voter qu&apos;une seule fois par candidat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
