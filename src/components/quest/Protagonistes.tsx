"use client";

import { motion } from "framer-motion";

const ROLES = [
  {
    title: "Visionnaires",
    desc: "Projets en écologie, éducation, technologie",
  },
  {
    title: "Stratèges",
    desc: "Direction de 240 experts",
  },
  {
    title: "Diplomates",
    desc: "Création d’alliances pour révéler les trésors",
  }
];

export function Protagonistes() {
  return (
    <section className="relative py-32 px-6 bg-white border-t border-zinc-100 text-zinc-950 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-zinc-950 leading-[1.05]">
            Les Amazones du futur
          </h2>
          <p className="mt-6 text-xl text-zinc-600 max-w-2xl mx-auto font-light leading-relaxed">
            Des leaders qui portent des projets à impact mondial et dirigent leur nation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {ROLES.map((role, idx) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-10 border border-zinc-200 rounded-[2rem] bg-zinc-50 hover:bg-white hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              <h3 className="font-display text-2xl font-semibold text-zinc-950 mb-4 tracking-tight">
                {role.title}
              </h3>
              <p className="text-zinc-600 font-light leading-relaxed">
                {role.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-max mx-auto px-8 py-4 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-2xl"
        >
          <span className="font-display text-xl font-medium tracking-wide uppercase">
            240 experts par nation
          </span>
        </motion.div>
      </div>
    </section>
  );
}
