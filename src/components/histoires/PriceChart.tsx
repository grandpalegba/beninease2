"use client";

import { useMemo } from "react";
import { Sparkles, TrendingUp } from "lucide-react";

interface PriceChartProps {
  data: number[];
  currentPrice: number;
}

export function PriceChart({ data, currentPrice }: PriceChartProps) {
  // Un stub de graphique simple avec SVG
  const max = Math.max(...(data.length ? data : [currentPrice]), currentPrice * 1.5) || 10;
  const min = Math.min(...(data.length ? data : [currentPrice]), 0);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-[#008751]">
        <TrendingUp className="w-5 h-5" />
        <h3 className="font-bold text-gray-900">Tendance du Cours</h3>
      </div>
      
      <div className="flex items-end gap-3 mb-6">
        <span className="text-3xl font-black text-gray-900 tabular-nums leading-none">
          {currentPrice.toFixed(2)}
        </span>
        <span className="flex items-center gap-1 text-sm font-bold text-[#008751] mb-1">
          <Sparkles className="w-3.5 h-3.5" /> NB
        </span>
      </div>

      <div className="h-32 w-full relative">
        <svg
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {points && (
            <>
              {/* Ligne du graphique */}
              <polyline
                points={points}
                fill="none"
                stroke="#008751"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />
              {/* Zone dégradée sous la ligne */}
              <polygon
                points={`0,100 ${points} 100,100`}
                fill="url(#gradient)"
                className="opacity-20"
              />
            </>
          )}
          <defs>
            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#008751" />
              <stop offset="100%" stopColor="#008751" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
