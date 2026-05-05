"use client";

import { motion } from "framer-motion";

const FACETTES = [
  "un escape game mondial",
  "une compétition collaborative",
  "une plateforme d’impact"
];

export function Experience() {
  return (
    <section className="relative py-32 px-6 bg-zinc-50 border-t border-zinc-100 text-zinc-950 overflow-hidden">
      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-4">
            L’Expérience
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
            Un jeu. Une quête. Un mouvement.
          </h2>
          <p className="mt-8 text-xl md:text-2xl text-zinc-600 font-light leading-relaxed">
            YONYVERSE est à la fois :
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-6 mb-20">
          {FACETTES.map((facette, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-2xl md:text-4xl font-display font-medium tracking-tight text-zinc-900 bg-white border border-zinc-200 py-6 px-10 rounded-[2rem] shadow-sm w-full max-w-2xl"
            >
              {facette}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xl md:text-2xl font-light leading-relaxed text-zinc-600 max-w-2xl mx-auto">
            Un système où <span className="font-medium text-zinc-900">culture</span>, <span className="font-medium text-zinc-900">innovation</span> et <span className="font-medium text-zinc-900">engagement</span> se rencontrent.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
