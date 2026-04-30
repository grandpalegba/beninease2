"use client";

import { useState } from "react";
import { useSeries } from "@/hooks/useSeries";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SeriesHistoiresPage() {
  const { series, loading, error, refetch } = useSeries();
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

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
    const threshold = 30; // Seuil plus bas pour faciliter le swipe à la souris
    const velocityThreshold = 200;
    
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
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
      >
        {series.map((serie, index) => (
          <div 
            key={serie.id || `serie-${index}`} 
            className="w-full h-full shrink-0 flex flex-col items-center justify-center px-4"
          >
            <div className="flex flex-col items-center justify-center w-full max-w-[850px] h-full pt-10 pb-6">
              {/* Carte Horizontale Sans Contour et Plus Haute */}
              <motion.div 
                onTap={() => router.push("/histoires/explorer")}
                className="w-full h-[320px] sm:h-[480px] relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-white flex flex-row transition-transform active:scale-[0.98]"
              >
                {/* Côté Gauche : Affiche (45% pour mieux voir l'image) */}
                <div className="w-[45%] h-full overflow-hidden bg-gray-50 shrink-0">
                  <img 
                    src={serie.affiche_url || "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5"} 
                    alt={serie.titre}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
                
                {/* Côté Droit : Contenu Typographique */}
                <div className="flex-1 p-5 sm:p-12 flex flex-col text-left overflow-y-auto hide-scrollbar pointer-events-none">
                  <h3 className="text-xl sm:text-5xl font-black mb-1 sm:mb-2 leading-tight tracking-[0.05em] text-gray-900 uppercase">
                    {serie.titre}
                  </h3>
                  
                  {serie.sous_titre && (
                    <p className="text-xs sm:text-2xl font-bold italic text-gray-900 mb-4 sm:mb-8 leading-tight">
                      {serie.sous_titre}
                    </p>
                  )}
                  
                  <div className="w-10 sm:w-16 h-0.5 sm:h-1 bg-[#008751] mb-4 sm:mb-8 rounded-full opacity-30 shrink-0" />

                  <p className="text-[10px] sm:text-lg font-normal text-gray-500 leading-relaxed">
                    {serie.synopsis}
                  </p>
                </div>
              </motion.div>

              {/* Bouton EXPLORER LES HISTOIRES */}
              <div className="shrink-0 mt-10 sm:mt-16">
                <Link 
                  href="/histoires/explorer"
                  className="flex items-center justify-center bg-black text-white px-10 sm:px-20 py-4 sm:py-7 rounded-full shadow-2xl font-bold text-[10px] sm:text-[14px] uppercase tracking-[0.3em] transition-transform hover:scale-105 active:scale-95"
                >
                  Explorer les histoires
                </Link>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
