/**
 * PAGE PUBLIQUE - CLASSEMENT
 * Role: Afficher le classement en temps réel des talents.
 */
"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Info, Trophy, Star, AlertCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Define the type for our talent data
type TalentRank = {
  id: string;
  slug: string;
  prenom: string | null;
  nom: string | null;
  categorie: string | null;
  votes: number;
  avatar_url: string; 
};

function RankingList() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [talents, setTalents] = useState<TalentRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTalents = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { data, error, status, statusText } = await supabase
        .from("talents")
        .select("id, slug, prenom, nom, categorie, votes, avatar_url")
        .not("prenom", "is", null)
        .not("nom", "is", null)
        .order("votes", { ascending: false })
        .order("nom", { ascending: true })
        .limit(16);

      if (error) {
        console.error("Erreur Supabase:", error);
        setTalents([]);
        setErrorMsg(`Erreur Supabase (${status}): ${error.message}`);
        return;
      }

      if (!data) {
        setTalents([]);
        return;
      }

      setTalents((data ?? []) as unknown as TalentRank[]);
    } catch (err) {
      console.error("Exception inattendue:", err);
      setErrorMsg("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTalents();

    // 2. Subscribe to real-time updates for Talents via supabase_realtime
    // const channel = supabase
    //   .channel('supabase_realtime')
    //   .on(
    //     'postgres_changes',
    //     { event: 'UPDATE', schema: 'public', table: 'talents' },
    //     () => {
    //       // Re-fetch and re-sort
    //       fetchTalents();
    //     }
    //   )
    //   .subscribe();
    //
    // return () => {
    //   supabase.removeChannel(channel);
    // };
  }, [supabase, fetchTalents]);

  if (loading && talents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#008751]/20 border-t-[#008751] rounded-full animate-spin mb-4" />
        <p className="text-[#008751] font-medium">Calcul du classement...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="font-sans font-bold">Une erreur est survenue lors de la récupération du classement.</p>
        <p className="font-sans text-sm mt-2">{errorMsg}</p>
        <button
          onClick={() => fetchTalents()}
          className="mt-6 px-6 py-3 bg-[#008751] text-white rounded-2xl font-bold uppercase tracking-widest text-xs"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid gap-4">
          {talents.map((talent, index) => {
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
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#F2EDE4] hover:shadow-lg transition-all group relative overflow-hidden"
                >
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm ${
                    index === 0 ? "bg-[#FFD700] text-white" : 
                    index === 1 ? "bg-[#C0C0C0] text-white" : 
                    index === 2 ? "bg-[#CD7F32] text-white" : 
                    "bg-[#F9F9F7] text-gray-400"
                  }`}>
                    {rankLabel}
                  </div>

                  {/* Avatar */}
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                    <Image
                      src={talent.avatar_url || "/placeholder-portrait.jpg"}
                      alt={fullName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-bold text-black truncate group-hover:text-[#008751] transition-colors">
                      {fullName}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                      {talent.categorie}
                    </p>
                  </div>

                  {/* Votes */}
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 text-[#008751]">
                      <Trophy className="w-4 h-4" />
                      <span className="font-display text-xl font-black">{talent.votes}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold">Votes récoltés</p>
                  </div>

                  {isTop4 && (
                    <div className="absolute -top-1 -right-1">
                      <Star className="w-8 h-8 text-[#FFD700]/10 fill-[#FFD700]/10 rotate-12" />
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {talents.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-[30px] border border-dashed border-gray-200">
          <p className="text-gray-500 font-sans">Aucun talent n&apos;est encore classé.</p>
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
