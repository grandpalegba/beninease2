"use client";

import { cn } from "@/lib/utils";

interface HistogrammeBeninoisProps {
  stats: {
    originalite: number; // 1-5
    authenticite: number; // 1-5
    impact: number; // 1-5
    count: number;
  };
}

export function HistogrammeBeninois({ stats }: HistogrammeBeninoisProps) {
  const bars = [
    { label: "Originalité", color: "bg-[#008751]", value: stats.originalite },
    { label: "Authenticité", color: "bg-[#FCD116]", value: stats.authenticite },
    { label: "Impact", color: "bg-[#E8112D]", value: stats.impact },
  ];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-full flex flex-col justify-center space-y-6 font-sans">
      <div className="mb-2">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          {stats.count} AVIS
        </p>
      </div>

      <div className="space-y-5">
        {bars.map((bar, i) => {
          const percentage = Math.round(((bar.value || 2.5) / 5) * 100);
          return (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{bar.label}</span>
                <span className="text-[10px] font-black text-gray-800">{percentage}%</span>
              </div>
              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                <div 
                  className={cn(bar.color, "h-full rounded-full transition-all duration-1000 ease-out")}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
