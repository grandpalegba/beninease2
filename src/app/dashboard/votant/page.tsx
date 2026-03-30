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
  ChevronDown,
  Flame,
  Brain,
  Star,
  Zap,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { 
  calculateVoterStatus, 
  getNextStatus, 
  getUniverseFromCategory,
  VoterStatus,
  VOTER_STATUSES
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
  const [sqlGrade, setSqlGrade] = useState<string | null>(null);

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
        .from("Votants")
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

      // Call the SQL grade function
      const { data: gradeData } = await supabase.rpc('get_user_grade', { user_uuid: user.id });
      if (gradeData) setSqlGrade(gradeData);

      // Function to load votes
      const fetchVotes = async () => {
        const { data: votesData } = await supabase
          .from("Votes")
          .select(`
            id,
            vote_date,
            candidate_id,
            user_id,
            sous_categorie,
            univers,
            talents:Talents (
              id,
              slug,
              prenom,
              nom,
              avatar_url
            )
          `)
          .eq("user_id", user.id)
          .order("vote_date", { ascending: false });

        if (votesData) {
          setVotes(votesData);
        }
      };

      await fetchVotes();
      setLoading(false);

      // Realtime subscription for this voter's votes
      const channel = supabase
        .channel(`voter_realtime_${user.id}`)
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'Votes', 
            filter: `user_id=eq.${user.id}` 
          },
          async () => {
            await fetchVotes();
            // Also refresh grade
            const { data: newGrade } = await supabase.rpc('get_user_grade', { user_uuid: user.id });
            if (newGrade) setSqlGrade(newGrade);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    loadData();
  }, [supabase, router]);

  // Derived stats using user_stats view for reliability
  const stats = useMemo(() => {
    const totalVotes = votes.length;
    const distinctUniverses = Array.from(new Set(votes.map(v => v.univers).filter(Boolean)));
    const distinctCategories = Array.from(new Set(votes.map(v => v.sous_categorie).filter(Boolean)));
    const universeCount = distinctUniverses.length;
    const categoryCount = distinctCategories.length;
    
    return {
      totalVotes,
      universeCount,
      categoryCount,
      distinctUniverses,
      distinctCategories,
      currentStatus: calculateVoterStatus(totalVotes, universeCount, categoryCount)
    };
  }, [votes]);

  const nextStatus = useMemo(() => getNextStatus(stats.currentStatus.level), [stats.currentStatus.level]);

  // Filtering logic
  const filteredVotes = useMemo(() => {
    return votes.filter(vote => {
      const talent = vote.talents;
      if (!talent) return false;
      
      const universe = vote.univers || getUniverseFromCategory(vote.sous_categorie);
      const fullName = `${talent.prenom} ${talent.nom}`.toLowerCase();
      
      const matchesUniverse = selectedUniverse === "Tous les univers" || universe === selectedUniverse;
      const matchesCategory = selectedCategory === "Toutes les catégories" || vote.sous_categorie === selectedCategory;
      const matchesSearch = fullName.includes(searchQuery.toLowerCase());
      
      return matchesUniverse && matchesCategory && matchesSearch;
    });
  }, [votes, selectedUniverse, selectedCategory, searchQuery]);

  const allCategories = useMemo(() => {
    const cats = new Set(votes.map(v => v.sous_categorie).filter(Boolean));
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-32 h-32 rounded-[30px] overflow-hidden border-4 border-white shadow-xl bg-gray-50"
          >
            <Image 
              src={profile?.avatar_url || "/placeholder-portrait.jpg"} 
              alt="Profile" 
              fill 
              className="object-cover" 
            />
          </motion.div>
          
          <div className="flex-1 text-center md:text-left space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <VoterStatusBadge status={{...stats.currentStatus, label: sqlGrade || stats.currentStatus.label}} />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-display font-bold text-black"
            >
              {profile?.full_name || profile?.prenom || "Citoyen Béninois"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 font-sans max-w-lg"
            >
              Votre parcours citoyen contribue au rayonnement de l&apos;excellence béninoise.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-[#F9F9F7] p-4 rounded-2xl border border-[#F2EDE4] text-center">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Impact (Votes)</span>
              <span className="text-2xl font-bold text-[#008751] flex items-center justify-center gap-2">
                <Flame className="w-5 h-5 fill-[#008751]" />
                {stats.totalVotes}
              </span>
            </div>
            <div className="bg-[#F9F9F7] p-4 rounded-2xl border border-[#F2EDE4] text-center">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Exploration</span>
              <span className="text-2xl font-bold text-[#E9B113] flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" />
                {stats.universeCount}/16
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Progress Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-[#F2EDE4] shadow-xl shadow-black/5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-display font-bold text-black flex items-center gap-2">
                    {nextStatus ? `Vers le grade : ${nextStatus.label}` : "Grade Maximum Atteint"}
                    {nextStatus && <Star className="w-5 h-5 text-[#E9B113] fill-[#E9B113]" />}
                  </h3>
                  {nextStatus ? (
                    <p className="text-sm text-gray-500 mt-1">
                      Encore 
                      {stats.totalVotes < nextStatus.minVotes && <span className="font-bold text-[#006B3F]"> {nextStatus.minVotes - stats.totalVotes} votes</span>}
                      {stats.totalVotes < nextStatus.minVotes && (stats.universeCount < nextStatus.minUniverses || stats.categoryCount < nextStatus.minCategories) && " et"}
                      {stats.universeCount < nextStatus.minUniverses && <span className="font-bold text-[#E9B113]"> {nextStatus.minUniverses - stats.universeCount} univers</span>}
                      {stats.universeCount < nextStatus.minUniverses && stats.categoryCount < nextStatus.minCategories && " et"}
                      {stats.categoryCount < nextStatus.minCategories && <span className="font-bold text-purple-500"> {nextStatus.minCategories - stats.categoryCount} catégories</span>}
                      pour progresser.
                    </p>
                  ) : (
                    <p className="text-sm text-[#006B3F] font-bold mt-1">Félicitations ! Vous êtes un Référent de l&apos;excellence béninoise.</p>
                  )}
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-6">
                {/* Impact Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 text-gray-400"><Flame className="w-3 h-3 text-[#006B3F]" /> Impact (Votes)</span>
                    <span className="text-[#006B3F]">{stats.totalVotes} {nextStatus && `/ ${nextStatus.minVotes}`}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, nextStatus ? (stats.totalVotes / nextStatus.minVotes) * 100 : 100)}%` }}
                      className="h-full bg-[#006B3F] rounded-full"
                    />
                  </div>
                </div>
                
                {/* Exploration Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 text-gray-400"><Globe className="w-3 h-3 text-[#E9B113]" /> Exploration (Univers)</span>
                    <span className="text-[#E9B113]">{stats.universeCount} {nextStatus && `/ ${nextStatus.minUniverses}`}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, nextStatus ? (stats.universeCount / nextStatus.minUniverses) * 100 : 100)}%` }}
                      className="h-full bg-[#E9B113] rounded-full"
                    />
                  </div>
                </div>

                {/* Profondeur Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 text-gray-400"><Brain className="w-3 h-3 text-purple-500" /> Profondeur (Catégories)</span>
                    <span className="text-purple-500">{stats.categoryCount} {nextStatus && `/ ${nextStatus.minCategories}`}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, nextStatus ? (stats.categoryCount / nextStatus.minCategories) * 100 : 100)}%` }}
                      className="h-full bg-purple-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* History & Filters */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-display font-bold text-black">Mes votes</h2>
                
                <div className="flex flex-wrap gap-2">
                  <select 
                    value={selectedUniverse}
                    onChange={(e) => setSelectedUniverse(e.target.value)}
                    className="bg-white border border-[#F2EDE4] px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#006B3F]/20 cursor-pointer"
                  >
                    <option>Tous les univers</option>
                    {universes.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
                  </select>

                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white border border-[#F2EDE4] px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#006B3F]/20 cursor-pointer"
                  >
                    {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Results Grid */}
              <AnimatePresence mode="popLayout">
                {filteredVotes.length > 0 ? (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 gap-4"
                  >
                    {filteredVotes.map((vote) => {
                      const talent = vote.talents;
                      const universe = vote.universe || getUniverseFromCategory(vote.category);
                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={vote.id}
                        >
                          <Link 
                            href={`/talents/${talent.slug}`}
                            className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#F2EDE4] hover:shadow-lg transition-all"
                          >
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                              <Image 
                                src={talent.avatar_url || "/placeholder-portrait.jpg"} 
                                alt={talent.prenom} 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[8px] font-black uppercase tracking-widest text-[#006B3F] bg-[#006B3F]/5 px-2 py-0.5 rounded-full mb-1 inline-block">
                                {universe}
                              </span>
                              <h4 className="text-base font-display font-bold text-black truncate group-hover:text-[#006B3F] transition-colors">
                                {talent.prenom} {talent.nom}
                              </h4>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                <Calendar className="w-2.5 h-2.5" />
                                {new Date(vote.vote_date).toLocaleDateString()}
                              </p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-[#006B3F] transition-colors" />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center bg-white rounded-[32px] border border-dashed border-gray-200"
                  >
                    <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-display font-bold text-black mb-1">Aucun talent trouvé</h3>
                    <p className="text-xs text-gray-400">Ajustez vos filtres pour voir vos autres votes.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar (Right 1/3) */}
          <div className="space-y-8">
            {/* 16 Universes Grid */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 border border-[#F2EDE4] shadow-xl shadow-black/5"
            >
              <h3 className="text-sm font-display font-bold text-black mb-6 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#E9B113]" />
                Exploration des 16 Univers
              </h3>
              
              <div className="grid grid-cols-4 gap-3">
                {universes.map((u, index) => {
                  const isExplored = stats.distinctUniverses.includes(u.name);
                  const Icon = u.icon;
                  return (
                    <div key={u.name} className="relative group">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className={cn(
                          "w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-500",
                          isExplored 
                            ? "bg-[#E9B113] text-white shadow-lg shadow-[#E9B113]/20" 
                            : "bg-gray-50 text-gray-300 grayscale"
                        )}
                      >
                        <Icon size={20} />
                        {isExplored && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-[#006B3F] text-white rounded-full p-0.5 border border-white"
                          >
                            <CheckCircle2 size={8} />
                          </motion.div>
                        )}
                      </motion.div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[8px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                        {u.name}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  Découvrez de nouveaux univers pour élever votre grade de citoyen.
                </p>
              </div>
            </motion.div>

            {/* Quick Tips */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#006B3F] rounded-3xl p-6 text-white shadow-xl shadow-[#006B3F]/20"
            >
              <Zap className="w-6 h-6 mb-4 text-[#E9B113] fill-[#E9B113]" />
              <h4 className="text-lg font-display font-bold mb-2">Conseil du jour</h4>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                Chaque vote compte pour le rayonnement du Bénin. Explorez les catégories moins connues pour diversifier votre impact !
              </p>
              <Link 
                href="/talents" 
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#E9B113] hover:translate-x-1 transition-transform"
              >
                Voter maintenant <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
