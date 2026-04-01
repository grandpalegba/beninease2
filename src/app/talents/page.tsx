/**
 * PAGE PUBLIQUE - LISTE DES TALENTS
 * Role: Galerie des candidats avec système de vote.
 */
"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Info, Loader2, LayoutGrid, Smartphone, Search, Filter, X, AlertCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Talent } from "@/types";
import { universes } from "@/lib/data/universes";

function TalentsList() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniverse, setSelectedUniverse] = useState("Tous les univers");
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const { data, error, status, statusText } = await supabase
          .from("talents")
          .select("id, slug, prenom, nom, univers, categorie, avatar_url, votes, bio")
          .order("votes", { ascending: false });

        if (error) {
          console.error("Erreur Supabase:", error);
          const msg = error.message;
          const stillMissing =
            msg.includes("schema cache") || msg.includes("does not exist") || msg.includes("relation");
          setErrorMsg(
            stillMissing
              ? `La table des talents est introuvable côté Supabase. Attendu: public.talents. Détail: ${msg}`
              : `Erreur Supabase (${status}): ${msg}`
          );
          return;
        }
        
        if (!data) {
          setErrorMsg("Aucune donnée n'a été retournée par Supabase.");
          setTalents([]);
          return;
        }

        setTalents(data as Talent[]);
        if (data.length === 0) {
          setErrorMsg("La base de données est vide (0 talents trouvés).");
        } else {
          setErrorMsg(null);
        }
      } catch (err) {
        console.error("Exception inattendue:", err);
        setErrorMsg("Une erreur inattendue est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, [supabase]);

  // useEffect(() => {
  //   const channel = supabase
  //     .channel("supabase_realtime")
  //     .on(
  //       "postgres_changes",
  //       { event: "UPDATE", schema: "public", table: "talents" },
  //       (payload) => {
  //         setTalents((prev) =>
  //           prev.map((t) => (t.id === payload.new.id ? { ...t, votes: payload.new.votes } : t)),
  //         );
  //       },
  //     )
  //     .subscribe();
  //
  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [supabase]);

  // Derived categories based on selected universe
  const availableCategories = useMemo(() => {
    if (selectedUniverse === "Tous les univers") {
      const allCats = new Set(talents.map(t => t.categorie).filter(Boolean));
      return ["Toutes les catégories", ...Array.from(allCats).sort()];
    }
    const universeData = universes.find(u => u.name === selectedUniverse);
    return ["Toutes les catégories", ...(universeData?.subs || []).sort()];
  }, [selectedUniverse, talents]);

  // Filtering logic
  const filteredTalents = useMemo(() => {
    return talents.filter(talent => {
      const fullName = `${talent.prenom} ${talent.nom}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase());
      const matchesUniverse = selectedUniverse === "Tous les univers" || talent.univers === selectedUniverse;
      const matchesCategory = selectedCategory === "Toutes les catégories" || talent.categorie === selectedCategory;
      
      return matchesSearch && matchesUniverse && matchesCategory;
    });
  }, [talents, searchQuery, selectedUniverse, selectedCategory]);

  if (loading && !errorMsg && talents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-[#008751] animate-spin mb-4" />
        <p className="text-[#8E8E8E] font-sans">Chargement de la galerie...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="font-sans font-bold">Une erreur est survenue lors de la récupération des talents.</p>
        <p className="font-sans text-sm mt-2">{errorMsg}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-[#008751] text-white rounded-2xl font-bold uppercase tracking-widest text-xs"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-black">
          Talents du Bénin
        </h1>
        <p className="mt-4 font-sans text-lg md:text-xl text-black/80 max-w-2xl mx-auto">
          Découvrez les femmes et les hommes qui font rayonner l&apos;excellence béninoise.
        </p>

        {/* Filters Section */}
        <div className="mt-10 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Rechercher un talent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#F2EDE4] pl-12 pr-10 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]/20 shadow-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Universe Filter */}
            <div className="relative w-full max-w-[240px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#008751]" />
              <select 
                value={selectedUniverse}
                onChange={(e) => {
                  setSelectedUniverse(e.target.value);
                  setSelectedCategory("Toutes les catégories");
                }}
                className="w-full appearance-none bg-white border border-[#F2EDE4] pl-10 pr-10 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008751]/20 shadow-sm cursor-pointer"
              >
                <option>Tous les univers</option>
                {universes.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative w-full max-w-[240px]">
              <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#008751]" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-white border border-[#F2EDE4] pl-10 pr-10 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008751]/20 shadow-sm cursor-pointer"
              >
                {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="inline-flex items-start gap-3 bg-white/50 border border-[#004d3d]/20 p-4 rounded-xl text-left max-w-2xl shadow-sm backdrop-blur-sm">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#004d3d]" />
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="block font-semibold text-black mb-1">Votez pour vos Talents</span>
                Explorez les portraits de nos ambassadeurs et soutenez ceux qui vous inspirent. Chaque vote compte pour le classement final !
              </p>
            </div>

            <Link 
              href="/talents/swipe"
              className="group flex items-center gap-3 px-6 py-4 bg-[#008751] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#004d3d] transition-all shadow-lg shadow-[#008751]/20 active:scale-95"
            >
              <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Mode Swipe Mobile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTalents.map((talent) => {
          const fullName = `${talent.prenom} ${talent.nom}`;
          let imageUrl = talent.avatar_url || "";
          
          if (!imageUrl) {
            imageUrl = `/talents/${talent.slug}.jpg`;
          } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
            if (imageUrl.startsWith('talents/')) {
              imageUrl = `/${imageUrl}`;
            } else {
              imageUrl = `/talents/${imageUrl}`;
            }
          }
          
          return (
            <Link
              key={talent.id}
              href={`/talents/${talent.slug}`}
              className="group block bg-white border border-[#F2EDE4] rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer relative z-10 pointer-events-auto"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={fullName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Vote Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-[#008751]">{talent.votes}</span>
                  <span className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">Votes</span>
                </div>
              </div>

              {/* Text Section */}
              <div className="p-5">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#008751] bg-[#008751]/5 px-2 py-0.5 rounded-full mb-2 inline-block">
                  {talent.univers}
                </span>
                <h2 className="font-display text-xl font-bold text-black truncate group-hover:text-[#008751] transition-colors">
                  {fullName}
                </h2>
                <p className="font-sans text-gray-500 text-xs mt-1 truncate uppercase tracking-wider font-bold">
                  {talent.categorie}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredTalents.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[30px] border border-dashed border-gray-200">
          <p className="text-gray-500 font-sans">Aucun talent ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
}

export default function TalentsListPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] px-4 py-10 md:p-8 md:py-14">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center text-[#8E8E8E] animate-pulse">
            Chargement de la galerie...
          </div>
        </div>
      }>
        <TalentsList />
      </Suspense>
    </div>
  );
}
// trigger git
// trigger git
