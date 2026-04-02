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
  univers: string | null;
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
  const [talents, setTalents] = useState<TalentRank[] | null>(null);
  const [selectedUnivers, setSelectedUnivers] = useState<string>("");
  const [selectedCategorie, setSelectedCategorie] = useState<string>("");

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        console.log('🏆 Chargement classement...');
        
        // Vérifier la session avant de lancer la requête
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('🔐 Session check (classement):', session ? '✅ Connecté' : '❌ Anonyme');
        
        if (sessionError) {
          console.error('❌ Erreur session (classement):', sessionError);
        }
        
        let data, error;
        try {
          // La requête fonctionne pour les utilisateurs connectés et anonymes
          const result = await supabase
            .from("talents")
            .select("id, slug, prenom, nom, categorie, univers, votes, avatar_url")
            .order("votes", { ascending: false })
            .limit(50); // Top 50 pour éviter les temps de chargement
          data = result.data;
          error = result.error;
        } catch (supabaseError) {
          console.error('💥 SUPABASE_ERROR (classement):', supabaseError);
          setStatus('error');
          return;
        }

        if (error) {
          console.error('💥 SUPABASE_ERROR (classement):', error);
          setStatus('error');
          return;
        }

        if (data && data.length > 0) {
          console.log('✅ Classement chargé:', data.length, 'talents');
          setTalents(data);
          setStatus('success');
        } else {
          console.log('📭 Classement vide');
          setTalents([]);
          setStatus('empty');
        }
      } catch (err) {
        console.error('💥 GENERAL_ERROR (classement):', err);
        setStatus('error');
      }
    };

    fetchRanking();
  }, []); // UN SEUL useEffect au montage

  // Extraire les univers et catégories uniques
  const universOptions = Array.from(new Set(talents?.map(t => t.univers).filter(Boolean) || []));
  
  // Catégories dépendantes de l'univers sélectionné
  const categorieOptions = selectedUnivers 
    ? Array.from(new Set(
        talents
          ?.filter(t => t.univers === selectedUnivers)
          .map(t => t.categorie)
          .filter(Boolean) || []
      ))
    : []; // Vide si pas d'univers sélectionné

  // Effet pour réinitialiser la catégorie quand l'univers change
  useEffect(() => {
    setSelectedCategorie("");
  }, [selectedUnivers]);

  // Filtrer les talents selon les sélections et conserver le tri par votes
  const filteredTalents = talents?.filter(t => {
    const matchesUnivers = !selectedUnivers || t.univers === selectedUnivers;
    const matchesCategorie = !selectedCategorie || t.categorie === selectedCategorie;
    return matchesUnivers && matchesCategorie;
  }) || [];

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
      <div className="bg-white border-b border-[#F2EDE4] py-16 px-4 text-center">
        <Trophy 
          className="w-12 h-12 mx-auto mb-6 text-[#D4AF37] fill-[#D4AF37]" 
          strokeWidth={1.5}
        />
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-black mb-4 tracking-wide">
          Classement des Talents
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
          Les meilleurs talents du Bénin selon vos votes
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white border-b border-[#F2EDE4] px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-3">
          {/* Filtre Univers */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Univers:</label>
            <select
              value={selectedUnivers}
              onChange={(e) => setSelectedUnivers(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#008751] outline-none bg-white"
            >
              <option value="">Tous</option>
              {universOptions.filter(Boolean).map(univers => (
                <option key={univers} value={univers}>{univers}</option>
              ))}
            </select>
          </div>
          
          {/* Filtre Catégorie */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Catégorie:</label>
            <select
              value={selectedCategorie}
              onChange={(e) => setSelectedCategorie(e.target.value)}
              disabled={!selectedUnivers}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#E9B113] outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <option value="">
                {selectedUnivers ? "Sélectionnez une catégorie" : "Sélectionnez d'abord un univers"}
              </option>
              {categorieOptions.filter(Boolean).map(categorie => (
                <option key={categorie} value={categorie}>{categorie}</option>
              ))}
            </select>
          </div>
          
          {/* Bouton de réinitialisation */}
          {(selectedUnivers || selectedCategorie) && (
            <button
              onClick={() => {
                setSelectedUnivers("");
                setSelectedCategorie("");
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
            >
              <AlertCircle className="w-3 h-3" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Ranking */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {filteredTalents.map((talent, index) => (
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
