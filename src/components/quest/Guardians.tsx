"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const GUARDIANS = [
  { phase: "I", name: "GrandPa Legba", role: "L'Ouverture", desc: "Gardien des carrefours, il ouvre les portes du voyage et accueille l'appel des 360 voix. Sans sa bénédiction, aucun Retour ne peut commencer.", img: "/quest/deity-legba.jpg", step: "/quest/step-1.png" },
  { phase: "II", name: "Babu Gu", role: "L'Avancée", desc: "Forgeron divin, il donne la force et les outils pour tracer le chemin. Il transforme la volonté en mouvement sur la route du Retour.", img: "/quest/deity-gu.jpg", step: "/quest/step-2.png" },
  { phase: "III", name: "Abuela Wata", role: "La Traversée", desc: "Mère des eaux, elle guide le voyage transatlantique inverse. Elle ramène ceux qui furent emportés par l'océan vers leur terre d'origine.", img: "/quest/deity-wata.jpg", step: "/quest/step-3.png" },
  { phase: "IV", name: "Avô Heviosso", role: "Le Ciel", desc: "Maître du tonnerre et de la justice, il purifie le chemin de sa foudre. Il rappelle que le Retour exige vérité et rectitude.", img: "/quest/deity-heviosso.jpg", step: "/quest/step-4.png" },
  { phase: "V", name: "Baba Sakpata", role: "L'Ancrage", desc: "Seigneur de la terre du Bénin, il accueille les trésors et les voix. Il enracine la renaissance dans le sol des ancêtres.", img: "/quest/deity-sakpata.jpg", step: "/quest/step-5.png" },
  { phase: "VI", name: "Nonna Minona", role: "La Bénédiction", desc: "Protectrice des femmes et des foyers, elle ouvre la Porte du Retour. Sa bénédiction scelle l'accomplissement de l'Odyssée.", img: "/quest/deity-minona.jpg", step: "/quest/step-6.png" },
];

const BLACK_HORSE = "/quest/black-horse.png";

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
            Les Forces Compagnes.
          </h2>
          <p className="mt-6 text-lg text-zinc-600 max-w-2xl mx-auto font-light leading-relaxed">
            Chaque groupe de 60 appels active l'influence d'une divinité qui protège une étape du Retour.
            Le cheval noir suit la divinité en cours.
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

        {/* Navigation par vignettes step (œufs progressifs) */}
        <div className="relative pt-20">
          <div className="grid grid-cols-6 gap-3 md:gap-6 max-w-4xl mx-auto">
            {GUARDIANS.map((g, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={g.name}
                  onClick={() => setActive(idx)}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Cheval noir au-dessus de la vignette active */}
                  {isActive && (
                    <motion.div
                      layoutId="horse"
                      className="absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 w-14 md:w-20 aspect-square z-10"
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                      <Image
                        src={BLACK_HORSE}
                        alt="Cheval du Retour"
                        fill
                        className="object-contain drop-shadow-md"
                      />
                    </motion.div>
                  )}

                  <div
                    className={`relative w-full aspect-square rounded-full overflow-hidden transition-all duration-500 ${
                      isActive ? "scale-110" : "opacity-60 group-hover:opacity-100"
                    }`}
                  >
                    <Image src={g.step} alt={`Étape ${idx + 1}`} fill className="object-contain" />
                  </div>

                  <div className="mt-3 text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-mono">
                    Phase {g.phase}
                  </div>
                  <div className={`mt-1 font-display text-xs md:text-sm font-semibold tracking-tight transition-colors ${
                    isActive ? "text-zinc-950" : "text-zinc-500"
                  }`}>
                    {g.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
