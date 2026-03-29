/**
 * PAGE PUBLIQUE - CLASSEMENT
 * Role: Afficher le classement en temps réel des talents.
 */
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Info } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

// Define the type for our profile data
type Profile = {
  id: string;
  slug: string;
  prenom: string | null;
  nom: string | null;
  category: string | null;
  univers: string | null;
  categorie: string | null;
  votes: number;
  avatar_url: string;
  role: string | null;
};

function RankingList() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial data
    const fetchProfiles = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('id, slug, prenom, nom, category, univers, categorie, avatar_url, votes, role')
        .or('role.eq.candidat,role.eq.ambassadeur,role.eq.candidate,role.eq.talent,role.eq.partenaire,role.eq.jury')
        .order('votes', { ascending: false })
        .order('nom', { ascending: true })
        .limit(16);

      if (data) {
        setProfiles(data as Profile[]);
      }
      setLoading(false);
    };

    fetchProfiles();

    // 2. Subscribe to real-time updates
    const channel = supabase
      .channel('profiles_updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        () => {
          // When a profile is updated, re-fetch the whole list to re-order it
          fetchProfiles();
        }
      )
      .subscribe();

    // 3. Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (loading && profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#008751]/20 border-t-[#008751] rounded-full animate-spin mb-4" />
        <p className="text-[#008751] font-medium">Chargement du classement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-4">
        {profiles.map((talent, index) => {
          const rankLabel = index === 0 ? "1er" : `${index + 1}e`;
          const isTop4 = index < 4;
          const fullName = `${talent.prenom || ''} ${talent.nom || ''}`;
          const category = talent.categorie || talent.univers || talent.category || "Talent";
          
          return (
            <Link 
              key={talent.id} 
              href={`/talents/${talent.slug || talent.id}`}
              className="flex items-center gap-4 bg-white p-4 md:p-6 rounded-[24px] shadow-sm border border-transparent hover:border-[#008751]/30 transition-all hover:shadow-md active:scale-[0.99] group relative overflow-hidden"
            >
              {isTop4 && (
                <div className="absolute top-0 left-0 w-1 h-full bg-[#004d3d]" />
              )}
              
              <div className="flex flex-col items-center justify-center w-12 md:w-16">
                <span className={`text-2xl md:text-3xl font-display font-black ${isTop4 ? 'text-[#004d3d]' : 'text-gray-300'}`}>
                  {rankLabel}
                </span>
              </div>

              <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                <Image 
                  src={talent.avatar_url || '/placeholder-portrait.jpg'} 
                  alt={fullName} 
                  fill 
                  className="object-cover" 
                />
              </div>

              <div className="flex-1 ml-2">
                <h3 className="font-display text-lg md:text-xl font-bold text-black group-hover:text-[#008751] transition-colors">
                  {fullName}
                </h3>
                <p className="text-xs md:text-sm text-[#004d3d] font-display font-bold uppercase tracking-widest mt-0.5">
                  {category}
                </p>
              </div>

              <div className="text-right px-4">
                <div className="flex flex-col items-end">
                  <span className="text-2xl md:text-3xl font-display font-black text-[#008751]">
                    {talent.votes}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    Votes
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {profiles.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500">Aucun talent n&apos;a encore reçu de vote.</p>
        </div>
      )}
    </div>
  );
}

export default function RankingPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] px-4 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#004d3d]/10 text-[#004d3d] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Temps Réel
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-black mb-6">
            Classement de l&apos;Excellence
          </h1>
          <p className="font-sans text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Suivez en direct l&apos;ascension des talents béninois. Chaque vote rapproche un ambassadeur de la reconnaissance nationale.
          </p>
        </div>

        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 bg-white/50 border border-[#004d3d]/20 p-5 rounded-2xl shadow-sm backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-[#004d3d] flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="block font-bold text-black mb-1">Classement en direct</span>
              Le classement est mis à jour instantanément à chaque nouveau vote enregistré sur la plateforme.
            </p>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#008751]/20 border-t-[#008751] rounded-full animate-spin mb-4" />
            <p className="text-[#008751] font-medium">Chargement du classement...</p>
          </div>
        }>
          <RankingList />
        </Suspense>
      </div>
    </div>
  );
}
