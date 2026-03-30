/**
 * PAGE PUBLIQUE - CLASSEMENT
 * Role: Afficher le classement en temps réel des talents.
 */
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Info, Trophy, Star, ChevronRight } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Define the type for our profile data
type Profile = {
  id: string;
  slug: string;
  prenom: string | null;
  nom: string | null;
  category: string | null;
  votes: number;
  avatar_url: string; 
};

function RankingList() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('Talents')
      .select('id, slug, prenom, nom, category, votes, avatar_url')
      .not('prenom', 'is', null)
      .not('nom', 'is', null)
      .order('votes', { ascending: false })
      .order('nom', { ascending: true })
      .limit(16);

    if (data) {
      setProfiles(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();

    // 2. Subscribe to real-time updates for profiles via supabase_realtime
    const channel = supabase
      .channel('supabase_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Talents' },
        () => {
          // Re-fetch and re-sort
          fetchProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (loading && profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#008751]/20 border-t-[#008751] rounded-full animate-spin mb-4" />
        <p className="text-[#008751] font-medium">Calcul du classement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid gap-4">
          {profiles.map((talent, index) => {
            const rankLabel = index === 0 ? "1er" : `${index + 1}e`;
            const isTop4 = index < 4;
            const fullName = `${talent.prenom} ${talent.nom}`;
            
            return (
              <motion.div
                key={talent.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  layout: { duration: 0.6 }
                }}
              >
                <Link 
                  href={`/talents/${talent.slug || talent.id}`}
                  className="flex items-center gap-4 bg-white p-4 md:p-6 rounded-[28px] shadow-sm border border-transparent hover:border-[#008751]/30 transition-all hover:shadow-lg active:scale-[0.98] group relative overflow-hidden"
                >
                  {isTop4 && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#008751]" />
                  )}
                  
                  <div className="flex flex-col items-center justify-center w-12 md:w-16">
                    <span className={`text-2xl md:text-3xl font-display font-black ${isTop4 ? 'text-[#008751]' : 'text-gray-300'}`}>
                      {rankLabel}
                    </span>
                    {index === 0 && <Trophy className="w-4 h-4 text-[#E9B113] mt-1" />}
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
                    <p className="text-[10px] md:text-xs text-gray-400 font-display font-bold uppercase tracking-[0.15em] mt-1">
                      {talent.category}
                    </p>
                  </div>

                  <div className="text-right px-4">
                    <motion.div 
                      key={talent.votes}
                      initial={{ scale: 1.2, color: "#E9B113" }}
                      animate={{ scale: 1, color: "#008751" }}
                      className="flex flex-col items-end"
                    >
                      <span className="text-2xl md:text-3xl font-display font-black">
                        {talent.votes}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                        Soutiens
                      </span>
                    </motion.div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-[#008751] transition-colors mr-2" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
      
      {profiles.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500">L&apos;excellence attend votre premier vote.</p>
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
