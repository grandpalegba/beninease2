"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-40 pb-4 flex items-center justify-center overflow-hidden px-6 bg-white">
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
          <h1 className="font-display font-semibold tracking-tight text-[#1B2A4A] mb-8 leading-[1.1]">
            <span className="block text-[14vw] md:text-[8rem] uppercase">
              YONYVERSE
            </span>
            <span className="block text-xl md:text-2xl lg:text-3xl font-medium mt-6 uppercase tracking-[0.15em] leading-relaxed opacity-90">
              Galaxie d'initiatives autour du Féminin <br /> et des cultures du monde
            </span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
