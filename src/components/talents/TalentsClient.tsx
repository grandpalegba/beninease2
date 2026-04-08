"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import SwipeContainer from "./SwipeContainer";
import { Duel } from "@/types";

export default function TalentsClient() {
  const [duels, setDuels] = useState<Duel[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // 1. Gestion de l'identité utilisateur (Auth ou Anonyme)
  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else {
        let anonId = sessionStorage.getItem("anon_user_id");
        if (!anonId) {
          const generateId = () =>
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : "anon-" + Math.random().toString(36).substring(2, 11);
          anonId = generateId();
          sessionStorage.setItem("anon_user_id", anonId);
        }
        setUserId(anonId);
      }
    }
    loadUser();
  }, []);

  // 2. Récupération des duels avec images de profil
  useEffect(() => {
    async function fetchDuels() {
      try {
        // Tentative via la fonction RPC
        const { data, error } = await supabase.rpc("generate_duels");

        if (error) {
          console.error("Erreur RPC, tentative fallback table:", error);
          // Fallback avec sélection explicite des champs requis (profile_image inclus)
          const { data: fallbackData } = await supabase
            .from("duels")
            .select(`
              id,
              categorie_duels,
              mission_categorie,
              talent_left:talents!talent_left(id, prenom_talent, profile_image, video_url, slogan),
              talent_right:talents!talent_right(id, prenom_talent, profile_image, video_url, slogan)
            `);

          if (fallbackData) {
            setDuels(fallbackData as unknown as Duel[]);
          }
        } else if (data) {
          setDuels(data as Duel[]);
        }
      } catch (err) {
        console.error("Erreur fatale fetching duels:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDuels();
  }, []);

  // 3. État de chargement (Arena Style)
  if (loading) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-[#006b3f] animate-spin" />
            <div className="absolute inset-2 rounded-full border-t-2 border-[#fcd116] animate-spin-slow" />
          </div>
          <p className="text-white font-manrope font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">
            Préparation de l'Arena...
          </p>
        </div>
      </div>
    );
  }

  // 4. État vide
  if (!duels || duels.length === 0) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-black text-white font-manrope">
        <p className="uppercase tracking-[0.3em] text-[10px] font-bold opacity-50">
          Aucun duel actif pour le moment
        </p>
      </div>
    );
  }

  return (
    /* L'unité h-[100dvh] est cruciale ici pour éviter le scroll sur mobile 
      malgré la présence des barres d'adresse URL.
    */
    <div className="bg-white w-full h-[100dvh] overflow-hidden flex flex-col font-manrope">

      {/* HEADER : Catégorie du duel (Stitch Design) */}
      <header className="w-full bg-black py-5 z-50 flex flex-col items-center justify-center text-center shadow-2xl">
        <h1 className="text-white font-black text-[11px] uppercase tracking-[0.4em] leading-none">
          {duels[0]?.categorie_duels || "Duel de Talents"}
        </h1>
        {/* Petit rappel de mission sous le titre */}
        <p className="text-gray-500 text-[8px] uppercase tracking-[0.2em] mt-2 font-bold max-w-[80%] line-clamp-1">
          {duels[0]?.mission_categorie}
        </p>
      </header>

      {/* ARENA : SwipeContainer gère l'affichage des images et le slider */}
      <div className="flex-grow relative overflow-hidden bg-black">
        <SwipeContainer
          initialDuels={duels}
          userId={userId}
          categoryId="all"
        />
      </div>

    </div>
  );
}