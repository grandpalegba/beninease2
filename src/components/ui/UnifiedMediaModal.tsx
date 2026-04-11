"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface UnifiedMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "photo" | "video";
  url: string | null;
  title?: string;
}

export default function UnifiedMediaModal({
  isOpen,
  onClose,
  type,
  url,
  title,
}: UnifiedMediaModalProps) {
  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Extract YouTube ID
  const getYouTubeId = (rawUrl: string | null) => {
    if (!rawUrl) return null;
    const match = rawUrl.match(/(?:youtube\.com\/embed\/|watch\?v=|youtu\.be\/|watch\?.*v=)([^?&]+)/);
    return match ? match[1] : rawUrl.split('/').pop() || null;
  };

  const id = type === "video" ? getYouTubeId(url) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
          />

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Content Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-[105] w-full max-w-5xl h-full flex items-center justify-center pointer-events-none"
          >
            {type === "photo" && url && (
              <div className="relative w-full h-full flex items-center justify-center p-2 md:p-8">
                <img
                  src={url}
                  alt={title || "Media preview"}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-auto"
                />
              </div>
            )}

            {type === "video" && id && (
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl pointer-events-auto">
                <iframe
                  src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
                  title={title || "Video player"}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
