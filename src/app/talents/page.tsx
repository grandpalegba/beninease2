/**
 * PAGE PUBLIQUE - LISTE DES TALENTS
 * Role: Galerie des candidats avec système de vote.
 */
"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { Talent } from "@/types";
import CandidateSwiper from "@/components/CandidateSwiper";
import { Loader2, AlertCircle, Info } from "lucide-react";

function TalentsList() {
  // Machine à états simple
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [talents, setTalents] = useState<Talent[]>([]);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        // Client Supabase propre
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
          .from("talents")
          .select("*")
          .order("votes", { ascending: false });

        if (error) {
          console.error("Erreur talents:", error);
          setStatus('error');
          return;
        }

        if (data && data.length > 0) {
          setTalents(data as Talent[]);
          setStatus('success');
        } else {
          setTalents([]);
          setStatus('empty');
        }
      } catch (err) {
        console.error("Erreur générale:", err);
        setStatus('error');
      }
    };

    fetchTalents();
  }, []); // UN SEUL useEffect au montage

  // Rendu conditionnel strict
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#008751]" />
          <p className="text-gray-600 font-medium">Chargement des talents...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">Impossible de charger la liste des talents</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-[#008751] hover:underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <div className="text-center max-w-md">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">Aucun talent trouvé</h2>
          <p className="text-gray-600">Les talents seront bientôt disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      <CandidateSwiper talents={talents} />
    </div>
  );
}

export default function TalentsPage() {
  return <TalentsList />;
}
