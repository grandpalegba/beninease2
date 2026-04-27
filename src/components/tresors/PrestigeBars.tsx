"use client";

import { motion } from "framer-motion";

interface PrestigeBarsProps {
  rarete: number;
  conservation: number;
  restitution: number;
}

export function PrestigeBars({ rarete, conservation, restitution }: PrestigeBarsProps) {
  const bars = [
    { label: "RARETÉ HISTORIQUE", value: rarete, color: "bg-[#2C9A5A]" }, // Green
    { label: "ÉTAT DE CONSERVATION", value: conservation, color: "bg-[#FAC710]" }, // Yellow
    { label: "POTENTIEL DE RESTITUTION", value: restitution, color: "bg-[#E0312D]" }, // Red
  ];

  return (
    <div className="space-y-10">
      {bars.map((bar) => (
        <div key={bar.label} className="space-y-4">
          <div className="flex justify-between items-center text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-black text-gray-400">
            <span>{bar.label}</span>
            <span className="font-sans text-lg md:text-xl text-gray-900 font-bold">{bar.value}%</span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${bar.value}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full ${bar.color}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
