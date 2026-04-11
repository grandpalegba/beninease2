"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface StitchReferentCardProps {
  ambassadeur: any;
}

/**
 * StitchReferentCard - Design "Stitch" optimisé pour Mobile & Protection Desktop.
 * Améliorations : Textes "levés" sur le dégradé (fog) et protection anti-extraction.
 */
export default function StitchReferentCard({ ambassadeur }: StitchReferentCardProps) {
  const router = useRouter();

  // Mapping des données Supabase
  const prenom = ambassadeur.prenom || "";
  const nom = ambassadeur.nom || "";
  const image = ambassadeur.avatar_url || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800";
  const categorie = ambassadeur.categorie;
  const bio = ambassadeur.bio;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/referent/${ambassadeur.slug}`);
  };

  return (
    <div
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      className="w-full h-full max-h-[90vh] mx-auto touch-none select-none cursor-pointer group flex flex-col overflow-hidden bg-white rounded-2xl"
    >
      {/* 🎯 PARTIE 1 — IMAGE (Protection Desktop + Fog) */}
      <section className="w-full relative flex-shrink-0">
        <div className="w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden relative">
          <Image
            src={image}
            alt={`${prenom} ${nom}`}
            fill
            className="w-full h-full object-cover pointer-events-none transition-transform duration-700 md:group-hover:scale-[1.03]"
            priority
            draggable={false}
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {/* Gradient STITCH EXACT (Fog) */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white via-white via-white/80 to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* 🎯 PARTIE 2 — CONTENU (Harmonie Patriotique) */}
      <section className="px-6 py-10 text-center max-w-2xl mx-auto relative z-10 flex-1 w-full bg-white -mt-16">
        
        {/* Catégorie : Vert Bénin */}
        <div className="text-[#008751] font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6">
          {categorie}
        </div>

        {/* Nom : Anthracite, Mixed Case, Font Light */}
        <h1 className="text-2xl md:text-4xl font-light font-manrope text-[#2a2118] mb-6 leading-tight tracking-tight">
          {prenom} {nom}
        </h1>

        {/* Bio */}
        {bio && (
          <p className="text-gray-400 font-light italic text-sm md:text-base tracking-wide px-4 opacity-80">
            « {bio} »
          </p>
        )}
      </section>
    </div>
  );
}
