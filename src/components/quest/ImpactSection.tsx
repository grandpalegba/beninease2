"use client";

import { motion } from "framer-motion";

export function ImpactSection() {
  return (
    <section className="relative py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* Libération Immatérielle Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold mb-6">Mission Sacrée</span>
            <h2 className="font-display text-5xl md:text-6xl text-zinc-950 mb-10 leading-tight">
              Libération Immatérielle : <br />
              <span className="text-zinc-400 font-light">Le Retour de l'Âme</span>
            </h2>
            <div className="space-y-6 text-xl text-zinc-600 font-light leading-relaxed italic">
              <p>
                "Le Yonyverse ne se bat pas contre les murs des musées, mais brise les chaînes du silence."
              </p>
              <p className="not-italic text-lg text-zinc-500 font-normal">
                Libérer un trésor, c'est extraire son <span className="text-zinc-950 font-medium">Code Source</span> — son histoire, sa puissance sacrée, son usage rituel — de son exil pour le rendre vivant dans le cœur des peuples.
              </p>
              <p className="not-italic text-lg text-zinc-500 font-normal">
                Tandis que l'objet physique reste un artefact inanimé à l'étranger, le Yonyverse rapatrie la <span className="text-zinc-950 font-medium">Vie du Trésor</span> au Bénin et au Pérou. Nous ne demandons pas la restitution de la matière, nous accomplissons la renaissance de l'Esprit.
              </p>
            </div>
          </motion.div>

          {/* Crowdfunding Amazone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-[4rem] bg-zinc-950 text-white relative overflow-hidden shadow-2xl"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px]" />
             <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-4 block">Action Collective</span>
                <h3 className="text-3xl font-semibold mb-8">Crowdfunding Amazone</h3>
                <p className="text-zinc-400 mb-10 font-light">
                  Chaque contribution financière booste les multiplicateurs de score de nos 16 femmes leaders tout en finançant directement leurs projets sociaux sur le terrain.
                </p>
                
                <div className="space-y-6 mb-12">
                   <div className="flex justify-between items-end">
                      <span className="text-xs uppercase tracking-widest text-zinc-500">Objectif Mensuel</span>
                      <span className="text-2xl font-heritage text-amber-400">84%</span>
                   </div>
                   <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "84%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
                      />
                   </div>
                </div>

                <button className="w-full py-5 rounded-2xl bg-white text-zinc-950 font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all duration-300">
                   Soutenir une Amazone
                </button>
             </div>
          </motion.div>
        </div>

        {/* Le Mur des Convergences */}
        <div className="mt-48">
          <div className="text-center mb-16">
             <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold mb-4 block">Flux Temps Réel</span>
             <h2 className="font-display text-4xl md:text-5xl text-zinc-950">Le Mur des Convergences</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
             {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="aspect-square rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-4 text-center group hover:bg-zinc-950 transition-all duration-300"
                >
                   <div className="flex flex-col gap-1 items-center">
                      <div className="w-8 h-8 rounded-full bg-zinc-200 group-hover:bg-zinc-800 transition-colors" />
                      <span className="text-[8px] uppercase tracking-widest text-zinc-400 group-hover:text-zinc-500 font-bold">Contribution</span>
                      <span className="text-[10px] font-medium text-zinc-900 group-hover:text-white">+5 Conscience</span>
                   </div>
                </motion.div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}
