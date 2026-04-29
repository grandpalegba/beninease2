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
import { motion } from "framer-motion";

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

  const storePrice = useWallet((s) => s.effectivePrice(id));
  const solde = useWallet((s) => s.solde);
  const investir = useWallet((s) => s.investir);

  const [open, setOpen] = useState(false);
  const [montant, setMontant] = useState(50);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  
  const [stats, setStats] = useState({
    originalite: 2.5,
    authenticite: 2.5,
    impact: 2.5,
    count: 0
  });

  useEffect(() => {
    if (!id) return;
    async function fetchFullData() {
      try {
        let serieData = null;
        setLoading(true);
        const { data: pData, error: pError } = await supabase
          .from("profiles_histoires")
          .select("*")
          .eq("id", id)
          .single();

        if (pError) throw pError;

        let allEpisodes: any[] = [];
        if (pData.series_id) {
          // 1. On récupère la série actuelle pour avoir le titre de référence
          const { data: currentSerie } = await supabase
            .from("series_histoires")
            .select("*")
            .eq("id", pData.series_id)
            .single();
          
          if (currentSerie) {
            serieData = currentSerie;
            // 2. On récupère TOUS les épisodes de cette même série (par titre)
            const { data: epData } = await supabase
              .from("series_histoires")
              .select("*")
              .eq("titre", currentSerie.titre)
              .order("episode_numero", { ascending: true });
            
            if (epData) allEpisodes = epData;
          }
        }

        // On mappe les vidéos du profil aux épisodes de la série par index
        const video_urls: Episode[] = Array.isArray(pData.video_urls)
          ? pData.video_urls.map((v: any, index: number) => {
            const dbEpisode = allEpisodes[index]; // On prend l'épisode correspondant à l'index (1er -> Ep 1, etc.)
            return {
              id: v.id ?? dbEpisode?.id ?? "",
              titre: dbEpisode?.episode_titre || v.titre || "Épisode " + (index + 1),
              video_url: v.video_url ?? "",
              numero: dbEpisode?.episode_numero || (index + 1),
              episode_question: dbEpisode?.episode_question || null
            };
          })
          : [];

        setProfil({
          ...pData,
          video_urls,
          serie: serieData as any,
        } as any);

        setStats({
          originalite: pData.moyenne_originalite ?? 2.5,
          authenticite: pData.moyenne_authenticite ?? 2.5,
          impact: pData.moyenne_impact ?? 2.5,
          count: pData.total_avis ?? 0
        });

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

  if (!profil) return null;

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
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[#F9F9F7] font-sans p-6 pt-4 md:pt-6 md:p-12 relative overflow-x-hidden"
    >
      <div className="fixed inset-0 pattern-bg -z-10"></div>

      <main className="max-w-7xl mx-auto space-y-6">
        
        {/* --- HEADER BLOCK : Symétrie Nom | Bio | Valeur --- */}
        <header className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-8 relative overflow-hidden">
          {/* Bouton Retour Flottant */}
          <button 
            onClick={() => router.push('/histoires')}
            className="absolute left-4 top-4 md:relative md:left-0 md:top-0 w-10 h-10 bg-gray-50 border border-gray-100 rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-black transition-all hover:scale-110 z-20"
            title="Retour aux cartes"
          >
            <ChevronLeft size={20} />
          </button>

          {/* GAUCHE : Identité */}
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto pt-8 md:pt-0">
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-inner bg-gray-50 border border-gray-100 select-none shrink-0">
              {profil.photo_url && (
                <Image src={profil.photo_url} alt={profil.nom_complet} fill className="object-cover object-top pointer-events-none" draggable={false} />
              )}
            </div>
            <div className="shrink-1">
              <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter leading-tight mb-1">{profil.nom_complet}</h1>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{profil.profession}</p>
            </div>
          </div>

          {/* CENTRE : Bio (visible sur MD+) */}
          {profil.bio_courte && (
            <div className="flex-1 max-w-lg hidden lg:block">
              <p className="text-sm font-medium text-gray-500 italic text-center leading-relaxed">
                « {profil.bio_courte} »
              </p>
            </div>
          )}

          {/* DROITE : Valeur Financière */}
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-none border-gray-50">
            <div className="text-left md:text-right">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Valeur Actuelle</p>
              <div className="flex items-center md:justify-end gap-2">
                <p className="text-2xl font-black text-black leading-none tracking-tighter tabular-nums">
                  {profil.valeur_noix_benies.toFixed(2)}
                  <span className="text-xs ml-1 text-gray-400">NB</span>
                </p>
                <span className="px-2 py-1 rounded-full bg-green-50 text-[10px] font-black text-green-600 border border-green-100">
                  +0.0%
                </span>
              </div>
            </div>
            {/* Affiche (Mini-thumb) */}
            {profil.serie?.affiche_url && (
              <div className="w-12 h-16 rounded-xl overflow-hidden border-2 border-white shadow-md shrink-0 relative">
                <Image src={profil.serie.affiche_url} alt="Serie" fill className="object-cover" />
              </div>
            )}
          </div>
        </header>

        {/* --- HERO GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Video Block (6 columns) */}
          <div className="lg:col-span-6 bg-black rounded-[2.5rem] relative aspect-video overflow-hidden group shadow-xl border border-gray-100 select-none">
            {mainVideoId ? (
              <iframe 
                src={`https://www.youtube.com/embed/${mainVideoId}`} 
                className="w-full h-full pointer-events-auto" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={profil.video_urls[0]?.video_url} className="w-full h-full object-cover pointer-events-none" draggable={false} />
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20">
                <Play fill="currentColor" size={32} />
              </div>
            </div>
          </div>

          {/* Serie Poster Block (2 columns) */}
          <div className="lg:col-span-2 rounded-[2.5rem] overflow-hidden relative shadow-lg border-4 border-white group select-none aspect-[2/3] hidden lg:block">
            {profil.serie?.affiche_url ? (
              <Image src={profil.serie.affiche_url} alt="Serie" fill className="object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" draggable={false} />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>

          {/* Finance Block : Horizontal Histogram (4 columns) */}
          <div className="lg:col-span-4">
            <HistogrammeBeninois stats={stats} />
          </div>
        </div>

        {/* --- ACTIONS SECTION --- */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/50 p-4 rounded-[2rem] border border-gray-100">
           <div className="flex items-center gap-4 px-6 w-full md:w-auto">
              <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Nb d&apos;investisseurs</p>
                <p className="text-2xl font-black text-black leading-none tracking-tighter">{profil.total_investisseurs ?? 0}</p>
              </div>
           </div>

           <button 
              onClick={() => setOpen(true)}
              className="w-full md:w-[300px] bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
            >
              Donner de l&apos;écho
            </button>
        </div>

        {/* --- EVALUATION MODULE --- */}
        <section className="space-y-8 pb-10">
          <EpisodeCarousel episodes={profil.video_urls} profilId={profil.id} seriesInfo={profil.serie} />
        </section>
      </main>

      {/* --- INVEST MODAL --- */}
      {open && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 relative shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 right-0 p-8">
              <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Acquisition</p>
            <h3 className="text-3xl font-black text-black tracking-tighter mb-8">{profil.nom_complet}</h3>

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
                  <span className="text-black">{profil.valeur_noix_benies.toFixed(2)} NB</span>
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
    </motion.div>
  );
}