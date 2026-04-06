"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Share2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import EditorialSection from "./EditorialSection";
import VideoModal from "../ui/VideoModal";

interface TalentProfileEditorialProps {
  talent: any;
  votes: number;
  onVote: () => void;
  onShare: () => void;
  isVoting?: boolean;
}

/**
 * TalentProfileEditorial - L'Expérience "Digital Atelier".
 * - Mise en page éditoriale centrée (max-width 820px)
 * - Narration verticale fluide
 * - Typographie Manrope dominante
 * - Esthétique minimaliste de luxe
 */
export default function TalentProfileEditorial({
  talent,
  votes,
  onVote,
  onShare,
  isVoting = false,
}: TalentProfileEditorialProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Définition de la structure narrative (Ordre Strict)
  const sections = [
    {
      id: "qui-je-suis",
      title: "Qui je suis",
      videoUrl: talent.video_qui_je_suis,
      imageUrl: talent.photo_qui_je_suis,
    },
    {
      id: "mon-histoire",
      title: "Mon histoire",
      videoUrl: talent.video_histoire,
      imageUrl: talent.photo_histoire,
    },
    {
      id: "mes-services",
      title: "Mes services",
      videoUrl: talent.video_services,
      imageUrl: talent.photo_services,
    },
    {
      id: "pourquoi-moi",
      title: "Pourquoi moi",
      videoUrl: talent.video_pourquoi,
      imageUrl: talent.photo_pourquoi,
    },
  ];

  const handlePlayVideo = (url: string) => setActiveVideo(url);

  return (
    <div 
      className="w-full bg-white font-manrope selection:bg-[#FCD116]/30 overflow-x-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      <main className="max-w-[820px] mx-auto px-6 pt-12 md:pt-24 pb-40">
        
        {/* 🎬 HERO SECTION (Digital Atelier) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col items-center text-center mb-32 md:mb-40"
        >
          {/* Portrait Image (1:1) */}
          <div className="relative w-[240px] h-[240px] md:w-[280px] md:h-[280px] mb-12 group">
            <div className="absolute inset-0 bg-gray-100 rounded-[32px] animate-pulse -z-10" />
            <Image
              src={talent.avatar_url || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800"}
              alt={`${talent.prenom} ${talent.nom}`}
              fill
              className="object-cover rounded-[32px] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] pointer-events-none"
              priority
              draggable={false}
              sizes="(max-width: 768px) 240px, 280px"
            />
          </div>

          {/* Profession (Gold Accent) */}
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C8A96A] mb-4">
            {talent.categorie}
          </span>

          {/* Name */}
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-[0.05em] text-[#1A1A1A] mb-4 leading-tight">
            {talent.prenom} <br className="md:hidden" /> {talent.nom}
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl italic text-gray-400 opacity-80 max-w-xl mx-auto mb-14 px-4 font-light leading-relaxed">
            {talent.slogan || `« Ambassadeur du savoir-faire béninois »`}
          </p>

          {/* CTAs */}
          <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-md mx-auto">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onVote}
              disabled={isVoting}
              className={cn(
                "w-full md:flex-1 py-5 px-8 bg-[#0E7C66] text-white rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-900/10 transition-all hover:bg-[#0C6A57]",
                isVoting && "opacity-60 cursor-not-allowed"
              )}
            >
              {isVoting ? "Soutien..." : "Voter pour moi"}
            </motion.button>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onShare}
                className="flex-1 md:flex-none p-5 rounded-full border border-gray-100 text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest"
              >
                <Share2 className="w-4 h-4" />
                <span className="md:hidden">Partager</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                className="flex-[2] md:flex-none py-5 px-8 rounded-full border border-gray-100 text-gray-500 hover:bg-gray-50 transition-all text-[10px] font-bold uppercase tracking-widest"
              >
                Me contacter
              </motion.button>
            </div>
          </div>
          
          <div className="mt-8 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">
            {votes} Soutiens Reçus
          </div>
        </motion.section>

        {/* 📖 STORYTELLING SECTIONS */}
        <div className="flex flex-col gap-[120px] md:gap-[160px]">
          {sections.map((section, index) => (
            <EditorialSection
              key={section.id}
              title={section.title}
              videoUrl={section.videoUrl}
              imageUrl={section.imageUrl}
              onPlayVideo={handlePlayVideo}
              index={index}
            />
          ))}
        </div>

        {/* Footer subtle navigation or message */}
        <div className="mt-40 text-center flex flex-col items-center gap-10">
           <div className="w-1 md:w-[1px] h-20 bg-gradient-to-b from-[#C8A96A] to-transparent opacity-30" />
           <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-300">
             BeninEase Atelier
           </p>
        </div>
      </main>

      {/* Video Cinematic Modal */}
      <VideoModal
        url={activeVideo}
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
}
