
import { useCallback } from 'react';

export function useWoodSound() {
  const ensureCtx = useCallback(() => {
    // Basic AudioContext unlock if needed
  }, []);

  const tick = useCallback(() => {
    // Play a short wood tick sound
  }, []);

  const playSettle = useCallback(() => {
    // Play a "settling" sound (multiple wood impacts)
  }, []);

  return { tick, playSettle, ensureCtx };
}
