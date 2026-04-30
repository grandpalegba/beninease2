"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
            {/* Conteneur Centre de la Carte et du Bouton */}
            <div className="flex flex-col items-center justify-center w-full max-w-[950px]">
              {/* Carte Horizontale Plus Haute pour Image Entiere */}
              <motion.div 
                onTap={() => router.push("/histoires/explorer")}
                className="w-full h-[380px] sm:h-[580px] relative rounded-[3rem] overflow-hidden shadow-2xl bg-white flex flex-row transition-transform active:scale-[0.98]"
              >
                {/* Côté Gauche : Affiche (50% pour visibilité totale) */}
                <div className="w-[50%] h-full overflow-hidden bg-gray-100 shrink-0">
                  <img 
                    src={serie.affiche_url || "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5"} 
                    alt={serie.titre}
                    className="w-full h-full object-cover"
                    draggable={false}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5";
                    }}
                  />
                </div>
                
                {/* Côté Droit : Contenu Typographique */}
                <div className="w-[50%] p-6 sm:p-14 flex flex-col justify-center text-left overflow-y-auto hide-scrollbar pointer-events-none">
                  <h3 className="text-2xl sm:text-5xl font-black mb-2 sm:mb-4 leading-tight tracking-[0.05em] text-gray-900 uppercase">
                    {serie.titre}
                  </h3>
                  
                  {serie.sous_titre && (
                    <p className="text-sm sm:text-2xl font-bold italic text-gray-900 mb-6 sm:mb-10 leading-tight">
                      {serie.sous_titre}
                    </p>
                  )}
                  
                  <div className="w-12 sm:w-20 h-0.5 sm:h-1 bg-[#008751] mb-6 sm:mb-10 rounded-full opacity-30 shrink-0" />

                  <p className="text-[11px] sm:text-xl font-normal text-gray-500 leading-relaxed">
                    {serie.synopsis}
                  </p>
                </div>
              </motion.div>

              {/* Bouton EXPLORER LES HISTOIRES */}
              <div className="shrink-0 mt-10 sm:mt-16">
                <Link 
                  href="/histoires/explorer"
                  className="flex items-center justify-center bg-black text-white px-12 sm:px-24 py-5 sm:py-8 rounded-full shadow-2xl font-bold text-[11px] sm:text-[15px] uppercase tracking-[0.3em] transition-transform hover:scale-105 active:scale-95"
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
