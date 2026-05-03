"use client";

import React from 'react';
import { VisionsGrid } from '@/components/visions/VisionsGrid';
import { VisionPanel } from '@/components/visions/VisionPanel';
import { VisionSelectionBar } from '@/components/visions/VisionSelectionBar';
import { motion } from 'framer-motion';


export default function VisionsPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white font-sans selection:bg-black selection:text-white">
      {/* Grid Container */}
      <VisionsGrid />

      {/* Top Title Overlay */}
      <div className="fixed top-24 left-10 z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.8]">
            Visions<br />
            <span className="text-zinc-200">Souveraines</span>
          </h1>
          <div className="mt-4 flex items-center gap-4">
             <div className="h-px w-12 bg-zinc-950" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Territoire du Patrimoine</p>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Bar */}
      <VisionSelectionBar />

      {/* Right-side Detail Panel */}
      <VisionPanel />

      {/* Stats Counter (Simple) */}
      <div className="fixed top-24 right-10 z-50 pointer-events-none text-right hidden md:block">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Libération Totale</p>
         <p className="text-3xl font-black text-zinc-950">256 / 4096</p>
      </div>
    </div>
  );
}
