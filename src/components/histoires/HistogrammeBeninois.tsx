"use client";

import { cn } from "@/lib/utils";

interface HistogrammeBeninoisProps {
  stats: {
    volume: number; // 1-5
    originalite: number; // 1-5
    authenticite: number; // 1-5
    impact: number; // 1-5
  };
  totalAvis: number;
}

export function HistogrammeBeninois({ stats }: HistogrammeBeninoisProps) {
  const bars = [
    { color: "bg-[#008751]", value: stats.originalite },
    { color: "bg-[#FCD116]", value: stats.authenticite },
    { color: "bg-[#E8112D]", value: stats.impact },
  ];

  return (
    <div className="flex items-end gap-1 h-12 pt-2">
      {bars.map((bar, i) => (
        <div 
          key={i} 
          className={cn(bar.color, "w-3 rounded-sm transition-all duration-700 ease-out")}
          style={{ height: `${Math.max(20, bar.value * 20)}%` }}
        />
      ))}
    </div>
  );
}
