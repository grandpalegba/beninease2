"use client";

import { useState } from "react";
import { useSeries } from "@/hooks/useSeries";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SeriesHistoiresPage() {
  const { series, loading, error, refetch } = useSeries();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#00693e] mb-4" />
        <p className="text-gray-400 uppercase tracking-widest text-xs">Chargement...</p>
      </div>
    );
  }

  if (error || series.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">Oups ! {series.length === 0 ? "Aucune série trouvée." : ""}</h2>
        <button onClick={refetch} className="text-[#00693e] font-bold hover:underline">Réessayer</button>
      </div>
    );
  }

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    const velocityThreshold = 500;
    
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      if (currentIndex < series.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-white flex flex-col overflow-hidden relative font-sans touch-none select-none">
      
      {/* Container principal du carrousel avec Framer Motion */}
      <motion.div 
        className="flex-1 w-full flex relative cursor-grab active:cursor-grabbing"
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={handleDragEnd}
        dragTransition={{ power: 0.1, timeConstant: 200 }}
      >
        {series.map((serie, index) => (
          <div 
            key={serie.id || `serie-${index}`} 
            className="w-full h-full shrink-0 flex flex-col items-center justify-center px-4"
          >
            {/* Carte Horizontale Forcee (Design Screenshot) */}
            <div className="flex flex-col items-center justify-center w-full max-w-[800px] h-full pt-20 pb-10">
              <Link 
                href="/histoires/explorer"
                className="w-full h-[280px] sm:h-[400px] relative rounded-[2rem] overflow-hidden shadow-2xl bg-white border border-[#3b82f6] flex flex-row transition-transform active:scale-[0.98]"
              >
                {/* Côté Gauche : Affiche (40%) */}
                <div className="w-[40%] h-full overflow-hidden bg-gray-50 shrink-0 border-r border-gray-100">
                  <img 
                    src={serie.affiche_url || "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5"} 
                    alt={serie.titre}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
                
                {/* Côté Droit : Contenu Typographique (60%) */}
                <div className="flex-1 p-4 sm:p-10 flex flex-col text-left overflow-y-auto hide-scrollbar">
                  <h3 className="text-xl sm:text-4xl font-black mb-1 sm:mb-2 leading-tight tracking-[0.05em] text-gray-900 uppercase">
                    {serie.titre}
                  </h3>
                  
                  {serie.sous_titre && (
                    <p className="text-xs sm:text-xl font-bold italic text-gray-900 mb-3 sm:mb-6 leading-tight">
                      {serie.sous_titre}
                    </p>
                  )}
                  
                  <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-[#008751] mb-3 sm:mb-6 rounded-full opacity-30 shrink-0" />

                  <p className="text-[10px] sm:text-base font-normal text-gray-500 leading-relaxed">
                    {serie.synopsis}
                  </p>
                </div>
              </Link>

              {/* Bouton EXPLORER LES HISTOIRES - Position Equilibrée */}
              <div className="shrink-0 mt-8 sm:mt-12">
                <Link 
                  href="/histoires/explorer"
                  className="flex items-center justify-center bg-black text-white px-10 sm:px-16 py-4 sm:py-6 rounded-full shadow-2xl font-bold text-[10px] sm:text-[13px] uppercase tracking-[0.25em] transition-transform hover:scale-105 active:scale-95"
                >
                  Explorer les histoires
                </Link>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Indicateurs de position en haut (Design Screenshot) */}
      <div className="absolute top-24 sm:top-28 left-0 w-full flex justify-center gap-1.5 px-6 pointer-events-none z-20">
        {series.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-black" : "w-2 bg-gray-200"}`}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
