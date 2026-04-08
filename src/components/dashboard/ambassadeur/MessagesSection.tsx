"use client";

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/utils/supabase/client';
import type { Ambassadeur } from '@/types';
import { cn } from '@/lib/utils';
import { Loader2, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  content: string;
  created_at: string;
  status: 'unread' | 'read';
}

interface MessagesSectionProps {
  profile: Ambassadeur;
}

export default function MessagesSection({ profile }: MessagesSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const unreadCount = useMemo(() => messages.filter(m => m.status === 'unread').length, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) console.error("Erreur lors de la récupération des messages:", error);
      if (data) setMessages(data as Message[]);
      setLoadingMessages(false);
    };

    fetchMessages();
  }, [profile.id, supabase]);

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'read' })
        .eq('id', message.id);

      if (!error) {
        setMessages(prev => prev.map(m => m.id === message.id ? { ...m, status: 'read' } : m));
      }
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !selectedMessage) return;
    setIsReplying(true);
    
    // Ici, on appellerait une fonction Supabase pour envoyer l'email/message
    // Par exemple: await supabase.functions.invoke('send-reply', { ... })
    console.log('Envoi de la réponse:', { 
        to: selectedMessage.sender_email, 
        subject: `Re: ${selectedMessage.subject}`,
        content: replyContent
    });

    // Simulation d'un délai réseau
    await new Promise(res => setTimeout(res, 1500));

    setIsReplying(false);
    setReplyContent('');
    alert("Réponse envoyée (simulation) !");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 px-2">Boîte de réception ({unreadCount})</h3>
        {loadingMessages ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
        ) : messages.length > 0 ? (
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all group relative",
                  selectedMessage?.id === msg.id 
                    ? "bg-white border-transparent shadow-lg shadow-blue-500/10 ring-2 ring-blue-500"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md",
                  msg.status === 'unread' && "font-bold"
                )}
              >
                {msg.status === 'unread' && <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs truncate max-w-[150px]">{msg.sender_name}</span>
                  <span className="text-[10px] text-gray-400 uppercase">{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
                <p className={cn("text-sm truncate transition-colors", selectedMessage?.id === msg.id ? "text-blue-600" : "group-hover:text-black")}>{msg.subject}</p>
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

      <div className="lg:col-span-2">
        {selectedMessage ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 sticky top-8">
            <div className="border-b border-gray-100 pb-6">
              <h2 className="text-2xl font-display font-bold text-black mb-2">{selectedMessage.subject}</h2>
              <p className="text-sm text-gray-500">De: <span className="font-semibold text-black">{selectedMessage.sender_name}</span> ({selectedMessage.sender_email})</p>
            </div>

            <div className="py-4 text-gray-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
              {selectedMessage.content}
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Répondre</h4>
                <textarea 
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Répondre à ${selectedMessage.sender_name}...`}
                    className="w-full h-28 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button
                    onClick={handleReply}
                    disabled={isReplying || !replyContent.trim()}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                >
                    {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isReplying ? 'Envoi en cours...' : 'Envoyer la réponse'}
                </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-200">
            <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-display font-bold text-gray-400">Sélectionnez un message</h3>
            <p className="text-gray-400 text-sm max-w-xs mt-2">Cliquez sur un message pour lire son contenu et y répondre.</p>
          </div>
        )}
      </div>
    </div>
  );
}
