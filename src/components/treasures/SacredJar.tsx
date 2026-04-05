"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SacredJarProps {
  pluggedHoles: number; // 0 to 4
  isLocked?: boolean;
  className?: string;
}

export default function SacredJar({ pluggedHoles, isLocked = false, className }: SacredJarProps) {
  // Positions approximate for the 4 holes on the jar body
  const holes = [
    { id: 1, x: "35%", y: "45%" },
    { id: 2, x: "65%", y: "48%" },
    { id: 3, x: "42%", y: "65%" },
    { id: 4, x: "58%", y: "62%" },
  ];

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow/Glow under the jar */}
        <ellipse cx="100" cy="225" rx="60" ry="10" fill="black" fillOpacity="0.1" />
        
        {/* Jar Body - Terracotta/Authentic texture logic */}
        <path
          d="M50 80C50 40 70 30 100 30C130 30 150 40 150 80C150 100 140 110 160 140C180 170 180 210 160 220C140 230 60 230 40 220C20 210 20 170 40 140C60 110 50 100 50 80Z"
          fill="#8B4513" // SaddleBrown for base
          stroke="#5D2E0C"
          strokeWidth="2"
        />
        
        {/* Highlight/Texture on body */}
        <path
          d="M60 80C60 60 70 50 100 50C130 50 140 60 140 80C140 95 130 105 150 135"
          stroke="white"
          strokeOpacity="0.1"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* The 4 Holes Logic */}
        {holes.map((hole, index) => {
          const isPlugged = pluggedHoles > index;
          return (
            <g key={hole.id}>
              {/* Hole Opening */}
              <circle
                cx={hole.x}
                cy={hole.y}
                r="6"
                fill={isPlugged ? "#FFD700" : "#2D1B0E"}
                className="transition-colors duration-700"
              />
              
              {/* Leaking Animation if not plugged */}
              {!isPlugged && !isLocked && (
                <motion.g
                   initial={{ opacity: 0 }}
                   animate={{ opacity: [0.2, 0.5, 0.2] }}
                   transition={{ duration: 2, repeat: Infinity }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={hole.x}
                      cy={hole.y}
                      r="1.5"
                      fill="#81E6D9" // Watery/Ethereal leak
                      initial={{ y: 0, opacity: 1, scale: 1 }}
                      animate={{ 
                        y: [0, 40], 
                        x: [0, (i - 1) * 10], 
                        opacity: [1, 0],
                        scale: [1, 0.5]
                      }}
                      transition={{ 
                        duration: 1.5 + i * 0.2, 
                        repeat: Infinity, 
                        delay: i * 0.4,
                        ease: "easeIn" 
                      }}
                    />
                  ))}
                </motion.g>
              )}

              {/* Golden Plug Effect */}
              <AnimatePresence>
                {isPlugged && (
                  <motion.circle
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1], opacity: 1 }}
                    cx={hole.x}
                    cy={hole.y}
                    r="8"
                    fill="url(#goldGradient)"
                    style={{ filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))" }}
                  />
                )}
              </AnimatePresence>
            </g>
          );
        })}

        {/* Jar Rim */}
        <path
          d="M70 30C70 20 80 15 100 15C120 15 130 20 130 30"
          stroke="#5D2E0C"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Full Seal Illumination & Apex Explosion */}
        <AnimatePresence>
          {pluggedHoles === 4 && (
            <g>
              <motion.circle
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.5, 2] }}
                transition={{ duration: 1.5, repeat: 1 }}
                cx="100"
                cy="130"
                r="60"
                fill="url(#victoryGlow)"
              />
              {/* Apex Particles */}
              {[...Array(12)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx="100"
                  cy="130"
                  r="2"
                  fill="#FFD700"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ 
                    x: Math.cos((i * 30) * Math.PI / 180) * 80,
                    y: Math.sin((i * 30) * Math.PI / 180) * 80,
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                />
              ))}
            </g>
          )}
        </AnimatePresence>

        {/* Victory Glow (Continuous) */}
        {pluggedHoles === 4 && (
          <motion.circle
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            cx="100"
            cy="130"
            r="80"
            fill="url(#victoryGlow)"
          />
        )}

        {/* Gradients */}
        <defs>
          <radialGradient id="goldGradient">
            <stop offset="0%" stopColor="#FFFACD" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#DAA520" />
          </radialGradient>
          <radialGradient id="victoryGlow">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Sealed Label */}
      <AnimatePresence>
        {pluggedHoles === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-12 px-4 py-2 bg-amber-500 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg border-2 border-white"
          >
            Jarre Scellée
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locking overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-grayscale rounded-3xl pointer-events-none">
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-16 h-16 border-4 border-red-500/30 rounded-full flex items-center justify-center"
           >
              <div className="w-8 h-1 bg-red-500 -rotate-45 absolute" />
              <div className="w-8 h-1 bg-red-500 rotate-45 absolute" />
           </motion.div>
        </div>
      )}
    </div>
  );
}
