"use client";

import { motion } from "framer-motion";

export function CycleWidget() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative z-20 -mt-12 max-w-2xl mx-auto px-6"
    >
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center gap-8">
        {/* Signe du Fâ */}
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2">Signe du Fâ</span>
          <div className="text-3xl font-heritage text-zinc-900">Gbe Medji</div>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="w-1 h-1 rounded-full bg-zinc-900" />
                <div className="w-1 h-1 rounded-full bg-zinc-900" />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block w-px h-12 bg-zinc-200" />

        {/* Binôme de Trésors */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2">Libération du Jour</span>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-950">L'Insigne de Kaba</span>
              <span className="text-[10px] uppercase text-amber-600 font-bold">Bénin</span>
            </div>
            <div className="text-zinc-300">✕</div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-950">Le Sceptre de Pachacamac</span>
              <span className="text-[10px] uppercase text-slate-500 font-bold">Pérou</span>
            </div>
          </div>
        </div>

        <button className="px-6 py-3 rounded-full bg-zinc-950 text-white text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
          Libérer
        </button>
      </div>
    </motion.div>
  );
}
