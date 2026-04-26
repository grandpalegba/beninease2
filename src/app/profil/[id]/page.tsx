"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { EpisodeCarousel } from "@/components/histoires/EpisodeCarousel";
import { HistogrammeBeninois } from "@/components/histoires/HistogrammeBeninois";
import type { ProfilAvecSerie, Episode } from "@/data/series";
import { useWallet } from "@/store/wallet";
import Image from "next/image";
import { ChevronLeft, Loader2, Sparkles, TrendingUp, TrendingDown, X, Play, ArrowRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const storePrice = useWallet((s) => s.effectivePrice(id));
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
          setStats({
            volume: Math.min(5, 1 + (count / 10)),
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
      <button onClick={() => router.back()} className="mt-4 inline-block text-sm underline font-sans">Retour</button>
    </div>
  );

  const displayPrice = storePrice > 0 ? storePrice : profil.valeur_noix_benies;

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

  const mainVideoId = getYoutubeID(profil.video_urls[0]?.video_url);

  return (
    <div className="min-h-screen bg-[#F9F9F7] font-sans p-6 md:p-12 relative overflow-x-hidden">
      <div className="fixed inset-0 pattern-bg -z-10"></div>

      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <header className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-inner bg-gray-50 border border-gray-100">
            {profil.photo_url && (
              <Image src={profil.photo_url} alt={profil.nom_complet} fill className="object-cover object-top" />
            )}
          </div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">{profil.nom_complet}</h1>
        </header>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Video Block (6 columns) */}
          <div className="lg:col-span-6 bg-black rounded-[2.5rem] relative aspect-video overflow-hidden group shadow-xl border border-gray-100">
            {mainVideoId ? (
              <iframe 
                src={`https://www.youtube.com/embed/${mainVideoId}`} 
                className="w-full h-full" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={profil.video_urls[0]?.video_url} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white">
                <Play fill="currentColor" size={32} />
              </div>
            </div>
            <div className="absolute bottom-6 left-8 text-white pointer-events-none group-hover:opacity-0 transition-opacity">
              <p className="font-bold text-lg uppercase tracking-tight">{profil.video_urls[0]?.titre || "Vision Ancestrale"}</p>
              <p className="text-sm opacity-70">Cinématique • 03:20</p>
            </div>
          </div>

          {/* Serie Poster Block (3 columns) */}
          <div className="lg:col-span-3 rounded-[2.5rem] overflow-hidden relative shadow-lg border-4 border-white group">
            {profil.serie?.affiche_url ? (
              <Image src={profil.serie.affiche_url} alt="Serie" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
            <div className="absolute top-6 left-6 bg-white p-4 rounded-2xl shadow-xl max-w-[120px]">
              <h2 className="font-black text-xl leading-tight uppercase tracking-tighter">
                {profil.serie?.titre.split(' ').map((word, i) => <span key={i} className="block">{word}</span>)}
              </h2>
            </div>
          </div>

          {/* Finance & Action Block (3 columns) */}
          <div className="lg:col-span-3 bg-[#F2F1EC] p-8 rounded-[2.5rem] flex flex-col justify-between border border-gray-200 shadow-sm">
            <div className="space-y-10">
              <div className="flex items-start gap-4">
                <HistogrammeBeninois stats={stats} totalAvis={stats.count} />
                <div>
                  <p className="text-4xl font-black text-black leading-none tabular-nums tracking-tighter">
                    {displayPrice.toFixed(2)}
                  </p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Noix Bénies</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/50 backdrop-blur-sm border border-white rounded-xl flex items-center justify-center text-gray-600 shadow-sm">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-4xl font-black text-black leading-none tabular-nums tracking-tighter">1,482</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Active Shares</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setOpen(true)}
              className="w-full bg-[#3b6934] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center hover:bg-[#2d5027] transition-all shadow-xl shadow-[#3b6934]/20 active:scale-95"
            >
              Investir
            </button>
          </div>
        </div>

        {/* Evaluation & Episodes Carousel Section */}
        <section className="space-y-8">
          <EpisodeCarousel episodes={profil.video_urls} profilId={profil.id} seriesInfo={profil.serie} />
        </section>

        {/* Suggestions Section */}
        <section className="mt-8 space-y-6 pb-20">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] ml-2 text-gray-400">Suggestions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestions.map((p, i) => (
              <div 
                key={p.id} 
                onClick={() => router.push(`/profil/${p.id}`)}
                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform">
                  {p.photo_url && <Image src={p.photo_url} alt={p.nom_complet} fill className="object-cover" />}
                </div>
                <div>
                  <p className="font-black text-gray-900 uppercase tracking-tight">{p.nom_complet}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{p.profession}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Invest Modal */}
      {open && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 relative shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 right-0 p-8">
              <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Acquisition</p>
            <h3 className="text-3xl font-black text-black uppercase tracking-tighter mb-8">{profil.nom_complet}</h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Montant (NB)</p>
                <input 
                  type="number" 
                  value={montant}
                  onChange={(e) => setMontant(Number(e.target.value))}
                  className="w-full bg-gray-50 rounded-2xl p-5 text-4xl font-black focus:outline-none border-2 border-transparent focus:border-[#3b6934] transition-all"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 100, 250].map(v => (
                  <button 
                    key={v}
                    onClick={() => setMontant(v)}
                    className={cn(
                      "py-3 rounded-xl font-black text-xs transition-all",
                      montant === v ? "bg-[#3b6934] text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl space-y-3">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                  <span>Cours actuel</span>
                  <span className="text-black">{displayPrice.toFixed(2)} NB</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                  <span>Solde disponible</span>
                  <span className="text-[#008751]">{solde.toFixed(0)} NB</span>
                </div>
              </div>

              <button 
                onClick={handleInvest}
                className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl active:scale-95 transition-all"
              >
                Confirmer l'achat
              </button>
              
              {feedback && (
                <p className={cn("text-center text-xs font-bold uppercase", feedback.type === 'ok' ? 'text-green-600' : 'text-red-600')}>
                  {feedback.msg}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}