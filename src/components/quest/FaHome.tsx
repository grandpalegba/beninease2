"use client";

import { motion } from "framer-motion";
import { NATIONS, flagEmoji } from "./Pantheon";

export function FaHome() {
  return (
    <section className="relative py-32 px-6 bg-transparent text-white overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#FCD116] font-bold mb-4">
            L'Architecture Mathématique
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
            La Géométrie Sacrée du Fâ
          </h2>
          <p className="mt-8 text-xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto">
            La structure des jeux s'appuie sur la science du Fâ, l'une des plus grandes traditions majeures du patrimoine béninois.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center mb-20">
          
          {/* Visual representation of the Nations (4x4 grid) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square max-w-md mx-auto w-full flex items-center justify-center p-8 bg-zinc-900/30 rounded-full border border-zinc-800/50 shadow-[0_0_50px_rgba(252,209,22,0.05)]"
          >
            <div className="grid grid-cols-4 gap-4 md:gap-8 z-10">
              {NATIONS.map((n, i) => (
                <motion.div
                  key={n.code}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-2xl md:text-3xl drop-shadow-[0_0_8px_rgba(252,209,22,0.3)]">
                    {flagEmoji(n.code)}
                  </span>
                  <span className="text-[6px] md:text-[8px] uppercase tracking-widest text-zinc-500 font-medium text-center leading-tight">
                    {n.name}
                  </span>
                </motion.div>
              ))}
            </div>
            
            {/* Connecting lines for the sacred geometry feel */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#FCD116" strokeWidth="0.2" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="#FCD116" strokeWidth="0.2" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="#FCD116" strokeWidth="0.2" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="#FCD116" strokeWidth="0.2" strokeDasharray="1 1" />
            </svg>
          </motion.div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-display text-2xl md:text-3xl font-semibold mb-4 text-white">
                Temporalité Unique
              </h3>
              <p className="text-zinc-400 font-light text-lg leading-relaxed">
                La compétition s'articule en <span className="text-[#FCD116] font-medium">16 cycles</span> de <span className="text-[#FCD116] font-medium">16 jours</span> chacun. Une résonance temporelle parfaite avec la matrice primordiale.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="font-display text-2xl md:text-3xl font-semibold mb-4 text-white">
                Les Nations-Mères
              </h3>
              <p className="text-zinc-400 font-light text-lg leading-relaxed">
                Le <span className="text-white font-medium">Bénin</span> (Gbe Medji) et le <span className="text-white font-medium">Pérou</span> (Yeku Medji) sont les deux Nations-Mères au cœur de la matrice du Fâ.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-8 border border-zinc-800 bg-zinc-900 rounded-3xl"
            >
              <p className="text-xl md:text-2xl font-display font-medium leading-relaxed tracking-wide text-white">
                Les Défis sont construits autour des cultures, des traditions de <span className="text-[#FCD116]">16 Nations-Mères</span>.
              </p>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
