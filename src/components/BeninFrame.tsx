'use client';

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Outer padding inside the frame (default 10px) */
  inset?: number;
  /** Frame stripe thickness in px (default 6) */
  thickness?: number;
  className?: string;
}

/**
 * Tricolor Benin flag frame — wraps the 16x16 matrix.
 * Top edge: red on the left half, green on the right half.
 * Right edge: green top, red bottom.
 * Bottom edge: green left, yellow right.
 * Left edge: yellow top, green bottom.
 * Mimics the uploaded "matrice.png" mockup.
 */
const BeninFrame = ({ children, inset = 10, thickness = 6, className = "" }: Props) => {
  const RED = "var(--color-benin-red)";
  const YELLOW = "var(--color-benin-yellow)";
  const GREEN = "var(--color-benin-green)";

  return (
    <div
      className={`relative ${className}`}
      style={{
        padding: inset,
        background: "transparent",
      }}
    >
      {/* Top edge: red (left 50%) | green (right 50%) */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: thickness,
          background: `linear-gradient(to right, ${RED} 0%, ${RED} 50%, ${GREEN} 50%, ${GREEN} 100%)`,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
      />
      {/* Right edge: green (top 50%) | red (bottom 50%) */}
      <div
        className="absolute top-0 right-0 bottom-0 pointer-events-none"
        style={{
          width: thickness,
          background: `linear-gradient(to bottom, ${GREEN} 0%, ${GREEN} 50%, ${RED} 50%, ${RED} 100%)`,
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
        }}
      />
      {/* Bottom edge: green (left 50%) | yellow (right 50%) */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: thickness,
          background: `linear-gradient(to right, ${GREEN} 0%, ${GREEN} 50%, ${YELLOW} 50%, ${YELLOW} 100%)`,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
      />
      {/* Left edge: yellow (top 50%) | green (bottom 50%) */}
      <div
        className="absolute top-0 left-0 bottom-0 pointer-events-none"
        style={{
          width: thickness,
          background: `linear-gradient(to bottom, ${YELLOW} 0%, ${YELLOW} 50%, ${GREEN} 50%, ${GREEN} 100%)`,
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4,
        }}
      />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
};

export default BeninFrame;
