"use client";

import { cn } from "@/lib/utils";

interface HistogrammeBeninoisProps {
  stats: {
    originalite: number; // 0-100
    authenticite: number; // 0-100
    impact: number; // 0-100
    count: number;
  };
}

export function HistogrammeBeninois({ stats }: HistogrammeBeninoisProps) {
  // Fonction de sécurité pour garantir une valeur entre 0 et 100
  // Si la valeur est null ou 0, on met 50 par défaut pour l'harmonie visuelle
  const safeValue = (val: number | null | undefined) => {
    if (!val || val <= 0) return 50;
    return Math.min(Math.max(Math.round(val), 0), 100);
  };

  const bars = [
    { label: "Originalité", color: "bg-[#008751]", value: safeValue(stats.originalite) },
    { label: "Authenticité", color: "bg-[#FCD116]", value: safeValue(stats.authenticite) },
    { label: "Impact", color: "bg-[#E8112D]", value: safeValue(stats.impact) },
  ];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-full flex flex-col justify-center space-y-6 font-sans">
      <div className="mb-2">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          {stats.count || 0} AVIS
        </p>
      </div>

      <div className="space-y-5">
        {bars.map((bar, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{bar.label}</span>
              <span className="text-[10px] font-black text-gray-800 tabular-nums">{bar.value}%</span>
            </div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
              <div 
                className={cn(bar.color, "h-full rounded-full transition-all duration-1000 ease-out")}
                style={{ width: `${bar.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
