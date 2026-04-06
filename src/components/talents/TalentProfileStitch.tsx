"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Share2, Heart, Play, Camera } from "lucide-react";

interface TalentProfileStitchProps {
  id: string;
  prenom: string;
  nom: string;
  avatar_url: string;
  bio: string;
  slogan: string;
  categorie: string;
  univers: string;
  video_urls?: string[];
  photo_urls?: string[];
  votes: number;
  onVote: () => void;
  onShare: () => void;
  isVoting?: boolean;
}

/**
 * TalentProfileStitch - Présentation pure du profil (UI uniquement).
 * Design STRICTEMENT identique au HTML "Stitch".
 */
export default function TalentProfileStitch({
  prenom,
  nom,
  avatar_url,
  bio,
  slogan,
  categorie,
  univers,
  video_urls = [],
  photo_urls = [],
  votes,
  onVote,
  onShare,
  isVoting = false,
}: TalentProfileStitchProps) {
  const hasVideos = video_urls.length > 0;
  const hasPhotos = photo_urls.length > 0;

  return (
    <section className="mb-24 text-center max-w-4xl mx-auto px-6">
      {/* ═ HERO SECTION (HTML STITCH) ════════════════════════════════════════ */}
      <div className="flex justify-center mb-12">
        <div className="w-80 h-80 md:w-96 md:h-96 overflow-hidden rounded-3xl relative shadow-xl">
          <Image
            src={avatar_url || "/placeholder-portrait.jpg"}
            alt={`${prenom} ${nom}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 320px, 384px"
          />
        </div>
      </div>

      <h1 className="text-5xl md:text-6xl font-black uppercase tracking-[0.1em] text-[#1A1A1A]">
        {prenom} {nom}
      </h1>

      <p className="italic text-gray-500 mt-2 text-lg">
        {slogan ? `« ${slogan} »` : "Détenteur d'un savoir-faire unique"}
      </p>

      <p className="mt-8 text-gray-600 max-w-xl mx-auto leading-relaxed text-lg">
        {bio}
      </p>

      <div className="mt-8 text-[#D4AF37] uppercase font-black tracking-widest text-sm">
        {categorie} · {univers}
      </div>

      <div className="flex flex-col items-center gap-4 mt-10">
        <button
          onClick={onVote}
          disabled={isVoting}
          className={cn(
            "px-12 py-5 bg-[#008751] text-white rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20",
            isVoting && "opacity-50 cursor-not-allowed"
          )}
        >
          {isVoting ? "Soutien en cours..." : "Voter (Soutenir)"}
        </button>

        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            <Heart className="w-3 h-3 text-emerald-600 fill-emerald-600" />
            <span>{votes} Soutiens reçus</span>
        </div>
      </div>

      {/* Share Button (Lucide Icon for high-end look) */}
      <button 
        onClick={onShare}
        className="mt-6 p-4 rounded-full bg-gray-50 border border-gray-100 text-gray-400 hover:text-gray-600 transition-all shadow-sm"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* ═ IMMERSION VIDÉO ══════════════════════════════════════════════════ */}
      {hasVideos && (
        <div className="mt-24 text-left">
          <h4 className="text-xl font-black uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
             <Play className="w-5 h-5 text-[#008751]" /> Immersion
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {video_urls.slice(0, 4).map((url, i) => (
              <div key={i} className="aspect-video bg-gray-900 rounded-3xl overflow-hidden relative border-8 border-gray-50">
                <iframe
                  src={url.includes('youtube.com') || url.includes('youtu.be') 
                    ? `https://www.youtube.com/embed/${url.split('v=')[1] || url.split('/').pop()}?rel=0`
                    : url}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═ GALERIE PHOTO ═════════════════════════════════════════════════════ */}
      {hasPhotos && (
        <div className="mt-24 text-left">
          <h4 className="text-xl font-black uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
             <Camera className="w-5 h-5 text-amber-600" /> Galerie
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {photo_urls.map((url, i) => (
              <div key={i} className="aspect-square relative rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform">
                <Image
                  src={url}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
