"use client";

import { motion } from "framer-motion";

const JETONS = [
  { name: "Conscience", desc: "engagement, visibilité", color: "var(--benin-green)" },
  { name: "Connaissance", desc: "savoir, transmission", color: "var(--benin-yellow)" },
  { name: "Compétence", desc: "actions concrètes", color: "#FCD116" },
  { name: "Confiance", desc: "soutien, financement", color: "var(--benin-red)" }
];

export function JetonsHome() {
  return (
    <section className="relative py-32 px-6 bg-zinc-950 text-white overflow-hidden">
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-4">
            Les Jetons
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
            Les ressources du jeu
          </h2>
          <p className="mt-8 text-xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
            Pour progresser, les équipes doivent collecter 4 types de jetons :
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20 max-w-4xl mx-auto">
          {JETONS.map((jeton, idx) => (
            <motion.div
              key={jeton.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 border border-zinc-800 rounded-[2rem] bg-zinc-900/50 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center gap-6"
            >
              <div 
                className="w-12 h-12 rounded-full flex-shrink-0"
                style={{ backgroundColor: jeton.color }}
              />
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight mb-1">
                  {jeton.name}
                </h3>
                <p className="text-zinc-400 font-light">
                  {jeton.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-max mx-auto text-center"
        >
          <p className="text-xl md:text-2xl font-light tracking-wide text-zinc-300">
            Chaque trésor exige une combinaison spécifique.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
