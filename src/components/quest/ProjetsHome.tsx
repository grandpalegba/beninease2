"use client";

import { motion } from "framer-motion";

const AVANTAGES = [
  "visibilité internationale",
  "campagne de financement participatif",
  "mobilisation globale pendant 256 jours"
];

export function ProjetsHome() {
  return (
    <section className="relative py-32 px-6 bg-white border-t border-zinc-100 text-zinc-950 overflow-hidden">
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-4">
            Les Projets
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 leading-[1.05]">
            Impact réel, au-delà du jeu
          </h2>
          <p className="mt-8 text-xl md:text-2xl text-zinc-600 max-w-3xl mx-auto font-light leading-relaxed">
            Chaque Amazone porte un projet qui bénéficie de :
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {AVANTAGES.map((avantage, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-10 border border-zinc-200 rounded-[2rem] bg-zinc-50 text-center flex items-center justify-center min-h-[200px]"
            >
              <h3 className="font-display text-2xl font-medium text-zinc-900 tracking-tight leading-snug">
                {avantage}
              </h3>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-max mx-auto px-8 py-4 rounded-full bg-zinc-950 text-white shadow-2xl text-center"
        >
          <p className="text-lg md:text-xl font-medium tracking-wide">
            <span className="text-[#FCD116]">👉</span> Libérer les trésors, c’est aussi financer le futur.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
