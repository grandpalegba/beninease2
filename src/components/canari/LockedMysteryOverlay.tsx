"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LockedMysteryOverlayProps {
  lockedUntil: number;
  onUnlock: () => void;
}

export default function LockedMysteryOverlay({ lockedUntil, onUnlock }: LockedMysteryOverlayProps) {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = lockedUntil - now;

      if (remaining <= 0) {
        setTimeRemaining("00:00:00");
        setTimeout(onUnlock, 1000);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil, onUnlock]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center p-8"
    >
      {/* Brume animée */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 text-center max-w-2xl">
        {/* Canari éteint */}
        <motion.div
          className="w-32 h-32 mx-auto mb-8 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center"
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-6xl grayscale opacity-50">🏺</div>
        </motion.div>

        {/* Vieil homme africain */}
        <motion.div
          className="w-48 h-48 mx-auto mb-8 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {/* Silhouette du vieil homme */}
          <div className="w-full h-full bg-gradient-to-b from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
            <div className="text-6xl">👴</div>
          </div>
          {/* Doigt devant la bouche */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
            🤫
          </div>
        </motion.div>

        {/* Textes */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-gray-300 text-3xl font-serif font-bold">
            Le Silence des Ancêtres
          </h2>
          
          <p className="text-gray-400 text-lg leading-relaxed">
            "Les Ancêtres ferment ce mystère pour un cycle de 48 heures."
          </p>
          
          <p className="text-gray-500 italic">
            "Le savoir ne se force pas. Reviens lorsque le silence aura fait son œuvre."
          </p>

          {/* Timer */}
          <motion.div
            className="mt-8 p-6 bg-gray-800/50 border border-gray-700 rounded-2xl"
            animate={{ 
              boxShadow: timeRemaining === "00:00:00" 
                ? "0 0 20px rgba(255,255,255,0.2)" 
                : "0 0 10px rgba(255,255,255,0.1)"
            }}
          >
            <p className="text-gray-400 text-sm mb-2">Temps d'attente restant</p>
            <p className="text-yellow-600 text-4xl font-mono font-bold">
              {timeRemaining}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
