"use client";

import { motion } from "framer-motion";

const POINTS = [
  {
    title: "256 jours",
    desc: "16 cycles de 16 jours",
  },
  {
    title: "16 nations",
    desc: "1 hôte permanent, 15 invitées",
  },
  {
    title: "Bénin",
    desc: "Ancrage central et symbolique",
  }
];

export function Architecture() {
  return (
    <section className="relative py-32 px-6 bg-zinc-950 text-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            Une architecture unique
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {POINTS.map((pt, idx) => (
            <motion.div
              key={pt.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 md:p-12 border border-zinc-800 rounded-[2rem] bg-zinc-900/50 backdrop-blur-sm text-center flex flex-col justify-center min-h-[250px]"
            >
              <h3 className="font-display text-3xl font-bold mb-4 tracking-tight">
                {pt.title}
              </h3>
              <p className="text-zinc-400 font-light text-lg">
                {pt.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight">
            La géométrie du Fâ structure chaque édition.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
