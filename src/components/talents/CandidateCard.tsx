"use client";

import React, { useRef, useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  talent: {
    id: string;
    prenom_talent?: string;
    profile_image?: string;
    video_url?: string;
    slogan?: string;
  };
  score: number;
  color: string;
  isActive: boolean;
  className?: string;
}

/**
 * Extrait l'ID de la vidéo YouTube pour l'intégration iframe
 */
const extractYouTubeId = (rawUrl: string | null | undefined) => {
  if (!rawUrl) return null;
  const match = rawUrl.match(/(?:youtube\.com\/embed\/|watch\?v=|youtu\.be\/|watch\?.*v=)([^?&]+)/);
  return match ? match[1] : rawUrl.split("/").pop() || null;
};

export default function CandidateCard({
  talent,
  score,
  color,
  isActive,
  className
}: CandidateCardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Sécurité si les données du talent sont absentes
  if (!talent) {
    return <div className="flex-1 bg-gray-100 animate-pulse rounded-[24px]" />;
  }

  const videoId = extractYouTubeId(talent.video_url);

  // Communication avec l'API YouTube IFrame
  const sendCommand = (func: string, args: any = "") => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  };

  // Gestion de la lecture automatique quand le duel est actif
  useEffect(() => {
    if (isActive && videoId) {
      const t = setTimeout(() => sendCommand("playVideo"), 300);
      return () => clearTimeout(t);
    } else {
      sendCommand("pauseVideo");
    }
  }, [isActive, videoId]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      sendCommand("unMute");
      sendCommand("setVolume", 100);
    } else {
      sendCommand("mute");
    }
    setIsMuted(!isMuted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex-1 w-full rounded-[24px] overflow-hidden bg-gray-100 shadow-sm border border-gray-100 group",
        className
      )}
    >
      {/* BACKGROUND MEDIA (Image ou Vidéo) */}
      <div className="absolute inset-0 z-0">
        {videoId ? (
          <div className="w-full h-full">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playsinline=1&modestbranding=1&rel=0&enablejsapi=1&playlist=${videoId}`}
              className="w-full h-full pointer-events-none object-cover scale-[1.6]"
              allow="autoplay; encrypted-media"
            />
          </div>
        ) : (
          <img
            src={talent.profile_image || "/placeholder-talent.jpg"}
            alt={talent.prenom_talent}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>

      {/* OVERLAY DÉGRADÉ (Pour la lisibilité du texte blanc) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

      {/* CONTENT LAYER */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-5">
        <div className="flex items-end justify-between">

          {/* Nom du Talent avec le point de couleur Arena */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                style={{ backgroundColor: color }}
              />
              <h2 className="text-white font-manrope font-black text-2xl uppercase tracking-tighter leading-none">
                {talent.prenom_talent || "Talent"}
              </h2>
            </div>
            {talent.slogan && (
              <p className="text-white/60 text-[9px] uppercase tracking-[0.2em] font-bold pl-5 italic">
                {talent.slogan}
              </p>
            )}
          </div>

          {/* Score & Contrôles */}
          <div className="flex flex-col items-end gap-3">
            <motion.span
              key={score}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-white/40 font-manrope font-black text-3xl tabular-nums tracking-tighter"
            >
              {score}%
            </motion.span>

            {videoId && (
              <button
                onClick={toggleMute}
                className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white active:scale-90 transition-transform"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}