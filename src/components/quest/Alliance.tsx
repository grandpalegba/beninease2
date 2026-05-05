"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const ACTIONS = [
  "conçoivent des stratégies",
  "mobilisent des communautés",
  "accumulent les ressources nécessaires"
];

export function Alliance() {
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
            L’Alliance des 240
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 leading-[1.05]">
            Une force collective nationale
          </h2>
          <p className="mt-8 text-xl md:text-2xl text-zinc-600 max-w-3xl mx-auto font-light leading-relaxed">
            Chaque groupe d’Amazones s’entoure de : <br />
            <span className="font-medium text-zinc-950">240 soutiens dans leur pays</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl mx-auto bg-zinc-50 border border-zinc-200 rounded-[2rem] p-8 md:p-12 shadow-sm mb-16"
        >
          <p className="text-xl font-medium text-zinc-900 mb-8 text-center">
            Ensemble, ils :
          </p>
          
          <ul className="space-y-6">
            {ACTIONS.map((action, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                className="flex items-center gap-4 text-lg md:text-xl text-zinc-700 font-light"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-900">
                  <Check size={16} strokeWidth={3} />
                </div>
                <span>{action}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-max mx-auto text-center px-8 py-4 rounded-full bg-zinc-950 text-white shadow-2xl"
        >
          <p className="text-lg md:text-xl font-medium tracking-wide">
            <span className="text-[#FCD116]">👉</span> Le jeu devient un mouvement national.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
