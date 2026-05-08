"use client";

import { motion } from "framer-motion";

const ARENAS = [
  {
    name: "SAGESSES",
    token: "Conscience",
    color: "bg-purple-500",
    description: "Explorer les profondeurs de l'âme et les mystères du Fâ.",
    icon: "👁️"
  },
  {
    name: "SAVOIRS",
    token: "Connaissance",
    color: "bg-blue-500",
    description: "Maîtriser les sciences ancestrales et la géographie sacrée.",
    icon: "📖"
  },
  {
    name: "TALENTS",
    token: "Compétences",
    color: "bg-amber-500",
    description: "Exprimer l'excellence artistique et le génie créateur.",
    icon: "🎭"
  },
  {
    name: "HISTOIRES",
    token: "Confiance",
    color: "bg-emerald-500",
    description: "Tisser les liens de la mémoire et restaurer la vérité.",
    icon: "🗣️"
  }
];

export function TransmissionArenas() {
  return (
    <section className="relative py-32 px-6 bg-zinc-950 text-white">
       <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold mb-4 block">Système de Transmission</span>
            <h2 className="font-display text-5xl md:text-7xl mb-8">Les 4 Arènes Mondiales</h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ARENAS.map((arena, i) => (
            <motion.div
              key={arena.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 rounded-[3rem] bg-zinc-900 border border-zinc-800 hover:border-white/20 transition-all duration-500"
            >
              <div className="text-4xl mb-8 group-hover:scale-110 transition-transform">{arena.icon}</div>
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-amber-400 transition-colors">Arène des {arena.name}</h3>
              <p className="text-zinc-500 text-sm font-light leading-relaxed mb-8">{arena.description}</p>
              
              <div className="flex flex-col gap-2 mt-auto">
                <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Jeton de Base</span>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${arena.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`} />
                  <span className="text-xs font-bold uppercase tracking-wider">{arena.token}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Movement Tokens */}
        <div className="mt-32 flex flex-col md:flex-row justify-center gap-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 p-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
          >
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shadow-lg">✈️</div>
             <div className="flex flex-col">
               <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Concordance</span>
               <span className="text-sm text-zinc-400">Tourisme physique & Immersion</span>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-6 p-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
          >
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-xl shadow-lg">📺</div>
             <div className="flex flex-col">
               <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Convergence</span>
               <span className="text-sm text-zinc-400">Participation aux Lives & Résonance</span>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
