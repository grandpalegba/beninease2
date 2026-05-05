"use client";

import { motion } from "framer-motion";

const PILIERS = [
  {
    title: "Génie féminin",
    desc: "Une scène mondiale dédiée au leadership des femmes.",
    color: "var(--benin-green)"
  },
  {
    title: "Culture universelle",
    desc: "Traditions ancestrales × innovation contemporaine.",
    color: "var(--benin-yellow-deep)"
  },
  {
    title: "Impact réel",
    desc: "Des projets financés à chaque édition.",
    color: "var(--benin-red)"
  }
];

export function Vision() {
  return (
    <section className="relative py-32 px-6 bg-white border-t border-zinc-100 text-zinc-950 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-zinc-950 leading-[1.05]">
            Un nouvel ordre olympique
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-24">
          {PILIERS.map((pilier, idx) => (
            <motion.div
              key={pilier.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group flex flex-col items-center text-center"
            >
              <div 
                className="w-12 h-1 rounded-full mb-8 transition-transform duration-500 group-hover:scale-x-150"
                style={{ background: pilier.color }}
              />
              <h3 className="font-display text-2xl font-semibold text-zinc-950 mb-4 tracking-tight">
                {pilier.title}
              </h3>
              <p className="text-zinc-600 font-light leading-relaxed">
                {pilier.desc}
              </p>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
