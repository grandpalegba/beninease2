"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisionsStore, BASE_PRICE } from '@/store/visions';
import { X, Check, MapPin } from 'lucide-react';

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

  // Calculate total price
  const totalPrice = selectedCells.reduce((acc, curr) => {
    const cellData = cells[`${curr.x}-${curr.y}`];
    const currentPrice = cellData ? cellData.price : BASE_PRICE;
    return acc + (cellData ? currentPrice * 2 : currentPrice);
  }, 0);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[250] w-[90%] max-w-lg"
      >
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 pl-2">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-black">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Zone sélectionnée</p>
              <div className="flex items-baseline gap-2">
                <span className="text-white font-black text-lg">{width}×{height}</span>
                <span className="text-white/40 text-xs font-medium uppercase tracking-tighter">{selectedCells.length} cellules</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedCells([])}
              className="p-3 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <button 
              onClick={() => setIsPanelOpen(true)}
              className="bg-white text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-[#D4AF37] transition-all active:scale-95"
            >
              <span>{totalPrice}€</span>
              <div className="h-4 w-px bg-black/10 mx-1" />
              <Check size={14} />
              <span>Confirmer</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
