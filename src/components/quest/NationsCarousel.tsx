import { NATIONS, flagEmoji } from "./Pantheon";

export function NationsCarousel() {
  // On duplique la liste pour permettre une boucle infinie sans saut visible
  const loop = [...NATIONS, ...NATIONS];

  return (
    <div className="relative overflow-hidden border-y border-zinc-100 bg-zinc-50/40 py-5">
      {/* Dégradés latéraux pour un fondu propre aux extrémités */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Piste défilante : translateX de 0 à -50% (car liste dupliquée) */}
      <div className="flex gap-12 animate-[scroll_40s_linear_infinite] whitespace-nowrap">
        {loop.map((n, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <span className="text-2xl">{flagEmoji(n.code)}</span>
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
