"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Play, Heart, CheckCircle2, Loader2, MapPin, Instagram,
  MessageCircle, ChevronRight, Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { confetti } from "tsparticles-confetti";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { useVoter } from "@/lib/auth/use-voter";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TalentProfileShellProps {
  id: string;
  full_name: string;
  city: string;
  avatar_url: string;
  bio_longue: string;
  slogan?: string;
  video_urls: string[];
  photo_urls?: string[];
  votes: number;
  univers: string;
  categorie: string;
  social_links: {
    instagram?: string | null;
    tiktok?: string | null;
    whatsapp?: string | null;
  };
}

// ─── Constants ───────────────────────────────────────────────────────────────

const VIDEO_LABELS = ["Présentation", "Mon Parcours", "Mon Service", "Pourquoi Moi"];
const PHOTO_LABELS = ["Éclat", "Identité", "Mouvement", "Signature"];

// Correspondance des formats photo/vidéo par position
const PHOTO_ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-video", "aspect-[4/5]"] as const;
const VIDEO_ASPECTS = ["aspect-video", "aspect-video", "aspect-video", "aspect-video"] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getEmbedUrl(url: string | undefined): string {
  if (!url) return "";
  let videoId = "";
  if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
  else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
  else if (url.includes("embed/")) videoId = url.split("embed/")[1].split("?")[0];
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : url;
}

function getYoutubeThumbnail(url: string | undefined): string {
  if (!url) return "";
  let videoId = "";
  if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
  else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
  else if (url.includes("embed/")) videoId = url.split("embed/")[1].split("?")[0];
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Ligne tricolore du drapeau béninois */
function BeninFlagLine({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-[3px] w-full overflow-hidden rounded-full", className)}>
      <div className="flex-1 bg-[#008751]" />
      <div className="flex-1 bg-[#FCD116]" />
      <div className="flex-1 bg-[#E8112D]" />
    </div>
  );
}

/** Carte vidéo YouTube avec bouton play */
function VideoCard({
  url,
  label,
  className,
  aspectClass = "aspect-video",
  avatarFallback,
}: {
  url?: string;
  label: string;
  className?: string;
  aspectClass?: string;
  avatarFallback: string;
}) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getEmbedUrl(url);
  const thumbnail = getYoutubeThumbnail(url);
  const hasVideo = !!url;

  return (
    <div className={cn("group flex flex-col gap-3", className)}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#008751]">{label}</p>
      <div className={cn("relative overflow-hidden bg-[#0F0F0F] rounded-2xl border border-black/5", aspectClass)}>
        {playing && hasVideo ? (
          <iframe
            src={`${embedUrl}&autoplay=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {/* Thumbnail */}
            <div className="absolute inset-0">
              <Image
                src={thumbnail || avatarFallback || "/placeholder-portrait.jpg"}
                alt={label}
                fill
                className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Play button */}
            <button
              onClick={() => hasVideo && setPlaying(true)}
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-300",
                hasVideo ? "cursor-pointer" : "cursor-default"
              )}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20",
                  hasVideo ? "bg-white/90 shadow-xl" : "bg-white/20"
                )}
              >
                <Play className={cn("w-5 h-5 fill-current ml-0.5", hasVideo ? "text-[#1A1A1A]" : "text-white/50")} />
              </motion.div>
            </button>

            {/* Label bottom */}
            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                {hasVideo ? "YouTube" : "À venir"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Carte photo style "Light Essence Photography" */
function PhotoCard({
  url,
  label,
  className,
  aspectClass = "aspect-square",
}: {
  url?: string;
  label: string;
  className?: string;
  aspectClass?: string;
}) {
  return (
    <div className={cn("group flex flex-col gap-3", className)}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <div className={cn("relative overflow-hidden bg-gray-50 rounded-2xl border border-black/5", aspectClass)}>
        {url ? (
          <Image
            src={url}
            alt={label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {/* Placeholder elegante */}
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Photo</span>
          </div>
        )}
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500 rounded-2xl" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TalentProfileShell({
  id,
  full_name,
  city,
  avatar_url,
  bio_longue,
  slogan,
  video_urls = [],
  photo_urls = [],
  votes: initialVotes,
  univers,
  categorie,
  social_links,
}: TalentProfileShellProps) {
  const { session, isAuthenticated, checkHasVoted } = useVoter();
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [votesCount, setVotesCount] = useState(initialVotes);

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
      const { error } = await supabase.from("votes").insert([{
        user_id: session?.user.id,
        talent_id: id,
      }]);

      if (error) {
        if (error.code === "23505") {
          setHasVoted(true);
          toast.info("Vous avez déjà soutenu ce talent !");
        } else {
          throw error;
        }
      } else {
        setHasVoted(true);
        setVotesCount((prev: number) => prev + 1);
        toast.success("Soutien enregistré ! Merci.");
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

  // Padder les arrays à 4 éléments
  const videos = [...video_urls, "", "", "", ""].slice(0, 4);
  const photos = [...photo_urls, "", "", "", ""].slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] font-sans antialiased">

      {/* ── HERO / ID CARD ─────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#008751]">BeninEase</span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleVote}
            disabled={isVoting || hasVoted}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] transition-all",
              hasVoted
                ? "bg-[#008751]/10 text-[#008751] border border-[#008751]/20"
                : "bg-[#008751] text-white shadow-lg shadow-[#008751]/25 hover:bg-[#006B3F]"
            )}
          >
            {isVoting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : hasVoted ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Heart className="w-3.5 h-3.5" />
            )}
            {hasVoted ? "Soutenu" : "Soutenir"}
          </motion.button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">

        {/* ── PROFILE CARD ───────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

              {/* Avatar */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl flex-shrink-0 group">
                <Image
                  src={avatar_url || "/placeholder-portrait.jpg"}
                  alt={full_name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
              </div>

              {/* Identité */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{full_name}</h1>
                  {slogan && (
                    <p className="mt-1 text-base text-gray-400 italic font-light">« {slogan} »</p>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-4 py-1.5 bg-[#008751]/8 text-[#008751] rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-[#008751]/15">
                    {univers}
                  </span>
                  <span className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-gray-100">
                    {categorie}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-5">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    {city}, Bénin
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                    <Heart className="w-3.5 h-3.5 text-[#E8112D]" />
                    <span className="text-[#1A1A1A] font-black">{votesCount}</span>&nbsp;soutiens
                  </div>
                </div>

                {/* Réseaux sociaux */}
                <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
                  {social_links.instagram && (
                    <a
                      href={social_links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#E1306C] hover:border-[#E1306C]/20 transition-all"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {social_links.tiktok && (
                    <a
                      href={social_links.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] hover:border-gray-400 transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.53a8.26 8.26 0 004.84 1.55V6.64a4.85 4.85 0 01-1.07.05z"/>
                      </svg>
                    </a>
                  )}
                  {social_links.whatsapp && (
                    <a
                      href={`https://wa.me/${social_links.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#25D366] hover:border-[#25D366]/20 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                  <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1A1A1A] transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Benin Flag Line */}
          <BeninFlagLine />

          {/* Biographie */}
          {bio_longue && (
            <div className="px-8 md:px-10 py-6">
              <p className="text-gray-500 leading-7 text-base font-light max-w-2xl">
                {bio_longue}
              </p>
            </div>
          )}
        </section>

        {/* ── SÉPARATEUR SECTION CONTENU ─────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <BeninFlagLine className="flex-1" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 whitespace-nowrap">Portfolio</span>
          <BeninFlagLine className="flex-1" />
        </div>

        {/* ── BENTO BOX GRID — ENTRELACEMENT VIDÉO / PHOTO ────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-8"
        >
          {videos.map((videoUrl, i) => {
            const photo = photo_urls?.[i]; // undefined si tableau vide ou index manquant
            const hasPhoto = !!photo;
            const isFirst = i === 0;
            const isLast = i === videos.length - 1;

            return (
              <div key={i} className="flex flex-col gap-6">
                {/* Vidéo : pleine largeur pour la 1ère et la dernière */}
                <VideoCard
                  url={videoUrl}
                  label={VIDEO_LABELS[i] ?? `Vidéo ${i + 1}`}
                  aspectClass={isFirst || isLast ? "aspect-video" : "aspect-video"}
                  avatarFallback={avatar_url}
                />

                {/* Photo associée — seulement si elle existe */}
                {hasPhoto && (
                  <PhotoCard
                    url={photo}
                    label={PHOTO_LABELS[i] ?? `Photo ${i + 1}`}
                    aspectClass={PHOTO_ASPECTS[i] ?? "aspect-square"}
                  />
                )}

                {/* Séparateur entre les blocs (sauf après le dernier) */}
                {!isLast && (
                  <BeninFlagLine className="opacity-30" />
                )}
              </div>
            );
          })}
        </motion.section>

        {/* ── CALL TO ACTION VOTE ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#008751] mb-1">Soutenir ce talent</p>
            <p className="text-2xl font-bold">
              <span className="text-[#008751]">{votesCount}</span> personnes ont déjà voté
            </p>
            <p className="text-gray-400 text-sm mt-1">Votre soutien compte. Un vote par compte.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleVote}
            disabled={isVoting || hasVoted}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.15em] transition-all",
              hasVoted
                ? "bg-[#008751]/10 text-[#008751] border border-[#008751]/20"
                : "bg-[#008751] text-white shadow-xl shadow-[#008751]/25 hover:bg-[#006B3F]"
            )}
          >
            {isVoting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : hasVoted ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Heart className="w-4 h-4" />
            )}
            {hasVoted ? "Merci pour votre soutien !" : "Voter maintenant"}
            {!hasVoted && !isVoting && <ChevronRight className="w-4 h-4" />}
          </motion.button>
        </motion.div>

      </main>
    </div>
  );
}
