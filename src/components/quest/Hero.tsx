"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-28 bg-white">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 80%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full"
        >
          {/* Titre */}
          <h1 className="font-display font-semibold tracking-tight leading-[0.9] text-zinc-950 mb-8">
            <span className="block text-[14vw] md:text-[8rem] uppercase text-zinc-950">
              YONYVERSE
            </span>
          </h1>

          {/* Slogan */}
          <h2 className="font-display text-2xl md:text-4xl font-medium tracking-tight text-zinc-800 mb-6">
            Une compétition mondiale. Une quête initiatique.
          </h2>

          {/* Accroche */}
          <p className="text-lg md:text-xl text-zinc-600 font-light max-w-3xl mx-auto mb-16">
            Là où l’excellence féminine rencontre les sagesses ancestrales.
          </p>

          {/* Chiffres clés */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 font-display text-2xl md:text-3xl font-semibold text-zinc-900 tracking-tight">
            <span>256 <span className="text-sm uppercase tracking-widest text-zinc-500 block mt-1">jours</span></span>
            <div className="hidden md:block w-px h-8 bg-zinc-200" />
            <span className="hidden md:block text-zinc-300">—</span>
            <span>16 <span className="text-sm uppercase tracking-widest text-zinc-500 block mt-1">nations</span></span>
            <div className="hidden md:block w-px h-8 bg-zinc-200" />
            <span className="hidden md:block text-zinc-300">—</span>
            <span>256 <span className="text-sm uppercase tracking-widest text-zinc-500 block mt-1">trésors</span></span>
          </div>
        </motion.div>
      </div>


    </section>
  );
}
