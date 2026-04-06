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
 * - Implémente la navigation discrète (flèches) à la place du swipe dominant.
 * - Assure une immersion totale dans le storytelling vertical.
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
    <div className="relative w-full">
      {/* 🧭 NAVIGATION DISCRÈTE (Digital Atelier Feel) */}
      <nav className="fixed inset-y-0 left-0 right-0 z-[60] flex items-center justify-between px-4 pointer-events-none">
        {prevSlug && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.3, x: 0 }}
            whileHover={{ opacity: 1, x: 5 }}
            onClick={() => router.push(`/talents/${prevSlug}`)}
            className="p-4 rounded-full bg-white/50 backdrop-blur-sm shadow-sm pointer-events-auto transition-all"
            aria-label="Profil Précédent"
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
            aria-label="Profil Suivant"
          >
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </motion.button>
        )}
      </nav>

      {/* Animation d'entrée pour le profil global */}
      <AnimatePresence mode="wait">
        <motion.div
          key={talent.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full"
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
