"use client";

import { motion } from "framer-motion";
import { NATIONS, flagEmoji } from "./Pantheon";

export function FaHome() {
  return (
    <section className="relative py-24 px-6 bg-transparent text-zinc-950 overflow-hidden">
      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4922A] font-bold mb-4">
            L'Organisation des Jeux
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
            Les 16 Nations <em>Hôtes</em>
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 md:p-12 shadow-[0_10px_50px_rgba(0,0,0,0.03)]"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10">
            {NATIONS.map((n, i) => (
              <motion.div
                key={n.code}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="flex flex-col items-center gap-3 group"
              >
                <span className="text-3xl md:text-4xl transition-transform duration-300 group-hover:scale-110">
                  {flagEmoji(n.code)}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-400 font-bold text-center group-hover:text-zinc-950 transition-colors">
                  {n.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

