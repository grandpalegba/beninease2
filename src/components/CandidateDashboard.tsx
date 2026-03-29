"use client";

import { useState, useEffect, useMemo } from 'react'; 
import { Lock, Trash2, Upload, Mail, MessageSquare, ChevronRight, CheckCircle2, ExternalLink, Loader2, Award, Heart, TrendingUp, User, Settings } from 'lucide-react'; 
import Link from 'next/link';
import { VIDEO_STEPS } from '@/lib/constants/video-steps'; 
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  content: string;
  created_at: string;
  status: 'unread' | 'read';
}

interface CandidateDashboardProps {
  profile: Profile;
}

export default function CandidateDashboard({ profile }: CandidateDashboardProps) { 
  const [activeTab, setActiveTab] = useState<'videos' | 'messages'>('videos');
  const [loading, setLoading] = useState(false); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [talentStats, setTalentStats] = useState<any>(null);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  
  // Logique d'activation : Seul l'onglet 1 est ouvert pour les 'candidat' 
  const isAmbassadeur = profile.role === 'ambassadeur' || profile.role === 'admin'; 

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchTalentStats();
  }, [profile.id]);

  const fetchTalentStats = async () => {
    try {
      // Use profiles as the single source of truth
      const { data: talentData, error: talentError } = await supabase
        .from('profiles')
        .select('votes, category')
        .eq('id', profile.id)
        .single();

      if (talentError) throw talentError;

      if (talentData) {
        // Fetch rank in category
        const { data: rankData, error: rankError } = await supabase
          .from('profiles')
          .select('id, votes')
          .eq('category', talentData.category)
          .or('role.eq.candidat,role.eq.ambassadeur,role.eq.candidate')
          .order('votes', { ascending: false });

        if (rankError) throw rankError;

        const rank = rankData ? rankData.findIndex(t => t.id === profile.id) + 1 : 0;
        setTalentStats({ votes: talentData.votes || 0, rank, category: talentData.category });
      }
    } catch (err) {
      console.error("Error fetching talent stats:", err);
      // Set default stats on error to avoid infinite loading
      setTalentStats({ votes: 0, rank: 0, category: profile.category || 'Non définie' });
    }
  };

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ status: 'read' })
      .eq('id', messageId);

    if (!error) {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: 'read' } : m));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, status: 'read' } : null);
      }
    }
  };

  const handleUpdateVideo = async (key: string, videoId: string | null) => { 
    setLoading(true); 
    const { error } = await supabase 
      .from('profiles') 
      .update({ [key]: videoId }) 
      .eq('id', profile.id); 
    
    if (!error) { 
      // Refresh local ou state 
      window.location.reload(); 
    } else {
      console.error("Erreur lors de la mise à jour de la vidéo:", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
    setLoading(false); 
  }; 

  const handleUploadClick = async (key: string) => {
    const videoId = window.prompt("Entrez l'ID de la vidéo YouTube (ex: dQw4w9WgXcQ) :");
    if (videoId) {
      await handleUpdateVideo(key, videoId);
    }
  };

  return ( 
    <div className="max-w-6xl mx-auto p-4 space-y-12"> 
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10"> 
        <div className="space-y-4">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
            isAmbassadeur ? "bg-[#E9B113]/10 text-[#E9B113] border-[#E9B113]/20" : "bg-[#008751]/10 text-[#008751] border-[#008751]/20"
          )}>
            {isAmbassadeur ? <Award className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            {isAmbassadeur ? 'Ambassadeur' : 'Candidat'}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-black tracking-tight">Mon Espace Talent</h1> 
          <p className="text-gray-500 font-sans text-lg">
            Gérez vos contenus et suivez votre impact sur Beninease.
          </p> 
          <p className="text-sm font-bold text-[#008751] bg-[#008751]/5 px-4 py-2 rounded-full inline-block">
            {`${profile.prenom || ''} ${profile.nom || ''}`.trim() || "Profil sans nom"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              href="/dashboard/votant"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#E9B113] text-[#E9B113] rounded-full font-bold text-sm hover:bg-[#E9B113]/5 transition-all shadow-sm group"
            >
              <Heart className="w-4 h-4 group-hover:fill-[#E9B113] transition-all" />
              Accéder à l'Espace Vote
            </Link>
            <button 
              onClick={() => window.location.href = '/settings'}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-full font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
            >
              <Settings className="w-4 h-4" />
              Modifier le profil
            </button>
          </div>
        </div>

        {/* Stats Cards Quick View */}
        <div className="flex gap-4">
          <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center min-w-[140px]">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </div>
            <span className="text-2xl font-black text-black">{talentStats?.votes || 0}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Votes</span>
          </div>
          <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center min-w-[140px]">
            <div className="w-10 h-10 rounded-full bg-[#E9B113]/10 flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-[#E9B113]" />
            </div>
            <span className="text-2xl font-black text-black">#{talentStats?.rank || '-'}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rang {talentStats?.category}</span>
          </div>
        </div>
      </header> 

      {/* Tabs Navigation */}
      <div className="flex justify-start gap-8 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('videos')}
          className={cn(
            "pb-6 text-sm font-bold uppercase tracking-widest transition-all relative font-display",
            activeTab === 'videos' ? "text-[#008751]" : "text-gray-400 hover:text-gray-600"
          )}
        >
          Ma Candidature (1+3+1)
          {activeTab === 'videos' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#008751] rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={cn(
            "pb-6 text-sm font-bold uppercase tracking-widest transition-all relative flex items-center gap-3 font-display",
            activeTab === 'messages' ? "text-[#008751]" : "text-gray-400 hover:text-gray-600"
          )}
        >
          Messages Reçus
          {messages.some(m => m.status === 'unread') && (
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8112D] animate-pulse" />
          )}
          {activeTab === 'messages' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#008751] rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === 'videos' ? (
        <div className="space-y-12">
          {/* Suivi Vidéo Info */}
          <div className="bg-[#008751]/5 border border-[#008751]/10 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-black">Progression du modèle "1+3+1"</h4>
              <p className="text-sm text-gray-500">
                {isAmbassadeur 
                  ? "Vous avez accès aux 4 slots vidéo pour maximiser votre impact." 
                  : "Le slot 1 est votre vidéo de présentation principale. Les suivants se débloqueront après validation."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {VIDEO_STEPS.map((step, i) => {
                const isUploaded = !!profile[step.key as keyof Profile];
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "w-10 h-2 rounded-full transition-all",
                      isUploaded ? "bg-[#008751]" : "bg-gray-200"
                    )}
                    title={step.label}
                  />
                );
              })}
            </div>
          </div>

          {/* Grille des Vidéos */} 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700"> 
            {VIDEO_STEPS.map((step) => { 
              const videoId = profile[step.key as keyof Profile] as string | null; 
              const isLocked = step.id > 1 && !isAmbassadeur; 

              return ( 
                <div key={step.id} className={cn(
                  "relative p-8 rounded-[32px] border-2 transition-all group overflow-hidden shadow-sm",
                  isLocked ? "bg-gray-50 border-gray-100 grayscale" : "bg-white border-[#008751]/5 hover:border-[#008751]/20 hover:shadow-xl hover:shadow-[#008751]/5"
                )}> 
                  {isLocked && ( 
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-[2px] z-10 p-6 text-center"> 
                      <Lock className="w-10 h-10 text-gray-300 mb-4" /> 
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed"> 
                        Débloqué après validation du jury
                      </p> 
                    </div> 
                  )} 

                  <div className="flex justify-between items-start mb-6"> 
                    <div className="space-y-1"> 
                      <h3 className="font-display text-xl font-bold text-black">{step.label}</h3> 
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{step.desc}</p> 
                    </div> 
                    {videoId && ( 
                      <div className="flex items-center gap-1.5 bg-[#008751]/10 text-[#008751] text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-[#008751]/20"> 
                        <div className="w-1.5 h-1.5 rounded-full bg-[#008751] animate-pulse" />
                        EN LIGNE 
                      </div> 
                    )} 
                  </div> 

                  <div className="mt-4"> 
                    {videoId ? ( 
                      <div className="space-y-4"> 
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white"> 
                          <iframe 
                            className="w-full h-full" 
                            src={`https://www.youtube.com/embed/${videoId}`} 
                            title={step.label} 
                            allowFullScreen
                          /> 
                        </div> 
                        <button 
                          onClick={() => handleUpdateVideo(step.key, null)} 
                          disabled={loading}
                          className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-[#E8112D] transition-all py-2" 
                        > 
                          <Trash2 className="w-4 h-4 mr-2" /> Supprimer et remplacer 
                        </button> 
                      </div> 
                    ) : ( 
                      <button 
                        onClick={() => handleUploadClick(step.key)}
                        disabled={isLocked || loading} 
                        className="w-full py-16 border-2 border-dashed border-gray-100 rounded-[24px] flex flex-col items-center hover:border-[#008751]/30 hover:bg-[#008751]/5 transition-all group bg-gray-50/30" 
                      > 
                        <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#008751]" /> 
                        </div>
                        <span className="text-sm font-bold text-gray-400 group-hover:text-[#008751] uppercase tracking-widest">Ajouter ma vidéo</span> 
                      </button> 
                    )} 
                  </div> 
                </div> 
              ); 
            })} 
          </div> 
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List of messages */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 px-2">Archive des messages</h3>
              {loadingMessages ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#E8112D]" />
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all group relative",
                        selectedMessage?.id === msg.id 
                          ? "bg-white border-[#E8112D] shadow-md" 
                          : "bg-white border-gray-100 hover:border-gray-300",
                        msg.status === 'unread' && "border-l-4 border-l-[#E8112D]"
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold truncate max-w-[120px]">{msg.sender_name}</span>
                        <span className="text-[10px] text-gray-400 uppercase">{new Date(msg.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-semibold truncate group-hover:text-[#E8112D] transition-colors">{msg.subject}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center">
                  <Mail className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Aucun message reçu pour le moment.</p>
                </div>
              )}
            </div>

            {/* Selected message view */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 sticky top-8">
                  <div className="flex justify-between items-start border-b border-gray-50 pb-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-black mb-2">{selectedMessage.subject}</h2>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-500">De : <span className="font-bold text-black">{selectedMessage.sender_name}</span></p>
                        <p className="text-xs text-gray-400">{selectedMessage.sender_email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reçu le</p>
                      <p className="text-sm font-bold text-black">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="py-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.content}
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex flex-wrap gap-4">
                    <a
                      href={`mailto:${selectedMessage.sender_email}?subject=Re: ${selectedMessage.subject}`}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Répondre par email
                    </a>
                    {selectedMessage.status === 'unread' && (
                      <button
                        onClick={() => markAsRead(selectedMessage.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#008751]/10 text-[#008751] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#008751]/20 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-200">
                  <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
                  <h3 className="text-xl font-display font-bold text-gray-400">Sélectionnez un message</h3>
                  <p className="text-gray-400 text-sm max-w-xs mt-2">
                    Cliquez sur un message dans la liste pour lire son contenu et y répondre.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Zone Publicitaire --- */} 
      <footer className="mt-12 pt-8 border-t border-gray-100"> 
        <div className="bg-gray-900 rounded-2xl p-6 flex items-center justify-between text-white"> 
          <div> 
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Partenaire Officiel</p> 
            <p className="font-bold text-lg">Découvrez les saveurs du Bénin</p> 
          </div> 
          <div className="w-24 h-12 bg-gray-800 rounded-lg flex items-center justify-center italic text-xs font-bold text-gray-400"> 
            Pub_Logo 
          </div> 
        </div> 
      </footer> 
    </div> 
  ); 
}
