"use client";

import { motion } from "framer-motion";

export function Delegation() {
  return (
    <section className="relative bg-white overflow-hidden border-b border-zinc-100" style={{ paddingTop: '6rem', paddingBottom: '6rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 700, color: '#2E5FA3', letterSpacing: '0.02em', lineHeight: 1.05 }}>L'Organisation des <em style={{ color: '#2E5FA3', fontStyle: 'normal' }}>Nations</em></h2>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '17px', color: 'rgba(0,0,0,0.6)', marginBottom: '2.5rem', textAlign: 'center' }}>
          Une délégation de 256 personnes par nation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Amazones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[1.5rem] bg-[#1B2A4A] text-white shadow-xl flex flex-col justify-between"
            style={{ padding: '2.5rem 3rem' }}
          >
            <div>
              <div className="text-4xl font-bold text-[#D4922A] mb-4">16</div>
              <h3 className="text-2xl font-semibold mb-6 uppercase tracking-wider">Amazones</h3>
              <p className="text-zinc-400 font-light leading-relaxed text-base">
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
            className="rounded-[1.5rem] bg-[#1B2A4A] text-white shadow-xl flex flex-col justify-between"
            style={{ padding: '2.5rem 3rem' }}
          >
            <div>
              <div className="text-4xl font-bold text-[#D4922A] mb-4">240</div>
              <h3 className="text-2xl font-semibold mb-6 uppercase tracking-wider">Soutiens</h3>
              <p className="text-zinc-400 font-light leading-relaxed text-base">
                Un réseau d'experts et de citoyens mobilisés, répartis dynamiquement selon les défis et les missions à accomplir pour libérer les trésors.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
