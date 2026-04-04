import { useState, useRef, useEffect } from 'react';

interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const useSwipe = (callbacks: SwipeCallbacks) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  // Seuil minimum pour considérer un swipe (en pixels)
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;

    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    if (isHorizontalSwipe) {
      if (Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          // Swipe vers la gauche
          callbacks.onSwipeLeft?.();
        } else {
          // Swipe vers la droite
          callbacks.onSwipeRight?.();
        }
      }
    } else if (isVerticalSwipe) {
      if (Math.abs(distanceY) > minSwipeDistance) {
        if (distanceY > 0) {
          // Swipe vers le haut
          callbacks.onSwipeUp?.();
        } else {
          // Swipe vers le bas
          callbacks.onSwipeDown?.();
        }
      }
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', onTouchStart as any);
    element.addEventListener('touchmove', onTouchMove as any);
    element.addEventListener('touchend', onTouchEnd);

    return () => {
      element.removeEventListener('touchstart', onTouchStart as any);
      element.removeEventListener('touchmove', onTouchMove as any);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [touchStart, touchEnd, callbacks]);

  return elementRef;
};
