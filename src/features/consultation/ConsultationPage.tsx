'use client';

import React, { useState } from 'react';
import { useLifeCases } from './useLifeCases';
import SandMatrix from '@/components/SandMatrix';
import SynchronicityWall from '@/components/SynchronicityWall';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';

type View = 'matrix' | 'wall';

/**
 * ConsultationPage - "Sagesses du Bénin" Redesign
 * 
 * Ultra-minimalist interface with bottom-heavy layout and horizontal swiping.
 */
export default function ConsultationPage() {
  const { cases, loading, error } = useLifeCases();
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeView, setActiveView] = useState<View>('matrix');

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
          
          <h2 className="text-4xl font-serif mb-6 text-black italic">Session Terminée</h2>
          <p className="text-lg font-light text-neutral-500 leading-relaxed mb-12">
            Votre sagesse a été capturée et transmise. Elle fait désormais partie 
            de la mémoire collective de BeninEase.
          </p>

          <div className="flex flex-col gap-4 px-8">
            <Link 
              href="/"
              className="flex items-center justify-center gap-3 bg-black text-white py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
            >
              Retourner à l'accueil
              <ArrowRight size={14} />
            </Link>
            <button 
              onClick={() => setIsCompleted(false)}
              className="flex items-center justify-center gap-3 bg-neutral-50 text-neutral-400 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-neutral-100"
            >
              Nouvelle consultation
              <RotateCcw size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-t-2 border-black border-solid rounded-full animate-spin"></div>
          <h1 className="text-[10px] font-bold tracking-[0.4em] text-neutral-300 uppercase">
            Initialisation
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
          <button onClick={() => window.location.reload()} className="mt-4 text-[10px] underline tracking-widest text-black font-bold">
            RÉESSAYER
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen flex flex-col-reverse bg-white text-black font-sans antialiased overflow-hidden">
      {/* Header (Bottom) */}
      <footer className="w-full pt-8 pb-16 px-8 flex flex-col items-center gap-8 bg-white z-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-black italic">
            Sagesses du Bénin
          </h1>
        </div>

        {/* Tab Selector - Pill Style */}
        <div className="bg-neutral-100 p-1 rounded-full flex gap-1 shadow-sm">
          <button
            onClick={() => setActiveView('matrix')}
            className={`px-8 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] transition-all ${
              activeView === 'matrix' 
                ? 'bg-white text-black shadow-sm' 
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Matrice des choix
          </button>
          <button
            onClick={() => setActiveView('wall')}
            className={`px-8 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] transition-all ${
              activeView === 'wall' 
                ? 'bg-white text-black shadow-sm' 
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Mur des consultations
          </button>
        </div>
      </footer>

      {/* Zone de Contenu (Center) */}
      <div className="flex-grow relative flex items-center justify-center overflow-hidden py-12">
        <AnimatePresence mode="wait">
          {activeView === 'matrix' ? (
            <motion.div 
              key="matrix"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-7xl px-6"
            >
              <SandMatrix onComplete={() => setIsCompleted(true)} />
            </motion.div>
          ) : (
            <motion.div 
              key="wall"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-7xl px-6"
            >
              <SynchronicityWall />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>

      {/* Debug Simulation Trigger (Only in Dev) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-[100] opacity-5 hover:opacity-100 transition-opacity">
          <button 
            onClick={async () => {
              const { simulateFullConsultation } = await import('./testConsultation');
              const result = await simulateFullConsultation();
              if (result.success) setIsCompleted(true);
            }}
            className="px-3 py-1 bg-black text-white text-[8px] rounded font-mono"
          >
            DEBUG
          </button>
        </div>
      )}
    </main>
  );
}
