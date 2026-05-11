import { ChevronsRight } from "lucide-react";
import { NATIONS, Flag } from "./Pantheon";
import Link from "next/link";

export function NationsCarousel() {
  // On duplique la liste pour permettre une boucle infinie sans saut visible
  const loop = [...NATIONS, ...NATIONS];

  return (
    <div className="relative group overflow-hidden border-y border-zinc-100 bg-zinc-50/40 py-5">
      {/* Dégradés latéraux pour un fondu propre aux extrémités */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Bouton d'accès rapide */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link 
          href="/visions" 
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-950 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all shadow-xl"
        >
          Consulter le classement
          <ChevronsRight size={14} className="animate-pulse" />
        </Link>
      </div>

      {/* Piste défilante : translateX de 0 à -50% (car liste dupliquée) */}
      <div className="flex gap-12 animate-[scroll_20s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap">
        {loop.map((n, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <Flag code={n.code} className="text-2xl" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-950">
              {n.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
              Cycle {n.cycle}
            </span>
          </div>
        ))}
      </div>

      {/* Keyframes injectées localement */}
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
      `}</style>
    </div>
  );
}
