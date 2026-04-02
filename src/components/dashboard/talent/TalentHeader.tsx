"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Talent } from '@/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/utils/supabase/client';
import { Award, User, Heart, TrendingUp } from 'lucide-react';

interface TalentHeaderProps {
  profile: Talent;
}

type ImpactStats = {
  votes: number;
  rank: number;
};

export default function TalentHeader({ profile }: TalentHeaderProps) {
  const isAmbassadeur = profile.role === 'ambassadeur' || profile.role === 'admin';
  const [stats, setStats] = useState<ImpactStats | null>(null);

  useEffect(() => {
    const fetchImpactStats = async () => {
      if (!profile.categorie) return;

      const { data: talentData, error: talentError } = await supabase
        .from('talents')
        .select('votes')
        .eq('id', profile.id)
        .single();

      if (talentError || !talentData) return;

      const { data: rankData, error: rankError } = await supabase.rpc('get_rank_in_category', { p_talent_id: profile.id });

      setStats({
        votes: talentData.votes || 0,
        rank: rankError ? 0 : rankData,
      });
    };

    fetchImpactStats();
    
    // Realtime subscription
    const channel = supabase
      .channel(`talent-votes-${profile.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'talents', filter: `id=eq.${profile.id}` }, 
        (payload) => {
          const newVotes = (payload.new as Talent).votes;
          setStats(prev => prev ? { ...prev, votes: newVotes } : { votes: newVotes, rank: prev?.rank || 0 });
          // On pourrait aussi rafraichir le rang ici, mais c'est plus coûteux
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [profile.id, profile.categorie, supabase]);

  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
      <div className="space-y-4">
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
          isAmbassadeur ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-teal-500/10 text-teal-600 border-teal-500/20"
        )}>
          {isAmbassadeur ? <Award className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
          {isAmbassadeur ? 'Ambassadeur' : 'Candidat'}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-black tracking-tight">Mon Espace Talent</h1>
        <p className="text-gray-500 font-sans text-lg">
          Gérez vos contenus et suivez votre impact sur BeninEase.
        </p>
      </div>

      <div className="flex flex-col gap-4 items-stretch">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Mon Impact</h3>
        <div className="flex gap-4">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[180px] hover:shadow-xl hover:border-red-500/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <span className="text-3xl font-black text-black">{stats?.votes ?? '...'}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Votes</span>
                </div>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[180px] hover:shadow-xl hover:border-amber-500/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                    <span className="text-3xl font-black text-black">#{stats?.rank ?? '-'}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mon Rang</span>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
}
