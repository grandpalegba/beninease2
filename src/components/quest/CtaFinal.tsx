"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const RANKS = [
  { name: "Ahosi", desc: "", img: "/quest/hero-ahosi.png", treasures: 16 },
  { name: "Agojie", desc: "", img: "/quest/hero-agojie.png", treasures: 32 },
  { name: "Kpojito", desc: "", img: "/quest/hero-kpojito.png", treasures: 48 },
  { name: "Gbeto", desc: "", img: "/quest/hero-gbeto.png", treasures: 64 },
];

export function CtaFinal() {
  return (
    <section className="relative bg-transparent border-t border-zinc-100">
      <div className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-24"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-950 mb-6">
              Statuts des Amazones
            </h2>
            <p className="text-lg md:text-xl text-zinc-500 font-medium">
              Le statut des Amazones évolue avec chaque Libération de trésor.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RANKS.map((r, idx) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-2xl overflow-hidden border border-zinc-100 bg-zinc-950 hover:border-zinc-950 transition-all duration-500"
              >
                <div className="relative aspect-[9/16] overflow-hidden">
                  <Image
                    src={r.img}
                    alt={r.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div 
                    className="absolute bottom-0 left-0 right-0 pt-12 px-5 text-white text-center"
                    style={{ paddingBottom: '8rem' }}
                  >
                    <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-300 mb-1 font-mono">
                      {r.treasures} trésors libérés
                    </div>
                    <div className="font-display text-2xl font-semibold">{r.name}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
