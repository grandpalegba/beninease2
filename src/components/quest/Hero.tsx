"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-28 bg-white">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="font-display font-semibold tracking-tight text-zinc-950 mb-8 leading-[1.1]">
            <span className="block text-[14vw] md:text-[8rem] uppercase text-zinc-950">
              YONYVERSE
            </span>
            <span className="block text-2xl md:text-3xl lg:text-4xl text-zinc-800 font-medium mt-6 uppercase tracking-[0.2em]">
              L'Univers des Traditions Sacrées
            </span>
          </h1>

          <div className="mt-20 space-y-4">
            <div className="text-xl md:text-2xl font-semibold text-zinc-950">
              Première Odyssée : Yony Games
            </div>
            <div className="text-lg md:text-xl font-light text-zinc-500 italic">
              « Libérer les trésors, révéler les lieux magiques »
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
