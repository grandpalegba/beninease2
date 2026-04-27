"use client";

import { motion } from "framer-motion";

interface PrestigeBarsProps {
  rarete: number;
  conservation: number;
  restitution: number;
}

export function PrestigeBars({ rarete, conservation, restitution }: PrestigeBarsProps) {
  const bars = [
    { label: "Rareté", value: rarete, color: "bg-[#8B4513]" }, // Terracotta/Brown
    { label: "Conservation", value: conservation, color: "bg-[#008751]" }, // Benin Green
    { label: "Urgence Restitution", value: restitution, color: "bg-[#E8112D]" }, // Benin Red
  ];

  return (
    <div className="space-y-6">
      {bars.map((bar) => (
        <div key={bar.label} className="space-y-2">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-gray-500">
            <span>{bar.label}</span>
            <span className="font-sans">{bar.value}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${bar.value}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${bar.color}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
