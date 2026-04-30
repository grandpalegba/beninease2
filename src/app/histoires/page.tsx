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
            className="w-full h-full shrink-0 flex flex-col items-center justify-center px-4"
          >
            <div className="flex flex-col items-center justify-center w-full max-w-[600px] h-full pt-12 pb-8">
              {/* Carte Unique - Design Paysage (Image sur le côté) */}
              <div 
                className="w-full h-[380px] relative rounded-[2rem] overflow-hidden shadow-2xl bg-white border border-gray-100 flex flex-row mb-8"
              >
                {/* Côté Gauche : Affiche */}
                <div className="w-[40%] h-full overflow-hidden bg-gray-50 shrink-0 border-r border-gray-50">
                  <img 
                    src={serie.affiche_url || "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5"} 
                    alt={serie.titre}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
                
                {/* Côté Droit : Contenu Typographique */}
                <div className="w-[60%] p-6 py-8 flex flex-col text-left overflow-y-auto hide-scrollbar">
                  <h3 className="text-2xl font-black mb-1 leading-tight tracking-[0.05em] text-gray-900 uppercase">
                    {serie.titre}
                  </h3>
                  
                  {serie.sous_titre && (
                    <p className="text-sm font-bold italic text-gray-900 mb-4 leading-snug">
                      {serie.sous_titre}
                    </p>
                  )}
                  
                  <div className="w-8 h-0.5 bg-[#008751] mb-4 rounded-full opacity-20" />

                  <p className="text-xs font-normal text-gray-500 leading-relaxed">
                    {serie.synopsis}
                  </p>
                </div>
              </div>

              {/* Bouton centré en dessous */}
              <div className="shrink-0 mb-4">
                <Link 
                  href="/histoires/explorer"
                  className="flex items-center justify-center bg-black text-white px-12 py-5 rounded-full shadow-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95"
                >
                  Explorer les histoires
                </Link>
              </div>
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
