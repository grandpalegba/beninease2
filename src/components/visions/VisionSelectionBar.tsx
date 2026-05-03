"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisionsStore, BASE_PRICE } from '@/store/visions';
import { X, Check, MapPin, Lock } from 'lucide-react';

export const VisionSelectionBar = () => {
  const { selectedCells, cells, setSelectedCells, setIsPanelOpen, isPanelOpen } = useVisionsStore();

  if (selectedCells.length === 0 || isPanelOpen) return null;

  // Calculate selection dimensions
  const minX = Math.min(...selectedCells.map(c => c.x));
  const maxX = Math.max(...selectedCells.map(c => c.x));
  const minY = Math.min(...selectedCells.map(c => c.y));
  const maxY = Math.max(...selectedCells.map(c => c.y));
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  // Check if any selected cell is locked
  const hasLock = selectedCells.some(c => {
    const key = `${c.x}-${c.y}`;
    return cells[key]?.isLocked;
  });

  // Calculate total price (free if it was a lock that got broken? no, price is handled in store)
  const totalPrice = selectedCells.reduce((acc, curr) => {
    const cellData = cells[`${curr.x}-${curr.y}`];
    return acc + (cellData?.price ?? BASE_PRICE);
  }, 0);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[250] w-[90%] max-w-lg"
      >
        <div className="bg-white border border-zinc-100 rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 pl-2">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white">
              {hasLock ? <Lock size={20} /> : <MapPin size={20} />}
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Territoire {width}×{height}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-zinc-950 font-black text-lg">{selectedCells.length}</span>
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-tighter">cellules</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedCells([])}
              className="p-3 text-zinc-300 hover:text-zinc-950 transition-colors"
            >
              <X size={20} />
            </button>
            
            {hasLock ? (
              <div className="bg-zinc-100 text-zinc-400 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                <Lock size={14} />
                <span>Zone Verrouillée</span>
              </div>
            ) : (
              <button 
                onClick={() => setIsPanelOpen(true)}
                className="bg-zinc-950 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-black/10"
              >
                <span>{totalPrice}€</span>
                <div className="h-4 w-px bg-white/10 mx-1" />
                <Check size={14} />
                <span>Libérer</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
