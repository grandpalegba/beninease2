"use client";

import React from 'react';
import { VisionsGrid } from '@/components/visions/VisionsGrid';
import { VisionPanel } from '@/components/visions/VisionPanel';
import { motion } from 'framer-motion';


export default function VisionsPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      {/* Grid Container */}
      <VisionsGrid />

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
