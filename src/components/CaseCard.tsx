'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Howl } from 'howler';
import type { LifeCase } from "@/features/consultation/useLifeCases";

interface Props {
  lifeCase: LifeCase;
  isActive: boolean;
}

const STORAGE_BASE_URL = `https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public`;

// Génère 60 hauteurs de barres aléatoires mais harmonieuses pour un visualiseur plus fin
const BAR_HEIGHTS = [
  4, 7, 10, 14, 18, 22, 19, 15, 12, 16, 20, 24, 21, 17, 13, 11, 15, 19, 23, 20, 16, 12, 8, 5,
  6, 9, 13, 17, 21, 25, 22, 18, 14, 12, 16, 20, 24, 21, 17, 13, 9, 6, 10, 14, 18, 22, 19, 15,
  12, 16, 20, 24, 21, 17, 13, 11, 15, 19, 23, 20
];

const CaseCard = ({ lifeCase, isActive }: Props) => {
  // URLs construites avec cas_numero (entier) qui correspond aux noms de fichiers : cas1.jpg, cas1.mp3...
  const photoUrl = `https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/images_casdevie/cas${lifeCase.cas_numero}.jpg`;
  const audioUrl = `https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/casdevie/cas${lifeCase.cas_numero}.mp3`;

  const howlRef = useRef<Howl | null>(null);
  const timerRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Howler.js - Gestion audio ultra-robuste
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    const sound = new Howl({
      src: [audioUrl],
      html5: true, // Crucial pour le streaming et éviter les erreurs de chargement bloquantes
      preload: true,
      onload: () => {
        setDuration(sound.duration());
      },
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
      onloaderror: (id, err) => console.error('Audio load error:', err),
      onplayerror: (id, err) => {
        console.error('Audio play error:', err);
        sound.once('unlock', () => sound.play());
      }
    });

    howlRef.current = sound;

    // Timer pour la barre de progression
    const updateProgress = () => {
      if (sound.playing()) {
        setCurrentTime(sound.seek());
      }
      timerRef.current = requestAnimationFrame(updateProgress);
    };
    timerRef.current = requestAnimationFrame(updateProgress);

    return () => {
      sound.unload();
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      howlRef.current = null;
    };
  }, [audioUrl]);

  // Pause quand la carte n'est plus active
  useEffect(() => {
    if (!isActive && howlRef.current) {
      howlRef.current.pause();
    }
  }, [isActive]);

  const togglePlay = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    const sound = howlRef.current;
    if (!sound) return;

    if (sound.playing()) {
      sound.pause();
    } else {
      sound.play();
    }
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const sound = howlRef.current;
    if (!sound || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const newTime = pct * duration;
    sound.seek(newTime);
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
      {/* Audio is managed imperatively via ref */}

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
            onPointerDown={togglePlay}
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

        {/* Waveform visualizer - Plus fin et élégant */}
        <div className="flex items-end justify-center gap-[1.5px] h-6 px-2">
          {BAR_HEIGHTS.map((h, i) => (
            <motion.span
              key={i}
              animate={isPlaying
                ? { 
                    height: [h * 0.3, h, h * 0.5, h * 0.8, h * 0.3], 
                    opacity: [0.4, 1, 0.6, 0.9, 0.4],
                    backgroundColor: ["rgba(255,255,255,0.4)", "rgba(29,185,84,1)", "rgba(255,255,255,0.6)", "rgba(29,185,84,0.8)", "rgba(255,255,255,0.4)"]
                  }
                : { height: 2, opacity: 0.15, backgroundColor: "rgba(255,255,255,1)" }
              }
              transition={{ 
                repeat: Infinity, 
                duration: 1.8 + (Math.random() * 0.4), 
                delay: i * 0.03, 
                ease: "easeInOut" 
              }}
              className="w-[1.5px] rounded-full shadow-[0_0_8px_rgba(29,185,84,0.3)]"
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