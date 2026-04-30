"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function TresorsTransitionPage() {
  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 pattern-bg opacity-[0.03] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Link 
          href="/tresors/explorer"
          className="flex items-center justify-center bg-black text-white px-12 sm:px-24 py-6 sm:py-8 rounded-full shadow-2xl font-bold text-[11px] sm:text-[15px] uppercase tracking-[0.3em] transition-transform hover:scale-105 active:scale-95"
        >
          Explorer les trésors du Bénin
        </Link>
      </motion.div>

      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
    </div>
  );
}
