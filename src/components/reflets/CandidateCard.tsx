"use client";

import React, { useRef, useEffect, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  name: string;
  image: string | null;
  video: string | null;
  color: "green" | "red";
  isActive: boolean;
  intensity?: number; // Valeur de 0 à 50 (distance depuis le centre du slider)
  className?: string;
}

const extractYouTubeId = (rawUrl: string | null) => {
  if (!rawUrl) return null;
  const match = rawUrl.match(/(?:youtube\.com\/embed\/|watch\?v=|youtu\.be\/|watch\?.*v=)([^?&]+)/);
  return match ? match[1] : rawUrl.split("/").pop() || null;
};

export default function CandidateCard({ name, image, video, color, isActive, intensity = 0, className }: CandidateCardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoId = extractYouTubeId(video);

  const sendCommand = (func: string, args: any = "") => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  };

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => sendCommand("playVideo"), 300);
      return () => clearTimeout(t);
    } else {
      sendCommand("pauseVideo");
    }
  }, [isActive]);

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

  // Calcul visuel basé sur l'intensité du vote
  const filterIntensity = 1 + (intensity / 100); // Augmente la luminosité/saturation
  const shadowColor = color === "green" ? "rgba(0, 107, 63, 0.6)" : "rgba(189, 0, 32, 0.6)";

  return (
    <motion.div
      animate={{
        scale: isActive ? 1 : 0.98,
        filter: `brightness(${isActive ? filterIntensity : 0.7}) saturate(${isActive ? 1.2 : 0.8})`
      }}
      className={cn("relative rounded-[24px] overflow-hidden bg-[#1a1a1a] isolate group flex-1 w-full", className)}
    >
      {/* Media Layer */}
      <div className="absolute inset-0 z-0">
        {videoId ? (
          <div className="w-full h-full scale-[1.05]"> {/* Overflow léger pour masquer les bords de l'iframe */}
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playsinline=1&modestbranding=1&rel=0&enablejsapi=1&playlist=${videoId}`}
              className="w-full h-full pointer-events-none object-cover"
              allow="autoplay; encrypted-media"
            />
          </div>
        ) : (
          <img src={image || ""} alt={name} className="w-full h-full object-cover opacity-60" />
        )}
      </div>

      {/* Overlay dégradé Premium */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6">
        {/* Top: Status Indicator */}
        <div className="flex justify-start">
          <AnimatePresence>
            {intensity > 10 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={cn("px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter", color === "green" ? "bg-[#006b3f]" : "bg-[#bd0020]")}
              >
                En tête (+{Math.round(intensity)}%)
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Info */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", color === "green" ? "bg-[#006b3f]" : "bg-[#bd0020]")}
                style={{ boxShadow: `0 0 15px ${shadowColor}` }} />
              <p className="text-white font-manrope font-extrabold text-xl uppercase tracking-tighter italic">
                {name}
              </p>
            </div>
          </div>

          {/* Controls */}
          {videoId && (
            <button
              onClick={toggleMute}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all pointer-events-auto"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}