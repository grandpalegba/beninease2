'use client';

import { motion } from "framer-motion";

interface Props {
  /** 4-element array, each 1 or 2. 1 = single line, 2 = double line */
  code: [number, number, number, number];
  size?: number;
  color?: string;
  animated?: boolean;
}

/**
 * Renders the esoteric trace of a Fongbé sign as SVG.
 * Each row: 1 = one centered horizontal line, 2 = two short lines with gap.
 */
const SignTrace = ({ code, size = 64, color = "currentColor", animated = true }: Props) => {
  const lineWidth = size * 0.7;
  const gapWidth = size * 0.12;
  const strokeWidth = Math.max(2, size * 0.06);
  const rowHeight = size / 5;
  const startX = (size - lineWidth) / 2;

  const rows = code.map((val, i) => {
    const y = rowHeight * (i + 1);
    if (val === 1) {
      // Single line
      return (
        <motion.line
          key={i}
          x1={startX}
          y1={y}
          x2={startX + lineWidth}
          y2={y}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : false}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        />
      );
    }
    // Double line (two segments with gap)
    const segLen = (lineWidth - gapWidth) / 2;
    return (
      <g key={i}>
        <motion.line
          x1={startX}
          y1={y}
          x2={startX + segLen}
          y2={y}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : false}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        />
        <motion.line
          x1={startX + segLen + gapWidth}
          y1={y}
          x2={startX + lineWidth}
          y2={y}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : false}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 + 0.05 }}
        />
      </g>
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="inline-block">
      {rows}
    </svg>
  );
};

export default SignTrace;
