"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Calendar, ArrowRight } from "lucide-react";
import { getUserVotes } from "@/lib/supabase/queries";
import { supabase } from '@/utils/supabase/client';

interface VoteHistoryProps {
  votantId: string;
}

type AmbassadeurMini = {
  id: string;
  slug: string;
  prenom: string | null;
  nom: string | null;
  avatar_url: string | null;
};

type VoteRow = {
  id: string;
  created_at: string;
  ambassadeurs: AmbassadeurMini | null;
};

export function VoteHistory({ votantId }: VoteHistoryProps) {
  const [votes, setVotes] = useState<VoteRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVotes() {
      try {
        const { data, error } = await getUserVotes(supabase, votantId);
        if (error) throw error;
        setVotes((data ?? []) as unknown as VoteRow[]);
      } catch (err) {
        console.error("Error loading votes:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVotes();
  }, [votantId, supabase]);

  if (loading) return <div className="animate-pulse h-40 bg-gray-100 rounded-2xl" />;

  if (votes.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-gray-200">
        <Heart className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Vous n&apos;avez pas encore soutenu d'ambassadeur.</p>
        <Link href="/ambassadeurs" className="text-[#008751] font-bold text-sm mt-4 inline-block hover:underline">
          Découvrir les ambassadeurs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {votes.map((vote) => {
        const ambassadeur = vote.ambassadeurs;
        if (!ambassadeur) return null;
        const fullName = `${ambassadeur.prenom || ''} ${ambassadeur.nom || ''}`.trim() || "Ambassadeur";
        return (
          <Link
            key={vote.id}
            href={`/ambassadeurs/${ambassadeur.slug}`}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#F2EDE4] hover:shadow-md transition-all group"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={ambassadeur.avatar_url || "/placeholder-portrait.jpg"}
                alt={fullName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-black truncate">
                {fullName}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                <Calendar className="w-3 h-3" />
                {new Date(vote.created_at).toLocaleDateString()}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#008751] transition-colors" />
          </Link>
        );
      })}
    </div>
  );
}
