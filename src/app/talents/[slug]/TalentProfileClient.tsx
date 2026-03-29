"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Heart, MapPin, Play, Globe, Clock, Share2, X, CheckCircle2, AlertCircle, Mail, MessageSquare, Phone, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import PhoneInput from "@/components/PhoneInput";
import { useVoter } from "@/lib/auth/use-voter";
import { ContactForm } from "@/components/talents/ContactForm";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
  candidate: any;
  initialVotesCount: number;
  profileId: string;
  avatarUrl?: string | null;
  profileData?: any; // New prop for extra profile info
};

export default function TalentProfileClient({ candidate, initialVotesCount, profileId, avatarUrl, profileData }: Props) {
  const router = useRouter();
  const { session, login, isAuthenticated, checkHasVoted } = useVoter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [activeTab, setActiveTab] = useState("Vidéos");
  const [activeVideoTab, setActiveVideoTab] = useState("Qui je suis");
  const [votesCount, setVotesCount] = useState(initialVotesCount);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
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

  const quiJeSuisImage = useMemo(() => getImagePath("Qui je suis"), [candidate.slug]);

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (tabName: string) => {
    setImageErrors((prev) => ({ ...prev, [tabName]: true }));
  };

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    }
    getUser();
    
    if (isAuthenticated && profileId) {
      checkHasVoted(profileId).then(setHasVoted);
    }
  }, [isAuthenticated, profileId, checkHasVoted, supabase]);

  useEffect(() => {
    if (candidate?.slug) {
      // Subscribe to real-time changes
      const channel = supabase
        .channel(`public:talents:slug=${candidate.slug}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'talents', filter: `slug=eq.${candidate.slug}` },
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
    }
  }, [candidate?.slug, supabase]);

  const handleVote = async () => {
    if (!profileId) return;

    // Phase de test : Redirection vers login si non connecté
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Phase de test : On utilise les infos de la session directement
    const voterId = currentUser?.id; // Use authenticated user ID directly from state

    setIsVoting(true);
    setVoteMessage(null);

    try {
      // Étape A : Insérer le vote dans la table votes (nom correct selon les spécifications récentes)
      const { error: recordError } = await supabase
        .from('votes')
        .insert([
          { 
            voter_id: voterId,
            candidate_id: profileId
          }
        ]);

      if (recordError) {
        // Gestion erreur : Si doublon (code 23505 ou message spécifique)
        if (recordError.code === '23505' || recordError.message?.includes('unique')) {
          setVoteMessage({ type: 'error', text: "Vous avez déjà soutenu ce talent !" });
          setHasVoted(true);
          setIsVoting(false);
          return;
        }
        throw recordError;
      }

      // Étape B : Si succès, incrémenter votes dans talents (via RPC pour atomicité)
      const { error: updateError } = await supabase.rpc('increment_votes', { candidate_id: profileId });
      if (updateError) throw updateError;
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#008751", "#E9B113", "#E8112D"],
      });

      setVoteMessage({ type: 'success', text: "Votre soutien a été enregistré avec succès !" });
      setHasVoted(true);
      
      // Refresh counts locally for instant feedback
      setVotesCount(prev => prev + 1);
      
      // Force refresh data for dashboards and leaderboard
      router.refresh();
      
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

  const fullName = `${candidate.prenom} ${candidate.nom}`;

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
                  // Fallback 1: Portrait local (ex: /talents/slug.jpg)
                  // Fallback 2: Image "Qui je suis" (ex: /talents/slug/qui-je-suis.jpg)
                  // Fallback 3: Placeholder global
                  if (profileImage === avatarUrl) {
                    setProfileImage(candidate.portrait);
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
                  src={imageErrors[activeVideoTab] ? candidate.portrait : getImagePath(activeVideoTab)} 
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
                  <div className="flex-[2] flex items-center justify-center gap-3 rounded-full bg-gray-100 border border-gray-200 px-8 py-5 text-sm font-bold tracking-widest uppercase text-gray-500 cursor-default">
                    <CheckCircle2 className="w-5 h-5 text-[#008751]" />
                    Talent soutenu ✅
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
                  onClick={() => {
                    const message = `Soutenez ${candidate.prenom} ${candidate.nom} pour devenir Ambassadeur du Bénin ! Votez ici : ${window.location.origin}/talents/${candidate.slug}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white border border-[#008751]/20 px-8 py-5 text-xs font-bold tracking-widest uppercase text-[#008751] transition-all hover:bg-[#F9F9F7] hover:border-[#008751] active:scale-95 shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              </div>
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
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Catégorie</p>
                        <p className="text-sm font-bold text-black">{candidate.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F9F9F7] flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-[#E9B113]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Langues</p>
                        <p className="text-sm font-bold text-black">{candidate.languages}</p>
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

      {/* Vote Modal - Temporarily disabled for test phase
      {showVoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          ...
        </div>
      )}
      */}
    </div>
  );
}
