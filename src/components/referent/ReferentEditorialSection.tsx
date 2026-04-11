"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import PremiumImage from "../ui/PremiumImage";
import UnifiedMediaModal from "../ui/UnifiedMediaModal";

interface ReferentEditorialSectionProps {
  title: string;
  videoUrl?: string | null;
  imageUrl?: string | null;
  text?: string | null;
  index: number;
}

/**
 * ReferentEditorialSection - Layout "Le Diptyque Visuel".
 * - Grille : Photo (Gauche) / Vidéo (Droite) en 4/3 sur Desktop.
 * - Interaction : Lightbox pour les photos, Modale pour les vidéos.
 * - Texte : Pleine largeur en dessous.
 */
export default function ReferentEditorialSection({
  title,
  videoUrl,
  imageUrl,
  text,
  index,
}: ReferentEditorialSectionProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "photo" | "video";
    url: string | null;
  }>({
    isOpen: false,
    type: "photo",
    url: null,
  });

  const openPhoto = () => setModalState({ isOpen: true, type: "photo", url: imageUrl || null });
  const openVideo = () => setModalState({ isOpen: true, type: "video", url: videoUrl || null });
  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  // Masquer si aucun média n'est présent
  if (!videoUrl && !imageUrl && !text) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className="w-full flex flex-col"
    >
      {/* 1. Titre de Section (Design Beaux-Arts) */}
      <h3 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-10 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {title}
      </h3>

      {/* 2. Grille de Médias (Le Diptyque) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10">
        
        {/* Colonne Gauche : Photo (Lightbox) */}
        <div className="relative group overflow-hidden rounded-2xl shadow-sm bg-gray-50 flex items-center justify-center">
          <PremiumImage 
            src={imageUrl} 
            alt={title} 
            aspectRatio="4/3"
            onClick={openPhoto}
            className="w-full h-full hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        {/* Colonne Droite : Vidéo (Modale) */}
        <div 
          className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-black group cursor-pointer"
          onClick={openVideo}
        >
          {imageUrl || videoUrl ? (
            <>
              <img
                src={videoUrl ? `https://img.youtube.com/vi/${videoUrl.split('/').pop()?.split('?')[0]}/maxresdefault.jpg` : imageUrl || ""}
                alt={`${title} video thumbnail`}
                className="w-full h-full object-cover opacity-60 group-hover:scale-[1.05] transition-transform duration-700 brightness-75"
                onError={(e) => {
                  e.currentTarget.src = imageUrl || "https://images.unsplash.com/photo-1492138786312-3004a408e063?auto=format&fit=crop&w=800";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl"
                >
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1" />
                </motion.div>
              </div>
            </>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900">
               Vidéo non disponible
             </div>
          )}
        </div>
      </div>

      {/* 3. Texte Descriptif */}
      {text && (
        <div className="w-full">
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light opacity-90 text-balance">
            {text}
          </p>
        </div>
      )}

      {/* 4. Modal Unifié */}
      <UnifiedMediaModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        url={modalState.url}
        title={title}
      />
    </motion.section>
  );
}
