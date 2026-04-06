"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface StitchTalentCardProps {
  talent: any;
}

/**
 * StitchTalentCard - Design "Stitch" optimisé pour Mobile & Protection Desktop.
 * Améliorations : Textes "levés" sur le dégradé (fog) et protection anti-extraction.
 */
export default function StitchTalentCard({ talent }: StitchTalentCardProps) {
  const router = useRouter();

  // Mapping des données Supabase
  const name = `${talent.prenom} ${talent.nom}`;
  const image = talent.avatar_url || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800";
  const categorie = talent.categorie;
  const slogan = talent.slogan || "Détenteur d'un savoir-faire unique";
  const bio = talent.bio;

  return (
    <div
      onClick={() => router.push(`/talents/${talent.slug}`)}
      onContextMenu={(e) => e.preventDefault()}
      className="w-full h-full max-h-[90vh] mx-auto touch-none select-none cursor-pointer group flex flex-col overflow-hidden bg-white rounded-2xl"
    >
      {/* 🎯 PARTIE 1 — IMAGE (Protection Desktop + Fog) */}
      <section className="w-full relative flex-shrink-0">
        <div className="w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden relative">
          <Image
            src={image}
            alt={name}
            fill
            className="w-full h-full object-cover pointer-events-none"
            priority
            draggable={false}
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {/* Gradient STITCH EXACT (Fog) */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white via-white via-white/60 to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* 🎯 PARTIE 2 — CONTENU (Textes "levés" sur la brume / -mt-28) */}
      <section className="px-6 py-8 text-center max-w-2xl mx-auto relative z-10 flex-1 w-full -mt-28 pointer-events-none">
        
        {/* Catégorie */}
        <div className="text-amber-600 font-bold uppercase tracking-[0.25em] text-xs md:text-sm mb-4">
          {categorie}
        </div>

        {/* Nom */}
        <h1 className="text-2xl md:text-4xl font-extrabold font-manrope text-[#1A1A1A] uppercase mb-4 tracking-[0.15em] leading-tight">
          {name}
        </h1>

        {/* Bio */}
        {bio && (
          <p className="text-gray-600 italic text-sm md:text-base tracking-wide px-4">
            {bio}
          </p>
        )}
      </section>
    </div>
  );
}
