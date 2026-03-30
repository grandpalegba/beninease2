"use client";

import { useState, useEffect, useMemo } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Talent } from '@/types';
import { Award, TrendingUp, Zap } from 'lucide-react';

interface StatsSectionProps {
  profile: Talent;
}

type TalentStats = {
  votes: number;
  rank: number;
  categorie: string | null;
  topRankVotes: number;
};

export default function StatsSection({ profile }: StatsSectionProps) {
  const [stats, setStats] = useState<TalentStats | null>(null);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    const fetchTalentStats = async () => {
      if (!profile.categorie) return;

      // 1. Get current talent's votes
      const { data: talentData } = await supabase
        .from('talents')
        .select('votes')
        .eq('id', profile.id)
        .single();

      if (!talentData) return;

      // 2. Get rank and all talents in the category
      const { data: categoryTalents, error: rankError } = await supabase
        .from('talents')
        .select('id, votes')
        .eq('categorie', profile.categorie)
        .order('votes', { ascending: false });

      if (rankError || !categoryTalents) return;

      const rank = categoryTalents.findIndex((t) => t.id === profile.id) + 1;
      const topRankVotes = categoryTalents.length > 0 ? categoryTalents[0].votes : 0;

      setStats({
        votes: talentData.votes || 0,
        rank: rank > 0 ? rank : 1,
        categorie: profile.categorie,
        topRankVotes,
      });
    };

    fetchTalentStats();
  }, [profile.id, profile.categorie, supabase]);

  const progressToTop1 = stats && stats.topRankVotes > 0 ? (stats.votes / stats.topRankVotes) * 100 : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-8">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-black">Analyse de votre Performance</h3>
            {stats?.rank && stats.rank <= 3 && (
                <div className="flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-500/10 px-4 py-2 rounded-full">
                    <Award className="w-5 h-5"/>
                    <span>Top 3 de votre catégorie !</span>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progression vs Top 1 */}
            <div className="bg-gray-50/70 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-600">Progression vs. #1</span>
                    <span className="text-sm font-bold text-teal-600">{progressToTop1.toFixed(0)}%</span>
                </div>
                <div className="relative h-2.5 w-full bg-gray-200 rounded-full">
                    <div 
                        className="absolute h-2.5 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500"
                        style={{ width: `${progressToTop1}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-400 mt-3">Vous avez atteint {progressToTop1.toFixed(0)}% des votes du talent le mieux classé.</p>
            </div>

            {/* Vote evolution (simulation for now) */}
            <div className="bg-gray-50/70 p-6 rounded-2xl">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-600">Évolution des votes</span>
                    <span className="text-sm font-bold text-green-600 flex items-center"><TrendingUp className="w-4 h-4 mr-1"/> +15% (7j)</span>
                </div>
                <div className="h-12 bg-gray-200 rounded-lg flex items-end">
                    {/* Simple bar chart simulation */}
                    <div className="w-1/4 h-1/3 bg-green-300 rounded-t-sm animate-pulse"></div>
                    <div className="w-1/4 h-2/3 bg-green-400 rounded-t-sm animate-pulse delay-75"></div>
                    <div className="w-1/4 h-1/2 bg-green-300 rounded-t-sm animate-pulse delay-150"></div>
                    <div className="w-1/4 h-full bg-green-500 rounded-t-sm animate-pulse delay-200"></div>
                </div>
                 <p className="text-xs text-gray-400 mt-3">Votre tendance de vote sur les 7 derniers jours.</p>
            </div>
        </div>

        {/* Conseils */}
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600"/>
                </div>
                <h4 className="font-bold text-blue-800">Conseils pour améliorer votre score</h4>
            </div>
            <ul className="list-disc list-inside text-sm text-blue-700/80 space-y-1 pl-2">
                <li>Partagez votre profil sur les réseaux sociaux pour obtenir plus de votes.</li>
                <li>Assurez-vous que votre vidéo de présentation (slot 1) est percutante et de haute qualité.</li>
                <li>Complétez tous les slots vidéo (1+3+1) pour montrer l'étendue de votre talent.</li>
            </ul>
        </div>
    </div>
  );
}
