/**
 * PAGE PUBLIQUE - PROFIL TALENT
 * Role: "Sanctuaire" du talent, affichage des vidéos et détails.
 */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, MapPin, Play, Globe, Clock, Share2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { candidates } from "@/data/candidates";
import confetti from "canvas-confetti";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import PhoneInput from "@/components/PhoneInput";
import { useVoter } from "@/lib/auth/use-voter";

export default function TalentProfilePage({ params }: { params: any }) {
  const router = useRouter();
  const { session, login, isAuthenticated, checkHasVoted } = useVoter();
  
  // Unwrapping params if it's a promise (Next.js 15 compatibility)
  const [resolvedParams, setResolvedParams] = useState<any>(null);
  useEffect(() => {
    if (params instanceof Promise) {
      params.then(setResolvedParams);
    } else {
      setResolvedParams(params);
    }
  }, [params]);

  const slug = resolvedParams?.slug;
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  // 1. Données du candidat depuis le mock local
  const candidate = useMemo(() => {
    if (!slug) return null;
    return candidates.find(c => c.slug === slug);
  }, [slug]);

  const [activeTab, setActiveTab] = useState("Qui je suis");
  const [loading, setLoading] = useState(true);
  const [votesCount, setVotesCount] = useState(0);
  const [profileId, setProfileId] = useState<string | null>(null);
  
  // Voting state
  const [hasVoted, setHasVoted] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [voterWhatsapp, setVoterWhatsapp] = useState("");
  const [voterName, setVoterName] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [voteMessage, setVoteMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const tabs = ["Qui je suis", "Mon histoire", "Mon service", "Pourquoi moi"];

  // Mapping pour les noms de fichiers (kebab-case)
  const getFileName = (tabName: string) => {
    return tabName.toLowerCase().replace(/ /g, "-");
  };

  // Calcul du chemin d'image dynamique selon la structure public/ (tout en minuscule)
  const getImagePath = (tabName: string) => {
    if (!candidate) return "";
    const fileName = getFileName(tabName);
    const extension = tabName === "Qui je suis" ? "jpg" : "png";
    return `/talents/${candidate.slug}/${fileName}.${extension}`;
  };

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (tabName: string) => {
    setImageErrors((prev) => ({ ...prev, [tabName]: true }));
  };

  useEffect(() => {
    if (candidate && slug) {
      setLoading(true);
      // Fetch votes count from Supabase
      const fetchVotes = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, votes')
            .eq('slug', slug)
            .single();
          
          if (data) {
            setVotesCount(data.votes);
            setProfileId(data.id);
            
            // Check if user has already voted
            if (isAuthenticated) {
              const voted = await checkHasVoted(data.id);
              setHasVoted(voted);
            }
          }
        } catch (err) {
          console.error("Erreur lors de la récupération des votes:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchVotes();

      // Subscribe to real-time changes
      const channel = supabase
        .channel('public:profiles')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `slug=eq.${slug}` },
          (payload) => {
            if (payload.new && typeof payload.new.votes === 'number') {
              setVotesCount(payload.new.votes);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else if (resolvedParams && !candidate) {
      setLoading(false);
    }
  }, [candidate, slug, supabase, resolvedParams, isAuthenticated, checkHasVoted]);

  const handleVote = async () => {
    if (!profileId) return;

    // If not authenticated, we need to log in first
    if (!isAuthenticated) {
      if (!voterWhatsapp || !voterName) return;
      setIsVoting(true);
      const { success, error } = await login(voterWhatsapp, voterName);
      if (!success) {
        setVoteMessage({ type: 'error', text: "Erreur lors de la connexion. Veuillez réessayer." });
        setIsVoting(false);
        return;
      }
    }

    const currentWhatsapp = session?.whatsapp || voterWhatsapp;

    setIsVoting(true);
    setVoteMessage(null);

    try {
      // Étape A : Insérer le vote dans votes_records
      const { error: recordError } = await supabase
        .from('votes_records')
        .insert([
          { 
            voter_whatsapp: currentWhatsapp, 
            candidate_id: profileId,
            voter_id: session?.voter_id // If we have it from session
          }
        ]);

      if (recordError) {
        // Gestion erreur : Si doublon (code 23505)
        if (recordError.code === '23505') {
          setVoteMessage({ type: 'error', text: "Vous avez déjà soutenu ce talent !" });
          setHasVoted(true);
          setIsVoting(false);
          return;
        }
        throw recordError;
      }

      // Étape B : Si succès, incrémenter votes dans profiles
      const { error: updateError } = await supabase.rpc('increment_votes', { profile_id: profileId });
      if (updateError) throw updateError;
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#008751", "#E9B113", "#E8112D"],
      });

      setVoteMessage({ type: 'success', text: "Votre vote a été pris en compte ! Merci." });
      setHasVoted(true);
      
      // Auto-close modal after success
      setTimeout(() => {
        setShowVoteModal(false);
        setVoteMessage(null);
      }, 3000);

    } catch (err) {
      console.error("Erreur lors du vote:", err);
      setVoteMessage({ type: 'error', text: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setIsVoting(false);
    }
  };

  if (!resolvedParams || loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] px-4 py-10 flex items-center justify-center">
        <div className="text-center text-[#8E8E8E] font-sans">
          <div className="w-12 h-12 border-4 border-[#008751]/20 border-t-[#008751] rounded-full animate-spin mb-4 mx-auto" />
          Chargement du sanctuaire…
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#F2EDE4] bg-white p-10 font-sans text-center">
          <p className="text-sm text-red-700 mb-6">Candidat introuvable.</p>
          <button
            type="button"
            onClick={() => router.push("/talents")}
            className="rounded-full border border-[#008751]/20 bg-[#F9F9F7] px-5 py-3 text-xs font-bold tracking-[0.15em] uppercase text-[#008751] hover:bg-[#E9B113] hover:text-[#008751] transition-all active:scale-95"
          >
            Retour aux talents
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${candidate.prenom} ${candidate.nom}`;

  return (
    <div className="min-h-screen bg-[#F9F9F7] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden border border-[#F2EDE4]">
        
        {/* 2. En-tête (Header) */}
        <div className="p-8 md:p-12 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative w-36 h-36 bg-[#F9F9F7] rounded-[25px] border-[6px] border-white shadow-sm overflow-hidden flex-shrink-0">
              <Image 
                src={candidate.portrait} 
                alt={fullName} 
                fill 
                className="object-cover"
                priority
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-[34px] font-display font-bold text-black leading-tight">
                {fullName}
              </h1>
              <p className="text-black/80 font-display text-lg mt-1">
                {candidate.tagline}
              </p>

              <div className="mt-6 bg-white px-6 py-4 rounded-2xl border border-[#F2EDE4] shadow-sm max-w-[240px] mx-auto md:mx-0">
                <span className="block text-xs uppercase tracking-widest text-[#004d3d] font-bold mb-2 text-center">NOMBRE DE VOTES</span>
                <span className="block text-3xl font-bold text-black text-center">{votesCount}</span>
              </div>
              
              <p className="mt-6 inline-block rounded-full bg-[#008751]/10 px-3 py-1 text-xs font-display font-bold uppercase tracking-wider text-[#008751]">
                {candidate.category}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-6 text-[#8E8E8E] text-[11px] font-medium uppercase tracking-widest">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-black" /> {candidate.city}, Bénin
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> {candidate.languages}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8 md:px-12 border-b border-[#F2EDE4]">
          <div className="flex justify-between md:justify-start md:gap-16">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-bold transition-all relative tracking-wider uppercase ${
                  activeTab === tab ? "text-[#004d3d]" : "text-gray-400 hover:text-[#004d3d]/70"
                }`}
              >
                {tab}
                {activeTab === tab ? (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#004d3d]" />
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Les 4 Miniatures (Aperçus) */}
        <div className="p-8 md:p-12 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative aspect-video rounded-[15px] overflow-hidden group transition-all duration-500 border-2 ${
                  activeTab === tab
                    ? "border-[#008751] scale-[1.02] shadow-lg"
                    : "border-transparent opacity-70 hover:opacity-100 hover:scale-[1.02]"
                }`}
              >
                <Image 
                  src={imageErrors[tab] ? candidate.portrait : getImagePath(tab)} 
                  alt={tab} 
                  fill 
                  className="object-cover"
                  onError={() => handleImageError(tab)}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-[9px] font-bold text-white uppercase tracking-widest text-center">
                    {tab}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. La Grande Vidéo & Le Texte */}
        <div className="px-8 md:px-12 pb-12">
          <div className="relative aspect-video bg-[#1A1A1A] rounded-[30px] overflow-hidden shadow-2xl group border-[8px] border-white ring-1 ring-[#008751]/20">
            <Image 
              src={imageErrors[activeTab] ? candidate.portrait : getImagePath(activeTab)} 
              alt={activeTab} 
              fill 
              className="object-cover"
              onError={() => handleImageError(activeTab)}
            />
            {/* Video Overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white transition-opacity group-hover:bg-black/30">
              <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-4 transition-transform hover:scale-110 active:scale-95">
                <Play className="w-7 h-7 text-[#E9B113] fill-[#E9B113]" />
              </button>
              <p className="text-lg font-bold tracking-wide uppercase">
                {activeTab}
              </p>
              <div className="mt-2 flex items-center gap-2 text-white/70 text-[11px] font-medium uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                Durée max : 2 minutes
              </div>
            </div>
          </div>

          {/* Descriptive Text Section */}
          <div className="mt-8 p-6 bg-[#F9F9F7] rounded-2xl border border-[#004d3d]/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#004d3d] mb-3">Détails de la présentation</h3>
            <p className="text-black/80 text-base leading-relaxed">
              {candidate.tabs[activeTab]}
            </p>
          </div>

          {/* 5. Footer & Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {hasVoted ? (
              <div className="flex-[2] flex items-center justify-center gap-3 rounded-full bg-gray-100 border border-gray-200 px-8 py-5 text-sm font-bold tracking-widest uppercase text-gray-500 cursor-default">
                <CheckCircle2 className="w-5 h-5 text-[#008751]" />
                Talent soutenu ✅
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowVoteModal(true)}
                className="flex-[2] flex items-center justify-center gap-3 rounded-full bg-[#008751] px-8 py-5 text-sm font-bold tracking-widest uppercase text-white shadow-xl transition-all hover:bg-[#008751]/90 hover:shadow-[#008751]/20 hover:shadow-2xl active:scale-95 group"
              >
                <Heart className="w-5 h-5 fill-white text-white group-hover:animate-pulse" />
                Voter pour {candidate.prenom}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                const message = `Votez pour ${fullName} sur Beninease ! ${window.location.origin}/talents/${candidate.slug}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white border border-[#008751]/20 px-8 py-5 text-xs font-bold tracking-widest uppercase text-[#008751] transition-all hover:bg-[#F9F9F7] hover:border-[#008751] active:scale-95 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              Partager
            </button>
          </div>
        </div>
      </div>

      {/* Vote Modal */}
      {showVoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-display font-bold text-black">
                  {isAuthenticated ? "Confirmer votre vote" : "Rejoindre l'aventure"}
                </h3>
                <button 
                  onClick={() => setShowVoteModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {!voteMessage ? (
                <>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {isAuthenticated 
                      ? `Vous allez voter pour `
                      : `Entrez vos informations pour soutenir `
                    }
                    <span className="font-bold text-black">{fullName}</span>. 
                    Un seul vote par personne est autorisé.
                  </p>

                  <div className="space-y-6">
                    {!isAuthenticated && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-2">Nom Complet</label>
                          <input 
                            type="text"
                            value={voterName}
                            onChange={(e) => setVoterName(e.target.value)}
                            placeholder="Votre nom et prénom"
                            className="w-full px-5 py-4 rounded-2xl bg-[#F9F9F7] border border-[#008751]/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-2">Numéro WhatsApp</label>
                          <PhoneInput 
                            value={voterWhatsapp} 
                            onChange={setVoterWhatsapp} 
                            placeholder="Votre numéro WhatsApp"
                          />
                        </div>
                      </>
                    )}

                    <button
                      onClick={handleVote}
                      disabled={( !isAuthenticated && (!voterWhatsapp || !voterName)) || isVoting}
                      className="w-full flex items-center justify-center gap-3 rounded-full bg-[#008751] py-4 text-sm font-bold tracking-widest uppercase text-white shadow-lg transition-all hover:bg-[#008751]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVoting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Heart className="w-5 h-5 fill-white" />
                          {isAuthenticated ? "Confirmer mon vote" : "Voter maintenant"}
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center animate-in zoom-in-95 duration-300">
                  {voteMessage.type === 'success' ? (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-[#008751]" />
                      </div>
                      <p className="text-lg font-bold text-black mb-2">{voteMessage.text}</p>
                      <p className="text-gray-500 text-sm">Merci pour votre soutien !</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                      </div>
                      <p className="text-lg font-bold text-black mb-2">{voteMessage.text}</p>
                      <button
                        onClick={() => setVoteMessage(null)}
                        className="mt-4 text-[#008751] font-bold text-sm uppercase tracking-widest"
                      >
                        Réessayer
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
