"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableCardProps {
  preview: React.ReactNode;
  expandedContent: React.ReactNode;
  className?: string;
}

export default function ExpandableCard({ preview, expandedContent, className }: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Preview Card */}
      <motion.div
        layout
        className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100 flex flex-col"
      >
        <div className="relative flex-1">
          {preview}
          
          {/* Action Button */}
          <button
            onClick={() => setIsExpanded(true)}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#008751] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform z-10"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </motion.div>

      {/* Expanded Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#F9F9F7]"
          >
            {/* Header / Close Button */}
            <div className="sticky top-0 w-full p-4 flex justify-between items-center bg-[#F9F9F7]/80 backdrop-blur-md border-b">
              <span className="font-display text-xl font-bold text-[#008751]">Détails</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-12 lg:p-24">
              <div className="max-w-4xl mx-auto">
                {expandedContent}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
