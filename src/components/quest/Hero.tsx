"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="font-display font-semibold tracking-tight leading-[0.9] text-zinc-950">
            <span className="block text-[14vw] lg:text-[7.5rem] uppercase text-zinc-950">
              Yonyverse
            </span>
          </h1>

          <h2 className="mt-8 font-display text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.05] text-zinc-800">
            L&apos;Harmonie du monde commence
            <br />
            par la Porte du Retour.
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
