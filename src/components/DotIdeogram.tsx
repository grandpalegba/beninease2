'use client';

import { motion } from "framer-motion";

interface Props {
  /** Left sign code (4 rows): 1 = single stick, 2 = double sticks */
  leftCode: [number, number, number, number];
  /** Right sign code (4 rows): 1 = single stick, 2 = double sticks */
  rightCode: [number, number, number, number];
  size?: number;
  color?: string;
}

/**
 * Stick-based ideogram for a 256-sign Fa figure.
 * Each row has either 1 vertical stick (centered) or 2 vertical sticks
 * (side-by-side) per column. Left column = leftCode (sign X),
 * right column = rightCode (sign Y).
 */
const DotIdeogram = ({
  leftCode,
  rightCode,
  size = 200,
  color = "hsl(30, 30%, 12%)",
}: Props) => {
  const rows = 4;
  const colGap = size * 0.32; // distance between the two columns
  const stickGap = size * 0.06; // horizontal gap between the two sticks when val === 2
  const stickWidth = Math.max(2, size * 0.018);
  const stickHeight = size * 0.13;
  const rowSpacing = size * 0.18;

  const totalHeight = rowSpacing * (rows - 1) + stickHeight;
  const startY = (size - totalHeight) / 2;
  const centerX = size / 2;
  const leftCx = centerX - colGap / 2;
  const rightCx = centerX + colGap / 2;

  const renderStick = (cx: number, cy: number, key: string, delay: number) => (
    <motion.rect
      key={key}
      x={cx - stickWidth / 2}
      y={cy}
      width={stickWidth}
      height={stickHeight}
      rx={stickWidth / 2}
      fill={color}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      style={{ transformOrigin: `${cx}px ${cy + stickHeight / 2}px` }}
      transition={{ duration: 0.3, delay }}
    />
  );

  const renderColumnRow = (
    val: number,
    cx: number,
    cy: number,
    key: string,
    delay: number,
  ) => {
    if (val === 1) {
      return renderStick(cx, cy, key, delay);
    }
    return (
      <g key={key}>
        {renderStick(cx - stickGap, cy, `${key}-a`, delay)}
        {renderStick(cx + stickGap, cy, `${key}-b`, delay + 0.04)}
      </g>
    );
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="inline-block"
      aria-hidden="true"
    >
      {leftCode.map((val, i) =>
        renderColumnRow(val, leftCx, startY + i * rowSpacing, `l-${i}`, i * 0.08),
      )}
      {rightCode.map((val, i) =>
        renderColumnRow(
          val,
          rightCx,
          startY + i * rowSpacing,
          `r-${i}`,
          0.35 + i * 0.08,
        ),
      )}
    </svg>
  );
};

export default DotIdeogram;
