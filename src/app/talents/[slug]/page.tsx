/**
 * PAGE PUBLIQUE - PROFIL TALENT
 * Role: "Sanctuaire" du talent, affichage des vidéos et détails.
 */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, MapPin, Play, Globe, Clock, Share2 } from "lucide-react";
import { candidates } from "@/data/candidates";

export default function TalentProfilePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = params?.slug;

  // 1. Données du candidat depuis le mock local
  const candidate = useMemo(() => candidates.find(c => c.slug === slug), [slug]);

  const [activeTab, setActiveTab] = useState("Qui je suis");
  const [loading, setLoading] = useState(true);

  const tabs = ["Qui je suis", "Mon histoire", "Mon service", "Pourquoi moi"];

  // Mapping pour les noms de fichiers (kebab-case)
  const getFileName = (tabName: string) => {
    return tabName.toLowerCase().replace(/ /g, "-");
  };

  // Calcul du chemin d'image dynamique selon la structure public/ (tout en minuscule)
  const getImagePath = (tabName: string) => {
    if (!candidate) return "";
    const fileName = getFileName(tabName);
    const extension = tabName === "Qui je suis" ? "jpg" : "png";
    return `/talents/${candidate.slug}/${fileName}.${extension}`;
  };

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (tabName: string) => {
    setImageErrors((prev) => ({ ...prev, [tabName]: true }));
  };

  useEffect(() => {
    if (candidate) {
      setLoading(false);
    }
  }, [candidate]);

  const handleVote = () => {
    if (!candidate) return;
    const message = `Je souhaite voter pour ${candidate.full_name} sur Beninease !`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#F2EDE4] bg-white p-10 text-center text-[#8E8E8E] font-sans">
          Chargement du sanctuaire…
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#F2EDE4] bg-white p-10 font-sans">
          <p className="text-sm text-red-700">Candidat introuvable.</p>
          <button
            type="button"
            onClick={() => router.push("/talents")}
            className="mt-6 rounded-full border border-[#E9E2D6] px-5 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-[#8E8E8E] hover:bg-[#C5A267] hover:text-white hover:border-[#C5A267] transition-colors"
          >
            Retour aux talents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden border border-[#F2EDE4]">
        
        {/* 2. En-tête (Header) */}
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative w-36 h-36 bg-[#F8F5F0] rounded-[25px] border-[6px] border-white shadow-sm overflow-hidden flex-shrink-0">
              <Image 
                src={candidate.portrait} 
                alt={candidate.full_name} 
                fill 
                className="object-cover"
                priority
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-[34px] font-display font-bold text-[#1A1A1A] leading-tight">
                {candidate.full_name}
              </h1>
              <p className="text-[#C5A267] font-medium text-sm mt-2 uppercase tracking-wider">
                {candidate.tagline}
              </p>
              <p className="mt-1 text-[#8E8E8E] text-sm">
                {candidate.category}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-6 text-[#8E8E8E] text-[11px] font-medium uppercase tracking-widest">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {candidate.city}, Bénin
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> {candidate.languages}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Invisible but logical for state) */}
        <div className="px-8 md:px-12 border-b border-[#F2EDE4]">
          <div className="flex justify-between md:justify-start md:gap-16">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-semibold transition-all relative ${
                  activeTab === tab ? "text-[#C5A267]" : "text-[#8E8E8E] hover:text-[#555]"
                }`}
              >
                {tab}
                {activeTab === tab ? (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A267]" />
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Les 4 Miniatures (Aperçus) */}
        <div className="p-8 md:p-12 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative aspect-video rounded-[15px] overflow-hidden group transition-all duration-500 ${
                  activeTab === tab
                    ? "ring-2 ring-[#C5A267] ring-offset-4 scale-[1.02] shadow-lg"
                    : "opacity-70 hover:opacity-100 hover:scale-[1.02]"
                }`}
              >
                <Image 
                  src={imageErrors[tab] ? candidate.portrait : getImagePath(tab)} 
                  alt={tab} 
                  fill 
                  className="object-cover"
                  onError={() => handleImageError(tab)}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-[9px] font-bold text-white uppercase tracking-widest text-center">
                    {tab}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. La Grande Vidéo & Le Texte */}
        <div className="px-8 md:px-12 pb-12">
          <div className="relative aspect-video bg-[#1A1A1A] rounded-[30px] overflow-hidden shadow-2xl group border-[8px] border-white ring-1 ring-[#F2EDE4]">
            <Image 
              src={imageErrors[activeTab] ? candidate.portrait : getImagePath(activeTab)} 
              alt={activeTab} 
              fill 
              className="object-cover"
              onError={() => handleImageError(activeTab)}
            />
            {/* Video Overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white transition-opacity group-hover:bg-black/30">
              <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-4 transition-transform hover:scale-110 active:scale-95">
                <Play className="w-7 h-7 text-[#C5A267] fill-[#C5A267]" />
              </button>
              <p className="text-lg font-bold tracking-wide uppercase">
                {activeTab}
              </p>
              <div className="mt-2 flex items-center gap-2 text-white/70 text-[11px] font-medium uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                Durée max : 2 minutes
              </div>
            </div>
          </div>

          {/* Descriptive Text Section */}
          <p className="text-[#555] text-base leading-relaxed mt-6">
            {candidate.tabs[activeTab]}
          </p>

          {/* 5. Footer & Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleVote}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#C5A267] px-8 py-4 text-xs font-bold tracking-[0.15em] uppercase text-white shadow-md transition-all hover:bg-[#B38F56] hover:shadow-lg active:scale-95"
            >
              <Heart className="w-4 h-4 fill-white" />
              Voter pour moi
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#E9E2D6] px-8 py-4 text-xs font-bold tracking-[0.15em] uppercase text-[#1A1A1A] transition-all hover:bg-[#FDFBF7] hover:border-[#C5A267] active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              Partager sur WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
