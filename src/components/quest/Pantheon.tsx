export const NATIONS = [
  { code: "BJ", name: "Bénin", points: 4820, cycle: 1 },
  { code: "GA", name: "Gabon", points: 4612, cycle: 2 },
  { code: "ZA", name: "Afrique du Sud", points: 4488, cycle: 3 },
  { code: "MG", name: "Madagascar", points: 4301, cycle: 4 },
  { code: "EG", name: "Égypte", points: 4187, cycle: 5 },
  { code: "TR", name: "Turquie", points: 4055, cycle: 6 },
  { code: "SE", name: "Suède", points: 3998, cycle: 7 },
  { code: "MN", name: "Mongolie", points: 3902, cycle: 8 },
  { code: "IN", name: "Inde", points: 3877, cycle: 9 },
  { code: "ID", name: "Indonésie", points: 3744, cycle: 10 },
  { code: "JP", name: "Japon", points: 3690, cycle: 11 },
  { code: "PG", name: "Papouasie-Nouvelle-Guinée", points: 3611, cycle: 12 },
  { code: "CL", name: "Île de Pâques", points: 3580, cycle: 13 },
  { code: "MX", name: "Mexique", points: 3501, cycle: 14 },
  { code: "BR", name: "Brésil", points: 3422, cycle: 15 },
  { code: "PE", name: "Pérou", points: 3388, cycle: 16 },
];

function flagEmoji(code: string) {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
}

export function Pantheon() {
  const sorted = [...NATIONS].sort((a, b) => b.points - a.points);
  const max = sorted[0].points;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden text-black">
      <div className="grid grid-cols-12 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500 border-b border-border">
        <div className="col-span-1">#</div>
        <div className="col-span-5">Nation</div>
        <div className="col-span-2">Cycle</div>
        <div className="col-span-4 text-right">Points</div>
      </div>
      <ul className="divide-y divide-border">
        {sorted.map((n, i) => (
          <li
            key={n.code}
            className="grid grid-cols-12 items-center px-6 py-4 hover:bg-zinc-50 transition-colors"
          >
            <div className="col-span-1 font-display text-base font-bold text-zinc-400 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="col-span-5 flex items-center gap-3">
              <span className="text-2xl leading-none">{flagEmoji(n.code)}</span>
              <span className="font-semibold">{n.name}</span>
            </div>
            <div className="col-span-2 text-sm text-zinc-500">J{n.cycle}/16</div>
            <div className="col-span-4 flex items-center justify-end gap-3">
              <div className="hidden sm:block w-24 h-1 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full bg-zinc-950"
                  style={{ width: `${(n.points / max) * 100}%` }}
                />
              </div>
              <span className="font-display text-base font-bold tabular-nums">
                {n.points.toLocaleString("fr-FR")}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { flagEmoji };
