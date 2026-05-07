"use client";

import { motion } from "framer-motion";

const RESSOURCES = [
  "conscience",
  "connaissance",
  "compétences",
  "confiance"
];

const MODULES = [
  { 
    name: "Sagesses", 
    action: "Résoudre des énigmes de vie par la science du Fâ pour gagner des jetons de conscience", 
    token: "Jeton de Conscience" 
  },
  { 
    name: "Savoirs", 
    action: "Relever des défis de culture générale pour récolter des jetons de connaissance", 
    token: "Jeton de Connaissance" 
  },
  { 
    name: "Talents", 
    action: "Remporter des duels artistiques pour s'emparer de jetons de compétence", 
    token: "Jeton de Compétence" 
  },
  { 
    name: "Histoires", 
    action: "Partager des récits de vie authentiques pour rafler des jetons de confiance", 
    token: "Jeton de Confiance" 
  }
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
            Libération des trésors
          </h2>
          <p className="mt-8 text-xl text-zinc-600 font-light leading-relaxed max-w-2xl mx-auto">
            Chaque trésor est verrouillé par une clé cryptographique.
            Pour l’ouvrir, il faut réunir un équilibre unique et précis de ressources :
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-32">
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

        <div className="space-y-6 max-w-4xl mx-auto">
          {MODULES.map((mod, idx) => (
            <motion.div
              key={mod.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group grid grid-cols-1 md:grid-cols-4 gap-6 items-center p-8 bg-white border border-zinc-200 rounded-[2rem] hover:border-zinc-950 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Espace</span>
                <span className="text-2xl font-semibold text-zinc-950">{mod.name}</span>
              </div>
              <div className="flex flex-col md:col-span-2">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Mission</span>
                <span className="text-base text-zinc-600 leading-relaxed">{mod.action}</span>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <div className="px-5 py-2.5 bg-zinc-950 text-[#FCD116] text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg group-hover:scale-105 transition-transform">
                  {mod.token}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
