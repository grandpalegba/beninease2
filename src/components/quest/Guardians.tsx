"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const GUARDIANS = [
  { phase: "I", name: "GrandPa Legba", role: "L'Ouverture", desc: "Gardien des carrefours, il déverrouille les portes du voyage et accueille l'appel des voix. Sans sa bénédiction, aucun mouvement vers la terre d'origine ne peut s'initier.", img: "/quest/deity-legba.jpg", step: "/quest/step-1.png" },
  { phase: "II", name: "Nan Aïzan", role: "Le Souffle", desc: "Tisseuse de l'invisible, elle purifie l'âme des trésors libérés et réaccorde leur vibration. Elle transmute l'énergie retrouvée en un souffle d'harmonie pour la Complétude.", img: "/quest/deity-aizan.png", step: "/quest/step-2.png" },
  { phase: "III", name: "Abuela Wata", role: "La Traversée", desc: "Mère des abysses, elle guide le voyage transatlantique inverse à travers la mémoire des eaux. Elle ramène ceux qui furent emportés par l'océan vers leur sanctuaire premier.", img: "/quest/deity-wata.jpg", step: "/quest/step-3.png" },
  { phase: "IV", name: "Avô Heviosso", role: "La Justice", desc: "Maître du tonnerre, il foudroie les obstacles et purifie le chemin par sa lumière céleste. Il rappelle que le Retour exige une vérité absolue et une rectitude sans faille.", img: "/quest/deity-heviosso.jpg", step: "/quest/step-4.png" },
  { phase: "V", name: "Baba Sakpata", role: "L'Ancrage", desc: "Seigneur du sol, il accueille les trésors retrouvés pour les sceller dans la terre du Bénin. Il enracine la renaissance et stabilise la force des ancêtres pour l'éternité.", img: "/quest/deity-sakpata.jpg", step: "/quest/step-5.png" },
  { phase: "VI", name: "Yony", role: "L'Union", desc: "Éveil de la conscience, elle rassemble les 16 nations et les 256 éclats de savoir libérés. Elle est le pont final qui transforme la restitution en une Renaissance globale.", img: "/quest/deity-yony.jpg", step: "/quest/step-6.png" },
];

const BLACK_STAR = "/quest/star-5.svg";

export function Guardians() {
  const [active, setActive] = useState(2);
  const current = GUARDIANS[active];

  return (
    <section className="relative py-32 px-6 bg-white border-t border-zinc-100 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-16 text-center mx-auto"
        >
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-zinc-950 leading-[1.05]">
            Les Guides du Retour
          </h2>

          {/* Navigation par vignettes step (œufs progressifs) - Déplacée et Réduite */}
          <div className="relative pt-16 pb-8">
            <div className="grid grid-cols-6 gap-2 md:gap-4 max-w-[340px] md:max-w-[480px] mx-auto">
              {GUARDIANS.map((g, idx) => {
                const isActive = idx === active;
                return (
                  <button
                    key={g.name}
                    onClick={() => setActive(idx)}
                    className="relative flex flex-col items-center text-center group min-w-0"
                  >


                    <div
                      className={`relative w-full aspect-square rounded-full overflow-hidden transition-all duration-500 ${
                        isActive ? "scale-110" : "opacity-40 group-hover:opacity-100"
                      }`}
                    >
                      <Image src={g.step} alt={`Étape ${idx + 1}`} fill className="object-contain" />
                    </div>

                    <div className="mt-3 text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-zinc-400 font-mono whitespace-nowrap">
                      Phase {g.phase}
                    </div>
                    <div className={`mt-1 font-display text-[8px] md:text-[10px] font-semibold tracking-tight transition-colors whitespace-nowrap ${
                      isActive ? "text-zinc-950" : "text-zinc-500"
                    }`}>
                      {g.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-6 text-lg text-zinc-600 max-w-2xl mx-auto font-light leading-relaxed">
            Chaque groupe de 60 appels active l'influence d'une divinité qui protège une étape du Retour.
            L'étoile noire suit la divinité en cours.
          </p>
        </motion.div>

        {/* Grand affichage : divinité + description */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center mb-20">
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[9/16] w-full max-w-[320px] rounded-3xl overflow-hidden border border-zinc-200 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.4)]"
              >
                <Image src={current.img} alt={current.name} fill className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.name + "-desc"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-medium mb-4">
                Phase {current.phase} · {current.role}
              </div>
              <h3 className="font-display text-5xl md:text-7xl font-semibold text-zinc-950 tracking-tight leading-[0.95]">
                {current.name}
              </h3>
              <p className="mt-8 text-lg text-zinc-600 font-light leading-relaxed max-w-lg">
                {current.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>


      </div>
    </section>
  );
}
