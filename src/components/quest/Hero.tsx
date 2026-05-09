"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 bg-white">
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
              Mise en lumière du Féminin <br /> et des cultures du monde
            </span>
          </h1>

          <div className="mt-20 space-y-4 text-[#1B2A4A]">
            <div className="text-xl md:text-2xl font-semibold">
              Première Odyssée : Yony Games
            </div>
            <div className="text-lg md:text-xl font-light italic opacity-70">
              « Libérer 256 trésors du monde pour ramener l'harmonie sur Terre »
            </div>

            <div className="mt-12">
              <Link href="/yonygames" className="inline-block bg-[#2E5FA3] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#1B2A4A] transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/20">
                Découvrir Yony Games
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
