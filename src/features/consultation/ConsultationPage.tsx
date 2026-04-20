'use client';

import React, { useState } from 'react';
import { useLifeCases } from './useLifeCases';
import SandMatrix from '@/components/SandMatrix';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';

/**
 * ConsultationPage - White Minimalist Experience
 * 
 * Orchestrates the full consultation flow from Case Selection to Matrix Reveal 
 * and final Wisdom Transmission.
 */
export default function ConsultationPage() {
  const { cases, loading, error } = useLifeCases();
  const [isCompleted, setIsCompleted] = useState(false);

  // Success Screen - White Minimalist
  if (isCompleted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="mb-8 flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle2 size={80} className="text-[#00693e] stroke-[1px]" />
            </motion.div>
          </div>
          
          <h2 className="text-4xl font-serif mb-6 text-black">Session Terminée</h2>
          <p className="text-lg font-light text-neutral-500 leading-relaxed mb-12">
            Votre sagesse a été capturée et transmise. Elle fait désormais partie 
            de la mémoire collective de BeninEase.
          </p>

          <div className="flex flex-col gap-4">
            <Link 
              href="/"
              className="flex items-center justify-center gap-3 bg-[#00693e] text-white py-5 rounded-2xl font-bold text-xs tracking-[0.2em] shadow-lg shadow-[#00693e]/20 transition-all hover:scale-[1.02]"
            >
              RETOURNER À L'ACCUEIL
              <ArrowRight size={16} />
            </Link>
            <button 
              onClick={() => setIsCompleted(false)}
              className="flex items-center justify-center gap-3 bg-neutral-50 text-neutral-500 py-5 rounded-2xl font-bold text-xs tracking-[0.2em] transition-all hover:bg-neutral-100"
            >
              NOUVELLE CONSULTATION
              <RotateCcw size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-[#00693e] border-solid rounded-full animate-spin"></div>
          <h1 className="text-sm font-light tracking-[0.3em] text-neutral-400 uppercase">
            Initialisation...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-8">
        <div className="max-w-xs text-center">
          <p className="text-xs font-light text-neutral-500 leading-relaxed">
            Désolé, une erreur est survenue lors du chargement de l'expérience. 
          </p>
          <button onClick={() => window.location.reload()} className="mt-4 text-[10px] underline tracking-widest text-[#00693e] font-bold">
            RÉESSAYER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans antialiased overflow-hidden">
      {/* Header */}
      <header className="pt-12 pb-6 px-8 sm:px-16 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif text-black mb-2">
            Sagesses du Bénin
          </h1>
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#00693e]/30"></span>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#00693e] font-bold">
              Expérience Divinatoire
            </p>
          </div>
        </div>
        <div className="hidden lg:flex gap-1">
          <span className="w-2 h-2 rounded-full bg-[#008751]" />
          <span className="w-2 h-2 rounded-full bg-[#fcd116]" />
          <span className="w-2 h-2 rounded-full bg-[#e8112d]" />
        </div>
      </header>

      {/* Experience Stage */}
      <main className="flex-1 px-6 pb-12 pt-4">
        <SandMatrix onComplete={() => setIsCompleted(true)} />
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>

      {/* Debug Simulation Trigger (Only in Dev) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-[100] opacity-10 hover:opacity-100 transition-opacity">
          <button 
            onClick={async () => {
              const { simulateFullConsultation } = await import('./testConsultation');
              const result = await simulateFullConsultation();
              if (result.success) setIsCompleted(true);
            }}
            className="px-3 py-1 bg-black text-white text-[8px] rounded font-mono"
          >
            DEBUG: SIMULATE CYCLE
          </button>
        </div>
      )}
    </div>
  );
}
