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
        {/* Image Section - 75% height for a tall, elegant look (image_21.png style) */}
        {!hideImage && (
          <div className="relative h-[75%] w-full overflow-hidden">
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
             {/* Deep Soft White Fade at bottom of image to merge with white content */}
             <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
          </div>
        )}
 
        {/* Content Section - Compact at bottom for image dominance */}
        <div className={cn(
          "px-8 md:px-10 flex-1 flex flex-col items-center text-center justify-between bg-white relative z-20",
          hideImage ? "py-24 space-y-12" : "py-10"
        )}>
           <div className="flex flex-col items-center space-y-4">
             {/* Category - Orange Gold */}
             <span className="text-amber-600 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">
               {subtitle}
             </span>
             
             {/* Name - Bold Serif Look */}
             {!hideTitle && (
               <h3 className="text-3xl md:text-44xl font-display font-black text-[#1A1A1A] leading-tight">
                 {title}
               </h3>
             )}
           </div>
           
           {/* Bio/Slogan - Italic Serif */}
           <p className={cn(
             "text-gray-500 font-serif italic mx-auto",
             hideImage ? "text-xl md:text-2xl max-w-md leading-[1.8] md:leading-[2]" : "text-base max-w-[280px] leading-relaxed"
           )}>
             "{text}"
           </p>
 
           {/* Minimalist CTA */}
           <div className="flex items-center gap-2 opacity-30 pt-4">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
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
