"use client";

import { motion } from "framer-motion";

export function Delegation() {
  return (
    <section className="relative py-24 px-6 bg-white overflow-hidden border-b border-zinc-100">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Block following "Les 6 arènes" style */}
        <div className="section-header-block">
          <h2 className="section-title-big">L'Organisation des <em>Nations</em></h2>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '17px', color: 'rgba(0,0,0,0.6)', marginBottom: '4rem', textAlign: 'center' }}>
          Une délégation de 256 personnes par nation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Amazones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-10 rounded-[1.5rem] bg-[#1B2A4A] text-white shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl font-bold text-[#D4922A] mb-4">16</div>
              <h3 className="text-2xl font-semibold mb-6 uppercase tracking-wider">Amazones</h3>
              <p className="text-zinc-400 font-light leading-relaxed text-lg">
                Des femmes leaders, porteuses de projets à fort impact social, environnemental ou culturel. Elles sont le cœur stratégique de chaque nation.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Soutiens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-10 rounded-[1.5rem] bg-[#1B2A4A] text-white shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl font-bold text-[#D4922A] mb-4">240</div>
              <h3 className="text-2xl font-semibold mb-6 uppercase tracking-wider">Soutiens</h3>
              <p className="text-zinc-400 font-light leading-relaxed text-lg">
                Un réseau d'experts et de citoyens mobilisés, répartis dynamiquement selon les défis et les missions à accomplir pour libérer les trésors.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-zinc-400 italic text-sm">
            Un équilibre parfait entre vision et action collective.
          </p>
        </div>
      </div>
    </section>
  );
}
