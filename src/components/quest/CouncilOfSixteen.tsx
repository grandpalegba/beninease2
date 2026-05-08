"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const BINOMES = [
  {
    id: 1,
    benin: {
      name: "Agbéké",
      rank: "Gbeto (La Chasseresse)",
      image: "/quest/hero-gbeto.png",
      description: "Force pure et vision stratégique.",
    },
    peru: {
      name: "Mama Qori",
      rank: "Mama-Cuna (La Source)",
      image: "/quest/guardian-mamacuna.png",
      description: "Gardienne des mémoires ancestrales de la Vallée Sacrée.",
    }
  },
  {
    id: 2,
    benin: {
      name: "Sika",
      rank: "Kposi (La Panthère)",
      image: "/quest/hero-kpojito.png",
      description: "Intelligence tactique et protection du patrimoine.",
    },
    peru: {
      name: "Nayra",
      rank: "Ñusta (La Princesse)",
      image: "/quest/paqos.png",
      description: "Rayonnement de la culture solaire et rites de l'eau.",
    }
  }
];

const RANKS_BENIN = ["Ahosi", "Mino", "Kposi", "Gbeto"];
const RANKS_PERU = ["Maskay", "Kamay", "Ñusta", "Mama-Cuna"];

export function CouncilOfSixteen() {
  return (
    <section className="relative py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold mb-4 block">Le Conseil des 16</span>
            <h2 className="font-display text-5xl md:text-7xl text-zinc-950 mb-6">Binômes de Destin</h2>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto italic">
              "L'Amazone et la Gardienne ne font qu'une. L'action sans mémoire est aveugle, la mémoire sans action est impuissante."
            </p>
          </motion.div>
        </div>

        {/* Rank Progression Legend */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-32 p-8 rounded-[3rem] bg-zinc-50 border border-zinc-100">
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-widest text-amber-600 font-bold mb-6 block">Rangs du Bénin (Polarité Masculine)</span>
            <div className="flex justify-between items-center gap-2">
              {RANKS_BENIN.map((rank, i) => (
                <div key={rank} className="flex flex-col items-center gap-2 flex-1">
                  <div className={`h-1.5 w-full rounded-full ${i === 3 ? 'bg-amber-500' : 'bg-zinc-200'}`} />
                  <span className="text-[10px] font-bold uppercase text-zinc-400">{rank}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block w-px bg-zinc-200" />
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-6 block">Rangs du Pérou (Polarité Féminine)</span>
            <div className="flex justify-between items-center gap-2">
              {RANKS_PERU.map((rank, i) => (
                <div key={rank} className="flex flex-col items-center gap-2 flex-1 text-right">
                  <div className={`h-1.5 w-full rounded-full ${i === 3 ? 'bg-slate-400' : 'bg-zinc-200'}`} />
                  <span className="text-[10px] font-bold uppercase text-zinc-400">{rank}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The Binômes - Face-à-Face effect */}
        <div className="space-y-32">
          {BINOMES.map((binome) => (
            <div key={binome.id} className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
              {/* Central Mirror Axis */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-100 to-transparent hidden md:block" />
              
              {/* Amazone (Left) */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex-1 flex flex-col items-center md:items-end md:pr-20 text-center md:text-right"
              >
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-amber-500/20 mb-8 group">
                   <div className="absolute inset-0 bg-amber-500/10 group-hover:bg-transparent transition-colors z-10" />
                   <Image 
                    src={binome.benin.image} 
                    alt={binome.benin.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-amber-600 font-bold mb-2">{binome.benin.rank}</div>
                <h3 className="text-4xl font-display text-zinc-950 mb-4">{binome.benin.name}</h3>
                <p className="text-zinc-500 font-light max-w-sm">{binome.benin.description}</p>
              </motion.div>

              {/* Central Icon */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-zinc-950 flex items-center justify-center border-4 border-white shadow-xl">
                 <div className="text-white text-xl font-heritage">∞</div>
              </div>

              {/* Gardienne (Right) */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex-1 flex flex-col items-center md:items-start md:pl-20 text-center md:text-left"
              >
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-slate-400/20 mb-8 group">
                  <div className="absolute inset-0 bg-slate-400/10 group-hover:bg-transparent transition-colors z-10" />
                  <Image 
                    src={binome.peru.image} 
                    alt={binome.peru.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">{binome.peru.rank}</div>
                <h3 className="text-4xl font-display text-zinc-950 mb-4">{binome.peru.name}</h3>
                <p className="text-zinc-500 font-light max-w-sm">{binome.peru.description}</p>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mt-40 text-center">
           <p className="text-sm text-zinc-400 uppercase tracking-widest font-medium">Lien Stratégique : Score Binominal Indivisible</p>
        </div>
      </div>
    </section>
  );
}
