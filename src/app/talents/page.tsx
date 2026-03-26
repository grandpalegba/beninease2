/**
 * PAGE PUBLIQUE - LISTE DES TALENTS
 * Role: Galerie des candidats avec système de vote.
 */
"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Info } from "lucide-react";
import { candidates } from "@/data/candidates";

function TalentsList() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1A1A1A]">
          Talents du Bénin
        </h1>
        <p className="mt-4 text-sm md:text-base text-[#8E8E8E] max-w-2xl mx-auto">
          Découvrez les femmes et les hommes qui font rayonner l&apos;excellence béninoise et votez pour vos favoris.
        </p>

        <div className="mt-6 inline-flex items-start gap-3 bg-[#FCFAFC] border border-[#E9E2D6] p-4 rounded-xl text-left max-w-2xl mx-auto shadow-sm">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#C5A267]" />
          <p className="text-sm text-[#555] leading-relaxed">
            <span className="block font-semibold text-[#1A1A1A] mb-1">Mode démonstration</span>
            Les profils présentés ci-dessous sont des exemples illustratifs conçus pour vous donner un avant-goût de l&apos;expérience à venir. Les véritables Talents du Bénin seront dévoilés très prochainement.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {candidates.map((candidate) => (
          <Link
            key={candidate.id}
            href={`/talents/${candidate.slug}`}
            className="group block bg-[#FCFAFC] border border-[#E9E2D6] rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[20px]">
              <Image
                src={candidate.portrait}
                alt={candidate.full_name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>

            {/* Text Section */}
            <div className="p-5">
              <h2 className="font-display text-xl font-bold text-[#1A1A1A] truncate">
                {candidate.full_name}
              </h2>
              <p className="text-[#C5A267] font-medium text-sm mt-1 truncate">
                {candidate.category}
              </p>
              
              <div className="mt-3 flex items-center gap-1.5 text-[#8E8E8E] text-sm">
                <MapPin className="w-4 h-4" />
                <span>{candidate.city}, Bénin</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function TalentsListPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-10 md:p-8 md:py-14">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center text-[#8E8E8E] animate-pulse">
            Chargement de la galerie...
          </div>
        </div>
      }>
        <TalentsList />
      </Suspense>
    </div>
  );
}
