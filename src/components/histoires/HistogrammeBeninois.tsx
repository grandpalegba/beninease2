"use client";

interface HistogrammeBeninoisProps {
  stats: {
    volume: number; // 1-5
    originalite: number; // 1-5
    authenticite: number; // 1-5
    impact: number; // 1-5
  };
  totalAvis: number;
}

export function HistogrammeBeninois({ stats, totalAvis }: HistogrammeBeninoisProps) {
  const bars = [
    { color: "bg-[#008751]", value: stats.originalite, label: "Originalité" },
    { color: "bg-[#FCD116]", value: stats.authenticite, label: "Authenticité" },
    { color: "bg-[#E8112D]", value: stats.impact, label: "Impact" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-3 h-32 w-full max-w-[200px]">
        {bars.map((bar, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <div 
              className={`${bar.color} w-full rounded-t-sm transition-all duration-500 ease-out`}
              style={{ height: `${bar.value * 20}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          {totalAvis} avis investi
        </span>
      </div>
    </div>
  );
}
