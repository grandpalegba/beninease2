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
}

export default function TeasingCard({
  id,
  image,
  title,
  subtitle,
  text,
  expandedContent,
  className
}: TeasingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <motion.div
        layoutId={`card-${id}`}
        onClick={() => setIsExpanded(true)}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "w-full h-full bg-white rounded-[3rem] shadow-2xl shadow-black/10 overflow-hidden flex flex-col border border-white/50 relative cursor-pointer",
          className
        )}
      >
        {/* Unified Badge (Header) */}
        <div className="absolute top-8 left-0 right-0 z-10 flex justify-center">
           <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#3D2614] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg border border-amber-900/10">
             {subtitle}
           </span>
        </div>

        {/* Unified Image Section */}
        <div className="relative h-[60%] w-full overflow-hidden">
           <motion.div 
             layoutId={`image-${id}`}
             className="w-full h-full"
           >
             <Image 
               src={image} 
               alt={title} 
               fill 
               className="object-cover"
               priority
             />
           </motion.div>
           <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        {/* Unified Content Section */}
        <div className="p-10 flex-1 flex flex-col items-center text-center justify-center space-y-6">
           <h3 className="text-3xl md:text-4xl font-display font-black text-gray-900 leading-tight tracking-tight">
             {title}
           </h3>
           
           <p className="text-base text-gray-500 font-serif italic leading-relaxed max-w-[280px] line-clamp-3">
             "{text}"
           </p>

           <div className="pt-2 flex items-center gap-2 opacity-30">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Explorer</span>
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
