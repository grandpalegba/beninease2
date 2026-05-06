"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const AMAZONES_ACTIONS = [
  "coordonnent leur équipe",
  "développent leur projet",
  "contribuent à la libération des trésors"
];

const ALLIANCE_ACTIONS = [
  "conçoivent des stratégies",
  "mobilisent des communautés",
  "accumulent les ressources nécessaires"
];

export function MissionStructure() {
  return (
    <section className="relative py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* PART 1: ARCHITECTURE */}
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-950 mb-12">
              16 pays. Une dynamique mondiale.
            </h2>
            <p className="text-2xl md:text-3xl font-light text-zinc-700 leading-relaxed max-w-4xl mx-auto mb-12">
              Chaque nation participe avec une délégation unique : <br/>
              <span className="font-medium text-zinc-950">16 Amazones.</span>
            </p>
            <div className="w-20 h-px bg-zinc-200 mx-auto mb-12" />
            <p className="text-xl md:text-2xl font-light text-zinc-500 leading-relaxed max-w-3xl mx-auto">
              Le <span className="font-medium text-zinc-900">Bénin</span> est au cœur du dispositif,<br />
              les <span className="font-medium text-zinc-900">15 autres nations</span> changent à chaque édition.
            </p>
          </motion.div>
        </div>

        {/* PART 2 & 3: PROTAGONISTES & ALLIANCE (GRID) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
          
          {/* AMZONES */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <div className="text-center mb-10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-4">
                Les Amazones
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-zinc-950 mb-6">
                Les actrices du changement
              </h3>
              <p className="text-lg text-zinc-600 font-light leading-relaxed px-4">
                Chaque Amazone est une femme porteuse d’un projet à impact <br className="hidden md:block" />
                <span className="text-zinc-400 text-base">(éducation, écologie, technologie, culture…).</span>
              </p>
            </div>

            <div className="flex-grow bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-lg font-medium text-zinc-900 mb-10 text-center">
                Pendant 256 jours <span className="text-zinc-400 font-light">(≈ 9 mois)</span>, elles :
              </p>
              
              <ul className="space-y-8">
                {AMAZONES_ACTIONS.map((action, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    className="flex items-center gap-5 text-lg text-zinc-700 font-light"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-950">
                      <Check size={18} strokeWidth={3} />
                    </div>
                    <span>{action}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ALLIANCE */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <div className="text-center mb-10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-4">
                L’Alliance des 240
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-zinc-950 mb-6">
                Une force collective nationale
              </h3>
              <p className="text-lg text-zinc-600 font-light leading-relaxed px-4">
                Chaque groupe d’Amazones s’entoure de : <br />
                <span className="font-medium text-zinc-950">240 soutiens dans leur pays</span>
              </p>
            </div>

            <div className="flex-grow bg-zinc-950 text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FCD116] opacity-5 blur-[80px] group-hover:opacity-10 transition-opacity" />
              
              <p className="text-lg font-medium text-zinc-200 mb-10 text-center">
                Ensemble, ils :
              </p>
              
              <ul className="space-y-8 mb-12">
                {ALLIANCE_ACTIONS.map((action, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                    className="flex items-center gap-5 text-lg text-zinc-300 font-light"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#FCD116]">
                      <Check size={18} strokeWidth={3} />
                    </div>
                    <span>{action}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-auto py-5 px-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center"
              >
                <p className="text-base md:text-lg font-medium tracking-wide">
                  <span className="text-[#FCD116]">👉</span> Le jeu devient un mouvement national.
                </p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
