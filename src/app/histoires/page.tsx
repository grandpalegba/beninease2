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
    <div className="min-h-[100dvh] w-full bg-white flex flex-col pt-12 pb-24 overflow-hidden relative font-sans">
      
      {/* Header */}
      <div className="px-6 mb-8 mt-12 shrink-0">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#1a1a1a] mb-2">
          Séries
        </h1>
        <p className="text-neutral-400 text-sm md:text-base font-light">
          Découvrez les différentes collections de nos histoires immersives.
        </p>
      </div>

      {/* Lateral Swipe Carousel */}
      <div className="flex-1 w-full flex flex-col justify-center min-h-0">
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-8 pt-4 hide-scrollbar items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {series.map((serie, index) => (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              key={serie.id} 
              className="snap-center shrink-0 w-[80vw] max-w-[320px] aspect-[4/5] relative rounded-[2rem] overflow-hidden shadow-xl bg-neutral-100 group"
            >
              <img 
                src={serie.affiche_url || "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5"} 
                alt={serie.titre}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 w-full p-6 text-white pointer-events-none flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-2">Série</span>
                <h3 className="text-2xl font-black mb-3 leading-tight tracking-tight">
                  {serie.titre}
                </h3>
                <p className="text-sm font-light text-white/80 line-clamp-3 leading-relaxed">
                  {serie.synopsis || "Une collection d'histoires immersives à découvrir sans plus attendre."}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-0 w-full flex justify-center px-6 pointer-events-none z-50">
        <Link 
          href="/histoires/explorer"
          className="pointer-events-auto flex items-center justify-center gap-3 bg-black text-white px-8 py-5 rounded-full shadow-2xl font-bold text-[11px] uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95"
        >
          Explorer les histoires
          <ArrowRight size={16} />
        </Link>
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
