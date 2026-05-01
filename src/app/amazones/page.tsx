"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AmazonesTransitionPage() {
  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image 
          src="/projects-bg.png" 
          alt="Les Amazones" 
          fill 
          className="object-cover opacity-[0.15]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10"
      >
        <h1 className="mb-12 font-display text-4xl sm:text-6xl font-black tracking-[-0.05em] text-black uppercase">
          Les <span className="text-[#B8860B]">Amazones</span>
        </h1>

        <Link 
          href="/amazones/explorer"
          className="group relative flex items-center justify-center bg-black text-white px-12 sm:px-24 py-6 sm:py-8 rounded-full shadow-2xl font-black text-[11px] sm:text-[14px] uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">Explorer les Amazones</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] opacity-0 group-hover:opacity-20 transition-opacity blur-xl" />
        </Link>
      </motion.div>

      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B8860B]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B8860B]/20 to-transparent" />
      
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
        <div className="w-[1px] h-12 bg-black" />
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Innovation & Futur</span>
      </div>
    </div>
  );
}
