"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MysteryCard from "./MysteryCard";
import type { Mystere, UserTreasure } from "@/types/treasures";

interface MysteryDeckProps {
  mysteres: (Mystere & { treasure_info?: any })[];
  userProgress: Record<string, UserTreasure>;
  onCorrect: (mystereId: string) => void;
  onWrong: (mystereId: string) => void;
  onUnlock: (mystereId: string, word: string) => void;
}

export default function MysteryDeck({
  mysteres,
  userProgress,
  onCorrect,
  onWrong,
  onUnlock
}: MysteryDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = mysteres.length - 1;
      if (nextIndex >= mysteres.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const currentMystere = mysteres[currentIndex];
  if (!currentMystere) return null;

  const progress = userProgress[currentMystere.id];

  return (
    <div className="h-[100vh] w-full relative bg-[#F4F4F2] overflow-hidden flex items-center justify-center p-4 md:p-10">
      {/* Background Ambience (Changes with card) */}
      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-radial from-amber-500 to-transparent" />
      </motion.div>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="w-full max-w-lg h-[80vh] cursor-grab active:cursor-grabbing z-10"
        >
          <MysteryCard 
            mystere={currentMystere}
            progress={progress}
            onCorrect={() => onCorrect(currentMystere.id)}
            onWrong={() => onWrong(currentMystere.id)}
            onUnlock={(word) => onUnlock(currentMystere.id, word)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Pagination Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {mysteres.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              i === currentIndex ? "bg-amber-600 w-8" : "bg-amber-900/20"
            )}
          />
        ))}
      </div>
    </div>
  );
}
