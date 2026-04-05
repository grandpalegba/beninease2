"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AwaleHeaderProps {
  lives: number;
  className?: string;
}

export default function AwaleHeader({ lives, className }: AwaleHeaderProps) {
  return (
    <div className={cn("w-full h-24 flex items-center justify-center bg-gray-900/40 backdrop-blur-md border-b border-white/5 px-6", className)}>
      <div className="relative flex items-center gap-4 bg-[#2A1B0E] p-4 rounded-3xl border border-amber-900/30 shadow-2xl">
        {/* Left Totem (Tortoise) */}
        <div className="text-2xl opacity-50 grayscale hover:grayscale-0 transition-all cursor-help">🐢</div>
        
        {/* Awale Cups */}
        <div className="flex gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="relative group">
              {/* Cup background */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A0F06] to-[#3D2614] border border-amber-900/20 shadow-inner" />
              
              {/* Seed (Graine) */}
              <motion.div
                initial={false}
                animate={{
                  scale: i < lives ? 1 : 0,
                  opacity: i < lives ? 1 : 0,
                  boxShadow: i < lives ? "0 0 15px rgba(217, 119, 6, 0.6)" : "none"
                }}
                className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 border border-amber-300 shadow-lg"
              />
              
              {/* Glow effect for active seeds */}
              {i < lives && (
                <motion.div
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  className="absolute -inset-1 rounded-full bg-amber-500/10 blur-sm pointer-events-none"
                />
              )}
            </div>
          ))}
        </div>

        {/* Right Totem (Panther) */}
        <div className="text-2xl opacity-50 grayscale hover:grayscale-0 transition-all cursor-help">🐆</div>
        
        {/* Score label */}
        <div className="ml-4 flex flex-col items-start leading-none">
           <span className="text-[8px] font-black text-amber-500/50 uppercase tracking-[0.2em] mb-1">Graines d'Éveil</span>
           <span className="text-lg font-black text-amber-500 font-mono">{lives}</span>
        </div>
      </div>
    </div>
  );
}
