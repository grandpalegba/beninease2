"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisionsStore, BASE_PRICE } from '@/store/visions';
import { X, ArrowRight, History, MessageCircle, Upload, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VisionCellData } from '@/types/visions';

export const VisionPanel = () => {
  const { selectedCell, cells, selectCell, captureCell } = useVisionsStore();
  const [step, setStep] = useState<'details' | 'upload' | 'success'>('details');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');

  if (!selectedCell) return null;

  const key = `${selectedCell.x}-${selectedCell.y}`;
  const cellData = cells[key];
  const currentPrice = cellData ? cellData.price : BASE_PRICE;
  const capturePrice = cellData ? cellData.price * 2 : BASE_PRICE;

  const handleCapture = () => {
    // Mock capture for now
    const mockNewCell: VisionCellData = {
      x: selectedCell.x,
      y: selectedCell.y,
      ownerName: "Nouvel Explorateur",
      mediaUrl: mediaType === 'photo' ? "https://images.unsplash.com/photo-1531297484001-80022131f5a1" : "",
      mediaType: mediaType,
      whatsappLink: "https://wa.me/22900000000",
      description: "Une nouvelle vision pour le Bénin.",
      price: capturePrice,
      captureCount: (cellData?.captureCount || 0) + 1,
      history: [
        ...(cellData?.history || []),
        { ownerName: cellData?.ownerName || "Initial", price: currentPrice, date: new Date().toLocaleDateString() }
      ]
    };
    
    captureCell(mockNewCell);
    setStep('success');
  };

  return (
    <AnimatePresence>
      {selectedCell && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-white shadow-2xl z-[300] flex flex-col font-sans"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Territoire {selectedCell.x}×{selectedCell.y}</h2>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Localisation dans la Vision</p>
            </div>
            <button 
              onClick={() => {
                selectCell(0, null);
                setStep('details');
              }}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {step === 'details' && (
              <div className="space-y-8">
                {/* Current Owner */}
                {cellData ? (
                  <div className="space-y-6">
                    <div className="aspect-square rounded-3xl overflow-hidden bg-zinc-100 relative shadow-xl">
                      {cellData.mediaType === 'photo' ? (
                        <img src={cellData.mediaUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <video src={cellData.mediaUrl} className="w-full h-full object-cover" controls />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#D4AF37] mb-2">Propriétaire Actuel</h3>
                      <p className="text-xl font-bold">{cellData.ownerName}</p>
                      <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{cellData.description}</p>
                    </div>

                    <a 
                      href={cellData.whatsappLink}
                      target="_blank"
                      className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl text-sm font-bold hover:bg-zinc-100 transition-colors"
                    >
                      <MessageCircle className="text-[#25D366]" size={20} />
                      Contacter via WhatsApp
                    </a>

                    {/* History */}
                    <div className="pt-6 border-t border-zinc-100">
                      <div className="flex items-center gap-2 mb-4">
                        <History size={16} className="text-zinc-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Historique des conquêtes</h4>
                      </div>
                      <div className="space-y-4">
                        {cellData.history.map((h, i) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <span className="font-medium text-zinc-600">{h.ownerName}</span>
                            <span className="font-bold">{h.price}€</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                      <ArrowRight size={32} className="text-zinc-200" />
                    </div>
                    <p className="text-zinc-400 font-medium italic">Ce territoire est encore vierge. Soyez le premier à y inscrire votre vision.</p>
                  </div>
                )}
              </div>
            )}

            {step === 'upload' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tight">Configuration de la Vision</h3>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Type de média</label>
                    <div className="flex gap-4">
                      {['photo', 'video'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setMediaType(type as any)}
                          className={cn(
                            "flex-1 py-3 rounded-xl border-2 font-bold text-xs uppercase tracking-widest transition-all",
                            mediaType === type ? "border-black bg-black text-white" : "border-zinc-100 text-zinc-400"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="aspect-video rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2 text-zinc-400 hover:border-black hover:text-black transition-all cursor-pointer">
                    <Upload size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Choisir un fichier</span>
                  </div>

                  <div className="space-y-4">
                    <input type="text" placeholder="Lien WhatsApp" className="w-full p-4 bg-zinc-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-black transition-all" />
                    <textarea placeholder="Description de votre vision..." className="w-full p-4 bg-zinc-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-black transition-all h-32" />
                  </div>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Conquête Réussie</h3>
                  <p className="text-zinc-500 mt-2">Votre vision est désormais ancrée sur le territoire.</p>
                </div>
                <button 
                  onClick={() => {
                    selectCell(0, null);
                    setStep('details');
                  }}
                  className="px-8 py-4 bg-zinc-100 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          {step !== 'success' && (
            <div className="p-8 border-t border-zinc-100 bg-zinc-50">
              {step === 'details' ? (
                <button 
                  onClick={() => setStep('upload')}
                  className="w-full bg-black text-white py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10"
                >
                  {cellData ? "Conquérir ce territoire" : "Inscrire ma vision"}
                  <span className="bg-white/20 px-3 py-1 rounded-full">{capturePrice}€</span>
                </button>
              ) : (
                <button 
                  onClick={handleCapture}
                  className="w-full bg-black text-white py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Payer et Activer
                  <span className="bg-white/20 px-3 py-1 rounded-full">{capturePrice}€</span>
                </button>
              )}
              <p className="text-[9px] text-center text-zinc-400 mt-4 font-bold uppercase tracking-widest">
                100% des fonds sont reversés au financement du projet
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
