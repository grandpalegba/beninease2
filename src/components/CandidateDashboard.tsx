"use client";

import { useState, useMemo } from 'react';
import type { Ambassadeur } from '@/types';
import { cn } from '@/lib/utils';
import VideosSection from './dashboard/ambassadeur/VideosSection';
import MessagesSection from './dashboard/ambassadeur/MessagesSection';
import AmbassadeurHeader from './dashboard/ambassadeur/AmbassadeurHeader';
import StatsSection from './dashboard/ambassadeur/StatsSection';

interface AmbassadeurDashboardProps {
  profile: Ambassadeur;
}

export default function AmbassadeurDashboard({ profile }: AmbassadeurDashboardProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'messages'>('videos');

  // Pour l'instant, on garde les messages simples
  const unreadMessagesCount = 0;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 space-y-12">
      <AmbassadeurHeader profile={profile} />

      <StatsSection profile={profile} />

      <div className="flex justify-start gap-8 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('videos')}
          className={cn(
            "pb-6 text-sm font-bold uppercase tracking-widest transition-all relative font-display",
            activeTab === 'videos' ? "text-[#008751]" : "text-gray-400 hover:text-gray-600"
          )}
        >
          Mes Vidéos
          {activeTab === 'videos' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#008751] rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={cn(
            "pb-6 text-sm font-bold uppercase tracking-widest transition-all relative flex items-center gap-3 font-display",
            activeTab === 'messages' ? "text-[#008751]" : "text-gray-400 hover:text-gray-600"
          )}
        >
          Messages
          {unreadMessagesCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />}
          {activeTab === 'messages' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#008751] rounded-t-full" />}
        </button>
      </div>

      <div className="animate-in fade-in duration-500">
        {activeTab === 'videos' ? (
          <VideosSection profile={profile} />
        ) : (
          <MessagesSection profile={profile} />
        )}
      </div>

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
