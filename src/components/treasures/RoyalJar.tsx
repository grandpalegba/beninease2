"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface Hole {
  id: number;
  x: string;
  y: string;
  symbol: string;
}

const ORGANIC_HOLES: Hole[] = [
  { id: 1, x: "32%", y: "42%", symbol: "🐚" },
  { id: 2, x: "68%", y: "40%", symbol: "⚔️" },
  { id: 3, x: "40%", y: "68%", symbol: "🏺" },
  { id: 4, x: "60%", y: "65%", symbol: "🐆" },
];

interface RoyalJarProps {
  currentStep: number; // 0 à 3 (question en cours), 4 (terminé)
  className?: string;
  isDragging?: boolean;
}

import Image from "next/image";

export default function RoyalJar({ currentStep, className, isDragging }: RoyalJarProps) {
  return (
    <div className={cn("relative p-8", className)}>
      {/* Detailed Jar Image v4.1 */}
      <div className="relative w-80 h-80 md:w-[28rem] md:h-[28rem] mx-auto">
        <Image 
          src="/images/treasures/image_14.png" 
          alt="Canari Sacré" 
          fill 
          className="object-contain drop-shadow-[0_0_30px_rgba(61,38,20,0.3)]"
        />

        {/* Global Glow during dragging */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Holes Layer */}
        {ORGANIC_HOLES.map((hole, index) => {
          const isPlugged = index < currentStep;
          const isActive = index === currentStep && currentStep < 4;
          
          return (
            <div 
              key={hole.id} 
              className="absolute" 
              style={{ left: hole.x, top: hole.y, transform: "translate(-50%, -50%)" }}
            >
              {/* The Hole Base */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700",
                isPlugged ? "bg-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.5)] border border-amber-400" : 
                isActive ? "bg-gray-900 border-2 border-amber-500/50" : "bg-black/80"
              )}>
                {isPlugged && <Sparkles className="w-5 h-5 text-amber-200" />}
              </div>

              {/* Active Hole Highlights: Golden Halo & Symbol Particles */}
              {isActive && (
                <>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-amber-500 blur-md pointer-events-none"
                  />
                  
                  {/* Floating symbols */}
                  {[...Array(3)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 0, x: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0], 
                        y: [-10, -40], 
                        x: [0, (i - 1) * 20],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: i * 1,
                        ease: "easeOut"
                      }}
                      className="absolute top-0 left-0 text-xl pointer-events-none"
                    >
                      {hole.symbol}
                    </motion.span>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
