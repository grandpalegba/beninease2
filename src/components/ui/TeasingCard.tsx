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
          "w-full h-full bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden flex flex-col border border-white relative cursor-pointer",
          className
        )}
      >
        {/* Teasing Image */}
        <div className="relative h-[65%] w-full">
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

        {/* Teasing Content */}
        <div className="p-8 flex-1 flex flex-col items-center text-center space-y-4">
           <div className="space-y-1">
             <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">
               {subtitle}
             </span>
             <h3 className="text-3xl font-display font-black text-gray-900 leading-tight">
               {title}
             </h3>
           </div>
           
           <p className="text-sm text-gray-400 font-serif italic leading-relaxed max-w-[250px] line-clamp-3">
             "{text}"
           </p>

           <div className="pt-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Cliquer pour explorer</span>
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
