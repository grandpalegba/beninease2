/**
 * PAGE PUBLIQUE - CLASSEMENT
 * Role: Afficher le classement en temps réel des talents.
 */
"use client";

import { useEffect, useState } from "react";
import { Info, Trophy, Star, AlertCircle } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Define type for our talent data
type TalentRank = {
  id: string;
  slug: string;
  prenom: string | null;
  nom: string | null;
  categorie: string | null;
  votes: number;
  avatar_url: string; 
};

// Composant pour afficher un talent dans le classement
function RankCard({ talent, rank }: { talent: TalentRank; rank: number }) {
  return (
    <Link href={`/talents/${talent.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rank * 0.1 }}
        className="bg-white rounded-2xl border border-[#F2EDE4] p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-50 flex-shrink-0">
              <Image
                src={talent.avatar_url}
                alt={`${talent.prenom} ${talent.nom}`}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#008751] text-white rounded-full flex items-center justify-center text-xs font-bold">
              {rank}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-black mb-1">
              {talent.prenom} {talent.nom}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{talent.categorie}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-[#E9B113]" />
                <span className="text-sm font-medium text-[#E9B113]">{talent.votes} votes</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Top {rank}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function RankingList() {
  // Machine à états simple
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [talents, setTalents] = useState<TalentRank[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const { data, error } = await supabase
          .from("talents")
          .select("id, slug, prenom, nom, categorie, votes, avatar_url")
          .order("votes", { ascending: false })
          .limit(50); // Top 50 pour éviter les temps de chargement

        if (error) {
          console.error("Erreur classement:", error);
          setStatus('error');
          return;
        }

        if (data && data.length > 0) {
          setTalents(data);
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

    fetchRanking();
  }, []); // UN SEUL useEffect au montage

  // Rendu conditionnel strict
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#008751] border-t-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du classement...</p>
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
          <p className="text-gray-600 mb-4">Impossible de charger le classement des talents</p>
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
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">Aucun classement</h2>
          <p className="text-gray-600">Le classement sera disponible dès les premiers votes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      {/* Header */}
      <div className="bg-white border-b border-[#F2EDE4] px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <Trophy className="w-12 h-12 text-[#E9B113] mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-black mb-2">Classement des Talents</h1>
          <p className="text-gray-600">Les meilleurs talents du Bénin selon vos votes</p>
        </div>
      </div>

      {/* Ranking */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {talents.map((talent, index) => (
            <RankCard key={talent.id} talent={talent} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RankingPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      <RankingList />
    </div>
  );
}
