"use client";

import { motion } from "framer-motion";

export function Delegation() {
  return (
    <section className="relative py-32 px-6 bg-transparent text-zinc-950 overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)",
            backgroundSize: "32px 32px"
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#FCD116] font-bold mb-6">
            L'Organisation des Nations
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-12">
            Une délégation de <span className="text-[#FCD116]">256 personnes</span> par nation.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="p-10 rounded-[2rem] bg-white border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] text-left flex flex-col justify-between hover:shadow-[0_8px_40px_rgba(0,0,0,0.04)] transition-all duration-500"
          >
            <div>
              <div className="text-4xl font-bold text-[#FCD116] mb-4">16</div>
              <h3 className="text-2xl font-semibold mb-6">Amazones</h3>
              <p className="text-zinc-400 font-light leading-relaxed text-lg">
                Des femmes leaders, porteuses de projets à fort impact social, environnemental ou culturel. Elles sont le cœur stratégique de chaque nation.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="p-10 rounded-[2rem] bg-white border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] text-left flex flex-col justify-between hover:shadow-[0_8px_40px_rgba(0,0,0,0.04)] transition-all duration-500"
          >
            <div>
              <div className="text-4xl font-bold text-[#FCD116] mb-4">240</div>
              <h3 className="text-2xl font-semibold mb-6">Soutiens</h3>
              <p className="text-zinc-400 font-light leading-relaxed text-lg">
                Un réseau d'experts et de citoyens mobilisés, répartis dynamiquement selon les défis et les missions à accomplir pour libérer les trésors.
              </p>
            </div>
          </motion.div>
        </div>


      </div>
    </section>
  );
}
