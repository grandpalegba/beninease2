"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisionsStore } from '@/store/visions';
import { X, User, MapPin } from 'lucide-react';

export const VisionDetailModal = () => {
  const { viewingVision, setViewingVision } = useVisionsStore();

  if (!viewingVision) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setViewingVision(null)}
        className="fixed inset-0 z-[500] bg-white/90 backdrop-blur-xl flex items-center justify-center p-6 md:p-10"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-white rounded-[2rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={() => setViewingVision(null)}
            className="absolute top-6 right-6 z-10 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <X size={20} className="text-zinc-950" />
          </button>

          {/* Media Section */}
          <div className="w-full md:w-[60%] aspect-square bg-zinc-100">
            {viewingVision.type === 'video' ? (
              <video 
                src={viewingVision.contentUrl}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={viewingVision.contentUrl}
                alt={viewingVision.label}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                   <div className="h-px w-8 bg-zinc-950" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Vision Libérée</p>
                </div>
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950 leading-[0.95]">
                  {viewingVision.label}
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-950 border border-zinc-100">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Propriétaire</p>
                    <p className="font-bold text-zinc-950">{viewingVision.ownerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-950 border border-zinc-100">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Coordonnées</p>
                    <p className="font-bold text-zinc-950">X:{viewingVision.x} Y:{viewingVision.y}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
