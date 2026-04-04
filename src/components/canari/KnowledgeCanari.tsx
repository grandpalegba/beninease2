import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const HOLES = [
  { cx: 138, cy: 92 }, 
  { cx: 141, cy: 117 }, 
  { cx: 141, cy: 142 }, 
  { cx: 138, cy: 167 }
];

interface KnowledgeCanariProps {
  fillStep?: number;
  isDropTarget?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function KnowledgeCanari({ 
  fillStep = 0, 
  isDropTarget = false, 
  size = 'medium' 
}: KnowledgeCanariProps) {
  const scale = size === 'small' ? 0.6 : size === 'large' ? 1.4 : 1;
  const width = 180 * scale;
  const height = 220 * scale;

  return (
    <div className="relative flex flex-col py-6">
      <motion.svg 
        width={width} 
        height={height} 
        viewBox="0 0 180 220" 
        animate={isDropTarget ? { scale: 1.05 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transform: `scale(${scale})` }}
      >
        <defs>
          <linearGradient id="jarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5E3C" />
            <stop offset="100%" stopColor="#6B3410" />
          </linearGradient>
          <clipPath id="interior">
            <rect x="32" y="80" width="116" height="110" rx="8" />
          </clipPath>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Corps de la jarre */}
        <path 
          d="M50,50 Q30,50 25,75 Q18,105 30,150 Q35,175 45,190 Q55,205 90,210 Q125,205 135,190 Q145,175 150,150 Q162,105 155,75 Q150,50 130,50" 
          fill="url(#jarGrad)" 
          stroke="#5C3317" 
          strokeWidth="2"
        />
        
        {/* Intérieur avec niveau d'eau */}
        <motion.rect 
          x="32" 
          y="80" 
          width="116" 
          fill="#D4AF37" 
          opacity={0.8} 
          clipPath="url(#interior)" 
          animate={{ 
            y: 200 - (fillStep / 4) * 120, 
            height: (fillStep / 4) * 120 
          }} 
          transition={{ 
            type: "spring", 
            stiffness: 60,
            damping: 15
          }} 
        />
        
        {/* Trous */}
        {HOLES.map((h, i) => (
          <g key={i}>
            <circle 
              cx={h.cx} 
              cy={h.cy} 
              r={6} 
              fill={fillStep > i ? "#D4AF37" : "#1A1A1A"} 
              stroke={fillStep > i ? "#F5D675" : "#5C3317"}
              strokeWidth={1}
            />
            {fillStep > i && (
              <motion.circle 
                cx={h.cx} 
                cy={h.cy} 
                r={10} 
                fill="none" 
                stroke="#F5D675" 
                strokeWidth="1.5" 
                filter="url(#glow)"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
            )}
          </g>
        ))}
        
        {/* Bordures décoratives */}
        <path 
          d="M35,55 Q30,55 28,65 Q25,75 30,85" 
          fill="none" 
          stroke="#D4AF37" 
          strokeWidth="1" 
          opacity={0.6}
        />
        <path 
          d="M145,55 Q150,55 152,65 Q155,75 150,85" 
          fill="none" 
          stroke="#D4AF37" 
          strokeWidth="1" 
          opacity={0.6}
        />
      </motion.svg>
    </div>
  );
}
