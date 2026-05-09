"use client";

import { motion } from "framer-motion";

export function Delegation() {
  return (
    <section className="relative py-32 px-6 bg-white text-[#1B2A4A] overflow-hidden border-b border-zinc-100">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(27,42,74,0.05) 1px, transparent 0)",
            backgroundSize: "32px 32px"
          }}
        />
      </div>
<line_number>: 
      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#D4922A] font-bold mb-6">
            L'Organisation des Nations
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-12">
            Une délégation de <span className="text-[#D4922A]">256 personnes</span> par nation.
          </h2>
        </motion.div>
<line_number>: 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="p-10 rounded-[2rem] bg-zinc-50 border border-zinc-100 shadow-sm text-left flex flex-col justify-between hover:bg-zinc-100 transition-all duration-500"
          >
            <div>
              <div className="text-4xl font-bold text-[#D4922A] mb-4">16</div>
              <h3 className="text-2xl font-semibold mb-6">Amazones</h3>
              <p className="text-zinc-500 font-light leading-relaxed text-lg">
                Des femmes leaders, porteuses de projets à fort impact social, environnemental ou culturel. Elles sont le cœur stratégique de chaque nation.
              </p>
            </div>
          </motion.div>
<line_number>: 
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="p-10 rounded-[2rem] bg-zinc-50 border border-zinc-100 shadow-sm text-left flex flex-col justify-between hover:bg-zinc-100 transition-all duration-500"
          >
            <div>
              <div className="text-4xl font-bold text-[#D4922A] mb-4">240</div>
              <h3 className="text-2xl font-semibold mb-6">Soutiens</h3>
              <p className="text-zinc-500 font-light leading-relaxed text-lg">
                Un réseau d'experts et de citoyens mobilisés, répartis dynamiquement selon les défis et les missions à accomplir pour libérer les trésors.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
