"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, ArrowLeft, Loader2, User } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useVoter } from "@/lib/auth/use-voter";

type SupportedTalent = {
  id: string;
  slug: string;
  prenom: string;
  nom: string;
  category: string;
  avatar_url: string;
  vote_date: string;
};

export default function SupportedTalentsPage() {
  const router = useRouter();
  const { session, isAuthenticated, loading: sessionLoading, logout } = useVoter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [talents, setTalents] = useState<SupportedTalent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    const fetchSupportedTalents = async () => {
      try {
        // 1. Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('Votants')
          .select('id')
          .eq('whatsapp', session?.whatsapp)
          .single();

        if (userError || !userData) throw userError || new Error('User not found');

        // 2. Fetch votes
        const { data, error } = await supabase
          .from('Votes')
          .select(`
            id,
            vote_date,
            talent_id,
            talents:Talents (
              id,
              slug,
              prenom,
              nom,
              categorie,
              avatar_url
            )
          `)
          .eq('votant_id', userData.id)
          .order('vote_date', { ascending: false });

        if (error) throw error;

        if (data) {
          const formatted = data.map((item: any) => ({
            ...(item.talents as any),
            category: (item.talents as any)?.categorie,
            vote_date: item.vote_date
          }));
          setTalents(formatted);
        }
      } catch (err) {
        console.error("Error fetching supported talents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportedTalents();
  }, [session, isAuthenticated, sessionLoading, router, supabase]);

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-[#008751] animate-spin mb-4" />
        <p className="text-[#8E8E8E] font-sans">Chargement de vos soutiens...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-3 rounded-full bg-white border border-[#F2EDE4] text-gray-400 hover:text-[#008751] hover:border-[#008751]/20 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-black">Mes Talents Soutenus</h1>
              <p className="text-gray-500 mt-1">Retrouvez les ambassadeurs que vous avez propulsés.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-3 pr-5 rounded-full border border-[#F2EDE4] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#008751]/10 flex items-center justify-center text-[#008751]">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-black">Votant</span>
              <span className="text-[10px] text-gray-400 font-medium">{session?.whatsapp}</span>
            </div>
            <button 
              onClick={logout}
              className="ml-2 text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Content Section */}
        {talents.length > 0 ? (
          <div className="grid gap-6">
            {talents.map((talent) => {
              const fullName = `${talent.prenom || ''} ${talent.nom || ''}`.trim() || "Ambassadeur";
              return (
                <Link 
                  key={talent.id}
                  href={`/talents/${talent.slug}`}
                  className="group flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-[32px] border border-[#F2EDE4] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-[#F9F9F7] flex-shrink-0">
                    <Image 
                      src={talent.avatar_url || '/placeholder-portrait.jpg'} 
                      alt={fullName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-[#008751]/10 text-[#008751] text-[10px] font-bold uppercase tracking-widest">
                        {talent.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        Soutenu le {new Date(talent.vote_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-black mb-2">
                      {fullName}
                    </h2>
                  </div>

                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#008751] text-white shadow-lg shadow-[#008751]/20">
                    <Heart className="w-6 h-6 fill-white" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 px-6 bg-white rounded-[40px] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-black mb-4">Vous n&apos;avez pas encore soutenu de talent.</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Explorez les profils des ambassadeurs et votez pour ceux qui vous inspirent !
            </p>
            <Link 
              href="/talents"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#008751] px-8 py-4 text-sm font-bold tracking-widest uppercase text-white shadow-xl hover:bg-[#008751]/90 transition-all active:scale-95"
            >
              Découvrir les Talents
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
