/**
 * PAGE PUBLIQUE - LISTE DES TALENTS
 * Role: Galerie des candidats avec système de vote.
 */
"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Info, Loader2, LayoutGrid, Smartphone } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Talent } from "@/types";

function TalentsList() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        // Interrogation de la table public.talents sans aucun filtre de rôle
        const { data, error } = await supabase
          .from('talents')
          .select('id, slug, prenom, nom, category, avatar_url, votes, bio')
          .order('votes', { ascending: false });

        console.log("Données reçues de la table talents:", data);

        if (error) throw error;
        if (data) setTalents(data as Talent[]);
      } catch (err) {
        console.error("Erreur lors de la récupération des talents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-[#008751] animate-spin mb-4" />
        <p className="text-[#8E8E8E] font-sans">Chargement de la galerie...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-black">
          Talents du Bénin
        </h1>
        <p className="mt-4 font-sans text-lg md:text-xl text-black/80 max-w-2xl mx-auto">
          Découvrez les femmes et les hommes qui font rayonner l&apos;excellence béninoise.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="inline-flex items-start gap-3 bg-white/50 border border-[#004d3d]/20 p-4 rounded-xl text-left max-w-2xl shadow-sm backdrop-blur-sm">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#004d3d]" />
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="block font-semibold text-black mb-1">Votez pour vos Talents</span>
              Explorez les portraits de nos ambassadeurs et soutenez ceux qui vous inspirent. Chaque vote compte pour le classement final !
            </p>
          </div>

          <Link 
            href="/talents/swipe"
            className="group flex items-center gap-3 px-6 py-4 bg-[#008751] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#004d3d] transition-all shadow-lg shadow-[#008751]/20 active:scale-95"
          >
            <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Mode Swipe Mobile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {talents.map((talent) => {
          const fullName = `${talent.prenom} ${talent.nom}`;
          let imageUrl = talent.avatar_url || "";
          
          if (!imageUrl) {
            imageUrl = `/talents/${talent.slug}.jpg`;
          } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
            if (imageUrl.startsWith('talents/')) {
              imageUrl = `/${imageUrl}`;
            } else {
              imageUrl = `/talents/${imageUrl}`;
            }
          }
          
          return (
            <Link
              key={talent.id}
              href={`/talents/${talent.slug}`}
              className="group block bg-white border border-[#F2EDE4] rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer relative z-10 pointer-events-auto"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={fullName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Vote Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-[#008751]">{talent.votes}</span>
                  <span className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">Votes</span>
                </div>
              </div>

              {/* Text Section */}
              <div className="p-5">
                <h2 className="font-display text-xl font-bold text-[#008751] truncate">
                  {fullName}
                </h2>
                <p className="font-sans text-black text-sm mt-1 truncate uppercase tracking-wider font-bold">
                  {talent.category}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {talents.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[30px] border border-dashed border-gray-200">
          <p className="text-gray-500 font-sans">Aucun talent n&apos;est encore inscrit dans cette galerie.</p>
        </div>
      )}
    </div>
  );
}

export default function TalentsListPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] px-4 py-10 md:p-8 md:py-14">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center text-[#8E8E8E] animate-pulse">
            Chargement de la galerie...
          </div>
        </div>
      }>
        <TalentsList />
      </Suspense>
    </div>
  );
}
