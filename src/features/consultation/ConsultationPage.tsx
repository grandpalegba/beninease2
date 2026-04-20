'use client';

import React, { useState } from 'react';
import { useLifeCases } from './useLifeCases';
import { logChoice } from './consultationApi';
import SwipeableCaseDeck from '@/components/SwipeableCaseDeck';

/**
 * ConsultationPage - White Minimalist Experience
 * 
 * Displays a deck of life cases that users can swipe to make choices.
 * Each choice is logged to Supabase via the consultationApi.
 */
export default function ConsultationPage() {
  const { cases, loading, error } = useLifeCases();
  const [lastConsultationId, setLastConsultationId] = useState<string | null>(null);

  /**
   * Handles the choice made by the user during a swipe action.
   * Logs the selection to the database.
   */
  const handleChoice = async (caseId: string, option: string) => {
    try {
      const result = await logChoice(caseId, option);
      if (result && result.id) {
        setLastConsultationId(result.id);
      }
    } catch (err) {
      console.error("Failed to log choice:", err);
    }
  };

  // Loading State - White Minimalist
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <h1 className="text-sm font-light tracking-[0.3em] text-black uppercase animate-pulse">
          Initialisation...
        </h1>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-8">
        <div className="max-w-xs text-center">
          <p className="text-xs font-light text-neutral-500 leading-relaxed">
            Désolé, une erreur est survenue lors du chargement de l'expérience. 
            Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans antialiased overflow-hidden">
      {/* Header - Subtle & Airy */}
      <header className="pt-16 pb-8 px-8 sm:px-16">
        <h1 className="text-3xl font-extralight tracking-tight text-black mb-2">
          Consultation
        </h1>
        <div className="flex items-center gap-3">
          <span className="w-8 h-[1px] bg-black/10"></span>
          <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
            Explorez les cas de vie
          </p>
        </div>
      </header>

      {/* Experience Stage */}
      <main className="flex-1 relative flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm aspect-[4/5] relative">
          <SwipeableCaseDeck 
            cases={cases} 
            onChoice={handleChoice} 
          />
        </div>
      </main>

      {/* Interaction Feedback / Minimalist Footer */}
      <footer className="fixed bottom-0 left-0 w-full h-24 flex flex-col items-center justify-center px-8 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
        {lastConsultationId && (
          <div className="flex items-center gap-2 opacity-40 transition-opacity duration-700">
            <div className="w-1 h-1 rounded-full bg-black"></div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-black">
              Session synchronisée
            </p>
          </div>
        )}
      </footer>

      {/* Decorative Minimalist Accents */}
      <div className="fixed top-0 left-0 w-full h-1 bg-neutral-50"></div>
    </div>
  );
}
