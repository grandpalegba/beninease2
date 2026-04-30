"use client";

import { useSeries } from "@/hooks/useSeries";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SeriesHistoiresPage() {
  const { series, loading, error, refetch } = useSeries();

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
        <h2 className="text-xl font-bold mb-2">Oups !</h2>
        <button onClick={refetch} className="text-[#00693e] font-bold hover:underline">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-white flex flex-col overflow-hidden relative font-sans">
      
      {/* Lateral Swipe Carousel */}
      <div className="flex-1 w-full flex flex-col relative h-full">
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory w-full h-full hide-scrollbar items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {series.map((serie, index) => (
            <div 
              key={serie.id} 
              className="w-full h-full shrink-0 snap-center flex flex-col items-center justify-center px-6 pb-20 pt-8"
            >
              {/* Carte Unique - Modèle ProfileCard Premium */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(index * 0.1, 0.5), duration: 0.5 }}
                className="w-full max-w-[360px] aspect-[4/5] relative rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-100 flex flex-col"
              >
                {/* Affiche avec masque dégradé (Modèle ProfileCard) */}
                <div className="absolute inset-0 w-full h-[60%] overflow-hidden bg-gray-50">
                  <img 
                    src={serie.affiche_url || "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5"} 
                    alt={serie.titre}
                    className="w-full h-full object-cover"
                    style={{ maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)" }}
                  />
                </div>
                
                {/* Contenu : Titre, Sous-titre, Synopsis */}
                <div className="mt-auto p-8 relative z-10 flex flex-col text-left">
                  <h3 className="text-3xl font-black mb-1 leading-tight tracking-tighter text-gray-900">
                    {serie.titre}
                  </h3>
                  {serie.sous_titre && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#008751] mb-4">
                      {serie.sous_titre}
                    </p>
                  )}
                  <p className="text-sm font-light text-gray-500 line-clamp-3 leading-relaxed">
                    {serie.synopsis}
                  </p>
                </div>
              </motion.div>

              {/* Bouton centré en dessous */}
              <div className="mt-8">
                <Link 
                  href="/histoires/explorer"
                  className="flex items-center justify-center bg-black text-white px-10 py-5 rounded-full shadow-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95"
                >
                  Explorer les histoires
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global CSS for hide-scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
