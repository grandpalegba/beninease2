"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { EpisodeCarousel } from "@/components/histoires/EpisodeCarousel";
import { HistogrammeBeninois } from "@/components/histoires/HistogrammeBeninois";
import type { ProfilAvecSerie, Episode } from "@/data/series";
import { useWallet } from "@/store/wallet";
import Image from "next/image";
import { ChevronLeft, Loader2, Sparkles, TrendingUp, TrendingDown, X, MessageSquare } from "lucide-react";

function getYoutubeID(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function ProfilHistoirePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [profil, setProfil] = useState<ProfilAvecSerie | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<ProfilAvecSerie[]>([]);

  // Zustand Store
  const storePrice = useWallet((s) => s.effectivePrice(id));
  const getSparkline = useWallet((s) => s.getSparkline);
  const sparklineData = getSparkline(id, profil || undefined);
  const solde = useWallet((s) => s.solde);
  const investir = useWallet((s) => s.investir);

  const [open, setOpen] = useState(false);
  const [montant, setMontant] = useState(50);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  
  const [stats, setStats] = useState({
    volume: 2.5,
    originalite: 2.5,
    authenticite: 2.5,
    impact: 2.5,
    count: 0
  });

  // Swipe Up -> Retour (Simulation simplifiée)
  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchStartY - touchEndY > 50 && !open) router.back();
    };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [open, router]);

  useEffect(() => {
    if (!id) return;
    async function fetchFullData() {
      try {
        setLoading(true);
        const { data: pData, error: pError } = await supabase
          .from("profiles_histoires")
          .select("*")
          .eq("id", id)
          .single();

        if (pError) throw pError;

        let serieData = null;
        if (pData.series_id) {
          const { data: sData } = await supabase
            .from("series_histoires")
            .select("*")
            .eq("id", pData.series_id)
            .single();
          serieData = sData;

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

        // Fetch Evaluation Stats
        const { data: evals } = await supabase
          .from("evaluations_histoires")
          .select("originalite, authenticite, impact")
          .eq("profil_id", id);

        if (evals && evals.length > 0) {
          const avg = evals.reduce((acc, curr) => ({
            originalite: acc.originalite + curr.originalite,
            authenticite: acc.authenticite + curr.authenticite,
            impact: acc.impact + curr.impact
          }), { originalite: 0, authenticite: 0, impact: 0 });

          const count = evals.length;
          // Volume mapping: 0 -> 1, 50+ -> 5
          const volumeScore = Math.min(5, 1 + (count / 10)); 

          setStats({
            volume: volumeScore,
            originalite: avg.originalite / count,
            authenticite: avg.authenticite / count,
            impact: avg.impact / count,
            count
          });
        }

      } catch (err) {
        console.error("Error", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFullData();
  }, [id]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F9F9F7] font-sans">
      <Loader2 className="w-8 h-8 animate-spin text-[#008751]" />
    </div>
  );

  if (!profil) return (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center">
      <p className="text-gray-500">Profil introuvable.</p>
      <button onClick={() => router.back()} className="mt-4 inline-block text-sm underline">Retour</button>
    </div>
  );

  const displayPrice = storePrice > 0 ? storePrice : profil.valeur_noix_benies;
  const variation = ((displayPrice - profil.valeur_noix_benies) / profil.valeur_noix_benies) * 100;
  const positive = variation >= 0;

  function handleInvest() {
    if (!profil) return;
    const res = investir(profil.id, montant);
    if (res.ok) {
      setFeedback({ type: "ok", msg: `Investissement validé · ${montant} Noix` });
      setTimeout(() => { setOpen(false); setFeedback(null); }, 900);
    } else {
      setFeedback({ type: "err", msg: res.error ?? "Erreur" });
    }
  }

  return (
    <div className="pb-24 lg:pb-0 bg-[#F9F9F7] min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-8 pb-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition mb-8"
          >
            <ChevronLeft className="h-5 w-5" />
            Retour
          </button>

          <div className="flex items-start gap-5 mb-10">
            {/* Avatar */}
            <div className="relative h-[88px] w-[88px] rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
              {profil.photo_url ? (
                <Image src={profil.photo_url} alt={profil.nom_complet} fill className="object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-sans text-3xl">{profil.nom_complet[0]}</div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-400 font-black mb-1.5 font-sans">
                {profil.serie?.titre || "Série Inconnue"}
              </p>
              <h1 className="font-sans text-4xl sm:text-5xl font-black text-gray-900 tracking-[-0.04em] leading-tight text-balance uppercase">
                {profil.nom_complet}
              </h1>
              <p className="mt-2.5 text-gray-600 font-bold text-[15px] font-sans">
                {profil.profession} {profil.age ? `· ${profil.age} ans` : ""}
              </p>
            </div>
            
            {/* Affiche série */}
            {profil.serie?.affiche_url && (
              <div className="hidden sm:block shrink-0">
                <div className="h-32 w-24 overflow-hidden rounded-[6px] border border-gray-200 shadow-sm bg-gray-100 relative">
                  <Image src={profil.serie.affiche_url} alt={profil.serie.titre} fill className="object-cover" />
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Vidéo principale - Section 1 Gauche */}
            <div className="aspect-video w-full rounded-[32px] overflow-hidden bg-black border-4 border-white shadow-2xl">
              {profil.video_urls[0]?.video_url && getYoutubeID(profil.video_urls[0].video_url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeID(profil.video_urls[0].video_url)}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={profil.video_urls[0]?.video_url}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Carte Investissement - Section 1 Droite */}
            <div className="flex flex-col gap-8">
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <div className="flex items-baseline justify-between mb-4 font-sans">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-black">
                    Valeur des Noix Bénies
                  </span>
                  <div className={`flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full ${
                    positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {variation >= 0 ? "+" : ""}{variation.toFixed(1)}%
                  </div>
                </div>
                <div className="flex items-baseline gap-3 mb-8">
                  <span className="font-sans text-[64px] font-black tabular-nums tracking-[-0.05em] leading-none text-black">
                    {displayPrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-black text-gray-300 uppercase tracking-widest">Noix</span>
                </div>

                {/* Histogramme Béninois */}
                <div className="pt-6 border-t border-gray-50 flex items-center gap-10">
                  <HistogrammeBeninois stats={stats} totalAvis={stats.count} />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setOpen(true)}
                  className="w-full rounded-2xl bg-[#0F172A] text-white font-black text-lg py-5 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
                >
                  Investir Maintenant
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <Sparkles className="h-3 w-3" />
                  Solde actuel · {solde.toFixed(0)} Noix
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Épisodes */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <EpisodeCarousel episodes={profil.video_urls} profilId={profil.id} seriesInfo={profil.serie} />
      </section>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestions.map((p) => (
              <div 
                key={p.id} 
                className="cursor-pointer bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow" 
                onClick={() => router.push(`/profil/${p.id}`)}
              >
                <div className="relative h-[60px] w-[60px] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image src={p.photo_url || ""} alt={p.nom_complet} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-gray-900 truncate text-base">{p.nom_complet}</h4>
                  <p className="text-xs text-gray-500 truncate font-medium mt-0.5">{p.profession}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sticky invest bar — mobile */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0 font-sans">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-black leading-none mb-1">Cours Actuel</p>
            <p className="text-2xl font-black tabular-nums leading-tight flex items-center gap-1.5 text-black">
              <Sparkles className="h-4 w-4 text-amber-500" />
              {displayPrice.toFixed(2)}
              <span className={`ml-1 text-xs font-black ${positive ? "text-green-600" : "text-red-600"}`}>
                {variation >= 0 ? "+" : ""}{variation.toFixed(1)}%
              </span>
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-gray-900 text-white font-bold text-sm px-6 py-3.5 shadow-lg active:scale-[0.98] transition whitespace-nowrap"
          >
            Investir
          </button>
        </div>
      </div>

      {/* Invest Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-8 relative animate-in fade-in zoom-in-95 font-sans" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-2">Investir dans</p>
            <h3 className="text-3xl font-black text-black mb-6 uppercase tracking-tight">{profil.nom_complet}</h3>

            <label className="block mb-6">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Montant (Noix Bénies)</span>
              <input
                type="number"
                min={1}
                max={solde}
                value={montant}
                onChange={(e) => setMontant(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-gray-100 bg-gray-50 px-6 py-5 text-4xl font-black tabular-nums focus:outline-none focus:ring-4 focus:ring-black/5 text-black"
              />
            </label>
            <div className="flex gap-2 mb-8">
              {[25, 50, 100, 250].map((v) => (
                <button
                  key={v}
                  onClick={() => setMontant(v)}
                  disabled={v > solde}
                  className="flex-1 text-xs font-black uppercase tracking-widest rounded-xl border border-gray-100 bg-white py-3 hover:bg-gray-50 disabled:opacity-30 transition-all active:scale-95"
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-gray-50 p-6 text-sm space-y-4 border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Cours d'entrée</span>
                <span className="tabular-nums font-black text-black flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  {displayPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200/50 pt-4 mt-2">
                <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Solde après</span>
                <span className="tabular-nums font-black text-black">{(solde - montant).toFixed(0)} Noix</span>
              </div>
            </div>

            <button
              onClick={handleInvest}
              disabled={montant <= 0 || montant > solde}
              className="mt-8 w-full rounded-2xl bg-[#0F172A] text-white font-black text-lg py-5 shadow-xl hover:scale-[1.01] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-widest"
            >
              Confirmer
            </button>

            {feedback && (
              <p className={`mt-4 text-center text-sm font-bold ${feedback.type === "ok" ? "text-green-600" : "text-red-600"}`}>
                {feedback.msg}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}