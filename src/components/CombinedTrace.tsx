'use client';

import { motion } from "framer-motion";

interface Props {
  /** Left sign code (4 rows) */
  leftCode: [number, number, number, number];
  /** Right sign code (4 rows) */
  rightCode: [number, number, number, number];
  size?: number;
  color?: string;
}

/**
 * Combined sign: left column on LEFT, right column on RIGHT.
 */
const CombinedTrace = ({ leftCode, rightCode, size = 100, color = "currentColor" }: Props) => {
  const colWidth = size * 0.3;
  const gapWidth = size * 0.1;
  const segGap = colWidth * 0.15;
  const strokeWidth = Math.max(2, size * 0.04);
  const rowHeight = size / 5;
  const leftX = (size - colWidth * 2 - gapWidth) / 2;
  const rightX = leftX + colWidth + gapWidth;

  const renderColumn = (code: number[], startX: number, delayOffset: number) =>
    code.map((val, i) => {
      const y = rowHeight * (i + 1);
      if (val === 1) {
        return (
          <motion.line
            key={`${delayOffset}-${i}`}
            x1={startX}
            y1={y}
            x2={startX + colWidth}
            y2={y}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.08 + delayOffset }}
          />
        );
      }
      const segLen = (colWidth - segGap) / 2;
      return (
        <g key={`${delayOffset}-${i}`}>
          <motion.line
            x1={startX}
            y1={y}
            x2={startX + segLen}
            y2={y}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.25, delay: i * 0.08 + delayOffset }}
          />
          <motion.line
            x1={startX + segLen + segGap}
            y1={y}
            x2={startX + colWidth}
            y2={y}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.25, delay: i * 0.08 + delayOffset + 0.04 }}
          />
        </g>
      );
    });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="inline-block">
      {renderColumn(leftCode, leftX, 0)}
      {renderColumn(rightCode, rightX, 0.35)}
    </svg>
  );
};

export default CombinedTrace;
