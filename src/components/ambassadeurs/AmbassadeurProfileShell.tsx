"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Play, Heart, CheckCircle2, Loader2, MapPin,
  Instagram, MessageCircle, Share2, ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { confetti } from "tsparticles-confetti";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { useVoter } from "@/lib/auth/use-voter";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AmbassadeurProfileShellProps {
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getEmbedUrl(url: string): string {
  if (!url) return "";
  let id = "";
  if (url.includes("v=")) id = url.split("v=")[1].split("&")[0];
  else if (url.includes("youtu.be/")) id = url.split("youtu.be/")[1].split("?")[0];
  else if (url.includes("embed/")) id = url.split("embed/")[1].split("?")[0];
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : url;
}

function getThumb(url: string): string {
  if (!url) return "";
  let id = "";
  if (url.includes("v=")) id = url.split("v=")[1].split("&")[0];
  else if (url.includes("youtu.be/")) id = url.split("youtu.be/")[1].split("?")[0];
  else if (url.includes("embed/")) id = url.split("embed/")[1].split("?")[0];
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : "";
}

// ─── Primitives ───────────────────────────────────────────────────────────────

/** Ligne tricolore du drapeau béninois */
function FlagLine({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-[3px] rounded-full overflow-hidden", className)}>
      <div className="flex-1 bg-[#008751]" />
      <div className="flex-1 bg-[#FCD116]" />
      <div className="flex-1 bg-[#E8112D]" />
    </div>
  );
}

/** En-tête de section avec ligne flag de chaque côté */
function SectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <FlagLine className="w-8 flex-shrink-0" />
      <h2
        className="whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#1A1A1A]"
        style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}
      >
        {label}
      </h2>
      <FlagLine className="flex-1" />
    </div>
  );
}

// ─── VideoCard ────────────────────────────────────────────────────────────────

function VideoCard({ url, label, fallback }: { url: string; label: string; fallback: string }) {
  const [playing, setPlaying] = useState(false);
  const hasUrl = !!url;
  const thumb = getThumb(url);
  const embed = getEmbedUrl(url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-3"
    >
      <p
        className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#008751]"
        style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}
      >
        {label}
      </p>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0D0D0D] border border-black/5 group">
        {playing && hasUrl ? (
          <iframe
            src={`${embed}&autoplay=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={thumb || fallback || "/placeholder-portrait.jpg"}
              alt={label}
              fill
              className="object-cover opacity-75 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <button
              onClick={() => hasUrl && setPlaying(true)}
              disabled={!hasUrl}
              className="absolute inset-0 flex items-center justify-center group/play"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all",
                  hasUrl
                    ? "bg-white shadow-xl group-hover/play:bg-[#008751]"
                    : "bg-white/20"
                )}
              >
                <Play
                  className={cn(
                    "w-6 h-6 ml-1 transition-colors",
                    hasUrl
                      ? "text-[#1A1A1A] fill-[#1A1A1A] group-hover/play:text-white group-hover/play:fill-white"
                      : "text-white/40 fill-white/40"
                  )}
                />
              </motion.div>
            </button>

            <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
              <div className={cn("w-1.5 h-1.5 rounded-full", hasUrl ? "bg-[#008751]" : "bg-gray-400")} />
              <span
                className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70"
                style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}
              >
                {hasUrl ? "YouTube" : "À venir"}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── PhotoCard ────────────────────────────────────────────────────────────────

function PhotoCard({ url, label }: { url: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-3"
    >
      <p
        className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-gray-400"
        style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}
      >
        {label}
      </p>
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-black/5 bg-gray-50 group">
        <Image
          src={url}
          alt={label}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
          <div className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center shadow">
            <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AmbassadeurProfileShell({
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
}: AmbassadeurProfileShellProps) {
  const { session, isAuthenticated, checkHasVoted } = useVoter();
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [votesCount, setVotesCount] = useState(initialVotes);

  useEffect(() => {
    if (isAuthenticated) checkHasVoted(id).then(setHasVoted);
  }, [id, isAuthenticated, checkHasVoted]);

  const handleVote = async () => {
    if (!isAuthenticated) { toast.error("Connectez-vous pour voter"); return; }
    if (hasVoted || isVoting) return;
    setIsVoting(true);
    try {
      const { error } = await supabase.from("votes").insert([{
        user_id: session?.user.id,
        ambassadeur_id: id,
      }]);
      if (error) {
        if (error.code === "23505") { setHasVoted(true); toast.info("Vous avez déjà soutenu cet ambassadeur !"); }
        else throw error;
      } else {
        setHasVoted(true);
        setVotesCount((p: number) => p + 1);
        toast.success("Merci pour votre soutien !");
        const canvas = document.createElement("canvas");
        confetti(canvas, { particleCount: 120, spread: 70, origin: { y: 0.6 } });
      }
    } catch { toast.error("Erreur lors du vote."); }
    finally { setIsVoting(false); }
  };

  const hasVideos = video_urls.length > 0;
  const hasPhotos = photo_urls.length > 0;
  const videoLabels = ["Présentation", "Mon Parcours", "Mon Service", "Pourquoi Moi"];
  const photoLabels = ["Portrait", "En Action", "Atmosphère", "Signature"];

  // ─────────────────────────────────────────────────────────────────────────
  // NOTE: Ce composant s'insère dans le RootLayout qui fournit déjà le
  // <Header /> global. On ne recrée PAS de navbar ici pour éviter le doublon.
  // Le fond blanc est forcé via la classe bg-white sur la div racine,
  // ce qui écrase le bg-[#F9F9F7] du body pour cette page uniquement.
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-white text-[#1A1A1A] pb-24"
      style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      {/* Bouton Soutenir flottant (aligné en haut à droite, sous le Header global) */}
      <div className="max-w-4xl mx-auto px-6 pt-6 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleVote}
          disabled={isVoting || hasVoted}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-[0.15em] transition-all",
            hasVoted
              ? "bg-[#008751]/10 text-[#008751] border border-[#008751]/20"
              : "bg-[#008751] text-white shadow-lg shadow-[#008751]/20 hover:bg-[#006B3F]"
          )}
        >
          {isVoting
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : hasVoted
              ? <CheckCircle2 className="w-3.5 h-3.5" />
              : <Heart className="w-3.5 h-3.5" />}
          {hasVoted ? "Soutenu ✓" : "Soutenir"}
        </motion.button>
      </div>

      <main className="max-w-4xl mx-auto px-6">

        {/* ══ HERO / ID CARD ════════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-8 pb-12 text-center"
        >
          {/* Avatar */}
          <div className="relative w-28 h-28 mx-auto mb-6 rounded-2xl overflow-hidden border-[5px] border-white shadow-2xl group">
            <Image
              src={avatar_url || "/placeholder-portrait.jpg"}
              alt={full_name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
          </div>

          {/* Nom */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#1A1A1A]">
            {full_name}
          </h1>

          {/* Slogan */}
          {slogan && (
            <p className="mt-3 text-base text-gray-400 font-light italic tracking-wide">
              « {slogan} »
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="px-4 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-[0.15em] bg-[#008751]/8 text-[#008751] border border-[#008751]/20">
              {univers}
            </span>
            <span className="px-4 py-1.5 rounded-xl bg-gray-50 text-gray-500 text-[10px] font-extrabold uppercase tracking-[0.15em] border border-gray-100">
              {categorie}
            </span>
          </div>

          {/* Meta : ville + votes */}
          <div className="flex items-center justify-center gap-6 mt-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1A1A1A]" />
              {city}, Bénin
            </span>
            <span className="w-px h-4 bg-gray-200" />
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#E8112D]" />
              <strong className="text-[#1A1A1A]">{votesCount}</strong>&nbsp;soutiens
            </span>
          </div>

          {/* Réseaux sociaux */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {social_links.instagram && (
              <a href={social_links.instagram} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E1306C] hover:border-[#E1306C]/20 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {social_links.tiktok && (
              <a href={social_links.tiktok} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1A1A1A] hover:border-gray-300 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.53a8.26 8.26 0 004.84 1.55V6.64a4.85 4.85 0 01-1.07.05z" />
                </svg>
              </a>
            )}
            {social_links.whatsapp && (
              <a href={`https://wa.me/${social_links.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#25D366] hover:border-[#25D366]/20 transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
            <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Biographie */}
          {bio_longue && (
            <div className="mt-8 max-w-xl mx-auto">
              <p className="text-gray-500 leading-8 font-light text-[15px]">{bio_longue}</p>
            </div>
          )}

          {/* Ligne flag sous le hero */}
          <FlagLine className="w-full mt-10" />
        </motion.section>

        {/* ══ IMMERSION VIDÉO ════════════════════════════════════════════════ */}
        {hasVideos && (
          <section className="py-10">
            <SectionTitle label="Immersion Vidéo" />
            <div className="grid grid-cols-1 gap-8">
              {video_urls.map((url, i) => (
                <VideoCard
                  key={i}
                  url={url}
                  label={videoLabels[i] ?? `Vidéo ${i + 1}`}
                  fallback={avatar_url}
                />
              ))}
            </div>
          </section>
        )}

        {/* ══ GALERIE PHOTO ══════════════════════════════════════════════════ */}
        {hasPhotos && (
          <section className="py-10">
            <SectionTitle label="Galerie Photo" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {photo_urls.map((url, i) => (
                <PhotoCard
                  key={i}
                  url={url}
                  label={photoLabels[i] ?? `Photo ${i + 1}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* ══ CTA VOTE ══════════════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="py-12"
        >
          <div className="rounded-2xl border border-gray-100 p-8 md:p-10 text-center space-y-5 bg-[#FAFAFA]">
            <FlagLine className="w-12 mx-auto" />
            <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#008751]">
              Soutenir cet ambassadeur
            </p>
            <p className="text-3xl font-extrabold text-[#1A1A1A]">
              {votesCount}
              <span className="text-lg font-normal text-gray-400 ml-2">soutiens</span>
            </p>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleVote}
              disabled={isVoting || hasVoted}
              className={cn(
                "inline-flex items-center gap-3 px-8 py-4 rounded-xl text-[12px] font-extrabold uppercase tracking-[0.2em] transition-all",
                hasVoted
                  ? "bg-[#008751]/10 text-[#008751] border border-[#008751]/20"
                  : "bg-[#008751] text-white shadow-xl shadow-[#008751]/20 hover:bg-[#006B3F]"
              )}
            >
              {isVoting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : hasVoted
                  ? <CheckCircle2 className="w-4 h-4" />
                  : <Heart className="w-4 h-4" />}
              {hasVoted ? "Merci pour votre soutien !" : "Voter maintenant"}
            </motion.button>
            <p className="text-[11px] text-gray-300 font-medium">Un vote par compte · Gratuit</p>
          </div>
        </motion.section>

      </main>
    </div>
  );
}
