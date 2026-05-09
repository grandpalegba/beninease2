"use client";

import { motion } from "framer-motion";
import { NATIONS, flagEmoji } from "./Pantheon";

export function FaHome() {
  return (
    <section className="relative py-24 bg-[#1B2A4A] text-white overflow-hidden" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
      <div className="relative max-w-5xl mx-auto">

        {/* Header — same pattern as other sections but on dark bg */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 700, color: '#ffffff', letterSpacing: '0.02em', lineHeight: 1.05 }}>
            La Géométrie Sacrée du <em style={{ color: '#D4922A', fontStyle: 'normal' }}>Fâ</em>
          </h2>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '17px', color: 'rgba(255,255,255,0.55)', marginBottom: '4rem', textAlign: 'center' }}>
          La structure des jeux s'appuie sur la science du Fâ, l'une des plus grandes traditions majeures du patrimoine béninois.
        </p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/10 p-8 md:p-12 shadow-2xl"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10">
            {NATIONS.map((n, i) => (
              <motion.div
                key={n.code}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="flex flex-col items-center gap-3 group"
              >
                <span className="text-3xl md:text-4xl transition-transform duration-300 group-hover:scale-110">
                  {flagEmoji(n.code)}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/40 font-bold text-center group-hover:text-white transition-colors">
                  {n.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
