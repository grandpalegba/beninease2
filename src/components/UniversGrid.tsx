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
      <div className="container px-4 relative z-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance" style={{ lineHeight: "1.15" }}>
            Les 16 Univers
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto font-body">
            Chaque univers regroupe les talents dans 4 catégories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto relative z-30">
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
                className={`relative group rounded-2xl p-5 md:p-6 text-left transition-all duration-300 ease-in-out cursor-pointer border-none shadow-sm flex flex-col items-start hover:scale-[1.05] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 z-40 pointer-events-auto ${
                  isActive ? "bg-[#008751] col-span-2 row-span-1 scale-[1.05] shadow-[0_10px_20px_rgba(0,0,0,0.1)] ring-2 ring-white/20" : "bg-white hover:scale-[1.05]"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                  isActive ? "bg-white/20" : "bg-[#008751]/10"
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#008751]"}`} />
                </div>
                <h3 className={`font-sans text-sm md:text-base font-bold leading-tight mb-1 uppercase tracking-wider ${
                  isActive ? "text-white" : "text-[#000000]"
                }`}>
                  {u.name}
                </h3>

                {isActive && (
                  <div className="mt-4 flex flex-wrap gap-2 animate-fade-in">
                    {u.subs.map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] md:text-xs px-3 py-1.5 rounded-full bg-white/20 text-white font-sans font-bold uppercase tracking-wider"
                      >
                        {sub}
                      </span>
                    ))}
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
