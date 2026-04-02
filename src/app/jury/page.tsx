/**
 * PAGE PUBLIQUE - JURY
 * Role: Galerie filtrée sur role === 'jury' .
 */
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Award } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import type { Talent } from "@/types";

function JuryList() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const { data, error } = await supabase
          .from('talents')
          .select('*')
          .eq('role', 'jury')
          .eq('is_validated', true)
          .order('prenom', { ascending: true });

        if (error) throw error;
        if (data) setTalents(data as Talent[]);
      } catch (err) {
        console.error("Erreur lors de la récupération du jury:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-[#004d3d] animate-spin mb-4" />
        <p className="text-[#8E8E8E] font-sans">Chargement du jury...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#004d3d]/10 text-[#004d3d] text-xs font-bold uppercase tracking-widest mb-4">
          <Award className="w-3.5 h-3.5" />
          Membres du Jury
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-black">
          Le Conseil d&apos;Honneur
        </h1>
        <p className="mt-4 font-sans text-lg md:text-xl text-black/80 max-w-2xl mx-auto">
          Découvrez les experts qui veillent à l&apos;excellence et à l&apos;intégrité de notre sélection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {talents.map((jury) => {
          const fullName = `${jury.prenom || ''} ${jury.nom || ''}`.trim() || "Membre du Jury";
          return (
            <Link
              key={jury.id}
              href={`/talents/${jury.slug}`}
              className="group block bg-white border border-[#F2EDE4] rounded-[30px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={jury.avatar_url || '/placeholder-portrait.jpg'}
                  alt={fullName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004d3d]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-8">
                <h2 className="font-display text-2xl font-bold text-black group-hover:text-[#004d3d] transition-colors">
                  {fullName}
                </h2>
                <p className="font-sans text-[#004d3d] text-xs font-bold uppercase tracking-widest mt-2">
                  {jury.title || "Membre du Jury"}
                </p>
                <p className="font-sans text-gray-600 text-sm mt-4 line-clamp-2 leading-relaxed">
                  {jury.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {talents.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[30px] border border-dashed border-gray-200">
          <p className="text-gray-500">Le jury est en cours de constitution.</p>
        </div>
      )}
    </div>
  );
}

export default function JuryPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] px-4 py-10 md:p-8 md:py-14">
      <Suspense fallback={<Loader2 className="animate-spin" />}>
        <JuryList />
      </Suspense>
    </div>
  );
}
