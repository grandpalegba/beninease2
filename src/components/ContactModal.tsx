
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  signName: string;
}

const ContactModal = ({ isOpen, onClose, signName }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Votre message a été envoyé avec succès !");
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/20"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-100"
          >
            <div className="px-8 py-6 flex items-center justify-between border-b border-neutral-50">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">Contacter l'expert</h2>
              <button onClick={onClose} className="p-2 hover:bg-neutral-50 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Sujet</label>
                <div className="w-full p-4 bg-neutral-50 rounded-xl text-sm font-medium text-neutral-600 border border-neutral-100">
                  Consultation sur le signe : {signName}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Nom complet</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Votre nom"
                    className="w-full p-4 bg-neutral-50 rounded-xl text-sm border border-transparent focus:border-neutral-200 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="votre@email.com"
                    className="w-full p-4 bg-neutral-50 rounded-xl text-sm border border-transparent focus:border-neutral-200 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Posez votre question à l'expert..."
                  className="w-full p-4 bg-neutral-50 rounded-xl text-sm border border-transparent focus:border-neutral-200 focus:bg-white transition-all outline-none resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#E8112D] text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#FCD116] hover:text-[#1a1a1a] transition-all"
              >
                {loading ? "Envoi en cours..." : "Envoyer le message"}
                {!loading && <Send size={14} />}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
