"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Heart, Share2, Instagram, Phone, Play, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { confetti } from "tsparticles-confetti";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { useVoter } from "@/lib/auth/use-voter";

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

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-.99 0-1.49.18-1.76.91-3.43 2.1-4.7 1.27-1.38 3.07-2.23 4.95-2.33 1.21-.1 2.42.16 3.5.7v4.21c-.76-.45-1.66-.67-2.54-.61-1.45.06-2.85.91-3.56 2.22-.55 1.02-.61 2.26-.19 3.3.36.93 1.16 1.67 2.12 1.98 1.03.32 2.16.17 3.08-.42.61-.4.99-1.06 1.13-1.77.13-.58.11-1.17.11-1.75V.02z" />
  </svg>
);

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
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [votesCount, setVotesCount] = useState(initialVotes);
  const [isSharing, setIsSharing] = useState(false);

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

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Découvrez ${full_name} sur BeninEase`,
          text: `Je viens de découvrir ${full_name} dans l'univers ${univers}. Allez voir son profil !`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Lien copié dans le presse-papier !");
      }
    } catch (err) {
      console.log("Share failed or cancelled", err);
    } finally {
      setIsSharing(false);
    }
  };

  const displayVideos = [...video_urls, "", "", "", ""].slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white">
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {univers}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {categorie}
                </span>
              </div>

              {/* Avatar */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              >
                {avatar_url ? (
                  <Image
                    src={avatar_url}
                    alt={full_name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <span className="text-5xl font-light">{full_name.charAt(0)}</span>
                  </div>
                )}
              </motion.div>

              {/* Name & Stats */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    {full_name}
                  </h1>
                  <div className="flex items-center text-gray-400 gap-1.5 text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    <span>{city}, Bénin</span>
                  </div>
                </div>

                {/* Vote Count Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-[#1A1A1A] text-white rounded-xl gap-2 shadow-xl shadow-black/10 transition-transform hover:scale-105">
                  <Heart className="w-4 h-4 fill-white" />
                  <span className="text-sm font-bold tracking-tight">{votesCount} votes</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleVote}
                disabled={isVoting}
                className={`flex-1 min-w-[200px] h-14 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm tracking-widest uppercase transition-all active:scale-95 ${
                  hasVoted 
                  ? "bg-gray-50 text-gray-400 border border-gray-100 cursor-default" 
                  : "bg-[#1A1A1A] text-white hover:bg-black shadow-lg shadow-black/5"
                }`}
              >
                {isVoting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : hasVoted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Voté
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Soutenir ce talent
                  </>
                )}
              </button>
              
              <button
                onClick={handleShare}
                className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center transition-all hover:bg-gray-50 active:scale-90 shadow-sm"
                title="Partager"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Suivre sur les réseaux</span>
              <div className="flex gap-4">
                {social_links.instagram && (
                  <a href={social_links.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:text-black hover:border-black/10 transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {social_links.tiktok && (
                  <a href={social_links.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:text-black hover:border-black/10 transition-all">
                    <TikTokIcon className="w-5 h-5" />
                  </a>
                )}
                {social_links.whatsapp && (
                  <a href={`https://wa.me/${social_links.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:text-black hover:border-black/10 transition-all">
                    <Phone className="w-5 h-5" />
                  </a>
                )}
                {!social_links.instagram && !social_links.tiktok && !social_links.whatsapp && (
                  <span className="text-xs text-gray-300 italic font-medium">Aucun réseau lié</span>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="prose prose-sm md:prose-base text-[#1A1A1A]/80 leading-relaxed max-w-none border-t border-gray-50 pt-8 mt-12">
              <p className="whitespace-pre-line">
                {bio_longue || "Biographie en cours de rédaction..."}
              </p>
            </div>
          </div>

          {/* Right Column: Videos */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {displayVideos.map((videoUrl, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] group relative"
                >
                  {videoUrl ? (
                    <iframe
                      src={getEmbedUrl(videoUrl)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`Video ${index + 1}`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center mb-4 transition-all group-hover:scale-110 shadow-sm">
                        <Play className="w-5 h-5 text-gray-200 fill-gray-200 translate-x-0.5" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-300">Vidéo à venir</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Disclaimer */}
            <p className="mt-8 text-[11px] text-gray-400 font-medium leading-relaxed max-w-md mx-auto text-center lg:text-left lg:mx-0">
              * Votez pour soutenir ce talent Béninois dans sa quête pour devenir ambassadeur. Un seul vote par talent est autorisé par membre.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

/**
 * Helper to convert YouTube URL to embed URL
 */
function getEmbedUrl(url: string): string {
  if (!url) return "";
  
  // Basic YouTube URL parsing
  let videoId = "";
  if (url.includes("v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("embed/")) {
    videoId = url.split("embed/")[1].split("?")[0];
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1` : url;
}
