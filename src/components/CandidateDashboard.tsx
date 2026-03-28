"use client";

import { useState, useEffect } from 'react'; 
import { Lock, Trash2, Upload, Mail, MessageSquare, ChevronRight, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react'; 
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
  const supabase = createSupabaseBrowserClient();
  
  // Logique d'activation : Seul l'onglet 1 est ouvert pour les 'candidat' 
  const isAmbassadeur = profile.role === 'ambassadeur' || profile.role === 'admin'; 

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('receiver_id', profile.id)
      .order('created_at', { ascending: false });

    if (data) setMessages(data);
    setLoadingMessages(false);
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
    <div className="max-w-4xl mx-auto p-4 space-y-8"> 
      <header className="text-center"> 
        <h1 className="font-display text-3xl text-[#E8112D]">Mon Espace Ambassadeur</h1> 
        <p className="text-gray-500 font-sans mt-2">Statut actuel : 
          <span className={`ml-2 font-bold ${isAmbassadeur ? 'text-[#008751]' : 'text-orange-500'}`}> 
            {profile.role.toUpperCase()} 
          </span> 
        </p> 
        <p className="text-sm font-bold text-black mt-2">
          {`${profile.prenom || ''} ${profile.nom || ''}`.trim() || "Profil sans nom"}
        </p>
      </header> 

      {/* Tabs Navigation */}
      <div className="flex justify-center border-b border-gray-100">
        <button
          onClick={() => setActiveTab('videos')}
          className={cn(
            "px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all relative",
            activeTab === 'videos' ? "text-[#E8112D]" : "text-gray-400 hover:text-gray-600"
          )}
        >
          Mes Vidéos
          {activeTab === 'videos' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8112D]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={cn(
            "px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all relative flex items-center gap-2",
            activeTab === 'messages' ? "text-[#E8112D]" : "text-gray-400 hover:text-gray-600"
          )}
        >
          Messages Reçus
          {messages.some(m => m.status === 'unread') && (
            <span className="w-2 h-2 rounded-full bg-[#E8112D] animate-pulse" />
          )}
          {activeTab === 'messages' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8112D]" />
          )}
        </button>
      </div>

      {activeTab === 'videos' ? (
        <>
          {/* Grille des 4 Vidéos */} 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500"> 
            {VIDEO_STEPS.map((step) => { 
              const videoId = profile[step.key as keyof Profile] as string | null; 
              const isLocked = step.id > 1 && !isAmbassadeur; 

              return ( 
                <div key={step.id} className={`relative p-6 rounded-2xl border-2 transition-all ${ 
                  isLocked ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-[#008751]/20 shadow-sm' 
                }`}> 
                  {isLocked && ( 
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 rounded-2xl z-10"> 
                      <Lock className="w-8 h-8 text-gray-400 mb-2" /> 
                      <p className="text-xs font-medium text-gray-500 px-4 text-center"> 
                        Débloqué après validation du jury de présélection 
                      </p> 
                    </div> 
                  )} 

                  <div className="flex justify-between items-start mb-4"> 
                    <div> 
                      <h3 className="font-bold text-lg">{step.label}</h3> 
                      <p className="text-xs text-gray-400">{step.desc}</p> 
                    </div> 
                    {videoId && ( 
                      <span className="bg-[#008751]/10 text-[#008751] text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest"> 
                        EN LIGNE 
                      </span> 
                    )} 
                  </div> 

                  {/* Zone d'action Video */} 
                  <div className="mt-4"> 
                    {videoId ? ( 
                      <div className="space-y-3"> 
                        <div className="aspect-video bg-black rounded-lg overflow-hidden"> 
                          {/* Preview simple */} 
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
                          className="flex items-center text-[#E8112D] text-sm hover:font-bold transition-all" 
                        > 
                          <Trash2 className="w-4 h-4 mr-2" /> Supprimer et remplacer 
                        </button> 
                      </div> 
                    ) : ( 
                      <button 
                        onClick={() => handleUploadClick(step.key)}
                        disabled={isLocked || loading} 
                        className="w-full py-8 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center hover:border-[#E8112D] hover:bg-red-50 transition-all group" 
                      > 
                        <Upload className="w-6 h-6 text-gray-300 group-hover:text-[#E8112D] mb-2" /> 
                        <span className="text-sm text-gray-400 group-hover:text-[#E8112D]">Ajouter ma vidéo</span> 
                      </button> 
                    )} 
                  </div> 
                </div> 
              ); 
            })} 
          </div> 

          {/* --- Zone Historique des Votes --- */} 
          <section className="bg-[#F9F9F7] p-8 rounded-2xl border border-[#008751]/10"> 
            <h2 className="font-display text-xl mb-4">Mes derniers votes</h2> 
            <div className="text-sm text-gray-500"> 
              Vous n'avez pas encore voté pour d'autres talents. 
              <a href="/talents" className="text-[#E8112D] ml-2 underline font-bold">Découvrir les talents</a> 
            </div> 
          </section> 
        </>
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
