import { useState, useEffect } from 'react';

/**
 * useLivingOrder - Manages a permutation of indices (0 to total-1)
 * that periodically swaps nearby elements to create a "living" effect.
 */
export function useLivingOrder(total: number, swapCount: number = 4, interval: number = 2200) {
  const [order, setOrder] = useState<number[]>([]);

  useEffect(() => {
    // Initial order: 0, 1, 2, ..., 255
    setOrder(Array.from({ length: total }, (_, i) => i));
  }, [total]);

  useEffect(() => {
    if (order.length === 0) return;

    const timer = setInterval(() => {
      setOrder((prev) => {
        const next = [...prev];
        const side = Math.sqrt(total);
        
        for (let k = 0; k < swapCount; k++) {
          const i = Math.floor(Math.random() * total);
          
          // Coordinate-based proximity bias (±2 rows/cols)
          const row = Math.floor(i / side);
          const col = i % side;
          
          const dRow = Math.floor(Math.random() * 5) - 2; // -2 to +2
          const dCol = Math.floor(Math.random() * 5) - 2; // -2 to +2
          
          let targetRow = row + dRow;
          let targetCol = col + dCol;
          
          // Keep within bounds
          targetRow = Math.max(0, Math.min(side - 1, targetRow));
          targetCol = Math.max(0, Math.min(side - 1, targetCol));
          
          const j = targetRow * side + targetCol;
          
          // Swap the indices in the permutation
          [next[i], next[j]] = [next[j], next[i]];
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [total, swapCount, interval, order.length]);

  return order;
}
