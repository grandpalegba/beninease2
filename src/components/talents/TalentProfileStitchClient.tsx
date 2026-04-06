"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import TalentProfileStitch from "./TalentProfileStitch";

interface TalentProfileStitchClientProps {
  talent: any;
  nextSlug: string | null;
  prevSlug: string | null;
}

/**
 * TalentProfileStitchClient - Logique client pour le profil Stitch.
 * Gère le swipe horizontal, le prefetch, le vote et le partage.
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

  // 2. Gestion du Vote (RPC)
  const handleVote = async () => {
    try {
      setIsVoting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Connectez-vous pour voter");
        return;
      }

      const { data, error } = await supabase.rpc("cast_weighted_vote", {
        target_talent_id: talent.id,
      });

      if (error) {
        if (error.message.includes("déjà voté")) {
          toast.info("Vous avez déjà soutenu ce talent !");
        } else {
          throw error;
        }
      } else {
        toast.success("Merci pour votre soutien !");
        // Mise à jour locale du compteur (approximation si l'impact est inconnu ici)
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
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Lien copié dans le presse-papier !");
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  // 4. Animation de sortie/entrée pour le swipe
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={talent.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, info) => {
          // Seuil de 100px pour déclencher la navigation
          if (info.offset.x < -100 && nextSlug) {
            router.push(`/talents/${nextSlug}`);
          } else if (info.offset.x > 100 && prevSlug) {
            router.push(`/talents/${prevSlug}`);
          }
        }}
        className="w-full cursor-grab active:cursor-grabbing"
      >
        <TalentProfileStitch
          id={talent.id}
          prenom={talent.prenom}
          nom={talent.nom}
          avatar_url={talent.avatar_url}
          bio={talent.bio}
          slogan={talent.slogan}
          categorie={talent.categorie}
          univers={talent.univers}
          video_urls={talent.video_urls}
          photo_urls={talent.photo_urls}
          votes={votesCount}
          onVote={handleVote}
          onShare={handleShare}
          isVoting={isVoting}
        />
      </motion.div>
    </AnimatePresence>
  );
}
