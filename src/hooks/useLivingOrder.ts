'use client';

import { useEffect, useState } from "react";

/**
 * Returns an array of `count` stable ids whose order is periodically
 * permuted by swapping a few random pairs. Combined with framer-motion's
 * `layout` prop on grid children keyed by id, this produces a "living"
 * effect where cells visually exchange positions over time.
 */
export function useLivingOrder(
  count: number,
  swapsPerTick = 6,
  intervalMs = 2200,
): number[] {
  const [order, setOrder] = useState<number[]>(() =>
    Array.from({ length: count }, (_, i) => i),
  );

  useEffect(() => {
    setOrder(Array.from({ length: count }, (_, i) => i));
  }, [count]);

  useEffect(() => {
    if (count < 2) return;
    const id = window.setInterval(() => {
      setOrder((prev) => {
        const next = prev.slice();
        for (let s = 0; s < swapsPerTick; s++) {
          const a = Math.floor(Math.random() * next.length);
          let b = Math.floor(Math.random() * next.length);
          // bias swaps to nearby cells so the motion looks organic
          const delta = (Math.floor(Math.random() * 5) - 2) * 16; // ±2 rows in a 16-wide grid
          const candidate = a + delta + (Math.floor(Math.random() * 5) - 2);
          if (candidate >= 0 && candidate < next.length) b = candidate;
          if (a !== b) {
            const tmp = next[a];
            next[a] = next[b];
            next[b] = tmp;
          }
        }
        return next;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, swapsPerTick, intervalMs]);

  return order;
}
