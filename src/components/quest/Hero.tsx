"use client";

import { motion } from "framer-motion";
import { CycleWidget } from "./CycleWidget";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
      {/* Split Background */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full bg-gradient-to-br from-amber-500/20 to-transparent" />
        <div className="w-1/2 h-full bg-gradient-to-bl from-slate-400/20 to-transparent" />
      </div>

      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center px-6 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="text-[12px] uppercase tracking-[0.5em] text-white/60 font-bold mb-8">
            Olympiade Mondiale des Cultures Vivantes
          </div>

          <h1 className="font-display font-semibold tracking-tight text-white mb-8 leading-[1.1]">
            <span className="block text-[10vw] md:text-[7rem] uppercase">
              YONYVERSE
            </span>
            <span className="block text-3xl md:text-5xl lg:text-6xl text-amber-200/90 font-light italic mt-4">
              L'Union des Contraires
            </span>
          </h1>

          <p className="mt-12 text-xl md:text-2xl lg:text-3xl font-light text-zinc-300 leading-[1.8] max-w-5xl mx-auto">
            Une mission sacrée pour récupérer <span className="font-medium text-amber-400">256 trésors de Lumière</span> (Bénin) et réactiver <span className="font-medium text-slate-300">256 trésors de Mémoire</span> (Pérou) exilés dans les musées du monde.
          </p>

          <div className="mt-16 flex flex-wrap justify-center gap-12 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/40">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              Polarité Masculine (Action)
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.5)]" />
              Polarité Féminine (Réception)
            </div>
          </div>
        </motion.div>
      </div>

      <CycleWidget />

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20">
        <span className="text-[10px] uppercase tracking-widest font-bold">Explorer le Cycle</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
