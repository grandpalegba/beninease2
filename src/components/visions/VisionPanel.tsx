"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisionsStore } from '@/store/visions';
import { X, CheckCircle2, Shield } from 'lucide-react';

export const VisionPanel = () => {
  const { selectedCells, setSelectedCells, captureCell, isPanelOpen, setIsPanelOpen } = useVisionsStore();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [name, setName] = useState('');

  if (!isPanelOpen || selectedCells.length === 0) return null;

  const handleCapture = () => {
    if (!name) return;
    selectedCells.forEach(c => captureCell(c.x, c.y, name));
    setStep('success');
  };

  const totalPrice = selectedCells.length * 8;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-white shadow-2xl z-[300] flex flex-col font-sans border-l border-zinc-100"
      >
        {/* Header */}
        <div className="p-8 flex items-center justify-between border-b border-zinc-50">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-950">
              Libération
            </h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
              {selectedCells.length} cellules sélectionnées
            </p>
          </div>
          <button 
            onClick={() => {
              setSelectedCells([]);
              setIsPanelOpen(false);
              setStep('details');
            }}
            className="p-2 hover:bg-zinc-50 rounded-full transition-colors text-zinc-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10">
          {step === 'details' ? (
            <div className="space-y-10">
              <div className="p-6 bg-zinc-50 rounded-3xl space-y-4">
                 <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-zinc-100">
                    <Shield size={20} className="text-zinc-950" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-950">Acte de Protection</h3>
                    <p className="text-xs text-zinc-400 mt-1">Inscrivez votre nom pour libérer ce territoire du cadastre colonial et le rendre au patrimoine.</p>
                 </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">Votre Nom / Vision</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Futur du Bénin" 
                  className="w-full p-5 bg-zinc-50 rounded-2xl text-sm border border-transparent focus:border-zinc-200 focus:bg-white focus:ring-0 transition-all outline-none" 
                />
              </div>

              <div className="pt-10">
                <button 
                  onClick={handleCapture}
                  disabled={!name}
                  className="w-full bg-zinc-950 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/10"
                >
                  Payer et Libérer
                  <span className="bg-white/10 px-3 py-1 rounded-full">{totalPrice}€</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-zinc-950 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-12">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-zinc-950">Territoire Libéré</h3>
                <p className="text-zinc-400 mt-3 text-sm leading-relaxed">Votre vision est désormais ancrée dans le patrimoine souverain du Bénin.</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedCells([]);
                  setIsPanelOpen(false);
                  setStep('details');
                }}
                className="px-10 py-5 bg-zinc-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all"
              >
                Continuer l'exploration
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
