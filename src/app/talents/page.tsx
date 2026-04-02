/**
 * PAGE PUBLIQUE - LISTE DES TALENTS
 * Role: Galerie des candidats avec système de vote.
 */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client";
import type { Talent } from "@/types";
import CandidateSwiper from "@/components/CandidateSwiper";
import { Loader2, AlertCircle, Info, Search, X, Grid, MousePointer2 } from "lucide-react";

// Composant pour afficher une carte de talent
function TalentCard({ talent, index, onClick }: { talent: Talent; index: number; onClick: (index: number) => void }) {
  return (
    <div 
      onClick={() => onClick(index)}
      className="bg-white rounded-2xl border border-[#F2EDE4] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={talent.avatar_url || "/placeholder-avatar.png"}
          alt={`${talent.prenom} ${talent.nom}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4 bg-[#008751] text-white px-3 py-1 rounded-full text-xs font-bold">
          {talent.votes || 0} votes
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-black mb-1">
              {talent.prenom} {talent.nom}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{talent.categorie}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#F9F9F7] px-2 py-1 rounded-full text-gray-600">
                {talent.univers}
              </span>
            </div>
          </div>
        </div>
        {talent.bio && (
          <p className="text-sm text-gray-700 line-clamp-3">
            {talent.bio}
          </p>
        )}
      </div>
    </div>
  );
}

function TalentsList() {
  // Machine à états simple
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [talents, setTalents] = useState<Talent[]>([]);
  
  // États de vue
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // États de recherche et filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniverse, setSelectedUniverse] = useState("Tous les univers");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");

  useEffect(() => {
    const fetchTalents = async () => {
      try {
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

  // Filtrage simple
  const filteredTalents = talents.filter(talent => {
    const matchesUniverse = selectedUniverse === "Tous les univers" || talent.univers === selectedUniverse;
    const matchesCategory = selectedCategory === "Toutes les catégories" || talent.categorie === selectedCategory;
    const matchesSearch = `${talent.prenom} ${talent.nom}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesUniverse && matchesCategory && matchesSearch;
  });

  // Catégories uniques basées sur l'univers sélectionné
  const categories = selectedUniverse === "Tous les univers" 
    ? ["Toutes les catégories", ...Array.from(new Set(talents.map(t => t.categorie).filter(Boolean)))]
    : ["Toutes les catégories", ...Array.from(new Set(filteredTalents.map(t => t.categorie).filter(Boolean)))];

  const univers = ["Tous les univers", ...Array.from(new Set(talents.map(t => t.univers).filter(Boolean)))];

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

  // Vue Swipe
  if (viewMode === 'swipe') {
    return (
      <div className="min-h-screen bg-[#F9F9F7] relative">
        {/* Bouton retour */}
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={() => setViewMode('grid')}
            className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        
        {/* Mode Swipe */}
        <CandidateSwiper talents={filteredTalents} />
      </div>
    );
  }

  // Vue Grid (par défaut)
  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      {/* Header avec recherche et filtres */}
      <div className="bg-white border-b border-[#F2EDE4] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un talent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filtres */}
            <div className="flex gap-2">
              <select
                value={selectedUniverse}
                onChange={(e) => setSelectedUniverse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008751]"
              >
                {univers.map(univ => (
                  <option key={univ} value={univ}>{univ}</option>
                ))}
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008751]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Bouton mode vue */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setViewMode('swipe')}
              className="flex items-center gap-2 bg-[#008751] text-white px-4 py-2 rounded-lg hover:bg-[#006B3F] transition-colors"
            >
              <MousePointer2 className="w-4 h-4" />
              Mode Swipe
            </button>
          </div>
        </div>
      </div>

      {/* Grille de talents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTalents.length === 0 ? (
          <div className="text-center py-12">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun talent trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos filtres de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTalents.map((talent, index) => (
              <TalentCard
                key={talent.id}
                talent={talent}
                index={index}
                onClick={(idx) => {
                  setSelectedIndex(idx);
                  setViewMode('swipe');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TalentsPage() {
  return <TalentsList />;
}
