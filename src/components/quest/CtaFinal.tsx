"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const RANKS = [
  { name: "Blackstone", desc: "La fondation", img: "/quest/hero-blackstone.png", treasures: 10 },
  { name: "Blackstar", desc: "Le guide", img: "/quest/hero-blackstar.png", treasures: 20 },
  { name: "Blacksun", desc: "Le rayonnement", img: "/quest/hero-blacksun.png", treasures: 30 },
  { name: "Blackswan", desc: "La métamorphose rare", img: "/quest/hero-blackswan.png", treasures: 40 },
];

export function CtaFinal() {
  return (
    <section className="relative bg-white border-t border-zinc-100">
      <div className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mb-14"
          >
            <h3 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-zinc-950 leading-[1.05]">
              Votre statut évolue avec chaque Libération et Retour au Bénin.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RANKS.map((r, idx) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-950 hover:border-zinc-950 transition-all duration-500"
              >
                <div className="relative aspect-[9/16] overflow-hidden">
                  <Image
                    src={r.img}
                    alt={r.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-300 mb-1 font-mono">
                      {r.treasures} trésors
                    </div>
                    <div className="font-display text-2xl font-semibold">{r.name}</div>
                    <div className="text-sm text-zinc-300 mt-1">{r.desc}</div>
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
