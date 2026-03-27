"use client";

import { useState } from "react";
import { universes } from "@/lib/data/universes";

type UniversGridProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

const UniversGrid = ({ ctaHref = "/postuler", ctaLabel = "Postuler maintenant" }: UniversGridProps) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  return (
    <section id="univers" className="py-24 md:py-32" style={{ backgroundColor: "#004D31" }}>
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance" style={{ lineHeight: "1.15" }}>
            Les 16 Univers
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto font-body">
            Chaque univers regroupe les talents dans 4 catégories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto">
          {universes.map((u, i) => {
            const Icon = u.icon;
            const isActive = activeIdx === i;
            return (
              <button
                key={u.name}
                onClick={() => setActiveIdx(isActive ? null : i)}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                className={`relative group rounded-xl p-5 md:p-6 text-left transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? "shadow-xl scale-[1.03] border-transparent text-white"
                    : "bg-background border-border hover:shadow-md hover:border-primary/20"
                }`}
                style={isActive ? { backgroundColor: "#008751" } : undefined}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                  isActive ? "bg-white/20" : "bg-primary/10 text-primary"
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                </div>
                <h3 className={`font-display text-sm md:text-base font-semibold leading-tight mb-1 ${
                  isActive ? "text-white" : "text-foreground"
                }`}>
                  {u.name}
                </h3>

                {isActive && (
                  <div className="mt-3 flex flex-wrap gap-1.5 animate-fade-in">
                    {u.subs.map((sub) => (
                      <span
                        key={sub}
                        className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/90 font-body"
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

        <div className="text-center mt-12">
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#E8112D] text-white hover:bg-[#C40D26] active:scale-[0.97] h-12 px-10 text-sm font-bold tracking-wide transition-all shadow-lg"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
};

export default UniversGrid;
