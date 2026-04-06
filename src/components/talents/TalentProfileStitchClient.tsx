"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import TalentProfileEditorial from "./TalentProfileEditorial";

interface TalentProfileStitchClientProps {
  talent: any;
  nextSlug: string | null;
  prevSlug: string | null;
}

/**
 * TalentProfileStitchClient - Orchestrateur du Profil Éditorial.
 * - Gère le vote (RPC) et le partage.
 * - Restauration du Swipe horizontal subtil (drag="x").
 * - Maintien des flèches de navigation pour l'accessibilité desktop.
 */
export default function TalentProfileStitchClient({
  talent,
  nextSlug,
  prevSlug,
}: TalentProfileStitchClientProps) {
  const router = useRouter();
  const [isVoting, setIsVoting] = useState(false);
  const [votesCount, setVotesCount] = useState(talent.weighted_votes_total || 0);

  // 1. Prefetch des profils adjacents
  useEffect(() => {
    if (nextSlug) router.prefetch(`/talents/${nextSlug}`);
    if (prevSlug) router.prefetch(`/talents/${prevSlug}`);
  }, [nextSlug, prevSlug, router]);

  // 2. Gestion du Vote
  const handleVote = async () => {
    try {
      setIsVoting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Connectez-vous pour voter");
        return;
      }
      const { error } = await supabase.rpc("cast_weighted_vote", {
        target_talent_id: talent.id,
      });
      if (error) {
        if (error.message.includes("déjà voté")) toast.info("Vous avez déjà soutenu ce talent !");
        else throw error;
      } else {
        toast.success("Merci pour votre soutien !");
        setVotesCount((prev: number) => prev + 1);
      }
    } catch (err: any) {
      console.error("Vote error:", err);
      toast.error("Erreur lors du vote");
    } finally {
      setIsVoting(false);
    }
  };

  // 3. Gestion du Partage
  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: `${talent.prenom} ${talent.nom} | BeninEase`,
      text: `Découvrez le talent de ${talent.prenom} ${talent.nom} sur BeninEase !`,
      url: shareUrl,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Lien copié !");
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* 🧭 NAVIGATION DISCRÈTE (Desktop Arrows) */}
      <nav className="fixed inset-y-0 left-0 right-0 z-[60] flex items-center justify-between px-4 pointer-events-none hidden md:flex">
        {prevSlug && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.3, x: 0 }}
            whileHover={{ opacity: 1, x: 5 }}
            onClick={() => router.push(`/talents/${prevSlug}`)}
            className="p-4 rounded-full bg-white/50 backdrop-blur-sm shadow-sm pointer-events-auto transition-all"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </motion.button>
        )}
        {nextSlug && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 0.3, x: 0 }}
            whileHover={{ opacity: 1, x: -5 }}
            onClick={() => router.push(`/talents/${nextSlug}`)}
            className="p-4 rounded-full bg-white/50 backdrop-blur-sm shadow-sm pointer-events-auto transition-all"
            aria-label="Suivant"
          >
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </motion.button>
        )}
      </nav>

      {/* ↔️ SWIPE NAVIGATION (Mobile + Gesture) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={talent.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.05} // Swipe très subtil pour ne pas gêner le scroll vertical
          onDragEnd={(e, info) => {
            const threshold = 80; // Seuil de déclenchement
            if (info.offset.x < -threshold && nextSlug) {
              router.push(`/talents/${nextSlug}`);
            } else if (info.offset.x > threshold && prevSlug) {
              router.push(`/talents/${prevSlug}`);
            }
          }}
          className="w-full cursor-grab active:cursor-grabbing"
        >
          <TalentProfileEditorial
            talent={talent}
            votes={votesCount}
            onVote={handleVote}
            onShare={handleShare}
            isVoting={isVoting}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
