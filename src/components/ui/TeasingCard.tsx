"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TeasingCardProps {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  text: string;
  expandedContent: (onClose: () => void) => React.ReactNode;
  className?: string;
  hideImage?: boolean;
  hideTitle?: boolean;
}

export default function TeasingCard({
  id,
  image,
  title,
  subtitle,
  text,
  expandedContent,
  className,
  hideImage = false,
  hideTitle = false
}: TeasingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <motion.div
        onClick={() => setIsExpanded(true)}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "w-full h-full bg-white rounded-[3rem] shadow-2xl shadow-black/10 overflow-hidden flex flex-col border border-white/50 relative cursor-pointer outline-none select-none",
          "touch-none", // Prevent scroll interference during drag
          className
        )}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {/* Unified Image Section - 55-60% height */}
        {!hideImage && (
          <div className="relative h-[55%] md:h-[60%] w-full overflow-hidden">
             <div className="w-full h-full">
               <Image 
                 src={image} 
                 alt={title} 
                 fill 
                 className="object-cover pointer-events-none"
                 priority
                 draggable={false}
               />
             </div>
             {/* Fade into content is now handled by overlap, but keeping a subtle shadow */}
             <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
 
        {/* Unified Content Section - Overlapping for Premium look */}
        <div className={cn(
          "px-8 md:px-10 flex-1 flex flex-col items-center text-center justify-between bg-white rounded-t-[3rem] z-10",
          !hideImage && "mt-[-40px] shadow-[0_-20px_40px_rgba(0,0,0,0.05)]",
          hideImage ? "py-20 md:py-24 space-y-12" : "py-8 md:py-10"
        )}>
           <div className="flex flex-col items-center space-y-3 md:space-y-4">
             {/* Unified Badge (Header) - Orange Gold */}
             <span className="text-amber-600 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em]">
               {subtitle}
             </span>
             
             {/* Title - Bold Serif Look */}
             {!hideTitle && (
               <h3 className="text-2xl md:text-4xl font-display font-black text-[#1A1A1A] leading-tight">
                 {title}
               </h3>
             )}
           </div>
           
           {/* Bio/Poetry - Italic Serif */}
           <p className={cn(
             "text-gray-500 font-serif italic mx-auto",
             hideImage ? "text-lg md:text-2xl max-w-md leading-[1.8] md:leading-[2]" : "text-sm md:text-base max-w-[260px] md:max-w-[280px] leading-relaxed"
           )}>
             "{text}"
           </p>
 
           {/* Call to Action - Minimalist */}
           <div className="flex items-center gap-2 opacity-30 pt-2 md:pt-4">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-amber-500" />
              <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Cliquer pour explorer
              </span>
           </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            layoutId={`card-${id}`}
            className="fixed inset-0 z-50 bg-[#F9F9F7] flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar"
          >
            {/* Action Bar (Top) */}
            <div className="sticky top-0 z-50 flex justify-end p-6 pointer-events-none">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="w-12 h-12 rounded-full bg-white/50 backdrop-blur flex items-center justify-center hover:bg-white transition-all shadow-lg active:scale-95 pointer-events-auto"
              >
                <X className="w-6 h-6 text-gray-900" />
              </button>
            </div>

            <div className="flex-1 w-full flex flex-col">
               {/* Transformed Hero Image */}
               <div className="relative h-[40vh] w-full max-w-4xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl mb-12">
                  <motion.div 
                    layoutId={`image-${id}`}
                    className="w-full h-full"
                  >
                    <Image 
                      src={image} 
                      alt={title} 
                      fill 
                      className="object-contain"
                    />
                  </motion.div>
               </div>

               {/* Expanded Content from Props */}
               <div className="w-full max-w-4xl mx-auto px-6 pb-20">
                  {expandedContent(() => setIsExpanded(false))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
