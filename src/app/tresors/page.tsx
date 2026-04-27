"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Tresor {
  id: string;
  nom: string;
  sous_titre: string;
  image_url: string;
  created_at: string;
}

export default function TresorsPage() {
  const [tresors, setTresors] = useState<Tresor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left

  useEffect(() => {
    async function fetchTresors() {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from("tresors_benin")
          .select("*")
          .order("nom", { ascending: true });

        if (supabaseError) throw supabaseError;
        setTresors(data || []);
      } catch (err: any) {
        console.error("Error fetching tresors:", err);
        setError(err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }

    fetchTresors();
  }, []);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = tresors.length - 1;
      if (nextIndex >= tresors.length) nextIndex = 0;
      return nextIndex;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7F2]">
        <Loader2 className="w-10 h-10 animate-spin text-[#008751] mb-4" />
        <p className="text-gray-400 uppercase tracking-widest text-[10px] font-sans font-black">Immersion dans l'histoire...</p>
      </div>
    );
  }

  if (error || tresors.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F9F7F2] font-sans text-center">
        <AlertCircle className="w-12 h-12 text-red-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">
          {error ? "Une erreur est survenue" : "Collection vide"}
        </h2>
        <p className="text-gray-400 mb-8 max-w-xs">
          {error || "Aucun trésor n'a été trouvé dans la collection pour le moment."}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-3 bg-white border border-gray-100 rounded-full text-[#008751] font-bold shadow-sm"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const currentTresor = tresors[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    })
  };

  return (
    <div className="h-screen bg-[#F9F7F2] overflow-hidden flex flex-col items-center justify-center relative px-6">
      
      {/* BACKGROUND DECOR (Optional but premium) */}
      <div className="fixed inset-0 pattern-bg -z-10 opacity-[0.03]"></div>

      {/* NAVIGATION ARROWS (Desktop) */}
      <div className="hidden lg:flex absolute inset-x-12 top-1/2 -translate-y-1/2 justify-between pointer-events-none z-20">
        <button 
          onClick={() => paginate(-1)}
          className="w-16 h-16 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-black hover:scale-110 transition-all pointer-events-auto border border-white"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={() => paginate(1)}
          className="w-16 h-16 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-black hover:scale-110 transition-all pointer-events-auto border border-white"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* IMMERSIVE CARD */}
      <div className="relative w-full max-w-2xl aspect-[4/5] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 500;
              if (swipe) {
                paginate(offset.x > 0 ? -1 : 1);
              }
            }}
            className="absolute w-full h-full bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden cursor-grab active:cursor-grabbing"
          >
            {/* IMAGE SECTION */}
            <div className="relative w-full h-full">
              <Image 
                src={currentTresor.image_url} 
                alt={currentTresor.nom}
                fill
                priority
                className="object-cover select-none pointer-events-none"
                draggable={false}
              />
              
              {/* VIGNETTE GRADIENT */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

              {/* CONTENT BOX (Floating bottom) */}
              <div className="absolute bottom-10 inset-x-10">
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/50">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
                    {currentTresor.nom}
                  </h2>
                  <p className="text-sm md:text-base text-gray-500 font-medium font-sans tracking-tight">
                    {currentTresor.sous_titre}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* COUNTER & NAVIGATION HINT */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
           <div className="h-[1px] w-8 bg-gray-200"></div>
           <p className="text-[12px] font-black text-gray-400 font-sans tracking-[0.4em] uppercase">
             {currentIndex + 1} / {tresors.length}
           </p>
           <div className="h-[1px] w-8 bg-gray-200"></div>
        </div>
        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest hidden md:block">
          Utilisez les flèches ou glissez pour explorer
        </p>
      </div>
    </div>
  );
}
