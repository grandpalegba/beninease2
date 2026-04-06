"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import type { Talent } from "@/types";
import { Loader2, AlertCircle, Play, Image as ImageIcon, Heart } from "lucide-react";
import CardDeck from "@/components/ui/CardDeck";
import TeasingCard from "@/components/ui/TeasingCard";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
      const { data, error } = await supabase.rpc('cast_weighted_vote', {
        target_talent_id: talent.id
      });

      if (error) throw error;

      toast.success(`Vote enregistré ! Impact : +${voterWeight}`);
      
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
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F4F4F2]">
      <Loader2 className="w-10 h-10 animate-spin text-[#008751] mb-4" />
      <p className="text-gray-500 font-medium font-display uppercase tracking-widest text-xs">Chargement des Talents...</p>
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
    <div className="h-screen w-full bg-[#F4F4F2] overflow-hidden">
      <CardDeck 
        items={talents}
        renderItem={(talent) => (
          <TeasingCard
            key={talent.id}
            id={talent.id}
            image={talent.avatar_url || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800"}
            title={`${talent.prenom} ${talent.nom}`}
            subtitle={talent.categorie}
            text={talent.bio || "Détenteur d'un savoir-faire ancestral..."}
            expandedContent={() => (
              <div className="space-y-12">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                  <div className="relative w-64 h-64 rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
                    <Image
                      src={talent.avatar_url || ""}
                      alt={talent.nom || ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                       <h2 className="text-5xl md:text-7xl font-display font-black text-gray-900 leading-none">
                         {talent.prenom} {talent.nom}
                       </h2>
                       <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                         <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold text-xs uppercase tracking-widest">
                           {talent.univers}
                         </span>
                         <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-widest">
                           {talent.categorie}
                         </span>
                       </div>
                    </div>
                    <p className="text-2xl text-gray-500 leading-relaxed font-serif italic max-w-2xl px-4 md:px-0 mx-auto md:mx-0">
                      "{talent.bio}"
                    </p>
                    
                    {/* Voting Action */}
                    <div className="pt-8 flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8">
                      <button 
                        onClick={() => handleVote(talent)}
                        className="group flex flex-col items-center justify-center px-10 py-5 bg-[#008751] text-white rounded-3xl font-black shadow-xl hover:shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
                      >
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 fill-white group-hover:scale-125 transition-transform" />
                          <span className="uppercase tracking-[0.2em] text-sm font-black">Soutenir</span>
                        </div>
                        <span className="text-[9px] opacity-60 mt-1 uppercase tracking-widest font-bold">Puissance : +{voterWeight}</span>
                      </button>

                      <Link 
                        href={`/talents/${talent.slug}`}
                        className="flex flex-col items-center justify-center px-10 py-5 bg-white text-[#1A1A1A] border-2 border-gray-100 rounded-3xl font-black shadow-sm hover:border-[#008751] hover:text-[#008751] hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
                      >
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-5 h-5" />
                          <span className="uppercase tracking-[0.2em] text-sm font-black">Profil Complet</span>
                        </div>
                        <span className="text-[9px] opacity-60 mt-1 uppercase tracking-widest font-bold">Voir le design V3</span>
                      </Link>

                      <div className="text-center md:text-left flex-shrink-0">
                        <p className="text-5xl font-display font-black text-[#008751] leading-none mb-1">{talent.weighted_votes_total || 0}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Soutiens Actuels</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-16 border-t border-gray-100">
                  <div className="space-y-8">
                    <h4 className="flex items-center gap-3 text-xl font-black uppercase tracking-widest text-[#008751]">
                      <Play className="w-5 h-5" /> Immersion Vidéo
                    </h4>
                    <div className="aspect-video bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white flex items-center justify-center group cursor-pointer relative">
                       <Play className="w-16 h-16 text-white/20 group-hover:text-amber-500 transition-all group-hover:scale-125 z-10" />
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h4 className="flex items-center gap-3 text-xl font-black uppercase tracking-widest text-amber-600">
                      <ImageIcon className="w-5 h-5" /> Galerie Photo
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={cn(
                          "aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-lg transition-transform hover:scale-105",
                          i % 2 === 0 ? "rotate-2" : "-rotate-2"
                        )}>
                           <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        )}
      />
    </div>
  );
}