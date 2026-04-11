"use client";

import React, { useRef, useState } from "react";
import { Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import MediaTile from "./MediaTile";
import PremiumImage from "../ui/PremiumImage";
import UnifiedMediaModal from "../ui/UnifiedMediaModal";

interface ReferentProfileEditorialProps {
  ambassadeur: any;
  votes: number;
  onVote: () => void;
  onShare: () => void;
  isVoting?: boolean;
}

/**
 * ReferentProfileEditorial - Design "Mur de Médias 2x2" Premium.
 * - Galerie : Mosaïque continue, photos à gauche, vidéos à droite.
 * - Récit : Texte narratif unique avec espacement généreux.
 * - Sécurisation : stopPropagation sur les médias.
 */
export default function ReferentProfileEditorial({
  ambassadeur,
  votes,
  onVote,
  onShare,
  isVoting = false,
}: ReferentProfileEditorialProps) {
  const contactFormRef = useRef<HTMLDivElement>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "photo" | "video";
    url: string | null;
    title?: string;
  }>({
    isOpen: false,
    type: "photo",
    url: null,
  });

  // 1. Extraction des Médias (Photos à Gauche, Vidéos à Droite)
  const photos = [
    { url: ambassadeur.photo_qui_je_suis, alt: "Qui je suis" },
    { url: ambassadeur.photo_histoire, alt: "Mon histoire" },
  ].filter(p => p.url);

  const videos = [
    { url: ambassadeur.video_qui_je_suis || ambassadeur.video_expertise, alt: "Expertise" },
    { url: ambassadeur.video_histoire || ambassadeur.video_pourquoi, alt: "Pourquoi moi" },
  ].filter(v => v.url);

  // 2. Extraction du Texte Narratif
  const narrativeTexts = [
    ambassadeur.texte_qui_je_suis || ambassadeur.bio_qui_je_suis,
    ambassadeur.texte_histoire || ambassadeur.bio_histoire,
    ambassadeur.texte_expertise || ambassadeur.bio_expertise || ambassadeur.description_services,
    ambassadeur.texte_pourquoi || ambassadeur.bio_pourquoi,
  ].filter(Boolean);

  const openModal = (type: "photo" | "video", url: string, title: string) => {
    setModalState({ isOpen: true, type, url, title });
  };

  const closeModal = () => setModalState({ ...modalState, isOpen: false });
  const scrollToContact = () => contactFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div 
      className="w-full bg-[#faf9f8] font-manrope selection:bg-[#a0412d]/10 overflow-x-hidden min-h-screen"
      onContextMenu={(e) => e.preventDefault()}
    >
      <main className="max-w-[1200px] mx-auto px-6 pt-12 md:pt-24 pb-40">
        
        {/* 🎬 HERO SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col items-center text-center mb-24 md:mb-32"
        >
          <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] mb-12 mx-auto">
            <PremiumImage 
              src={ambassadeur.avatar_url}
              alt={`${ambassadeur.prenom} ${ambassadeur.nom}`}
              aspectRatio="square"
              className="shadow-sm"
            />
          </div>

          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#a0412d] mb-6">
            {ambassadeur.categorie}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] uppercase tracking-tight leading-tight mb-10 max-w-3xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {ambassadeur.prenom} {ambassadeur.nom}
          </h1>

          <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-lg mx-auto">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onVote}
              disabled={isVoting}
              className={cn(
                "w-full md:flex-1 py-4 px-8 text-white rounded-full font-bold uppercase tracking-widest text-[10px] shadow-sm transition-all",
                isVoting ? "bg-gray-400 cursor-not-allowed" : "bg-[#a0412d] hover:bg-[#8b3827]"
              )}
            >
              {isVoting ? "Chargement..." : "Soutenir ce Référent"}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={scrollToContact}
              className="w-full md:flex-1 py-4 px-8 rounded-full border border-[#a0412d]/30 text-[#a0412d] font-bold uppercase tracking-widest text-[10px] hover:bg-[#a0412d]/5 transition-all"
            >
              Me contacter
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onShare}
              className="w-full md:w-auto p-4 rounded-full border border-gray-200 text-gray-400 hover:text-[#a0412d] transition-all flex items-center justify-center"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.section>

        {/* 🖼️ LE MUR DE MÉDIAS (Galerie 2x2) */}
        <section className="w-full mb-32">
          <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl bg-black">
            {/* Colonne Gauche (Photos) */}
            <div className="flex flex-col">
              {photos[0] && (
                <MediaTile 
                  type="photo" 
                  url={photos[0].url} 
                  alt={photos[0].alt} 
                  onClick={() => openModal("photo", photos[0].url, photos[0].alt)} 
                />
              )}
              {photos[1] && (
                <MediaTile 
                  type="photo" 
                  url={photos[1].url} 
                  alt={photos[1].alt} 
                  onClick={() => openModal("photo", photos[1].url, photos[1].alt)} 
                />
              )}
            </div>

            {/* Colonne Droite (Vidéos) */}
            <div className="flex flex-col">
              {videos[0] && (
                <MediaTile 
                  type="video" 
                  url={videos[0].url} 
                  alt={videos[0].alt} 
                  onClick={() => openModal("video", videos[0].url, videos[0].alt)} 
                />
              )}
              {videos[1] && (
                <MediaTile 
                  type="video" 
                  url={videos[1].url} 
                  alt={videos[1].alt} 
                  onClick={() => openModal("video", videos[1].url, videos[1].alt)} 
                />
              )}
            </div>
          </div>
        </section>

        {/* 📖 LE RÉCIT (Texte Narratif) */}
        <section className="max-w-3xl mx-auto py-20">
          <div className="space-y-12">
            {narrativeTexts.map((paragraph, idx) => (
              <p 
                key={idx} 
                className="text-lg md:text-xl text-gray-700 leading-relaxed font-light opacity-90 text-justify md:text-left"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* 📩 CONTACT FORM SECTION */}
        <motion.section 
          ref={contactFormRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-60 w-full pt-24 border-t border-gray-100"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Me contacter
              </h2>
              <p className="text-gray-500 font-light tracking-wide">
                Une question ou un projet ? Envoyez-moi un message directement.
              </p>
            </div>

            <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Nom Complet</label>
                  <input 
                    type="text" 
                    placeholder="Jean Dupont" 
                    className="w-full py-4 px-6 bg-white rounded-2xl border border-gray-100 focus:border-[#a0412d]/50 outline-none transition-all placeholder:text-gray-200 text-gray-700 shadow-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="jean@example.com" 
                    className="w-full py-4 px-6 bg-white rounded-2xl border border-gray-100 focus:border-[#a0412d]/50 outline-none transition-all placeholder:text-gray-200 text-gray-700 shadow-sm" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Message</label>
                <textarea 
                  placeholder="Décrivez votre demande..." 
                  rows={4}
                  className="w-full py-4 px-6 bg-white rounded-2xl border border-gray-100 focus:border-[#a0412d]/50 outline-none transition-all placeholder:text-gray-200 text-gray-700 resize-none shadow-sm" 
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-max mx-auto mt-4 py-5 px-16 bg-[#a0412d] text-white rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-orange-900/10 hover:bg-[#8b3827] transition-all"
              >
                Envoyer le message
              </motion.button>
            </form>
          </div>
        </motion.section>
      </main>

      {/* 4. Modal Unifié */}
      <UnifiedMediaModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        url={modalState.url}
        title={modalState.title}
      />
    </div>
  );
}
