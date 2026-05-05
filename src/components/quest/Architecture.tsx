"use client";

import { motion } from "framer-motion";

export function Architecture() {
  return (
    <section className="relative py-32 px-6 bg-white border-t border-zinc-100 text-zinc-950 overflow-hidden">
      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
            16 pays. Une dynamique mondiale.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl mx-auto space-y-12"
        >
          <p className="text-2xl md:text-3xl font-light text-zinc-800 leading-relaxed">
            Chaque nation participe avec une délégation unique : <br/>
            <span className="font-medium text-zinc-950">16 Amazones.</span>
          </p>

          <div className="w-16 h-px bg-zinc-200 mx-auto" />

          <p className="text-xl md:text-2xl font-light text-zinc-600 leading-relaxed">
            Le <span className="font-medium text-zinc-900">Bénin</span> est au cœur du dispositif,<br />
            les <span className="font-medium text-zinc-900">15 autres nations</span> changent à chaque édition.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
