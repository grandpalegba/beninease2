/**
 * PAGE PUBLIQUE - TRÉSORS DU BÉNIN
 * Role: Galerie thématique (Royauté, Culture) réutilisant le design des talents.
 */
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Info, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import type { Treasure } from "@/types";

function TreasuresList() {
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreasures = async () => {
      try {
        const { data, error } = await supabase
          .from('treasures')
          .select('*')
          .eq('is_validated', true)
          .order('title', { ascending: true });

        if (error) throw error;
        if (data) setTreasures(data as Treasure[]);
      } catch (err) {
        console.error("Erreur lors de la récupération des trésors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreasures();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-[#E8112D] animate-spin mb-4" />
        <p className="text-[#8E8E8E] font-sans">Chargement des trésors...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8112D]/10 text-[#E8112D] text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Patrimoine & Culture
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-black">
          Trésors du Bénin
        </h1>
        <p className="mt-4 font-sans text-lg md:text-xl text-black/80 max-w-2xl mx-auto">
          Explorez les richesses historiques et culturelles qui font la fierté de notre nation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {treasures.map((treasure) => (
          <Link
            key={treasure.id}
            href={`/treasures/${treasure.slug}`}
            className="group block bg-white border border-[#F2EDE4] rounded-[30px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={treasure.image_url || '/placeholder-treasure.jpg'}
                alt={treasure.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-6">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                  {treasure.category}
                </span>
              </div>
            </div>

            <div className="p-8">
              <h2 className="font-display text-2xl font-bold text-black group-hover:text-[#E8112D] transition-colors">
                {treasure.title}
              </h2>
              <p className="font-sans text-gray-600 text-sm mt-3 line-clamp-2 leading-relaxed">
                {treasure.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-[#E8112D] font-bold text-xs uppercase tracking-widest">
                Découvrir l'histoire
                <div className="w-8 h-[1px] bg-[#E8112D]/30" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {treasures.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[30px] border border-dashed border-gray-200">
          <p className="text-gray-500">Bientôt disponible : La galerie des trésors historiques.</p>
        </div>
      )}
    </div>
  );
}

export default function TreasuresPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] px-4 py-10 md:p-8 md:py-14">
      <Suspense fallback={<Loader2 className="animate-spin" />}>
        <TreasuresList />
      </Suspense>
    </div>
  );
}
