"use client";

import React from 'react';
import { VisionsGrid } from '@/components/visions/VisionsGrid';
import { VisionPanel } from '@/components/visions/VisionPanel';
import { useVisionsStore } from '@/store/visions';
import { motion } from 'framer-motion';

export default function VisionsPage() {
  const { totalFunded } = useVisionsStore();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      {/* Grid Container */}
      <VisionsGrid />

      {/* Floating Info Overlay (Left Side) */}
      <div className="fixed top-28 left-6 md:left-12 pointer-events-none z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none text-black">
              Visions
            </h1>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mt-2">
              Le Territoire du Futur
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-black/5 p-6 rounded-[2rem] shadow-xl pointer-events-auto inline-block">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">
              Financement Récolté
            </div>
            <div className="text-3xl font-black tracking-tighter">
              {totalFunded}€
            </div>
            <div className="w-48 h-1 bg-zinc-100 rounded-full mt-4 overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "15%" }}
                  className="h-full bg-black"
               />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Instructions Overlay */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 pointer-events-none z-50 text-center">
         <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full border border-black/5"
         >
            Pincez pour zoomer • Glissez pour explorer • Cliquez pour conquérir
         </motion.p>
      </div>

      {/* Right-side Detail Panel */}
      <VisionPanel />
    </div>
  );
}
