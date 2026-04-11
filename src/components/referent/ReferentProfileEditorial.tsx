"use client";

import React, { useRef, useState } from "react";
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
 * ReferentProfileEditorial - Design "V" Asymétrique Haute-Couture.
 * - Header : Portrait 4/5 à gauche, Info à droite (Casse Mixte, font-light).
 * - Mur de Médias : Grille 2x4 en damier (Strict 2 colonnes sur mobile).
 * - Épure : Pas d'icônes sur les boutons, pas de texte narratif.
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

  // 1. Extraction des 8 Médias (4 Photos, 4 Vidéos)
  const photos = [
    { url: ambassadeur.photo_qui_je_suis, alt: "Portrait" },
    { url: ambassadeur.photo_histoire, alt: "Histoire" },
    { url: ambassadeur.photo_expertise || ambassadeur.photo_services, alt: "Expertise" },
    { url: ambassadeur.photo_pourquoi, alt: "Engagement" },
  ].filter(p => p.url);

  const videos = [
    { url: ambassadeur.video_qui_je_suis, alt: "Présentation" },
    { url: ambassadeur.video_histoire, alt: "Récit" },
    { url: ambassadeur.video_expertise || ambassadeur.video_services, alt: "Services" },
    { url: ambassadeur.video_pourquoi, alt: "Pourquoi" },
  ].filter(v => v.url);

  // 2. Construction du Damier (Photo/Vidéo alternés)
  // L1: P0 V0 | L2: V1 P1 | L3: P2 V2 | L4: V3 P3
  const mediaGrid = [];
  for (let i = 0; i < 4; i++) {
    if (i % 2 === 0) {
      if (photos[i]) mediaGrid.push({ ...photos[i], type: "photo" as const });
      if (videos[i]) mediaGrid.push({ ...videos[i], type: "video" as const });
    } else {
      if (videos[i]) mediaGrid.push({ ...videos[i], type: "video" as const });
      if (photos[i]) mediaGrid.push({ ...photos[i], type: "photo" as const });
    }
  }

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
      <main className="max-w-[1100px] mx-auto px-6 pt-12 md:pt-24 pb-40">
        
        {/* 🎬 HEADER ASYMETRIQUE (Le "V") */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-20 md:mb-32"
        >
          {/* Gauche : Portrait 4/5 */}
          <div className="relative w-full max-w-[420px] mx-auto md:ml-0">
            <PremiumImage 
              src={ambassadeur.avatar_url}
              alt={`${ambassadeur.prenom} ${ambassadeur.nom}`}
              aspectRatio="4/5"
              rounded="3xl"
              className="shadow-md"
            />
          </div>

          {/* Droite : Informations (Casse Mixte, font-light) */}
          <div className="flex flex-col text-left">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#a0412d] mb-4">
              {ambassadeur.categorie}
            </span>

            <h1 className="text-4xl md:text-6xl font-light text-[#1A1A1A] leading-tight mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {ambassadeur.prenom} {ambassadeur.nom}
            </h1>

            {ambassadeur.bio && (
              <p className="text-lg md:text-xl font-light text-gray-500 mb-12 italic border-l-2 border-[#a0412d]/20 pl-6 py-2">
                « {ambassadeur.bio} »
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onVote}
                disabled={isVoting}
                className={cn(
                  "py-4 px-10 text-white rounded-full font-bold uppercase tracking-widest text-[10px] shadow-sm transition-all",
                  isVoting ? "bg-gray-400 cursor-not-allowed" : "bg-[#a0412d] hover:bg-[#8b3827]"
                )}
              >
                {isVoting ? "Soutien..." : "Soutenir ce Référent"}
              </button>
              
              <button
                onClick={scrollToContact}
                className="py-4 px-10 rounded-full border border-gray-200 text-gray-600 font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:shadow-md transition-all"
              >
                Me contacter
              </button>
            </div>
          </div>
        </motion.section>

        {/* 🖼️ LE MUR DE MÉDIAS (Grille 2x4 Damier) */}
        <section className="w-full mb-32">
          <div className="grid grid-cols-2 gap-px bg-white overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/50">
            {mediaGrid.map((item, index) => (
              <MediaTile 
                key={index}
                type={item.type} 
                url={item.url} 
                alt={item.alt} 
                onClick={() => openModal(item.type, item.url!, item.alt)} 
              />
            ))}
          </div>
        </section>

        {/* 📩 FORMULAIRE DE CONTACT (Final Point) */}
        <motion.section 
          ref={contactFormRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-40 w-full pt-32 border-t border-gray-100"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-[#1A1A1A] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Me contacter
              </h2>
              <div className="h-0.5 w-12 bg-[#a0412d]/20 mx-auto" />
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-10" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Nom Complet</label>
                  <input 
                    type="text" 
                    placeholder="Jean Dupont" 
                    className="w-full py-4 px-6 bg-white rounded-2xl border border-gray-100 focus:border-[#a0412d]/50 outline-none transition-all text-gray-700 shadow-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="jean@example.com" 
                    className="w-full py-4 px-6 bg-white rounded-2xl border border-gray-100 focus:border-[#a0412d]/50 outline-none transition-all text-gray-700 shadow-sm" 
                  />
                </div>
              </div>
              <div className="space-y-2 flex flex-col h-full">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Message</label>
                <textarea 
                  placeholder="Décrivez votre projet..." 
                  className="w-full flex-1 py-4 px-6 bg-white rounded-2xl border border-gray-100 focus:border-[#a0412d]/50 outline-none transition-all text-gray-700 resize-none shadow-sm min-h-[160px]" 
                />
              </div>
              <div className="md:col-span-2 flex justify-center mt-4">
                <button
                  className="py-5 px-20 bg-[#a0412d] text-white rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-orange-900/10 hover:bg-[#8b3827] transition-all"
                >
                  Envoyer le message
                </button>
              </div>
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
