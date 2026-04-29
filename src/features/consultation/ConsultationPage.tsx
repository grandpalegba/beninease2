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
 * ConsultationPage - "Sagesses du Bénin"
 * 
 * Layout matching the provided mockups: Title and Selector at the top.
 */
export default function ConsultationPage() {
  const { cases, loading, error } = useLifeCases();
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeView, setActiveView] = useState<View>('matrix');

  // Success Screen
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
          
          <h2 className="text-4xl font-sans mb-6 text-black italic">Session Terminée</h2>
          <p className="text-lg font-light text-neutral-500 leading-relaxed mb-12">
            Votre sagesse a été capturée et transmise. Elle fait désormais partie 
            de la mémoire collective de BeninEase.
          </p>

          <div className="flex flex-col gap-4 px-8">
            <Link 
              href="/"
              className="flex items-center justify-center gap-3 bg-[#00693e] text-white py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
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
          <div className="w-12 h-12 border-t-2 border-[#00693e] border-solid rounded-full animate-spin"></div>
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
          <button onClick={() => window.location.reload()} className="mt-4 text-[10px] underline tracking-widest text-[#00693e] font-bold">
            RÉESSAYER
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="h-[100dvh] bg-white text-foreground font-sans antialiased flex flex-col items-center justify-start overflow-hidden pb-20">
      {/* Title Section */}
      <div className="w-full text-center shrink-0 z-10 pt-8">

        {/* Tab Selector - Pill Style */}
        <div className="bg-[#f0f1f1] p-1 rounded-full flex gap-1 shadow-none mx-auto w-fit">
          <button
            onClick={() => setActiveView('matrix')}
            className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-[0.05em] transition-all ${
              activeView === 'matrix' 
                ? 'bg-[#1a1a1a] text-white' 
                : 'text-[#666] hover:text-[#1a1a1a]'
            }`}
          >
            Cas pratiques
          </button>
          <button
            onClick={() => setActiveView('wall')}
            className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-[0.05em] transition-all ${
              activeView === 'wall' 
                ? 'bg-[#1a1a1a] text-white' 
                : 'text-[#666] hover:text-[#1a1a1a]'
            }`}
          >
            Mur des consultations
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full max-w-7xl px-4 md:px-12 flex-1 flex items-center justify-center min-h-0 mt-4">
        <AnimatePresence mode="wait">
          {activeView === 'matrix' ? (
            <motion.div 
              key="matrix"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <SandMatrix onComplete={() => setIsCompleted(true)} />
            </motion.div>
          ) : (
            <motion.div 
              key="wall"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <SynchronicityWall />
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Debug Trigger */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-[100] opacity-5 hover:opacity-100 transition-opacity">
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
