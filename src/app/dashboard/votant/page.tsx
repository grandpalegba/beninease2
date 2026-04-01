"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Calendar, 
  ArrowRight, 
  Target, 
  Globe, 
  Heart, 
  Flame,
  Brain,
  Star,
  Zap,
  CheckCircle2,
  User,
  BarChart3,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { 
  calculateVoterStatus, 
  getNextStatus, 
  getUniverseFromCategory,
} from "@/lib/voter-logic";
import { VoterStatusBadge } from "@/components/voter/VoterStatusBadge";
import { universes } from "@/lib/data/universes";
import { cn } from "@/lib/utils";
import type { Votant } from "@/types";
import * as htmlToImage from 'html-to-image';

type TalentMini = {
  id: string;
  slug: string;
  prenom: string | null;
  nom: string | null;
  avatar_url: string | null;
};

type VoteRow = {
  id: string;
  created_at: string;
  talent_id: string;
  voter_id: string;
  categorie: string | null;
  univers: string | null;
  talents: TalentMini | null;
};

// Avatar Component with Fallback
const AvatarFallback = ({ profile, size = "large" }: { profile: any, size?: "large" | "small" }) => {
  const sizeClasses = size === "large" ? "w-32 h-32" : "w-16 h-16";
  const iconSize = size === "large" ? "w-12 h-12" : "w-6 h-6";
  
  if (profile?.avatar_url) {
    return (
      <Image 
        src={profile.avatar_url} 
        alt="Profile" 
        fill 
        className="object-cover"
        onError={(e) => {
          // Hide broken image and show fallback
          if (e.currentTarget.parentElement) {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.classList.add('bg-gray-100');
            e.currentTarget.parentElement.classList.add('flex');
            e.currentTarget.parentElement.classList.add('items-center');
            e.currentTarget.parentElement.classList.add('justify-center');
          }
        }}
      />
    );
  }
  
  // Show default avatar image if no custom avatar
  return (
    <Image 
      src="/default-avatar.png" 
      alt="Default Profile" 
      fill 
      className="object-cover"
      onError={(e) => {
        // If default image fails, show initials or User icon
        e.currentTarget.style.display = 'none';
        const parentElement = e.currentTarget.parentElement;
        if (parentElement) {
          parentElement.classList.add('bg-gray-100');
          parentElement.classList.add('flex');
          parentElement.classList.add('items-center');
          parentElement.classList.add('justify-center');
          
          const initials = profile?.prenom && profile?.nom 
            ? `${profile.prenom[0]}${profile.nom[0]}`.toUpperCase()
            : profile?.prenom?.[0]?.toUpperCase() || 'U';
          
          if (initials !== 'U') {
            parentElement.innerHTML = `<span class="text-2xl font-bold text-gray-600">${initials}</span>`;
          } else {
            parentElement.innerHTML = `<svg class="${iconSize} text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;
          }
        }
      }}
    />
  );
};

// Composant isolé pour l'affichage du nom utilisateur
function UserNameDisplay() {
  const [userName, setUserName] = useState<{prenom: string | null, nom: string | null} | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const fetchUserName = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select('prenom, nom')
        .eq("id", user.id)
        .single();

      console.log('Test Colonnes:', data);
      
      if (data) {
        setUserName({ prenom: data.prenom, nom: data.nom });
      }
    } catch (err) {
      console.error("Erreur fetch nom:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchUserName();
  }, [fetchUserName]);

  if (loading) {
    return (
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-display font-bold text-gray-400"
      >
        Chargement de l'identité...
      </motion.h1>
    );
  }

  if (userName?.prenom || userName?.nom) {
    return (
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-display font-bold text-black"
      >
        {`${userName.prenom || ''} ${userName.nom || ''}`.trim()}
      </motion.h1>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-4xl font-display font-bold"
    >
      <Link 
        href="/settings" 
        className="text-[#008751] hover:text-[#006B3F] transition-colors underline"
      >
        Profil à compléter
      </Link>
    </motion.div>
  );
}

export default function VoterDashboard() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  
  const [profile, setProfile] = useState<any>(null);
  const [votes, setVotes] = useState<VoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatingCard, setGeneratingCard] = useState(false);
  
  // États pour le quota de votes
  const [votesLast24h, setVotesLast24h] = useState(0);
  const [remainingVotes, setRemainingVotes] = useState(16);

  // Filters
  const [selectedUniverse, setSelectedUniverse] = useState<string>("Tous les univers");
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes les catégories");
  const [searchQuery, setSearchQuery] = useState("");

  // Generate and Share Card
  const generateAndShareCard = async () => {
    setGeneratingCard(true);
    
    try {
      const cardElement = document.getElementById('citizen-card');
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Generate image from the hidden card element
      const dataUrl = await htmlToImage.toPng(cardElement, {
        width: 800,
        height: 800,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });

      // Convert to blob for sharing
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'citizen-card.png', { type: 'image/png' });

      const shareText = `Je suis fier d'être ${stats.currentStatus.label} ! Découvrez l'excellence béninoise et votez vous aussi sur Benin Excellence.`;

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Ma Carte Citoyenne',
          text: shareText,
          files: [file]
        });
      } else {
        // Fallback: download image and copy text
        const link = document.createElement('a');
        link.download = 'citizen-card.png';
        link.href = dataUrl;
        link.click();

        await navigator.clipboard.writeText(shareText);
        alert('Carte téléchargée et texte copié dans le presse-papier !');
      }
    } catch (error) {
      console.error('Error generating/sharing card:', error);
      alert('Erreur lors de la génération de la carte');
    } finally {
      setGeneratingCard(false);
    }
  };

  const fetchVotes = useCallback(async (actualVotantId: string) => {
    // Récupérer les votes des 24 dernières heures pour le quota
    const { data: recentVotes, error: recentError } = await supabase
      .from("votes")
      .select("id, created_at")
      .eq("voter_id", actualVotantId)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false });

    if (recentError) {
      console.error("Dashboard Votant - Error fetching recent votes:", recentError);
    }

    const votesLast24h = recentVotes?.length || 0;
    const remainingVotes = Math.max(0, 16 - votesLast24h);

    // CORRECTION #1 : Ajout de .from("votes") ici
    const { data, error } = await supabase
      .from("votes")
      .select(`
        id,
        created_at,
        talent_id,
        voter_id,
        categorie,
        univers,
        talents:talents (
          id,
          slug,
          prenom,
          nom,
          avatar_url
        )
      `)
      .eq("voter_id", actualVotantId) // Changed from votant_id to voter_id
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Dashboard Votant - Error fetching votes:", error);
      setErrorMsg(error.message);
      setVotes([]);
      return;
    }

    setVotes((data ?? []) as unknown as VoteRow[]);
    
    // Stocker les informations de quota pour l'affichage
    setVotesLast24h(votesLast24h);
    setRemainingVotes(remainingVotes);
  }, [supabase]);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Charger le profil depuis la table profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error loading profile:", profileError);
    }

    const profile = profileData || {
      id: user.id,
      prenom: null,
      nom: null,
      avatar_url: null,
    };

    setProfile(profile);
    await fetchVotes(user.id);
    setLoading(false);
  }, [supabase, router, fetchVotes]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const stats = useMemo(() => {
    const totalVotes = votes.length;
    const distinctUniverses = Array.from(new Set(votes.map(v => v.univers).filter(Boolean)));
    const distinctCategories = Array.from(new Set(votes.map(v => v.categorie).filter(Boolean)));
    const universeCount = distinctUniverses.length;
    const categoryCount = distinctCategories.length;
    
    const calculatedStatus = calculateVoterStatus(totalVotes, universeCount, categoryCount);
    const currentStatus = {
      ...calculatedStatus,
      color: "#8E8E8E",
      bg: "bg-[#8E8E8E]/10", 
      icon: "🗳️"
    };
    
    return {
      totalVotes,
      universeCount,
      categoryCount,
      distinctUniverses,
      distinctCategories,
      currentStatus
    };
  }, [votes]);

  const nextStatus = useMemo(() => getNextStatus(stats.currentStatus.level), [stats.currentStatus.level]);

  const availableCategories = useMemo(() => {
    if (selectedUniverse === "Tous les univers") {
      const cats = new Set(votes.map((vote) => vote.categorie).filter(Boolean));
      return ["Toutes les catégories", ...Array.from(cats) as string[]];
    }

    const cats = new Set(
      votes
        .filter((vote) => (vote.univers || getUniverseFromCategory(vote.categorie ?? "")) === selectedUniverse)
        .map((vote) => vote.categorie)
        .filter(Boolean),
    );

    return ["Toutes les catégories", ...Array.from(cats) as string[]];
  }, [selectedUniverse, votes]);

  // Filtering logic
  const filteredVotes = useMemo(() => {
    return votes.filter(vote => {
      const universe = vote.univers || getUniverseFromCategory(vote.categorie ?? "");
      const talent = vote.talents;
      if (!talent) return false;
      
      const fullName = `${talent.prenom || ""} ${talent.nom || ""}`.toLowerCase();
      
      const matchesUniverse = selectedUniverse === "Tous les univers" || universe === selectedUniverse;
      const matchesCategory = selectedCategory === "Toutes les catégories" || vote.categorie === selectedCategory;
      const matchesSearch = fullName.includes(searchQuery.toLowerCase());
      
      return matchesUniverse && matchesCategory && matchesSearch;
    });
  }, [votes, selectedUniverse, selectedCategory, searchQuery]);

  // Debug: Vérifier les données du profil
  console.log("Données du profil dans le Dashboard :", profile);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <Loader2 className="w-12 h-12 text-[#008751] animate-spin" />
      </div>
    );
  }

  if (errorMsg && votes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F7] px-6 text-center">
        <Heart className="w-12 h-12 text-[#E9B113] mb-4" />
        <h2 className="text-2xl font-display font-bold text-black">Impossible de charger votre Dashboard Votant</h2>
        <p className="text-sm text-gray-500 mt-3 max-w-xl">{errorMsg}</p>
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
            <AvatarFallback profile={profile} size="large" />
          </motion.div>
          
          <div className="flex-1 text-center md:text-left space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <VoterStatusBadge status={stats.currentStatus} />
            </motion.div>
            <UserNameDisplay />
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 font-sans max-w-lg"
            >
              Votre parcours citoyen contribue au rayonnement de l&apos;excellence béninoise.
            </motion.p>
            
            {/* Share Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <button
                onClick={generateAndShareCard}
                disabled={generatingCard}
                className="inline-flex items-center gap-2 bg-[#008751] text-white font-medium py-2 px-4 rounded-xl hover:bg-[#006B3F] transition-colors text-sm disabled:opacity-50"
              >
                {generatingCard ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Partager ma carte
                  </>
                )}
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-[#F9F9F7] p-4 rounded-2xl border border-[#F2EDE4] text-center">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Votes</span>
              <span className="text-2xl font-bold text-black flex items-center justify-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {stats.totalVotes}
              </span>
            </div>
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
            <div className="bg-[#F9F9F7] p-4 rounded-2xl border border-[#F2EDE4] text-center">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Profondeur</span>
              <span className="text-2xl font-bold text-[#E8112D] flex items-center justify-center gap-2">
                <Target className="w-5 h-5" />
                {stats.categoryCount}/64
              </span>
            </div>
          </div>
        {/* CORRECTION #2 : Il manquait ce </div> de fermeture ici */}
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
                      {stats.totalVotes < nextStatus.minVotes && (stats.universeCount < nextStatus.minUniverses || stats.categoryCount < nextStatus.minCategories) && " / "}
                      {stats.universeCount < nextStatus.minUniverses && <span className="font-bold text-[#E9B113]"> {nextStatus.minUniverses - stats.universeCount} univers</span>}
                      {stats.universeCount < nextStatus.minUniverses && stats.categoryCount < nextStatus.minCategories && " / "}
                      {stats.categoryCount < nextStatus.minCategories && <span className="font-bold text-[#E8112D]"> {nextStatus.minCategories - stats.categoryCount} catégories</span>}
                      {" "}pour progresser.
                    </p>
                  ) : (
                    <p className="text-sm text-[#006B3F] font-bold mt-1">Félicitations ! Vous êtes un Gardien de l&apos;excellence béninoise.</p>
                  )}
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-6">
                {/* Impact Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 text-gray-400"><Flame className="w-3 h-3 text-green-600" /> Impact (Votes)</span>
                    <span className="text-green-600">{stats.totalVotes} {nextStatus && `/ ${nextStatus.minVotes}`}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, nextStatus ? (stats.totalVotes / nextStatus.minVotes) * 100 : 100)}%` }}
                      className="h-full bg-green-600 rounded-full"
                    />
                  </div>
                </div>
                
                {/* Exploration Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 text-gray-400"><Globe className="w-3 h-3 text-yellow-500" /> Exploration (Univers)</span>
                    <span className="text-yellow-500">{stats.universeCount} / 16</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, nextStatus ? (stats.universeCount / nextStatus.minUniverses) * 100 : 100)}%` }}
                      className="h-full bg-yellow-500 rounded-full"
                    />
                  </div>
                </div>
                
                {/* Depth Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 text-gray-400"><Target className="w-3 h-3 text-red-600" /> Profondeur (Catégories)</span>
                    <span className="text-red-600">{stats.categoryCount} / 64</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, nextStatus ? (stats.categoryCount / nextStatus.minCategories) * 100 : 100)}%` }}
                      className="h-full bg-red-600 rounded-full"
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
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un talent…"
                    className="bg-white border border-[#F2EDE4] px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#006B3F]/20"
                  />
                  <select 
                    value={selectedUniverse}
                    onChange={(e) => {
                      setSelectedUniverse(e.target.value);
                      setSelectedCategory("Toutes les catégories");
                    }}
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
                    {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
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
                      if (!talent) return null;
                      const universe = vote.univers || getUniverseFromCategory(vote.categorie ?? "");
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
                                alt={talent.prenom || ""} 
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
                                {new Date(vote.created_at).toLocaleDateString()}
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
                    <h3 className="text-lg font-display font-bold text-black mb-1">
                      {votes.length === 0 ? "Aucun vote pour le moment" : "Aucun talent trouvé"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {votes.length === 0
                        ? "Commencez à soutenir des talents pour débloquer votre progression."
                        : "Ajustez vos filtres pour voir vos autres votes."}
                    </p>
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
                {universes.map((u) => {
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

      {/* Hidden Citizen Card for Image Generation */}
      <div 
        id="citizen-card" 
        className="fixed -top-[9999px] -left-[9999px] w-[800px] h-[800px] bg-white p-8"
      >
        <div className="h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50">
              <AvatarFallback profile={profile} size="large" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">
                {profile?.prenom} {profile?.nom || "Citoyen Béninois"}
              </h2>
              <div className="text-lg font-medium text-[#008751] mt-1">
                {stats.currentStatus.label}
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold uppercase">
                <span className="text-gray-600">Impact (Votes)</span>
                <span className="text-green-600">{stats.totalVotes}</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${Math.min(100, (stats.totalVotes / 250) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold uppercase">
                <span className="text-gray-600">Exploration (Univers)</span>
                <span className="text-yellow-600">{stats.universeCount} / 16</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${(stats.universeCount / 16) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold uppercase">
                <span className="text-gray-600">Profondeur (Catégories)</span>
                <span className="text-red-600">{stats.categoryCount} / 64</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 rounded-full"
                  style={{ width: `${(stats.categoryCount / 64) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-2">Benin Excellence</div>
            <div className="text-lg font-bold text-black">🇧🇯</div>
          </div>
        </div>
      </div>
    </div>
  );
}