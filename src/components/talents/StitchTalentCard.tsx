"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface StitchTalentCardProps {
  talent: any;
}

/**
 * StitchTalentCard - Design "Stitch" de la carte talent (Correction Swipe).
 * Respecte STRICTEMENT le HTML fourni par l'utilisateur.
 * Contient le correctif pour la fluidité du swipe (touch-none).
 */
export default function StitchTalentCard({ talent }: StitchTalentCardProps) {
  const router = useRouter();

  // Mapping des données Supabase
  const name = `${talent.prenom} ${talent.nom}`;
  const image = talent.avatar_url || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800";
  const categorie = talent.categorie;
  const slogan = talent.slogan || "Détenteur d'un savoir-faire unique";

  return (
    <div
      onClick={() => router.push(`/talents/${talent.slug}`)}
      className="w-full h-full touch-none select-none cursor-pointer group flex flex-col"
    >
      {/* 🎯 PARTIE 1 — CARTE TALENT (HTML STITCH EXACT) */}
      <section className="w-full relative flex-shrink-0">
        <div className="w-full aspect-[4/5] overflow-hidden relative">
          <Image
            src={image}
            alt={name}
            fill
            className="w-full h-full object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {/* Gradient STITCH EXACT */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white via-white via-white/60 to-transparent"></div>
        </div>
      </section>

      {/* 🎯 PARTIE 2 — CONTENU (HTML STITCH EXACT) */}
      <section className="px-6 py-12 text-center max-w-2xl mx-auto relative z-10 flex-1 bg-white w-full">
        <div className="text-amber-600 font-bold uppercase tracking-[0.25em] text-xs md:text-sm mb-4">
          {categorie}
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold font-manrope text-[#1A1A1A] uppercase mb-4 tracking-[0.15em] leading-tight">
          {name}
        </h1>

        <p className="text-gray-600 italic text-base md:text-lg tracking-wide mb-12">
          "{slogan}"
        </p>
      </section>
    </div>
  );
}
