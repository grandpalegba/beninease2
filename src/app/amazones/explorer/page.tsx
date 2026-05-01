"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AmazonesExplorerPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] pt-32 pb-24 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/amazones"
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
            Retour
          </Link>
          <div className="h-[1px] flex-1 bg-black/5 mx-8" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300">
            Héritage & Courage
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-black mb-6">
            Les <span className="text-[#B8860B]">Amazones</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed mb-12">
            Découvrez l'histoire et l'influence des guerrières du Danxomè, symboles de l'excellence et de la détermination béninoise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {/* Placeholder for projects */}
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 bg-black rounded-2xl mb-6 flex items-center justify-center text-white font-black text-xl italic group-hover:scale-110 transition-transform">
                0{i}
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Projet en Développement</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Une initiative majeure visant à transformer un secteur clé de l'économie béninoise.
              </p>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-wider text-gray-500">
                  Technologie
                </div>
                <div className="px-3 py-1 bg-[#B8860B]/10 rounded-full text-[9px] font-black uppercase tracking-wider text-[#B8860B]">
                  En cours
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
