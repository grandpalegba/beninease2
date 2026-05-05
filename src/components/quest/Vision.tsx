"use client";

import { motion } from "framer-motion";

const RESSOURCES = [
  "conscience",
  "connaissance",
  "compétences",
  "confiance"
];

export function Vision() {
  return (
    <section className="relative py-32 px-6 bg-zinc-50 border-t border-zinc-100 text-zinc-950 overflow-hidden">
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 leading-[1.05]">
            Libérer les trésors, ensemble
          </h2>
          <p className="mt-8 text-xl text-zinc-600 font-light leading-relaxed max-w-2xl mx-auto">
            Chaque trésor est verrouillé par une clé cryptographique.
            Pour l’ouvrir, il faut réunir un équilibre précis de ressources :
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {RESSOURCES.map((res, idx) => (
            <motion.div
              key={res}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="px-6 py-3 rounded-full border border-zinc-200 bg-white text-zinc-800 font-medium tracking-wide uppercase text-sm shadow-sm"
            >
              {res}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center p-8 md:p-12 rounded-[2rem] bg-zinc-950 text-white shadow-2xl"
        >
          <p className="text-xl md:text-2xl font-light leading-relaxed">
            <span className="text-[#FCD116]">👉</span> Aucun pays ne peut réussir seul.<br />
            <span className="font-medium">La libération est forcément collective.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
