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

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <h1 className="font-display font-semibold tracking-tight leading-[0.9] text-zinc-950">
            <span className="block text-[14vw] lg:text-[7.5rem] uppercase">
              Black To Benin
            </span>
          </h1>

          <h2 className="mt-8 font-display text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.05] text-zinc-800">
            La Renaissance commence
            <br />
            par la Porte du Retour.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.35)] border border-zinc-200">
            <Image
              src="/quest/porte-du-retour.png"
              alt="La Porte du Retour avec l'œuf"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
