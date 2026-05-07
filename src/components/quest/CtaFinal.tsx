"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const RANKS = [
  { name: "Ahosi", desc: "", img: "/quest/hero-ahosi.png", treasures: 16 },
  { name: "Agojie", desc: "", img: "/quest/hero-agojie.png", treasures: 32 },
  { name: "Kpojito", desc: "", img: "/quest/hero-kpojito.png", treasures: 48 },
  { name: "Gbeto", desc: "", img: "/quest/hero-gbeto.png", treasures: 64 },
];

const ROLES = [
  { 
    name: "Les Paqos", 
    arena: "Arène Sagesses", 
    desc: "Les maîtres spirituels qui canalisent l'énergie de la Terre.", 
    img: "/quest/paqos.png" 
  },
  { 
    name: "Les Chasquis", 
    arena: "Arène Savoirs", 
    desc: "Les messagers rapides qui font circuler le savoir entre les nations.", 
    img: "/quest/chasquis.png" 
  },
  { 
    name: "Les Kumpis", 
    arena: "Arène Talents", 
    desc: "Les artisans d'excellence qui tissent la beauté de la compétition.", 
    img: "/quest/kumpis.png" 
  },
  { 
    name: "Les Quipucamayocs", 
    arena: "Arène Histoires", 
    desc: "Les gardiens des données et des récits, maîtres de la mémoire.", 
    img: "/quest/quipucamayocs.png" 
  },
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
              Le statut des Amazones évolue avec chaque Libération de trésor.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
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
                      {r.treasures} trésors libérés
                    </div>
                    <div className="font-display text-2xl font-semibold">{r.name}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-zinc-950">
              Les Gardiens du Savoir
            </h2>
            <p className="mt-4 text-zinc-500 font-light">Les fonctions de soutien au sein de chaque délégation</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ROLES.map((role, idx) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col"
              >
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 shadow-xl border border-zinc-100">
                  <Image 
                    src={role.img}
                    alt={role.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#FCD116] mb-2">{role.arena}</div>
                <h4 className="text-xl font-semibold text-zinc-950 mb-3">{role.name}</h4>
                <p className="text-sm text-zinc-500 font-light leading-relaxed">{role.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
