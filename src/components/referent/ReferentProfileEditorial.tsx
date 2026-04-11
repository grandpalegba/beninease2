"use client";

import React, { useRef } from "react";
import { Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ReferentEditorialSection from "./ReferentEditorialSection";
import PremiumImage from "../ui/PremiumImage";

interface ReferentProfileEditorialProps {
  ambassadeur: any;
  votes: number;
  onVote: () => void;
  onShare: () => void;
  isVoting?: boolean;
}

/**
 * ReferentProfileEditorial - Mise en page premium "Diptyque".
 * - Palette : Sable (#faf9f8) & Terracotta (#a0412d).
 * - Sections narratives avec grille média 2 colonnes.
 * - Formulaire de contact épuré en conclusion.
 */
export default function ReferentProfileEditorial({
  ambassadeur,
  votes,
  onVote,
  onShare,
  isVoting = false,
}: ReferentProfileEditorialProps) {
  const contactFormRef = useRef<HTMLDivElement>(null);

  // Structure narrative avec fallbacks pour les textes descriptifs
  const sections = [
    {
      id: "qui-je-suis",
      title: "Qui je suis",
      videoUrl: ambassadeur.video_qui_je_suis,
      imageUrl: ambassadeur.photo_qui_je_suis,
      text: ambassadeur.texte_qui_je_suis || ambassadeur.bio_qui_je_suis,
    },
    {
      id: "mon-histoire",
      title: "Mon histoire",
      videoUrl: ambassadeur.video_histoire,
      imageUrl: ambassadeur.photo_histoire,
      text: ambassadeur.texte_histoire || ambassadeur.bio_histoire,
    },
    {
      id: "mon-expertise",
      title: "Mon expertise",
      videoUrl: ambassadeur.video_expertise || ambassadeur.video_services,
      imageUrl: ambassadeur.photo_expertise || ambassadeur.photo_services,
      text: ambassadeur.texte_expertise || ambassadeur.bio_expertise || ambassadeur.description_services,
    },
    {
      id: "pourquoi-moi",
      title: "Pourquoi moi",
      videoUrl: ambassadeur.video_pourquoi,
      imageUrl: ambassadeur.photo_pourquoi,
      text: ambassadeur.texte_pourquoi || ambassadeur.bio_pourquoi,
    },
  ];

  const scrollToContact = () => {
    contactFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const terracotta = "#a0412d";

  return (
    <div 
      className="w-full bg-[#faf9f8] font-manrope selection:bg-[#a0412d]/10 overflow-x-hidden min-h-screen"
      onContextMenu={(e) => e.preventDefault()}
    >
      <main className="max-w-[1000px] mx-auto px-6 pt-12 md:pt-24 pb-40">
        
        {/* 🎬 HERO SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col items-center text-center mb-32 md:mb-40"
        >
          <div className="relative w-[300px] h-[300px] md:w-[360px] md:h-[360px] mb-16 mx-auto">
            <PremiumImage 
              src={ambassadeur.avatar_url}
              alt={`${ambassadeur.prenom} ${ambassadeur.nom}`}
              aspectRatio="square"
              className="shadow-sm"
            />
          </div>

          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#a0412d] mb-8">
            {ambassadeur.categorie}
          </span>

          <h1 className="text-4xl md:text-6xl font-bold font-manrope text-[#1A1A1A] uppercase tracking-tight leading-tight mb-12 max-w-3xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {ambassadeur.prenom} {ambassadeur.nom}
          </h1>

          {ambassadeur.bio && (
            <p className="text-xl md:text-2xl font-light text-gray-500 max-w-2xl mx-auto mb-14 px-4 leading-relaxed italic">
              « {ambassadeur.bio} »
            </p>
          )}

          <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-xl mx-auto">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onVote}
              disabled={isVoting}
              className={cn(
                "w-full md:flex-1 py-5 px-8 text-white rounded-full font-bold uppercase tracking-widest text-[11px] shadow-sm transition-all",
                isVoting ? "bg-gray-400 cursor-not-allowed" : "bg-[#a0412d] hover:bg-[#8b3827]"
              )}
            >
              {isVoting ? "Chargement..." : "Soutenir ce Référent"}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={scrollToContact}
              className="w-full md:flex-1 py-5 px-8 rounded-full border-2 border-[#a0412d]/20 text-[#a0412d] font-bold uppercase tracking-widest text-[11px] hover:bg-[#a0412d]/5 transition-all"
            >
              Me contacter
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onShare}
              className="w-full md:w-auto p-5 rounded-full border border-gray-200 text-gray-400 hover:text-[#a0412d] transition-all flex items-center justify-center"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
          
          {votes > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 flex items-center gap-3"
            >
               <div className="h-px w-8 bg-[#a0412d]/20" />
               <span className="text-lg font-bold text-[#a0412d]">
                 {votes} Soutiens
               </span>
               <div className="h-px w-8 bg-[#a0412d]/20" />
            </motion.div>
          )}
        </motion.section>

        {/* 📖 STORYTELLING SECTIONS */}
        <div className="flex flex-col gap-[140px] md:gap-[180px]">
          {sections.map((section, index) => (
            <ReferentEditorialSection
              key={section.id}
              title={section.title}
              videoUrl={section.videoUrl}
              imageUrl={section.imageUrl}
              text={section.text}
              index={index}
            />
          ))}
        </div>

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
    </div>
  );
}
