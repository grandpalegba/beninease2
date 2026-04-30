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
              {/* Carte Unique */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(index * 0.1, 0.5), duration: 0.5 }}
                className="w-full max-w-[360px] aspect-[4/5] relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-neutral-900 mb-8 flex flex-col"
              >
                <img 
                  src={serie.affiche_url || "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5"} 
                  alt={serie.titre}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 pointer-events-none" />
                
                <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white text-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-3">Série • Épisode 1</span>
                  <h3 className="text-3xl font-black mb-4 leading-tight tracking-tight drop-shadow-lg">
                    {serie.titre}
                  </h3>
                  <p className="text-sm font-light text-white/90 line-clamp-4 leading-relaxed drop-shadow">
                    {serie.synopsis || "Une collection d'histoires immersives à découvrir sans plus attendre."}
                  </p>
                </div>
              </motion.div>

              {/* Bouton centré en dessous */}
              <Link 
                href="/histoires/explorer"
                className="pointer-events-auto flex items-center justify-center gap-3 bg-black text-white px-10 py-5 rounded-full shadow-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95"
              >
                Explorer les histoires
                <ArrowRight size={16} />
              </Link>
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
