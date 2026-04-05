"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AwaleHeaderProps {
  lives: number;
  className?: string;
}

import Image from "next/image";

export default function AwaleHeader({ lives, className }: AwaleHeaderProps) {
  return (
    <div className={cn("w-full h-24 flex items-center justify-center bg-transparent px-6", className)}>
      <div className="relative w-full max-w-2xl h-16">
        {/* Background Sculpted Board */}
        <Image 
          src="/images/treasures/image_12.png" 
          alt="Tableau Awalé" 
          fill 
          className="object-contain"
        />
        
        {/* Seeds Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-[6%] px-[15%]">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i < lives ? 1.2 : 0,
                opacity: i < lives ? 1 : 0,
                filter: i < lives ? "brightness(1.5) drop-shadow(0 0 10px rgba(255,191,0,0.8))" : "none"
              }}
              className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 to-amber-600 border border-white/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
