"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Share2, MessageCircle } from "lucide-react";
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
 * TalentProfileEditorial - Expérience "Digital Atelier" Raffinée.
 * - Image de profil agrandie (320px/380px) avec radius réduit (20px).
 * - Social Proof (Compteur de Soutiens) vert, large, sous les CTAs.
 * - Rythme vertical aéré et padding de sécurité pour navigation basse.
 */
export default function TalentProfileEditorial({
  talent,
  votes,
  onVote,
  onShare,
  isVoting = false,
}: TalentProfileEditorialProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const contactFormRef = useRef<HTMLDivElement>(null);

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

  // Scroll vers le formulaire de contact
  const scrollToContact = () => {
    contactFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div 
      className="w-full bg-white font-manrope selection:bg-[#FCD116]/30 overflow-x-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      <main className="max-w-[820px] mx-auto px-6 pt-12 md:pt-24 pb-60">
        
        {/* 🎬 HERO SECTION (Digital Atelier) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col items-center text-center mb-32 md:mb-40"
        >
          {/* Portrait Image (1:1 Optimized) */}
          <div className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px] mb-16 mx-auto group">
            <Image
              src={talent.avatar_url || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800"}
              alt={`${talent.prenom} ${talent.nom}`}
              fill
              className="object-cover rounded-[20px] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] pointer-events-none"
              priority
              loading="eager"
              decoding="async"
              draggable={false}
              sizes="(max-width: 768px) 320px, 380px"
            />
          </div>

          {/* Profession (Gold Accent) */}
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C8A96A] mb-8">
            {talent.categorie}
          </span>

          {/* Name (STRICT MATCH with Listing) */}
          <h1 className="text-2xl md:text-4xl font-extrabold font-manrope text-[#1A1A1A] uppercase tracking-[0.15em] leading-tight mb-12 max-w-2xl mx-auto">
            {talent.prenom} {talent.nom}
          </h1>

          {/* Bio (Replacing fixed tagline / 2-4 lines) */}
          {talent.bio && (
            <p className="text-base md:text-lg italic text-gray-500 opacity-80 max-w-xl mx-auto mb-14 px-4 font-light leading-relaxed line-clamp-4">
              {talent.bio}
            </p>
          )}

          {/* CTAs HIERARCHY */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-xl mx-auto">
            {/* Primary : Voter */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onVote}
              disabled={isVoting}
              className={cn(
                "w-full md:flex-1 py-5 px-8 bg-[#0E7C66] text-white rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-900/10 transition-all hover:bg-[#0C6A57] hover:shadow-emerald-900/20",
                isVoting && "opacity-60 cursor-not-allowed"
              )}
            >
              {isVoting ? "Soutien..." : "Voter pour moi"}
            </motion.button>
            
            {/* Secondary : Contact */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={scrollToContact}
              className="w-full md:flex-1 py-5 px-8 rounded-full border-2 border-gray-100 text-[#1A1A1A] font-bold uppercase tracking-widest text-[11px] hover:border-gray-200 hover:bg-gray-50 transition-all"
            >
              Me contacter
            </motion.button>

            {/* Tertiary : Partager */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onShare}
              className="w-full md:w-auto p-5 rounded-full border border-gray-100 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-gray-600 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span className="md:hidden">Partager le profil</span>
            </motion.button>
          </div>
          
          {/* 💚 SOCIAL PROOF (Soutiens) - Rendered only if votes > 0 */}
          {votes > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 px-6 py-2 bg-emerald-50 rounded-full border border-emerald-100"
            >
               <span className="text-xl md:text-2xl font-bold text-[#0E7C66]">
                 {votes}
               </span>
               <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-[#0E7C66] opacity-70">
                 Soutiens Reçus
               </span>
            </motion.div>
          )}
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

        {/* 📩 CONTACT FORM SECTION (Conversion Block) */}
        <motion.section 
          ref={contactFormRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-40 md:mt-60 w-full pt-16 border-t border-gray-50 pb-20"
        >
          <div className="text-center mb-16">
            <h4 className="text-[12px] md:text-[13px] font-extrabold uppercase tracking-[0.4em] text-gray-800 mb-6">
              Me contacter
            </h4>
            <div className="w-12 h-[1px] bg-[#C8A96A] mx-auto opacity-50" />
          </div>

          <form className="max-w-lg mx-auto flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="Votre nom" 
              className="w-full py-5 px-0 bg-transparent border-b border-gray-100 focus:border-[#C8A96A] outline-none transition-all placeholder:text-gray-300 text-gray-600" 
            />
            <input 
              type="email" 
              placeholder="Votre email" 
              className="w-full py-5 px-0 bg-transparent border-b border-gray-100 focus:border-[#C8A96A] outline-none transition-all placeholder:text-gray-300 text-gray-600" 
            />
            <textarea 
              placeholder="Votre message" 
              rows={4}
              className="w-full py-5 px-0 bg-transparent border-b border-gray-100 focus:border-[#C8A96A] outline-none transition-all placeholder:text-gray-300 text-gray-600 resize-none" 
            />
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-5 bg-[#0E7C66] text-white rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-900/10 hover:bg-[#0C6A57] transition-all"
            >
              Envoyer le message
            </motion.button>
          </form>
        </motion.section>
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
