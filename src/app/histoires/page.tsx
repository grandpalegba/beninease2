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
        transition={{ type: "spring", stiffness: 250, damping: 28 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
      >
        {series.map((serie, index) => (
          <div 
            key={serie.id || `serie-${index}`} 
            className="w-full h-full shrink-0 flex flex-col items-center justify-center px-6"
          >
            {/* Carte Entièrement Cliquable */}
            <Link 
              href="/histoires/explorer"
              className="w-full max-w-[400px] sm:max-w-[650px] h-[70vh] sm:h-[400px] relative rounded-[2rem] overflow-hidden shadow-2xl bg-white border border-gray-100 flex flex-col sm:flex-row transition-transform active:scale-[0.98]"
            >
              {/* Image : Haut sur mobile, Gauche sur desktop */}
              <div className="w-full h-[40%] sm:w-[40%] sm:h-full overflow-hidden bg-gray-50 shrink-0 border-b sm:border-b-0 sm:border-r border-gray-50">
                <img 
                  src={serie.affiche_url || "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5"} 
                  alt={serie.titre}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              
              {/* Contenu : Bas sur mobile, Droite sur desktop */}
              <div className="flex-1 p-6 sm:p-10 flex flex-col text-left overflow-y-auto hide-scrollbar">
                <h3 className="text-2xl sm:text-3xl font-black mb-2 leading-tight tracking-[0.05em] text-gray-900 uppercase">
                  {serie.titre}
                </h3>
                
                {serie.sous_titre && (
                  <p className="text-base sm:text-lg font-bold italic text-gray-900 mb-6 leading-snug">
                    {serie.sous_titre}
                  </p>
                )}
                
                <div className="w-10 h-1 bg-[#008751] mb-6 rounded-full opacity-20 shrink-0" />

                <p className="text-sm sm:text-base font-normal text-gray-500 leading-relaxed">
                  {serie.synopsis}
                </p>

                {/* Petite indication visuelle pour le mobile */}
                <div className="mt-auto pt-6 text-[10px] uppercase tracking-widest text-[#008751] font-bold sm:hidden">
                  Appuyer pour explorer
                </div>
              </div>
            </Link>

            {/* Bouton centré en dessous */}
            <div className="shrink-0 mt-8 mb-4">
              <Link 
                href="/histoires/explorer"
                className="flex items-center justify-center bg-black text-white px-12 py-5 rounded-full shadow-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95"
              >
                Explorer les histoires
              </Link>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Indicateur de position élégant */}
      <div className="absolute top-10 left-0 w-full flex justify-center gap-1.5 px-6 pointer-events-none">
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
