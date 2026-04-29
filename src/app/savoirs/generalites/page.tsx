
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Play } from 'lucide-react';
import ContactModal from '@/components/ContactModal';

const GeneralitesPage = () => {
  const router = useRouter();
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] pb-32">
      {/* Navbar Minimalist */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex justify-start pointer-events-none">
        <button 
          onClick={() => router.back()} 
          className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-neutral-100 hover:bg-white transition-all pointer-events-auto"
        >
          <ChevronLeft size={20} />
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-24 flex flex-col items-center">
        
        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display uppercase tracking-[0.2em] font-bold text-center mb-12 text-[#E8112D]"
        >
          Bases et Généralités sur le Fâ
        </motion.h1>

        {/* Separator Line */}
        <div className="w-24 h-[1.5px] bg-[#008751] mb-20" />

        {/* Section Title */}
        <div className="w-full mb-12 text-center md:text-left">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#008751]">
            Introduction aux fondements
          </h2>
        </div>

        {/* Video Gallery */}
        <div className="w-full space-y-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8112D] text-center md:text-left">
            Partage d'expertises sur les bases
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <VideoCard 
              title="Histoire et Origines du Fâ"
              expertName="Bokônon Ahodehou"
              expertLanguages="Fongbé, Français"
              expertLocation="Bénin"
              expertPhoto="/assets/talents/guide-moise.jpg"
              thumbnail="/assets/talents/tantie-flore.jpg"
              onContact={() => setIsContactOpen(true)}
            />
            <VideoCard 
              title="La Philosophie du Destin"
              expertName="Aïcha Gogan"
              expertLanguages="Yoruba, Français"
              expertLocation="Bénin"
              expertPhoto="/assets/talents/arielle-gogan.jpg"
              thumbnail="/assets/talents/amina-dossou.jpg"
              onContact={() => setIsContactOpen(true)}
            />
          </div>
        </div>
      </main>

      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
        signName="Bases du Fâ"
      />
    </div>
  );
};

const VideoCard = ({ title, expertName, expertPhoto, expertLanguages, expertLocation, thumbnail, onContact, isPlaceholder = false }: any) => (
  <div className={`group rounded-3xl overflow-hidden border border-neutral-100 shadow-sm transition-all hover:shadow-xl ${isPlaceholder ? 'opacity-40 grayscale' : ''}`}>
    <div className="relative aspect-video bg-neutral-100 overflow-hidden">
      {!isPlaceholder && thumbnail && (
        <img src={thumbnail} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
          <Play size={20} fill="currentColor" />
        </div>
      </div>
    </div>
    <div className="p-6 space-y-6 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden border border-[#008751]/30 shrink-0">
          {expertPhoto && <img src={expertPhoto} alt={expertName} className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#008751] truncate">{expertName}</p>
          <h4 className="text-sm font-bold truncate leading-tight mt-0.5">{title}</h4>
          {!isPlaceholder && (
            <div className="flex flex-wrap gap-x-2 mt-1">
              <span className="text-[9px] text-neutral-400">{expertLanguages}</span>
              <span className="text-[9px] text-neutral-400">•</span>
              <span className="text-[9px] text-neutral-400">{expertLocation}</span>
            </div>
          )}
        </div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onContact(); }}
        className="w-full py-3 bg-[#E8112D] text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#FCD116] hover:text-[#1a1a1a] transition-all shadow-sm"
      >
        Contacter l'expert
      </button>
    </div>
  </div>
);

export default GeneralitesPage;
