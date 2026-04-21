'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import type { LifeCase } from "@/features/consultation/useLifeCases";

interface Props {
  lifeCase: LifeCase;
  isActive: boolean;
}

const STORAGE_BASE_URL = `https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public`;

const BAR_HEIGHTS = [3, 5, 8, 12, 16, 14, 10, 13, 16, 11, 8, 14, 16, 12, 9, 6, 10, 14, 16, 13, 10, 8, 5, 3];

const CaseCard = ({ lifeCase, isActive }: Props) => {
  // URLs construites avec cas_numero (entier) qui correspond aux noms de fichiers : cas1.jpg, cas1.mp3...
  const photoUrl = `https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/images_casdevie/cas${lifeCase.cas_numero}.jpg`;
  const audioUrl = `https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/casdevie/cas${lifeCase.cas_numero}.mp3`;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Pause when card becomes inactive (swipe away)
  useEffect(() => {
    if (!isActive) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  // Reset audio and set up listeners robustly
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    const audio = audioRef.current;
    if (!audio) return;

    // S'assure que le navigateur charge l'audio
    audio.load();

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e: Event) => console.error('Audio load error:', e);

    // Si les métadonnées sont déjà chargées
    if (audio.readyState >= 1) {
      handleLoadedMetadata();
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [lifeCase.cas_numero]);

  const togglePlay = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.error('Audio play error:', err));
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const newTime = pct * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Hidden audio element */}
      <audio
        key={`audio-${lifeCase.cas_numero}`}
        ref={audioRef}
        src={audioUrl}
        preload="auto"
        crossOrigin="anonymous"
      />

      {/* Album Art */}
      <img
        alt={lifeCase.persona}
        src={photoUrl}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Cinematic gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* ── Spotify-style bottom panel ── */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pt-4 pb-7 z-20 flex flex-col gap-3">

        {/* Label */}
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 0.75, x: 0 }}
          className="text-[9px] tracking-[0.35em] uppercase font-bold text-[#fcd116]"
        >
          {lifeCase.label || "Consultation"}
        </motion.span>

        {/* Persona + Play button */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[1.55rem] font-bold text-white leading-tight tracking-tight">
            {lifeCase.persona.split(',').slice(0, 2).join(',')}
          </h2>

          {/* Spotify green play/pause */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.08 }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={togglePlay}
            className="w-[52px] h-[52px] shrink-0 bg-[#1DB954] rounded-full flex items-center justify-center shadow-2xl shadow-[#1DB954]/30"
          >
            {isPlaying
              ? <Pause size={20} fill="black" strokeWidth={0} />
              : <Play size={20} fill="black" strokeWidth={0} className="ml-[2px]" />
            }
          </motion.button>
        </div>

        {/* Progress bar */}
        <div
          className="relative h-[3px] bg-white/20 rounded-full cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div
            className="absolute left-0 top-0 h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
          {/* Scrubber dot */}
          <motion.div
            className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Time */}
        <div className="flex justify-between text-[10px] text-white/40 font-medium -mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Waveform visualizer */}
        <div className="flex items-end gap-[2.5px] h-5">
          {BAR_HEIGHTS.map((h, i) => (
            <motion.span
              key={i}
              animate={isPlaying
                ? { height: [h * 0.4, h, h * 0.6, h * 0.9, h * 0.4], opacity: [0.5, 1, 0.7, 1, 0.5] }
                : { height: 2, opacity: 0.25 }
              }
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.06, ease: "easeInOut" }}
              className="flex-1 bg-[#1DB954] rounded-full"
              style={{ minWidth: 2 }}
            />
          ))}
        </div>

        {/* Swipe up hint */}
        <div className="flex justify-center mt-1">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-8 h-1 bg-white/25 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default CaseCard;