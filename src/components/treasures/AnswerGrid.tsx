"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnswerGridProps {
  options: string[];
  onDragEnd: (event: any, info: any, index: number) => void;
  onDragStart: () => void;
  onDrag: (event: any, info: any) => void;
  isAnswered: boolean;
  currentQuestionIndex: number;
}

export default function AnswerGrid({
  options,
  onDragEnd,
  onDragStart,
  onDrag,
  isAnswered,
  currentQuestionIndex
}: AnswerGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {options.map((option, index) => (
        <motion.div
          key={`${currentQuestionIndex}-${index}`}
          drag
          dragSnapToOrigin
          dragListener={!isAnswered}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={(e, info) => onDragEnd(e, info, index)}
          whileHover={{ scale: 1.02 }}
          whileDrag={{ 
            scale: 1.1, 
            zIndex: 100,
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
          }}
          className="cursor-grab active:cursor-grabbing relative h-full flex flex-col justify-end"
        >
          {/* Ribbon Style Button */}
          <div className={cn(
            "relative p-4 md:p-6 bg-gradient-to-br from-[#1A0F06] to-[#2A1B0E] border-t-2 border-amber-600/40 rounded-t-xl rounded-b-md shadow-xl transition-all",
            "before:absolute before:inset-x-0 before:-bottom-2 before:h-4 before:bg-amber-900/20 before:skew-x-12 before:-z-10 before:rounded-b-lg"
          )}>
            {/* Letter Badge */}
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-lg bg-amber-600 text-[#1A0F06] flex items-center justify-center font-black text-xs shadow-lg transform -rotate-12 border border-amber-400">
              {String.fromCharCode(65 + index)}
            </div>
            
            {/* Text */}
            <span className="block font-bold text-amber-100 text-xs md:text-sm leading-tight text-center">
              {option}
            </span>

            {/* Aesthetic Gold Lines */}
            <div className="absolute bottom-1 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          </div>

          {/* Ribbon Tail (Decoration) */}
          <div className="flex justify-between px-4 opacity-50">
             <div className="w-2 h-3 bg-amber-900/40 clip-path-ribbon" />
             <div className="w-2 h-3 bg-amber-900/40 clip-path-ribbon" />
          </div>
        </motion.div>
      ))}
      <style jsx>{`
        .clip-path-ribbon {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
        }
      `}</style>
    </div>
  );
}
