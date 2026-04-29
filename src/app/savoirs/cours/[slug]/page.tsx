
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Play, Info, Shield, Target, Lightbulb } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { SIGNS, type FongbeSign } from '@/data/fongbe';
import { SignIdeogram } from '@/components/FaMatrix';

import ContactModal from '@/components/ContactModal';

interface SignData {
  id: string;
  signe_nom: string;
  introduction: string;
  devise: string;
  avantages: string;
  defis: string;
  recommandation: string;
}

const cleanString = (s: string) => {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[\s-]/g, ""); // Remove spaces and dashes
};

const CoursePage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [data, setData] = useState<SignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [leftSign, setLeftSign] = useState<FongbeSign | null>(null);
  const [rightSign, setRightSign] = useState<FongbeSign | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all signs to find the one matching the slug
        // Using index idx_signes_fa_nom implicitly via the select
        const { data: allSigns, error } = await supabase
          .from('signes_fa')
          .select('*');

        if (error) throw error;

        // Robust matching: lowercase, no accents/spaces, meji == medji
        const foundSign = allSigns?.find(s => {
          const dbSlug = cleanString(s.signe_nom).toLowerCase().replace('medji', 'meji');
          const urlSlug = (slug as string).toLowerCase().replace('medji', 'meji');
          return dbSlug === urlSlug;
        });
        
        if (foundSign) {
          setData(foundSign);
          findMotherSigns(foundSign.signe_nom);
        }
      } catch (err) {
        console.error("Error fetching sign data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const findMotherSigns = (signName: string) => {
    const normalizedName = signName.toLowerCase().replace('medji', 'meji');
    
    // If it's a "Meji" sign
    if (normalizedName.includes('meji')) {
      const baseName = signName.split(' ')[0];
      const sign = SIGNS.find(s => cleanString(s.name).toLowerCase() === cleanString(baseName).toLowerCase());
      if (sign) {
        setLeftSign(sign);
        setRightSign(sign);
      }
    } else {
      // It's a combination
      // Split by space or dash
      const parts = signName.split(/[\s-]/);
      if (parts.length >= 2) {
        const left = SIGNS.find(s => cleanString(s.name).toLowerCase() === cleanString(parts[0]).toLowerCase());
        const right = SIGNS.find(s => cleanString(s.name).toLowerCase() === cleanString(parts[1]).toLowerCase());
        if (left) setLeftSign(left);
        if (right) setRightSign(right);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-neutral-100 border-t-neutral-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-display mb-4 uppercase tracking-widest">Signe non trouvé</h1>
        <button onClick={() => router.back()} className="text-[10px] underline uppercase tracking-[0.2em] font-bold">Retour à la matrice</button>
      </div>
    );
  }

  // Formatting name based on strict rules for display
  const displayName = data.signe_nom.toLowerCase().includes('medji') || data.signe_nom.toLowerCase().includes('meji')
    ? `${data.signe_nom.split(' ')[0]} Meji`
    : data.signe_nom;

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] pb-32">
      {/* Navbar Minimalist */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-start pointer-events-none">
        <button 
          onClick={() => router.back()} 
          className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-neutral-100 hover:bg-white transition-all pointer-events-auto"
        >
          <ChevronLeft size={20} />
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-24 flex flex-col items-center">
        
        {/* 1. En-tête Visual: Ideogram */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-12 bg-neutral-50 rounded-[3rem] border border-neutral-100 shadow-sm"
        >
          {leftSign && rightSign && (
            <SignIdeogram leftSign={leftSign} rightSign={rightSign} size={110} />
          )}
        </motion.div>

        {/* 2. Nom du signe */}
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-display uppercase tracking-[0.2em] font-bold text-center mb-12"
        >
          {displayName}
        </motion.h1>

        {/* 3. Ligne de séparation fine */}
        <div className="w-24 h-[1px] bg-neutral-200 mb-20" />

        {/* 4. Titre de section */}
        <div className="w-full mb-12 text-center md:text-left">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">
            Cours et éléments sur le signe du Fâ
          </h2>
        </div>

        {/* 5. Contenu textuel */}
        <div className="w-full grid md:grid-cols-2 gap-16 mb-24">
          <div className="space-y-12">
            <TextSection title="Introduction" content={data.introduction} />
            <TextSection title="La Devise" content={data.devise} italic />
          </div>
          <div className="space-y-12">
            <TextSection title="Les Avantages" content={data.avantages} isGood />
            <TextSection title="Les Défis" content={data.defis} isWarning />
          </div>
        </div>

        {/* 6. Galerie Vidéo (Max 4) */}
        <div className="w-full space-y-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 text-center md:text-left">
            Vidéos & Expertises
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <VideoCard 
              title={`Ésotérisme du signe ${displayName}`}
              expertName="Bokônon Ahodehou"
              expertLanguages="Fongbé, Français"
              expertLocation="Bénin"
              expertPhoto="/assets/talents/guide-moise.jpg"
              thumbnail="/assets/talents/tantie-flore.jpg"
              onContact={() => setIsContactOpen(true)}
            />
            <VideoCard 
              title={`Les interdits de ${displayName}`}
              expertName="Aïcha Gogan"
              expertLanguages="Yoruba, Français"
              expertLocation="Bénin"
              expertPhoto="/assets/talents/arielle-gogan.jpg"
              thumbnail="/assets/talents/amina-dossou.jpg"
              onContact={() => setIsContactOpen(true)}
            />
            <VideoCard 
              title="Cours en attente..."
              expertName="Expert à venir"
              expertLanguages="-"
              expertLocation="-"
              isPlaceholder
              onContact={() => setIsContactOpen(true)}
            />
            <VideoCard 
              title="Cours en attente..."
              expertName="Expert à venir"
              expertLanguages="-"
              expertLocation="-"
              isPlaceholder
              onContact={() => setIsContactOpen(true)}
            />
          </div>
        </div>
      </main>

      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
        signName={displayName}
      />
    </div>
  );
};

const TextSection = ({ title, content, italic = false, isGood = false, isWarning = false }: any) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      {isGood && <div className="w-1 h-4 bg-emerald-500 rounded-full" />}
      {isWarning && <div className="w-1 h-4 bg-amber-500 rounded-full" />}
      <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">{title}</h3>
    </div>
    <p className={`text-sm leading-relaxed font-light text-neutral-700 ${italic ? 'italic font-headline text-lg' : ''}`}>
      {content || "Information non disponible."}
    </p>
  </div>
);

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
        <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0">
          {expertPhoto && <img src={expertPhoto} alt={expertName} className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 truncate">{expertName}</p>
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
        className="w-full py-3 border border-neutral-200 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
      >
        Contacter l'expert
      </button>
    </div>
  </div>
);


export default CoursePage;
