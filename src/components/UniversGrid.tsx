"use client";

import { useState } from "react";
import Link from "next/link";
import { universes } from "@/lib/data/universes";

type UniversGridProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

const UniversGrid = ({ ctaHref = "/postuler", ctaLabel = "POSTULER MAINTENANT" }: UniversGridProps) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const handleToggle = (i: number, name: string) => {
    console.log("Clic détecté sur la carte Univers:", name);
    setActiveIdx(prev => prev === i ? null : i);
  };

  return (
    <section id="univers" className="py-24 md:py-32 bg-[#008751] relative z-10">
      <div className="container px-4 relative z-20 mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance" style={{ lineHeight: "1.15" }}>
            Les 16 Univers
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto font-body">
            Chaque univers regroupe les talents dans 4 catégories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-7xl mx-auto relative z-30">
          {universes.map((u, i) => {
            const Icon = u.icon;
            const isActive = activeIdx === i;
            return (
              <button
                key={u.name}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggle(i, u.name);
                }}
                className={`relative group rounded-2xl p-5 md:p-6 text-left transition-all duration-300 ease-in-out cursor-pointer border-none shadow-sm flex flex-col items-start hover:scale-[1.05] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 z-40 pointer-events-auto min-h-[140px] ${
                  isActive ? "bg-white col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 scale-[1.05] shadow-[0_20px_40px_rgba(0,0,0,0.2)] ring-4 ring-white/20" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  isActive ? "bg-[#008751]/10" : "bg-white/20"
                }`}>
                  <Icon className={`w-6 h-6 ${isActive ? "text-[#008751]" : "text-white"}`} />
                </div>
                <h3 className={`font-sans text-sm md:text-base font-bold leading-tight mb-1 uppercase tracking-wider ${
                  isActive ? "text-[#008751]" : "text-white"
                }`}>
                  {u.name}
                </h3>

                {isActive && (
                  <div className="mt-4 grid grid-cols-2 gap-2 w-full animate-in fade-in slide-in-from-top-2 duration-300">
                    {u.subs.map((sub) => (
                      <div
                        key={sub}
                        className="text-[10px] md:text-xs px-3 py-2.5 rounded-xl bg-[#008751]/5 text-[#008751] font-sans font-bold uppercase tracking-wider border border-[#008751]/10 flex items-center justify-center text-center"
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
                
                {!isActive && (
                  <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">
                    <span>Voir les catégories</span>
                    <div className="w-4 h-px bg-current" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white text-[#008751] hover:bg-[#004d3d] hover:text-white border border-transparent active:scale-[0.97] h-14 px-12 text-sm font-bold tracking-[0.1em] uppercase transition-all shadow-xl"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UniversGrid;
