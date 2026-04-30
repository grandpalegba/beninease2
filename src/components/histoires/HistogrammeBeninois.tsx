"use client";

import { cn } from "@/lib/utils";

interface HistogrammeBeninoisProps {
  stats: {
    originalite: number; // 0-100
    authenticite: number; // 0-100
    impact: number; // 0-100
    count: number;
  };
  title?: string;
  subtitle?: string;
}

export function HistogrammeBeninois({ stats, title, subtitle }: HistogrammeBeninoisProps) {
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
    <div className="p-10 md:p-12 flex flex-col justify-center space-y-6 min-h-full bg-white font-sans">
      {(title || subtitle) && (
        <div>
          {title && <h2 className="text-2xl font-black text-black tracking-tighter leading-none mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-400 font-medium italic text-xs leading-relaxed">{subtitle}</p>}
        </div>
      )}
      <div className="mb-2">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          {stats.count || 0} AVIS
        </p>
      </div>

      <div className="space-y-6">
        {bars.map((bar, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-end px-1">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">{bar.label}</span>
              <span className="text-[10px] font-black tabular-nums text-black">{bar.value}%</span>
            </div>
            <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
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
