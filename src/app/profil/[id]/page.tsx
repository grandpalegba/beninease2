"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { EpisodeCarousel } from "@/components/histoires/EpisodeCarousel";
import { PriceChart } from "@/components/histoires/PriceChart";
import type { ProfilAvecSerie, Episode } from "@/data/series";
import { useWallet } from "@/store/wallet";
import Image from "next/image";
import { ChevronLeft, Loader2, Users } from "lucide-react";

export default function ProfilHistoirePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [profil, setProfil] = useState<ProfilAvecSerie | null>(null);
  const [loading, setLoading] = useState(true);

  // Zustand Store
  const storePrice = useWallet((s) => s.effectivePrice(id));
  const sparklineData = useWallet((s) => s.getSparkline(id, profil || undefined));

  useEffect(() => {
    if (!id) return;
    
    async function fetchProfil() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles_histoires")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          // Fetch serie separately to avoid FK join issues
          let serieData = null;
          if (data.series_id) {
            const { data: sData } = await supabase
              .from("series_histoires")
              .select("*")
              .eq("id", data.series_id)
              .single();
            serieData = sData;
          }

          const rawVideos = data.video_urls ?? [];
          const video_urls: Episode[] = Array.isArray(rawVideos)
            ? rawVideos.map((v: any) => ({
                id: v.id ?? "",
                titre: v.titre ?? "",
                video_url: v.video_url ?? v.url ?? "",
              }))
            : [];

          setProfil({
            id: data.id,
            series_id: data.series_id,
            nom_complet: data.nom_complet ?? "",
            age: data.age ?? null,
            profession: data.profession ?? null,
            bio_courte: data.bio_courte ?? null,
            photo_url: data.photo_url ?? null,
            valeur_noix_benies: data.valeur_noix_benies ?? 0,
            video_urls,
            total_investisseurs: data.total_investisseurs ?? 0,
            numero_profil: data.numero_profil ?? null,
            serie: serieData as any,
          });
        }
      } catch (err) {
        console.error("Error fetching profil", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfil();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F4F4F2]">
        <Loader2 className="w-10 h-10 animate-spin text-[#008751]" />
      </div>
    );
  }

  if (!profil) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F4F4F2]">
        <h1 className="text-2xl font-bold mb-4">Profil introuvable</h1>
        <button onClick={() => router.back()} className="text-[#008751] hover:underline font-bold">
          Retour
        </button>
      </div>
    );
  }

  const displayPrice = storePrice > 0 ? storePrice : profil.valeur_noix_benies;

  return (
    <div className="min-h-screen bg-[#F9F9F7] pb-32">
      {/* Header court */}
      <div className="pt-24 px-5 pb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Section Gauche : Photo & Infos de base */}
          <div className="w-full md:w-1/3">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
              {profil.photo_url ? (
                <Image
                  src={profil.photo_url}
                  alt={profil.nom_complet}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#008751]/10 text-[#008751] font-serif text-6xl">
                  {profil.nom_complet[0]}
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <h1 className="text-3xl font-black text-gray-900 leading-tight">
                {profil.nom_complet}
              </h1>
              {profil.profession && (
                <p className="text-sm text-[#008751] font-bold uppercase tracking-widest mt-1">
                  {profil.profession} {profil.age ? `· ${profil.age} ans` : ""}
                </p>
              )}
              {profil.bio_courte && (
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {profil.bio_courte}
                </p>
              )}

              <div className="flex items-center gap-2 mt-6 text-sm text-gray-500 font-medium">
                <Users className="w-4 h-4" />
                <span>{profil.total_investisseurs} investisseurs au total</span>
              </div>
            </div>
          </div>

          {/* Section Droite : Graphique & Vidéos */}
          <div className="w-full md:w-2/3 flex flex-col gap-8">
            <PriceChart data={sparklineData} currentPrice={displayPrice} />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Épisodes ({profil.video_urls.length})</h2>
              <EpisodeCarousel episodes={profil.video_urls} />
            </div>
            
            {profil.serie && (
              <div className="bg-[#008751]/5 border border-[#008751]/10 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-[#008751] uppercase tracking-widest mb-2">
                  Série : {profil.serie.titre}
                </h2>
                {profil.serie.synopsis && (
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {profil.serie.synopsis}
                  </p>
                )}
                {profil.serie.episode_question && (
                  <p className="text-gray-900 font-bold italic text-lg">
                    « {profil.serie.episode_question} »
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
