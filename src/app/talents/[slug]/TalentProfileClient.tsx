"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Heart, MapPin, Play, Globe, Clock, Share2, X, CheckCircle2, AlertCircle, Mail, Phone, Trophy } from "lucide-react";
import { confetti } from "tsparticles-confetti";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useVoter } from "@/lib/auth/use-voter";
import { ContactForm } from "@/components/talents/ContactForm";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getUniverseFromCategory } from "@/lib/voter-logic";

// Custom Instagram Icon because it's missing from lucide-react in this version
const Instagram = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

type Props = {
  candidate: {
    slug: string;
    prenom: string | null;
    nom: string | null;
    portrait?: string | null;
    city?: string | null;
    univers?: string | null;
    categorie?: string | null;
    tabs: Record<string, string>;
  };
  initialVotesCount: number;
  profileId: string;
  avatarUrl?: string | null;
  profileData?: {
    instagram_url?: string | null;
    tiktok_url?: string | null;
    whatsapp_number?: string | null;
    city?: string | null;
  } | null;
};

export default function TalentProfileClient({
  candidate,
  initialVotesCount,
  profileId,
  avatarUrl,
  profileData
}: Props) {
  console.log("PROPS REÇUES PAR LE CLIENT :", candidate);  // Debug au début du composant
  const router = useRouter();
  const { isAuthenticated, checkHasVoted } = useVoter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [activeTab, setActiveTab] = useState("Vidéos");
  const [activeVideoTab, setActiveVideoTab] = useState("Qui je suis");
  const [votesCount, setVotesCount] = useState(initialVotesCount);
  
  // Voting state
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteMessage, setVoteMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const tabs = ["Qui je suis", "Mon histoire", "Mon service", "Pourquoi moi"];

  // Mapping pour les noms de fichiers (kebab-case)
  const getFileName = (tabName: string) => {
    return tabName.toLowerCase().replace(/ /g, "-");
  };

  // Image de profil (avatar) prioritaire si elle vient de Supabase
  const [profileImage, setProfileImage] = useState(avatarUrl || candidate.portrait || "/placeholder-portrait.jpg");

  useEffect(() => {
    if (avatarUrl) {
      setProfileImage(avatarUrl);
    }
  }, [avatarUrl]);

  // Calcul du chemin d'image dynamique selon la structure public/ (tout en minuscule)
  const getImagePath = (tabName: string) => {
    if (!candidate) return "";
    const fileName = getFileName(tabName);
    const extension = tabName === "Qui je suis" ? "jpg" : "png";
    return `/talents/${candidate.slug}/${fileName}.${extension}`;
  };

  const quiJeSuisImage = useMemo(() => {
    const fileName = "qui-je-suis";
    return `/talents/${candidate.slug}/${fileName}.jpg`;
  }, [candidate.slug]);

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (tabName: string) => {
    setImageErrors((prev) => ({ ...prev, [tabName]: true }));
  };

  useEffect(() => {
    const verifyVote = async () => {
      if (isAuthenticated && profileId && !isVoting && !hasVoted) {
        console.log("🔍 Vérification du vote pour le talent:", profileId);
        const voted = await checkHasVoted(profileId);
        setHasVoted(voted);
      }
    };
  
    verifyVote();
  }, [isAuthenticated, profileId, checkHasVoted, isVoting, hasVoted]);

  // Share state
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsShareCopied] = useState(false);

  const handleVote = async () => {
    // Récupération forcée de la session actuelle
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    const activeUser = currentSession?.user;

    if (!profileId || !activeUser) return;

    setIsVoting(true);
    setVoteMessage(null);

    try {
      // 0. Debug de la structure réelle du candidat
      console.log("STRUCTURE RÉELLE DU CANDIDATE :", candidate);
      
      // 1. Payload avec les noms exacts des colonnes (harmonisés)
      const payload = {
        voter_id: activeUser.id,
        talent_id: profileId,
        univers: candidate.univers,  // ← depuis talents.univers vers votes.univers
        categorie: candidate.categorie  // ← depuis talents.categorie vers votes.categorie
      };

      console.log("DÉBOGAGE FINAL - Univers:", candidate.univers, "Catégorie:", candidate.categorie);

      console.log("🚀 TENTATIVE DE VOTE AVEC :", payload);

      const { error: recordError } = await supabase
        .from('votes')
        .insert([payload]);

      // 2. Gestion des résultats
      if (recordError) {
        // Si l'erreur est "déjà voté" (code 23505), c'est une réussite pour l'interface !
        if (recordError.code === '23505' || recordError.message?.includes('unique')) {
          console.log("✅ Vote déjà existant, on valide l'affichage.");
          setHasVoted(true);  // DOIS appeler immédiatement
          setIsVoting(false);  // DOIS appeler immédiatement
          setVoteMessage({ type: 'success', text: "Soutien déjà enregistré !" });
          return;  // Sortir de la fonction
        } else {
          // Pour toute autre erreur (ex: NOT NULL constraint)
          console.error("❌ Erreur insertion:", recordError);
          setVoteMessage({ type: 'error', text: "Erreur technique lors du vote." });
        }
      } else {
        // Succès total
        console.log("🎉 Vote inséré avec succès !");
        setHasVoted(true);  // DOIS appeler immédiatement
        setIsVoting(false);  // DOIS appeler immédiatement
        setVoteMessage({ type: 'success', text: "Soutien validé ! Merci." });
        
        // Petit effet visuel si ce n'est pas déjà fait
        const canvas = document.createElement('canvas');
        confetti(canvas, { particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }

    } catch (err) {
      console.error("💥 Erreur critique:", err);
    } finally {
      setIsVoting(false);
      // router.refresh(); // Supprimé pour éviter le flicker d'état
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Soutenez ${fullName} sur Beninease !`,
      text: `Je viens de voter pour ${fullName} dans l'univers ${candidate.univers}. Rejoignez l'aventure pour choisir nos 256 ambassadeurs !`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('User cancelled share or error:', err);
      }
    } else {
      // Fallback if Native Share API is not available
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsShareCopied(true);
    setTimeout(() => setIsShareCopied(false), 2000);
  };

  const fullName = `${candidate.prenom || ""} ${candidate.nom || ""}`.trim() || "Talent";

  console.log("ÉTAT ACTUEL HASVOTED :", hasVoted);  // Debug en temps réel

  return (
    <div className="min-h-screen bg-[#F9F9F7] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden border border-[#F2EDE4]">
        
        {/* 2. En-tête (Header) */}
        <div className="p-8 md:p-12 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative w-36 h-36 bg-[#F9F9F7] rounded-[25px] border-[6px] border-white shadow-sm overflow-hidden flex-shrink-0">
              <Image 
                src={profileImage} 
                alt={fullName} 
                fill 
                className="object-cover"
                priority
                onError={() => {
                  if (profileImage === avatarUrl) {
                    setProfileImage(candidate.portrait || "/placeholder-portrait.jpg");
                  } else if (profileImage === candidate.portrait) {
                    setProfileImage(quiJeSuisImage);
                  } else if (profileImage === quiJeSuisImage) {
                    setProfileImage("/placeholder-portrait.jpg");
                  }
                }}
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-[34px] font-display font-bold text-black leading-tight">
                {fullName}
              </h1>

              <div className="mt-6 bg-white px-6 py-4 rounded-2xl border border-[#F2EDE4] shadow-sm max-w-[240px] mx-auto md:mx-0">
                <span className="block text-xs uppercase tracking-widest text-[#004d3d] font-bold mb-2 text-center">NOMBRE DE VOTES</span>
                <span className="block text-3xl font-bold text-black text-center">{votesCount}</span>
              </div>
              
              <div className="mt-6 flex items-center justify-center md:justify-start gap-2">
                <span className="rounded-full bg-[#008751]/10 px-3 py-1 text-xs font-display font-bold uppercase tracking-wider text-[#008751]">
                  {candidate.univers}
                </span>
                <span className="text-[#8E8E8E] text-[10px] font-bold uppercase tracking-widest">•</span>
                <span className="text-[#8E8E8E] text-[10px] font-bold uppercase tracking-widest">{candidate.categorie}</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-6 text-[#8E8E8E] text-[11px] font-medium uppercase tracking-widest">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-black" /> {candidate.city}, Bénin
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> {candidate.categorie || "Français"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8 md:px-12 border-b border-[#F2EDE4] bg-white sticky top-0 z-30">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("Vidéos")}
              className={cn(
                "py-6 text-sm font-bold transition-all relative tracking-[0.2em] uppercase",
                activeTab === "Vidéos" ? "text-[#004d3d]" : "text-gray-400 hover:text-[#004d3d]/70"
              )}
            >
              <div className="flex items-center gap-2">
                <Play className={cn("w-4 h-4", activeTab === "Vidéos" ? "fill-[#004d3d]" : "")} />
                Vidéos
              </div>
              {activeTab === "Vidéos" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#004d3d] rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("Contact")}
              className={cn(
                "py-6 text-sm font-bold transition-all relative tracking-[0.2em] uppercase",
                activeTab === "Contact" ? "text-[#004d3d]" : "text-gray-400 hover:text-[#004d3d]/70"
              )}
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact & Infos
              </div>
              {activeTab === "Contact" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#004d3d] rounded-t-full" />
              )}
            </button>
          </div>
        </div>

        {activeTab === "Vidéos" ? (
          <>
            {/* 3. Les 4 Miniatures (Aperçus) */}
            <div className="p-8 md:p-12 pb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveVideoTab(tab)}
                    className={`relative aspect-video rounded-[15px] overflow-hidden group transition-all duration-500 border-2 ${
                      activeVideoTab === tab
                        ? "border-[#008751] scale-[1.02] shadow-lg"
                        : "border-transparent opacity-70 hover:opacity-100 hover:scale-[1.02]"
                    }`}
                  >
                    <Image 
                      src={imageErrors[tab] ? (candidate.portrait || "/placeholder-portrait.jpg") : getImagePath(tab)} 
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
                  src={imageErrors[activeVideoTab] ? (candidate.portrait || "/placeholder-portrait.jpg") : getImagePath(activeVideoTab)} 
                  alt={activeVideoTab} 
                  fill 
                  className="object-cover"
                  onError={() => handleImageError(activeVideoTab)}
                />
                {/* Video Overlay */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white transition-opacity group-hover:bg-black/30">
                  <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-4 transition-transform hover:scale-110 active:scale-95">
                    <Play className="w-7 h-7 text-[#E9B113] fill-[#E9B113]" />
                  </button>
                  <p className="text-lg font-bold tracking-wide uppercase">
                    {activeVideoTab}
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
                  {candidate.tabs[activeVideoTab]}
                </p>
              </div>

              {/* 5. Footer & Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {hasVoted ? (
                  <div className="flex-[2] flex flex-col items-center justify-center gap-1 rounded-full bg-gray-50 border border-[#008751]/20 px-8 py-5 text-sm font-bold tracking-widest uppercase text-[#008751] cursor-default animate-in fade-in duration-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Soutien validé ✅
                    </div>
                    <span className="text-[10px] text-gray-400 normal-case font-medium">Merci pour votre participation</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleVote}
                    disabled={isVoting}
                    className="flex-[2] flex items-center justify-center gap-3 rounded-full bg-[#008751] px-8 py-5 text-sm font-bold tracking-widest uppercase text-white shadow-xl transition-all hover:bg-[#008751]/90 hover:shadow-[#008751]/20 hover:shadow-2xl active:scale-95 group"
                  >
                    {isVoting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Heart className="w-5 h-5 fill-white text-white group-hover:animate-pulse" />
                        Voter pour {candidate.prenom}
                      </>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white border border-[#008751]/20 px-8 py-5 text-xs font-bold tracking-widest uppercase text-[#008751] transition-all hover:bg-[#F9F9F7] hover:border-[#008751] active:scale-95 shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              </div>

              {/* Vote message notification */}
              {voteMessage && !hasVoted && (
                <div className={cn(
                  "mt-4 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-2 duration-300",
                  voteMessage.type === 'success' ? "bg-green-50 text-[#008751]" : "bg-red-50 text-red-600"
                )}>
                  {voteMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {voteMessage.text}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column: Form */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-black mb-2">Contacter le Talent</h2>
                  <p className="text-gray-500">Envoyez un message direct à {candidate.prenom} pour toute proposition ou encouragement.</p>
                </div>
                <ContactForm receiverId={profileId} talentName={fullName} />
              </div>

              {/* Right Column: Info & Socials */}
              <div className="space-y-10">
                {/* Social Networks */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Réseaux Sociaux</h3>
                  <div className="flex flex-wrap gap-3">
                    {profileData?.instagram_url && (
                      <a 
                        href={profileData.instagram_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-2xl bg-white border border-[#F2EDE4] flex items-center justify-center text-pink-600 hover:bg-pink-50 hover:border-pink-100 transition-all shadow-sm"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {profileData?.tiktok_url && (
                      <a 
                        href={profileData.tiktok_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-2xl bg-white border border-[#F2EDE4] flex items-center justify-center text-black hover:bg-gray-50 transition-all shadow-sm"
                      >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-.99 0-1.49.18-1.76.91-3.43 2.1-4.7 1.27-1.38 3.07-2.23 4.95-2.33 1.21-.1 2.42.16 3.5.7v4.21c-.76-.45-1.66-.67-2.54-.61-1.45.06-2.85.91-3.56 2.22-.55 1.02-.61 2.26-.19 3.3.36.93 1.16 1.67 2.12 1.98 1.03.32 2.16.17 3.08-.42.61-.4.99-1.06 1.13-1.77.13-.58.11-1.17.11-1.75V.02z"/>
                        </svg>
                      </a>
                    )}
                    {profileData?.whatsapp_number && (
                      <a 
                        href={`https://wa.me/${profileData.whatsapp_number}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-2xl bg-white border border-[#F2EDE4] flex items-center justify-center text-[#25D366] hover:bg-green-50 hover:border-green-100 transition-all shadow-sm"
                      >
                        <Phone className="w-5 h-5 fill-current" />
                      </a>
                    )}
                    {(!profileData?.instagram_url && !profileData?.tiktok_url && !profileData?.whatsapp_number) && (
                      <p className="text-xs text-gray-400 italic">Non renseignés</p>
                    )}
                  </div>
                </div>

                {/* Practical Infos */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Infos Pratiques</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F9F9F7] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Localisation</p>
                        <p className="text-sm font-bold text-black">{profileData?.city || candidate.city}, Bénin</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F9F9F7] flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-4 h-4 text-[#008751]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Univers</p>
                        <p className="text-sm font-bold text-black">{candidate.univers}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F9F9F7] flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-[#E9B113]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Langues</p>
                        <p className="text-sm font-bold text-black">{candidate.languages || "Français"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="p-6 bg-[#008751]/5 rounded-[24px] border border-[#008751]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-[#008751]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#004d3d]">Candidat Validé</span>
                  </div>
                  <p className="text-[11px] text-[#004d3d]/70 leading-relaxed font-medium">
                    Ce profil a été vérifié par le comité de Beninease pour participer à la sélection des Ambassadeurs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal Fallback */}
      {showShareModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-bold text-black">Partager le profil</h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    const message = `Soutenez ${candidate.prenom} ${candidate.nom} pour devenir Ambassadeur du Bénin ! Votez ici : ${window.location.href}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all font-bold text-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white">
                    <Phone className="w-5 h-5 fill-current" />
                  </div>
                  WhatsApp
                </button>

                <button
                  onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-all font-bold text-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center text-white">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 3.656 10.995 8.75 11.723v-8.293H5.27v-3.43h3.48V9.411c0-3.435 2.045-5.333 5.178-5.333 1.499 0 3.069.268 3.069.268v3.375h-1.73c-1.701 0-2.231 1.056-2.231 2.14v2.561h3.8l-.607 3.43h-3.193V23.8c5.094-.728 8.75-5.733 8.75-11.727z"/>
                    </svg>
                  </div>
                  Facebook
                </button>

                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-bold text-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-white">
                    <Share2 className="w-5 h-5" />
                  </div>
                  {isCopied ? "Lien copié !" : "Copier le lien"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
