"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const DIMENSIONS = [
  {
    code: "01",
    name: "Conscience",
    page: "Page Sagesses",
    symbol: "Coquillage",
    icon: "/quest/icon-conscience.png",
    accent: "var(--benin-green)",
    accentName: "Green",
    description: "Éveil spirituel et philosophique. Donnez votre guidance sur des situations de vie.",
    balance: "0",
  },
  {
    code: "02",
    name: "Connaissance",
    page: "Page Savoirs",
    symbol: "Marteau",
    icon: "/quest/icon-connaissance.png",
    accent: "var(--benin-yellow-deep)",
    accentName: "Yellow",
    description: "Maîtrise de l'histoire, des langues et des faits culturels du Bénin.",
    balance: "0",
  },
  {
    code: "03",
    name: "Concordance",
    page: "Page Talents",
    symbol: "Racines",
    icon: "/quest/icon-concordance.png",
    accent: "var(--benin-red)",
    accentName: "Red",
    description: "Arbitrage de duels artistiques. Gagnez en alignant votre vote sur l'instinct collectif.",
    balance: "0",
  },
  {
    code: "04",
    name: "Confiance",
    page: "Page Histoires",
    symbol: "Ailes",
    icon: "/quest/icon-confiance.png",
    accent: "oklch(0.78 0.17 92)",
    accentName: "Gold",
    description: "Validation et partage des récits communautaires qui tissent la mémoire.",
    balance: "0",
  },
];

export function Pillars() {
  return (
    <section id="dimensions" className="relative py-32 px-6 bg-white border-t border-zinc-100 text-zinc-950">
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-20"
        >
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-zinc-950 leading-[1.05]">
            Quatre dimensions.
            <br />
            <span className="text-zinc-400">Quatre éléments.</span>
          </h2>
          <p className="mt-6 text-lg text-zinc-600 max-w-2xl font-light leading-relaxed">
            Pour lancer un Appel au Trésor, collectez des jetons dans chaque sanctuaire.
            Chaque dimension forge une part essentielle de l'énergie du Retour.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIMENSIONS.map((d, idx) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative bg-white border border-zinc-200 rounded-2xl p-8 hover:border-zinc-300 transition-colors duration-500 flex flex-col"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
                style={{ background: d.accent }}
              />

              {/* Icône sur fond noir (seule zone sombre) */}
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-zinc-950 flex items-center justify-center">
                <div className="relative w-[72%] h-[72%]">
                  <Image
                    src={d.icon}
                    alt={d.name}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: "drop-shadow(0 0 30px color-mix(in oklab, " + d.accent + " 45%, transparent))" }}
                  />
                </div>
              </div>

              <h3 className="font-display text-2xl font-semibold text-zinc-950 mb-3 tracking-tight">
                {d.name}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-8 font-light flex-1">
                {d.description}
              </p>

              <div className="pt-6 border-t border-zinc-100">
                <a href="#" className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors">
                  {d.page}
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
