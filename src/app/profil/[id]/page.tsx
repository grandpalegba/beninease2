"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { EpisodeCarousel } from "@/components/histoires/EpisodeCarousel";
import { PriceChart } from "@/components/histoires/PriceChart";
import type { ProfilAvecSerie, Episode } from "@/data/series";
import { useWallet } from "@/store/wallet";
import Image from "next/image";
import { ChevronLeft, Loader2, Sparkles, MapPin, TrendingUp } from "lucide-react";

export default function ProfilHistoirePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [profil, setProfil] = useState<ProfilAvecSerie | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<ProfilAvecSerie[]>([]);

  const storePrice = useWallet((s) => s.effectivePrice(id));
  const getSparkline = useWallet((s) => s.getSparkline);
  const sparklineData = getSparkline(id, profil || undefined);

  useEffect(() => {
    if (!id) return;

    async function fetchFullData() {
      try {
        setLoading(true);
        // 1. Fetch Profil
        const { data: pData, error: pError } = await supabase
          .from("profiles_histoires")
          .select("*")
          .eq("id", id)
          .single();

        if (pError) throw pError;

        // 2. Fetch Serie
        let serieData = null;
        if (pData.series_id) {
          const { data: sData } = await supabase
            .from("series_histoires")
            .select("*")
            .eq("id", pData.series_id)
            .single();
          serieData = sData;

          // 3. Fetch Suggestions (même série)
          const { data: suggData } = await supabase
            .from("profiles_histoires")
            .select("*")
            .eq("series_id", pData.series_id)
            .neq("id", id)
            .limit(3);
          if (suggData) setSuggestions(suggData as any);
        }

        const video_urls: Episode[] = Array.isArray(pData.video_urls)
          ? pData.video_urls.map((v: any) => ({
            id: v.id ?? "",
            titre: v.titre ?? "",
            video_url: v.video_url ?? "",
            numero: v.numero ?? 1
          }))
          : [];

        setProfil({
          ...pData,
          video_urls,
          serie: serieData as any,
        } as any);

      } catch (err) {
        console.error("Error", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFullData();
  }, [id]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!profil) return null;

  const displayPrice = storePrice > 0 ? storePrice : profil.valeur_noix_benies;
  const variation = ((displayPrice - profil.valeur_noix_benies) / profil.valeur_noix_benies) * 100;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* HEADER NAVIGATION */}
      <nav className="fixed top-0 z-50 w-full px-6 py-4 flex items-center justify-between bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm">
        <button onClick={() => router.back()} className="p-2 rounded-full bg-white/50 shadow-sm border border-white/20">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
      </nav>

      {/* HERO SECTION - LOOK IBRAHIM SOW */}
      <section className="relative w-full h-[70vh] overflow-hidden bg-gray-50">
        {profil.photo_url && (
          <div className="relative w-full h-full">
            <Image
              src={profil.photo_url}
              alt={profil.nom_complet}
              fill
              className="object-cover object-top"
              priority
              style={{ maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)' }}
            />
            {/* Badge Performance */}
            <div className="absolute top-24 left-8 bg-green-500/90 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold shadow-lg backdrop-blur-md">
              <TrendingUp className="w-4 h-4" />
              {variation >= 0 ? '+' : ''}{variation.toFixed(1)}%
            </div>
          </div>
        )}

        <div className="absolute bottom-12 left-0 w-full px-8">
          <h1 className="text-5xl font-serif font-black text-gray-900 tracking-tight">
            {profil.nom_complet}
          </h1>
          <div className="flex items-center gap-4 mt-3">
            <p className="text-lg font-medium text-gray-600">
              {profil.profession} · {profil.age} ans
            </p>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <MapPin className="w-4 h-4" />
              <span>Bénin</span>
            </div>
          </div>
        </div>
      </section>

      {/* BANDEAU VALEUR BÉNIE */}
      <section className="px-8 -mt-6 relative z-10">
        <div className="bg-gray-50/50 backdrop-blur-xl border border-gray-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-gray-200/50">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">
              Valeur des Noix Bénies
            </span>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span className="text-4xl font-black text-gray-900 tabular-nums">
                {displayPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <button className="mt-6 md:mt-0 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-gray-900/20">
            Investir maintenant
          </button>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-8 mt-16 space-y-24">

        {/* CARROUSEL ÉPISODES & ÉVALUATIONS */}
        <section>
          <div className="flex flex-col mb-10">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Témoignages</span>
            <h2 className="text-3xl font-serif font-bold">Plonger dans son histoire</h2>
          </div>
          <EpisodeCarousel
            episodes={profil.video_urls}
            profilNom={profil.nom_complet}
            profilId={profil.id}
          />
        </section>

        {/* ANALYSE TECHNIQUE (Graphique) */}
        <section className="py-12 border-y border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Analyse de la courbe</h3>
          <div className="h-[300px]">
            <PriceChart data={sparklineData} currentPrice={displayPrice} />
          </div>
        </section>

        {/* SUGGESTIONS DE LA SÉRIE */}
        {suggestions.length > 0 && (
          <section className="pb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-8 relative rounded overflow-hidden shadow-sm">
                {profil.serie?.affiche_url && <Image src={profil.serie.affiche_url} alt="serie" fill className="object-cover" />}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Dans la même série</p>
                <h4 className="text-xl font-serif font-bold">{profil.serie?.titre}</h4>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestions.map((s) => (
                <div key={s.id} className="cursor-pointer group" onClick={() => router.push(`/profil/${s.id}`)}>
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                    <Image src={s.photo_url || ''} alt={s.nom_complet} fill className="object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <p className="font-bold text-gray-900">{s.nom_complet}</p>
                  <p className="text-xs text-gray-400">{s.profession}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}