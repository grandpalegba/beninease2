"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Loader2, Heart, Share2 } from "lucide-react";
import { VoterStatusBadge } from "@/components/voter/VoterStatusBadge";

type Profile = {
  id: string;
  prenom: string | null;
  nom: string | null;
  avatar_url: string | null;
};

// Composant UI simple pour le header
function DashboardUI({ prenom, nom }: { prenom: string | null; nom: string | null }) {
  const displayName = (prenom || nom) ? `${prenom || ""} ${nom || ""}`.trim() : "Mon Profil";

  return (
    <div className="min-h-screen bg-[#F9F9F7] pb-20">
      <div className="bg-white border-b border-[#F2EDE4] pt-12 pb-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-32 h-32 rounded-[30px] overflow-hidden border-4 border-white shadow-xl bg-gray-50"
          >
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </motion.div>
          
          <div className="flex-1 text-center md:text-left space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <VoterStatusBadge status="NOUVEAU VOTANT" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-display font-bold text-black"
            >
              {displayName}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 font-sans max-w-lg"
            >
              Votre parcours citoyen contribue au rayonnement de l'excellence béninoise.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <button className="inline-flex items-center gap-2 bg-[#008751] text-white font-medium py-2 px-4 rounded-xl hover:bg-[#006B3F] transition-colors text-sm">
                <Share2 className="w-4 h-4" />
                Partager ma carte
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VoterDashboard() {
  const router = useRouter();
  
  // Machine à états simple
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setStatus('empty');
          router.push("/login");
          return;
        }

        // Récupérer le profil
        const { data, error } = await supabase
          .from("profiles")
          .select("prenom, nom, avatar_url")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Erreur profil:", error);
          setStatus('error');
          return;
        }

        if (data && (data.prenom || data.nom)) {
          setProfile(data);
          setStatus('success');
        } else {
          setStatus('empty');
        }
      } catch (err) {
        console.error("Erreur générale:", err);
        setStatus('error');
      }
    };

    fetchProfile();
  }, []); // UN SEUL useEffect au montage

  // Rendu conditionnel strict
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <Loader2 className="w-8 h-8 animate-spin text-[#008751]" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erreur de chargement du profil</p>
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
      <DashboardUI prenom="Profil" nom="à compléter" />
    );
  }

  if (status === 'success') {
    return (
      <DashboardUI prenom={profile!.prenom} nom={profile!.nom} />
    );
  }

  return null;
}
