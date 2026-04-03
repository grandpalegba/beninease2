"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import CandidateDashboard from "@/components/CandidateDashboard";
import { Loader2, AlertCircle } from "lucide-react";
import type { Talent } from "@/types";

export default function TalentDashboardPage() {
  const [profile, setProfile] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        // 🔐 Si pas connecté → redirection propre (pas de boucle)
        if (!user) {
          router.replace("/login");
          return;
        }

        const { data, error } = await supabase
          .from("talents")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error || !data) {
          console.error("Error fetching talent profile:", error);
          setLoading(false);
          return;
        }

        // 🔐 Sécurité : vérifier rôle
        if (
          data.role !== "candidat" &&
          data.role !== "ambassadeur" &&
          data.role !== "admin"
        ) {
          router.replace("/");
          return;
        }

        setProfile(data as Talent);
      } catch (err) {
        console.error("Erreur générale:", err);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []); // ✅ IMPORTANT : PAS de dépendances

  // 🔄 Loading
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F9F9F7]">
        <Loader2 className="w-12 h-12 text-[#008751] animate-spin mb-4" />
        <p className="text-gray-500 font-sans font-medium">
          Chargement de votre espace talent...
        </p>
      </div>
    );
  }

  // ❌ Accès refusé
  if (!profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F9F9F7] p-6 text-center">
        <AlertCircle className="w-16 h-16 text-[#E8112D] mb-4" />
        <h1 className="text-2xl font-display font-bold text-black mb-4">
          Accès restreint
        </h1>
        <p className="text-gray-500 max-w-md mb-8">
          Cet espace est réservé aux talents inscrits sur Beninease.
        </p>
        <button
          onClick={() => router.replace("/postuler")}
          className="px-8 py-3 bg-[#008751] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#008751]/90 transition-all"
        >
          Devenir Ambassadeur
        </button>
      </div>
    );
  }

  // ✅ OK
  return (
    <div className="min-h-screen bg-[#F9F9F7] py-10 md:py-20">
      <div className="container mx-auto px-6">
        <CandidateDashboard profile={profile} />
      </div>
    </div>
  );
}