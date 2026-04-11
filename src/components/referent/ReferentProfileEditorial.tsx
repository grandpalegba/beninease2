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
 * ReferentProfileEditorial - Design "Harmonie Patriotique".
 * - Header : Asymétrique, accent Vert Bénin (#008751), Casse Mixte.
 * - Mur de Médias : 2x4 Damier, Strict 2 colonnes sur mobile.
 * - Contact : Bloc "Carte de Visite" avec inputs soulignés Vert/Jaune.
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
      className="w-full bg-white font-manrope selection:bg-[#008751]/10 overflow-x-hidden min-h-screen"
      onContextMenu={(e) => e.preventDefault()}
    >
      <main className="max-w-[1100px] mx-auto px-6 pt-12 md:pt-24 pb-40">
        
        {/* 🎬 HEADER PATRIO-PREMIUM (Le "V") */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-20 md:mb-32"
        >
          <div className="relative w-full max-w-[420px] mx-auto md:ml-0">
            <PremiumImage 
              src={ambassadeur.avatar_url}
              alt={`${ambassadeur.prenom} ${ambassadeur.nom}`}
              aspectRatio="4/5"
              rounded="3xl"
              className="shadow-md"
            />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#008751] mb-4">
              {ambassadeur.categorie}
            </span>

            <h1 className="text-4xl md:text-6xl font-light text-[#1A1A1A] leading-tight mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {ambassadeur.prenom} {ambassadeur.nom}
            </h1>

            {ambassadeur.bio && (
              <p className="text-lg md:text-xl font-light text-gray-500 mb-12 italic border-l-2 border-[#008751]/10 pl-6 py-2">
                « {ambassadeur.bio} »
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={(e) => { e.stopPropagation(); onVote(); }}
                disabled={isVoting}
                className={cn(
                  "py-4 px-10 text-white rounded-full font-bold uppercase tracking-widest text-[10px] shadow-none transition-all",
                  isVoting ? "bg-gray-300" : "bg-[#008751] hover:bg-[#007043]"
                )}
              >
                {isVoting ? "Soutien..." : "Soutenir ce Référent"}
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); scrollToContact(); }}
                className="py-4 px-10 rounded-full border border-gray-100 text-gray-500 font-bold uppercase tracking-widest text-[10px] hover:border-[#008751]/20 hover:bg-[#008751]/5 transition-all"
              >
                Me contacter
              </button>
            </div>
          </div>
        </motion.section>

        {/* 🖼️ MUR DE MÉDIAS (Grille 2x4 Damier) */}
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

        {/* ✉️ BLOC CONTACT "CARTE DE VISITE" (Écrin Patriotique) */}
        <motion.section 
          ref={contactFormRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 w-full flex justify-center"
        >
          <div 
            className="w-full max-w-2xl bg-stone-50/50 rounded-[2rem] shadow-md p-10 md:p-16 relative overflow-hidden"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Titre minimaliste */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extralight text-[#1A1A1A] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Me contacter
              </h2>
              <div className="h-px w-8 bg-[#FCD116] mx-auto" />
            </div>

            <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                <div className="flex flex-col gap-2">
                  <label className="lowercase text-[9px] tracking-[0.2em] font-bold text-stone-400">nom complet</label>
                  <input 
                    type="text" 
                    placeholder="jean dupont" 
                    className="w-full py-2 bg-transparent border-b-2 border-[#008751] focus:border-[#FCD116] outline-none transition-all text-gray-700 placeholder:text-stone-200" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="lowercase text-[9px] tracking-[0.2em] font-bold text-stone-400">votre email</label>
                  <input 
                    type="email" 
                    placeholder="jean@example.com" 
                    className="w-full py-2 bg-transparent border-b-2 border-[#008751] focus:border-[#FCD116] outline-none transition-all text-gray-700 placeholder:text-stone-200" 
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="lowercase text-[9px] tracking-[0.2em] font-bold text-stone-400">message</label>
                <textarea 
                  placeholder="votre projet ou question..." 
                  rows={3}
                  className="w-full py-2 bg-transparent border-b-2 border-[#008751] focus:border-[#FCD116] outline-none transition-all text-gray-700 resize-none placeholder:text-stone-200" 
                />
              </div>

              <div className="flex justify-center pt-8">
                <button
                  className="py-4 px-20 bg-[#008751] border border-[#FCD116]/20 text-white rounded-full font-light uppercase tracking-widest text-[11px] transition-all hover:bg-[#007043] shadow-none"
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
