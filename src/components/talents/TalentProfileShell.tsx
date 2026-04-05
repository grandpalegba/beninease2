"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Filter, Play, Mail, Heart, Share2, MapPin, Globe, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { confetti } from "tsparticles-confetti";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { useVoter } from "@/lib/auth/use-voter";
import { cn } from "@/lib/utils";

interface TalentProfileShellProps {
  id: string;
  full_name: string;
  city: string;
  avatar_url: string;
  bio_longue: string;
  video_urls: string[];
  votes: number;
  univers: string;
  categorie: string;
  social_links: {
    instagram?: string | null;
    tiktok?: string | null;
    whatsapp?: string | null;
  };
}

const TABS = [
  { id: "videos", label: "VIDÉOS", icon: Play },
  { id: "contact", label: "CONTACT & INFOS", icon: Mail },
];

const VIDEO_THEMES = [
  { id: 0, label: "QUI JE SUIS" },
  { id: 1, label: "MON HISTOIRE" },
  { id: 2, label: "MON SERVICE" },
  { id: 3, label: "POURQUOI MOI" },
];

export default function TalentProfileShell({
  id,
  full_name,
  city,
  avatar_url,
  bio_longue,
  video_urls = [],
  votes: initialVotes,
  univers,
  categorie,
  social_links,
}: TalentProfileShellProps) {
  const { session, isAuthenticated, checkHasVoted } = useVoter();
  const [activeTab, setActiveTab] = useState("videos");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [votesCount, setVotesCount] = useState(initialVotes);

  // Sync with actual vote status
  useEffect(() => {
    if (isAuthenticated) {
      checkHasVoted(id).then(setHasVoted);
    }
  }, [id, isAuthenticated, checkHasVoted]);

  const handleVote = async () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour voter");
      return;
    }

    if (hasVoted || isVoting) return;

    setIsVoting(true);
    try {
      const { error } = await supabase.from("votes").insert([
        {
          voter_id: session?.user.id,
          talent_id: id,
          univers,
          categorie,
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          setHasVoted(true);
          toast.info("Vous avez déjà soutenu ce talent !");
        } else {
          throw error;
        }
      } else {
        setHasVoted(true);
        setVotesCount((prev) => prev + 1);
        toast.success("Soutien enregistré ! Merci.");
        
        // Success effect
        const canvas = document.createElement("canvas");
        confetti(canvas, { particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error("Vote error:", err);
      toast.error("Une erreur est survenue lors du vote.");
    } finally {
      setIsVoting(false);
    }
  };

  const displayVideos = [...video_urls, "", "", "", ""].slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] font-sans antialiased pb-20">
      {/* 1. Global Search Bar (Minimalist) */}
      <div className="w-full bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#008751] transition-colors" />
            <input 
              type="text" 
              placeholder="Rechercher un talent..." 
              className="w-full h-11 pl-11 pr-4 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]/10 focus:border-[#008751] transition-all placeholder:text-gray-300"
            />
          </div>
          <button className="w-11 h-11 bg-[#008751] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#008751]/20 hover:bg-[#006B3F] transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 mt-12">
        {/* 2. Main Profile Card */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_10px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-8 md:p-12 pb-6">
            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
              
              {/* Avatar Circle */}
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-[40px] overflow-hidden border-[6px] border-white shadow-xl flex-shrink-0 group">
                <Image 
                  src={avatar_url || "/placeholder-portrait.jpg"} 
                  alt={full_name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority 
                />
              </div>

              {/* Identity & Voting Info */}
              <div className="flex-1 space-y-8 text-center md:text-left">
                <div className="space-y-1">
                  <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight text-[#1A1A1A]">
                    {full_name}
                  </h1>
                </div>

                {/* Vote Card (White Centered) */}
                <motion.button 
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVote}
                  disabled={isVoting || hasVoted}
                  className="inline-block bg-white border border-gray-100 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] min-w-[240px] transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] group relative"
                >
                  <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-[#008751] mb-2">Nombre de votes</span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-bold text-[#1A1A1A]">{votesCount}</span>
                    {isVoting ? (
                      <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
                    ) : hasVoted ? (
                      <CheckCircle2 className="w-6 h-6 text-[#008751] fill-[#008751]/10" />
                    ) : (
                      <Heart className="w-6 h-6 text-gray-200 group-hover:text-red-500 transition-colors" />
                    )}
                  </div>
                </motion.button>

                {/* Badges & Location Info */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-3">
                  <span className="px-5 py-2 bg-[#008751]/5 text-[#008751] rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-[#008751]/10">
                    {univers}
                  </span>
                  <span className="text-gray-300 hidden md:inline">•</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                    {categorie}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <MapPin className="w-4 h-4 text-black" /> {city}, BÉNIN
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <Globe className="w-4 h-4 text-black" /> {categorie}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Navigation Tabs */}
          <div className="px-8 md:px-12 border-t border-gray-50 flex gap-10">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "py-8 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] transition-all relative group",
                  activeTab === id ? "text-[#1A1A1A]" : "text-gray-300 hover:text-gray-500"
                )}
              >
                <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", activeTab === id ? "text-[#008751]" : "")} />
                {label}
                {activeTab === id && (
                  <motion.div 
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#008751] rounded-t-full" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Tab Content 영역 */}
        <AnimatePresence mode="wait">
          {activeTab === "videos" ? (
            <motion.div 
              key="videos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-12 space-y-12"
            >
              {/* Main Player Display */}
              <div className="aspect-video bg-black rounded-[40px] overflow-hidden shadow-2xl border-[10px] border-white ring-1 ring-gray-100">
                <iframe
                 src={getEmbedUrl(displayVideos[activeVideoIndex])}
                 className="w-full h-full"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
               />
              </div>

              {/* Selector Thumbnails */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {VIDEO_THEMES.map((theme, i) => (
                  <button
                    key={theme.id}
                    onClick={() => setActiveVideoIndex(i)}
                    className={cn(
                      "relative group aspect-[16/10] rounded-[24px] overflow-hidden transition-all duration-500 active:scale-95",
                      activeVideoIndex === i 
                        ? "ring-4 ring-[#008751] scale-[1.02] shadow-xl" 
                        : "ring-1 ring-gray-200 grayscale-[0.3] hover:grayscale-0"
                    )}
                  >
                    {/* Background visual based on category/theme (placeholder) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-900/40" />
                    <Image 
                      src={avatar_url || "/placeholder-portrait.jpg"} 
                      alt="" 
                      fill 
                      className="object-cover mix-blend-overlay transition-transform duration-700 group-hover:scale-110" 
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <span className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.2em] text-center filter drop-shadow-md">
                        {theme.label}
                      </span>
                    </div>
                    {/* Play Indicator overlay */}
                    <div className={cn(
                      "absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100",
                      activeVideoIndex === i && "bg-[#008751] opacity-100"
                    )}>
                      <Play className="w-2.5 h-2.5 text-white fill-current" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="contact"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-12 bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h2 className="text-3xl font-display font-medium tracking-tight">Biographie</h2>
                  <p className="text-gray-500 leading-relaxed text-lg font-light italic">
                    « {bio_longue} »
                  </p>
                </div>
                
                <div className="space-y-8">
                   <h2 className="text-3xl font-display font-medium tracking-tight">Réseaux Sociaux</h2>
                   <div className="flex gap-4">
                    {social_links.instagram && (
                      <SocialIcon href={social_links.instagram} icon={Instagram} />
                    )}
                    {social_links.whatsapp && (
                      <SocialIcon href={`https://wa.me/${social_links.whatsapp}`} icon={Mail} /> // Should be WhatsApp icon but keeping consistent
                    )}
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

function SocialIcon({ href, icon: Icon }: { href: string, icon: any }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#008751] hover:border-[#008751]/20 transition-all shadow-sm hover:shadow-lg"
    >
      <Icon className="w-6 h-6" />
    </a>
  );
}

function getEmbedUrl(url: string | undefined): string {
  if (!url) return "";
  let videoId = "";
  if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
  else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
  else if (url.includes("embed/")) videoId = url.split("embed/")[1].split("?")[0];
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : url;
}
