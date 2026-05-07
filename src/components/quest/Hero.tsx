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
            <span className="block text-4xl md:text-5xl lg:text-6xl text-zinc-800 font-medium mt-2">
              Matrice du Fâ
            </span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl lg:text-3xl font-light text-zinc-600 leading-relaxed max-w-4xl mx-auto">
            Un Escape Game Culturel où les Nations du monde
            <br className="hidden md:block" />
            collaborent pour libérer <span className="font-medium text-zinc-950">256 Trésors du Bénin</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
