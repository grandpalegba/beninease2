/**
 * PAGE PUBLIQUE - LISTE DES TALENTS
 * Role: Galerie des candidats avec système de vote.
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Info, Loader2, LayoutGrid, Smartphone, Search, Filter, X, AlertCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import type { Talent } from "@/types";
import { universes } from "@/lib/data/universes";

// Composant pour afficher un talent
function TalentCard({ talent }: { talent: Talent }) {
  return (
    <Link href={`/talents/${talent.slug}`}>
      <div className="bg-white rounded-2xl border border-[#F2EDE4] overflow-hidden hover:shadow-lg transition-shadow">
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
    </Link>
  );
}

function TalentsList() {
  // Machine à états simple
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [talents, setTalents] = useState<Talent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniverse, setSelectedUniverse] = useState("Tous les univers");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");

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
          .select("id, slug, prenom, nom, univers, categorie, avatar_url, votes, bio")
          .order("votes", { ascending: false });

        if (error) {
          console.error("Erreur talents:", error);
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
      {/* Header */}
      <div className="bg-white border-b border-[#F2EDE4] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-black mb-2">Découvrez les Talents</h1>
              <p className="text-gray-600">Explorez et votez pour les meilleurs talents du Bénin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-[#F2EDE4] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un talent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={selectedUniverse}
              onChange={(e) => setSelectedUniverse(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent"
            >
              {["Tous les univers", ...universes.map(u => u.name)].map(universe => (
                <option key={universe} value={universe}>{universe}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredTalents.length === 0 ? (
          <div className="text-center py-12">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-black mb-2">Aucun talent trouvé</h3>
            <p className="text-gray-600">
              {searchQuery || selectedUniverse !== "Tous les univers" || selectedCategory !== "Toutes les catégories"
                ? "Essayez de modifier vos filtres pour voir plus de talents."
                : "Aucun talent ne correspond à votre recherche."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTalents.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TalentsPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      <TalentsList />
    </div>
  );
}
