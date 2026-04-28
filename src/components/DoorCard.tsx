"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface DoorCardProps {
  id: number;
  title: string;
  fragment: string;
  image: string;
  className?: string;
}

export const DoorCard = ({ id, title, fragment, image, className }: DoorCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={cn("relative cursor-pointer group perspective-1000", className)}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* RECTO : IMAGE */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden bg-white ring-1 ring-black/5 shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image 
              src={`/${image}`}
              alt={title}
              fill
              className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
            />
            {/* Overlay indicatif */}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] drop-shadow-md">
                Porte {id}
              </span>
            </div>
          </div>
        </div>

        {/* VERSO : FRAGMENT */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-[#f4f4f5] border border-zinc-200 p-8 flex flex-col justify-center items-center text-center shadow-inner"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-4">
            {title}
          </span>
          <p className="text-sm md:text-base text-zinc-600 font-serif italic leading-relaxed">
            "{fragment}"
          </p>
          <div className="absolute top-4 right-4 opacity-10">
            <span className="text-4xl font-black text-zinc-900">{id}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
