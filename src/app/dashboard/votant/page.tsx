"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Search, 
  Filter, 
  Calendar, 
  ArrowRight, 
  Trophy, 
  Globe, 
  Heart,
  ChevronDown
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { 
  calculateVoterStatus, 
  getNextStatus, 
  getUniverseFromCategory,
  VoterStatus 
} from "@/lib/voter-logic";
import { VoterStatusBadge } from "@/components/voter/VoterStatusBadge";
import { universes } from "@/lib/data/universes";
import { cn } from "@/lib/utils";

export default function VoterDashboard() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  
  const [profile, setProfile] = useState<any>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedUniverse, setSelectedUniverse] = useState<string>("Tous les univers");
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes les catégories");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      setProfile(profileData);

      // Load stats from user_stats view
      const { data: statsData } = await supabase
        .from("user_stats")
        .select("*")
        .eq("voter_id", user.id)
        .single();
      
      setUserStats(statsData);

      // Load unique votes
      const { data: votesData, error: votesError } = await supabase
        .from("votes")
        .select(`
          id,
          created_at,
          candidate_id,
          voter_id,
          profiles:candidate_id (
            id,
            slug,
            prenom,
            nom,
            category,
            avatar_url
          )
        `)
        .eq("voter_id", user.id)
        .order("created_at", { ascending: false });

      if (votesData) {
        setVotes(votesData);
      }
      
      setLoading(false);
    }

    loadData();
  }, [supabase, router]);

  // Derived stats using user_stats view for reliability
  const stats = useMemo(() => {
    const totalVotes = userStats?.unique_candidates_voted || 0;
    const universeCount = userStats?.unique_universes_voted || 0;
    
    return {
      totalVotes,
      universeCount,
      currentStatus: calculateVoterStatus(totalVotes, universeCount)
    };
  }, [userStats]);

  const nextStatus = useMemo(() => getNextStatus(stats.currentStatus.level), [stats.currentStatus.level]);

  // Filtering logic
  const filteredVotes = useMemo(() => {
    return votes.filter(vote => {
      const talent = vote.talents;
      if (!talent) return false;
      
      const universe = getUniverseFromCategory(talent.category);
      const fullName = `${talent.prenom} ${talent.nom}`.toLowerCase();
      
      const matchesUniverse = selectedUniverse === "Tous les univers" || universe === selectedUniverse;
      const matchesCategory = selectedCategory === "Toutes les catégories" || talent.category === selectedCategory;
      const matchesSearch = fullName.includes(searchQuery.toLowerCase());
      
      return matchesUniverse && matchesCategory && matchesSearch;
    });
  }, [votes, selectedUniverse, selectedCategory, searchQuery]);

  const allCategories = useMemo(() => {
    const cats = new Set(votes.map(v => v.talents?.category).filter(Boolean));
    return ["Toutes les catégories", ...Array.from(cats) as string[]];
  }, [votes]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <Loader2 className="w-12 h-12 text-[#008751] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] pb-20">
      {/* Header / Hero Section */}
      <div className="bg-white border-b border-[#F2EDE4] pt-12 pb-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-32 h-32 rounded-[30px] overflow-hidden border-4 border-white shadow-xl bg-gray-50">
            <Image 
              src={profile?.avatar_url || "/placeholder-portrait.jpg"} 
              alt="Profile" 
              fill 
              className="object-cover" 
            />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-3">
            <VoterStatusBadge status={stats.currentStatus} />
            <h1 className="text-4xl font-display font-bold text-black">
              {profile?.full_name || profile?.prenom || "Citoyen Béninois"}
            </h1>
            <p className="text-gray-500 font-sans max-w-lg">
              Votre parcours citoyen contribue au rayonnement de l&apos;excellence béninoise.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-[#F9F9F7] p-4 rounded-2xl border border-[#F2EDE4] text-center">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Talents soutenus</span>
              <span className="text-2xl font-bold text-[#008751]">{stats.totalVotes}</span>
            </div>
            <div className="bg-[#F9F9F7] p-4 rounded-2xl border border-[#F2EDE4] text-center">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Univers explorés</span>
              <span className="text-2xl font-bold text-[#E9B113]">{stats.universeCount}/16</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8">
        {/* Progress Section */}
        {nextStatus && (
          <div className="bg-white rounded-3xl p-8 border border-[#F2EDE4] shadow-xl shadow-black/5 mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-black flex items-center gap-2">
                  Objectif : {nextStatus.label}
                </h3>
                <p className="text-sm text-gray-500">
                  {stats.totalVotes < nextStatus.minVotes && `Encore ${nextStatus.minVotes - stats.totalVotes} votes `}
                  {stats.totalVotes < nextStatus.minVotes && stats.universeCount < nextStatus.minUniverses && "et "}
                  {stats.universeCount < nextStatus.minUniverses && `${nextStatus.minUniverses - stats.universeCount} univers `}
                  pour passer au grade supérieur.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#008751] uppercase tracking-widest">Niveau {stats.currentStatus.level} → {nextStatus.level}</span>
              </div>
            </div>

            {/* Double Progress Bar */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span>Votes</span>
                  <span>{stats.totalVotes} / {nextStatus.minVotes}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#008751] transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (stats.totalVotes / nextStatus.minVotes) * 100)}%` }}
                  />
                </div>
              </div>
              
              {nextStatus.minUniverses > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span>Diversité des Univers</span>
                    <span>{stats.universeCount} / {nextStatus.minUniverses}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#E9B113] transition-all duration-1000" 
                      style={{ width: `${Math.min(100, (stats.universeCount / nextStatus.minUniverses) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History & Filters */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-2xl font-display font-bold text-black">Historique de vos votes</h2>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Universe Filter */}
              <div className="relative group">
                <select 
                  value={selectedUniverse}
                  onChange={(e) => setSelectedUniverse(e.target.value)}
                  className="appearance-none bg-white border border-[#F2EDE4] px-4 py-2 pr-10 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008751]/20 cursor-pointer"
                >
                  <option>Tous les univers</option>
                  {universes.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Category Filter */}
              <div className="relative group">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-[#F2EDE4] px-4 py-2 pr-10 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008751]/20 cursor-pointer"
                >
                  {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Rechercher un talent par son nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#F2EDE4] pl-12 pr-6 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]/20 shadow-sm"
            />
          </div>

          {/* Results Grid */}
          {filteredVotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVotes.map((vote) => {
                const talent = vote.profiles;
                const universe = getUniverseFromCategory(talent.category);
                return (
                  <Link 
                    key={vote.id}
                    href={`/talents/${talent.slug}`}
                    className="group flex items-center gap-5 p-5 bg-white rounded-3xl border border-[#F2EDE4] hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                      <Image 
                        src={talent.avatar_url || "/placeholder-portrait.jpg"} 
                        alt={talent.prenom} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#008751] bg-[#008751]/5 px-2 py-0.5 rounded-full">
                          {universe}
                        </span>
                      </div>
                      <h4 className="text-lg font-display font-bold text-black truncate group-hover:text-[#008751] transition-colors">
                        {talent.prenom} {talent.nom}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3 h-3" />
                        Soutenu le {new Date(vote.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-[#008751] transition-colors" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-[#F9F9F7] rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-display font-bold text-black mb-2">
                {votes.length === 0 ? "Commencez votre parcours citoyen" : "Aucun résultat trouvé"}
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto text-sm mb-8">
                {votes.length === 0 
                  ? "Découvrez les talents exceptionnels du Bénin et apportez-leur votre soutien."
                  : "Ajustez vos filtres ou votre recherche pour trouver un talent spécifique."}
              </p>
              <Link 
                href="/talents" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#008751] text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#004d3d] transition-all shadow-lg shadow-[#008751]/20"
              >
                Découvrir les talents
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
