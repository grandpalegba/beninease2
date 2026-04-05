"use client";

import React from "react";
import { motion } from "framer-motion";

interface JarreSvgProps {
  className?: string;
  isLocked?: boolean;
}

export default function JarreSvg({ className, isLocked = false }: JarreSvgProps) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 200 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xl"
      >
        {/* Shadow */}
        <ellipse cx="100" cy="235" rx="60" ry="10" fill="black" fillOpacity="0.1" />

        {/* Jar Body */}
        <motion.path
          d="M40 100C40 60 70 40 100 40C130 40 160 60 160 100C160 140 180 180 160 210C140 240 60 240 40 210C20 180 40 140 40 100Z"
          fill={isLocked ? "#4B5563" : "#D97706"}
          stroke={isLocked ? "#374151" : "#92400E"}
          strokeWidth="4"
          animate={isLocked ? { opacity: 0.8 } : { y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Jar Rim */}
        <ellipse
          cx="100"
          cy="45"
          rx="35"
          ry="15"
          fill={isLocked ? "#374151" : "#B45309"}
          stroke={isLocked ? "#1F2937" : "#78350F"}
          strokeWidth="3"
        />

        {/* Traditional Patterns/Holes (The Jarre à Trous concept) */}
        {!isLocked && (
          <g>
            {[
              { cx: 70, cy: 110, r: 8 },
              { cx: 100, cy: 100, r: 10 },
              { cx: 130, cy: 110, r: 8 },
              { cx: 65, cy: 145, r: 9 },
              { cx: 100, cy: 140, r: 12 },
              { cx: 135, cy: 145, r: 9 },
              { cx: 80, cy: 175, r: 8 },
              { cx: 120, cy: 175, r: 8 },
            ].map((hole, i) => (
              <motion.circle
                key={i}
                cx={hole.cx}
                cy={hole.cy}
                r={hole.r}
                fill="#FEE6C1"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </g>
        )}

        {/* Lock Icon if locked */}
        {isLocked && (
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-white"
          >
            <rect x="85" y="110" width="30" height="25" rx="4" fill="white" />
            <path
              d="M90 110V100C90 94.4772 94.4772 90 100 90C105.523 90 110 94.4772 110 100V110"
              stroke="white"
              strokeWidth="4"
            />
          </motion.g>
        )}
      </svg>
    </div>
  );
}
