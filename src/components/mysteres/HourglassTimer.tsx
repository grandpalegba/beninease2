"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HourglassTimerProps {
  timeLeft: number; // 0 to 30
  isFlipping: boolean;
}

export function HourglassTimer({ timeLeft, isFlipping }: HourglassTimerProps) {
  // Calculate percentage of time remaining (0 to 1)
  const progress = timeLeft / 30;
  
  // Bulbes and sand paths
  // Top sand: slowly shrinks vertically
  // Bottom sand: slowly grows vertically
  
  return (
    <div className="relative flex flex-col items-center justify-center w-16 h-24 md:w-20 md:h-28">
      <motion.div
        animate={{ 
          rotate: isFlipping ? 180 : 0 
        }}
        transition={{ 
          duration: 0.8, 
          ease: "easeInOut" 
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 100 150"
          className="w-full h-full drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hourglass Frame/Structure */}
          <path
            d="M20 10H80M20 140H80M25 10C25 10 25 50 50 75C75 50 75 10 75 10M25 140C25 140 25 100 50 75C75 100 75 140 75 140"
            stroke="#5c3c35"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Glass (Slightly visible) */}
          <path
            d="M25 10C25 10 25 50 50 75C75 50 75 10 75 10M25 140C25 140 25 100 50 75C75 100 75 140 75 140Z"
            fill="rgba(92, 60, 53, 0.05)"
          />

          {/* Top Bulb Sand */}
          <mask id="topSandMask">
             <motion.rect 
               x="20" 
               y="10" 
               width="60" 
               animate={{ height: `${progress * 65}px` }} 
               transition={{ duration: 1, ease: "linear" }}
             />
          </mask>
          <motion.path
            d="M25 10C25 10 25 50 50 75C75 50 75 10 75 10Z"
            fill="#fdb813"
            initial={false}
            animate={{ 
              scaleY: progress,
              originY: 1
            }}
            transition={{ duration: 1, ease: "linear" }}
            style={{ opacity: progress > 0 ? 1 : 0 }}
          />

          {/* Bottom Bulb Sand */}
          <motion.path
            d="M25 140C25 140 25 100 50 75C75 100 75 140 75 140Z"
            fill="#fdb813"
            initial={false}
            animate={{ 
              scaleY: 1 - progress,
              originY: 1
            }}
            transition={{ duration: 1, ease: "linear" }}
          />

          {/* Falling Sand Stream */}
          <AnimatePresence>
            {timeLeft > 0 && !isFlipping && (
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                x1="50"
                y1="75"
                x2="50"
                y2="135"
                stroke="#fdb813"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="8;0"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
              </motion.line>
            )}
          </AnimatePresence>
          
          {/* Base and Top Plates */}
          <rect x="15" y="5" width="70" height="5" rx="2" fill="#5c3c35" />
          <rect x="15" y="140" width="70" height="5" rx="2" fill="#5c3c35" />
        </svg>
      </motion.div>

      {/* Digital Timer Overlay (Self-styled) */}
      <div 
        className="absolute bottom-[-20px] px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border border-[#5c3c35]/10"
        style={{ 
          background: "white", 
          color: timeLeft <= 5 ? "#a0412d" : "#5c3c35",
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {timeLeft}s
      </div>
    </div>
  );
}
