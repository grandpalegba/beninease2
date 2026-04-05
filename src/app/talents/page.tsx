"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import type { Talent } from "@/types";
import { Loader2, AlertCircle, Play, Image as ImageIcon, Heart } from "lucide-react";
import HorizontalSwiper from "@/components/swipers/HorizontalSwiper";
import ExpandableCard from "@/components/ui/ExpandableCard";
import Image from "next/image";
import { VotingService } from "@/lib/voting-service";
import { toast } from "sonner";

export default function TalentsPage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [voterWeight, setVoterWeight] = useState<number>(1);
  const [userId, setUserId] = useState<string | null>(null);

  const loadTalents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .order('weighted_votes_total', { ascending: false });
      
      if (error) throw error;
      setTalents(data || []);
    } catch (err) {
      console.error('Error loading talents:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTalents();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        // Fetch voter weight from profile
        supabase.from('profiles')
          .select('voter_weight')
          .eq('id', data.user.id)
          .single()
          .then(({ data: profileData }) => {
            if (profileData) setVoterWeight(profileData.voter_weight);
          });
      }
    });
  }, [loadTalents]);

  const handleVote = async (talent: Talent) => {
    if (!userId) {
      toast.error("Veuillez vous connecter pour voter");
      return;
    }

    try {
      // ✅ Call the weighted vote RPC as requested
      const { data, error } = await supabase.rpc('cast_weighted_vote', {
        target_talent_id: talent.id
      });

      if (error) throw error;

      toast.success(`Vote enregistré ! Puissance appliquée : +${voterWeight}`);
      
      // Refresh talent's vote count locally
      setTalents(prev => prev.map(t => 
        t.id === talent.id ? { ...t, weighted_votes_total: (t.weighted_votes_total || 0) + voterWeight } : t
      ));
    } catch (err) {
      console.error('Error casting weighted vote:', err);
      toast.error("Erreur lors du vote");
    }
  };

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-[#008751] mb-4" />
      <p className="text-gray-500 font-medium">Chargement des Talents...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Oups !</h2>
        <p className="text-gray-600 mb-6">Impossible de charger les talents pour le moment.</p>
        <button onClick={loadTalents} className="text-[#008751] font-bold hover:underline">Réessayer</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-10 overflow-x-hidden">
      <header className="px-6 md:px-12 mb-12 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-gray-900 mb-4 tracking-tight">
          Nos <span className="text-[#008751]">Talents</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Découvrez les visages de l'excellence béninoise. Scrollez horizontalement et cliquez sur le "+" pour plonger au cœur de leur univers.
        </p>
      </header>

      <HorizontalSwiper>
        {talents.map((talent) => (
          <ExpandableCard
            key={talent.id}
            preview={
              <div className="w-full h-full relative group">
                <Image
                  src={talent.avatar_url || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800"}
                  alt={`${talent.prenom} ${talent.nom}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                  <span className="inline-block px-2 py-1 rounded bg-[#008751] text-[10px] font-bold uppercase tracking-widest mb-2">
                    {talent.categorie}
                  </span>
                  <h3 className="text-2xl font-display font-bold">
                    {talent.prenom} {talent.nom}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-1">{talent.univers}</p>
                </div>
              </div>
            }
            expandedContent={
              <div className="space-y-12">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl skew-y-3">
                    <Image
                      src={talent.avatar_url || ""}
                      alt={talent.nom || ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="text-5xl font-display font-extrabold text-gray-900 underline decoration-[#008751] underline-offset-8">
                      {talent.prenom} {talent.nom}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-1.5 rounded-full bg-[#008751]/10 text-[#008751] font-bold text-sm">
                        {talent.univers}
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 font-bold text-sm border border-orange-100">
                        {talent.categorie}
                      </span>
                    </div>
                    <p className="text-xl text-gray-600 leading-relaxed italic">
                      "{talent.bio || "Le talent est une flamme qui doit être entretenue par la passion et la persévérance."}"
                    </p>
                    
                    {/* Voting Action */}
                    <div className="pt-4 flex items-center gap-6">
                      <button 
                        onClick={() => handleVote(talent)}
                        className="flex flex-col items-center justify-center px-10 py-5 bg-[#008751] text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <Heart className="w-5 h-5 fill-white group-hover:scale-125 transition-transform" />
                          <span>Soutenir ce Talent</span>
                        </div>
                        <span className="text-[10px] opacity-80 mt-0.5">Impact du vote : +{voterWeight} pts</span>
                      </button>
                      <div className="text-center">
                        <p className="text-3xl font-display font-black text-[#008751]">{talent.weighted_votes_total || 0}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Soutiens</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-gray-100">
                  <div className="space-y-6">
                    <h4 className="flex items-center gap-2 text-xl font-bold uppercase tracking-widest text-[#008751]">
                      <Play className="w-5 h-5" /> Vidéos
                    </h4>
                    <div className="aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-lg border-4 border-white flex items-center justify-center group cursor-pointer relative">
                       <Play className="w-16 h-16 text-white/20 group-hover:text-white/80 transition-all group-hover:scale-110" />
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <p className="text-sm text-gray-500 italic">Portrait vidéo : Immersion dans le quotidien de {talent.prenom}.</p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="flex items-center gap-2 text-xl font-bold uppercase tracking-widest text-orange-600">
                      <ImageIcon className="w-5 h-5" /> Photos
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden hover:rotate-2 transition-transform shadow-md">
                           <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 italic">Galerie : L'excellence immortalisée.</p>
                  </div>
                </div>
              </div>
            }
          />
        ))}
      </HorizontalSwiper>
    </div>
  );
}