"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { EpisodeCarousel } from "@/components/histoires/EpisodeCarousel";
import { HistogrammeBeninois } from "@/components/histoires/HistogrammeBeninois";
import type { ProfilAvecSerie, Episode } from "@/data/series";
import { useWallet } from "@/store/wallet";
import Image from "next/image";
import { Loader2, Sparkles, TrendingUp, TrendingDown, X, Play, ArrowRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";

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
        // 1. Fetch profile
        const { data: pData, error: pError } = await supabase
          .from("profiles_histoires")
          .select("*")
          .eq("id", id)
          .single();

        if (pError) throw pError;

        const getPosterUrl = (url: string | null) => {
          if (!url) return null;
          if (url.startsWith('http')) return url;
          const cleanUrl = url.replace(/^\/+/, '');
          return `https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/affiches_histoires/${cleanUrl}`;
        };

        serieData = null;
        let allEpisodesFromDB: any[] = [];

        if (pData.series_id) {
          // 2. Fetch series/episode metadata (Liaison Profils ↔ Séries via integer ID)
          const { data: sRow } = await supabase
            .from("series_histoires")
            .select("*")
            .eq("id", pData.series_id)
            .maybeSingle();
          
          if (sRow) {
            serieData = { 
              ...sRow, 
              id: String(sRow.id),
              affiche_url: getPosterUrl(sRow.affiche_url) 
            };
            
            // 3. On récupère tous les épisodes de la même série (par titre)
            const { data: eps } = await supabase
              .from("series_histoires")
              .select("*")
              .eq("titre", sRow.titre)
              .order("episode_numero", { ascending: true });
            
            if (eps) allEpisodesFromDB = eps;
          }
        }

        const profileVideos = Array.isArray(pData.video_urls) ? pData.video_urls : [];
        
        const video_urls: Episode[] = allEpisodesFromDB.map((dbEp, index) => {
          const profVideo = profileVideos[index];
          return {
            id: dbEp.id || `ep-${index + 1}`,
            titre: dbEp.episode_titre || `Épisode ${dbEp.episode_numero || index + 1}`,
            video_url: profVideo?.video_url || profVideo?.url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            numero: dbEp.episode_numero || (index + 1),
            episode_question: dbEp.episode_question || null
          };
        });

        const final_video_urls: Episode[] = video_urls.length > 0 ? video_urls : profileVideos.map((pv, idx) => ({
          ...pv,
          numero: pv.numero || (idx + 1),
          titre: pv.titre || `Épisode ${idx + 1}`
        }));

        setProfil({
          ...pData,
          video_urls: final_video_urls,
          serie: (serieData as any) ?? null,
        } as any);

        setStats({
          originalite: pData.moyenne_originalite ?? 50,
          authenticite: pData.moyenne_authenticite ?? 50,
          impact: pData.moyenne_impact ?? 50,
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
        
        {/* --- HEADER BLOCK : Identité | Affiche --- */}
        <header className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:justify-between gap-6 md:gap-10 relative overflow-hidden">
          <BackButton href="/histoires/explorer" className="absolute left-4 top-4 md:relative md:left-0 md:top-0" />

          {/* GAUCHE : Identité */}
          <div className="flex items-center gap-6 w-full md:w-auto pt-8 md:pt-0">
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-inner bg-gray-50 border border-gray-100 select-none shrink-0">
              {profil.photo_url && (
                <Image src={profil.photo_url} alt={profil.nom_complet} fill className="object-cover object-top pointer-events-none" draggable={false} />
              )}
            </div>
            <div className="shrink-1">
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter leading-tight mb-1">{profil.nom_complet}</h1>
              <p className="text-xs md:text-sm font-bold text-[#008751] uppercase tracking-widest">{profil.profession}</p>
            </div>
          </div>

          {/* CENTRE/DROITE : Affiche de la Série (Plus grande, remplace la valeur financière) */}
          {profil.serie?.affiche_url && (
            <div className="flex items-center justify-center md:justify-end gap-6 w-full md:w-auto pt-6 md:pt-0 border-t md:border-none border-gray-50">
              <div className="relative w-28 h-40 md:w-32 md:h-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500">
                <Image src={profil.serie.affiche_url} alt={profil.serie.titre} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="hidden md:block">
                <p className="text-lg font-black text-black leading-none tracking-tighter">{profil.serie.titre}</p>
              </div>
            </div>
          )}
        </header>

        {/* --- HERO SECTION --- */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 items-center font-sans mb-6">
          
          {/* Main Video Block (Presentation) */}
          <div className="bg-black relative aspect-video flex items-center justify-center group self-center lg:self-auto rounded-[2rem] overflow-hidden shadow-2xl m-4 lg:m-6">
            <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity z-10 bg-black/60">
              <h3 className="text-xl md:text-2xl font-black text-white text-center tracking-[0.3em] uppercase drop-shadow-2xl px-8 py-4 rounded-[2rem] mb-4">
                Présentation
              </h3>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20">
                <Play fill="currentColor" size={32} />
              </div>
            </div>
            {/* Poster background or colored backdrop */}
            <div className="absolute inset-0 bg-[#008751]/20" />
          </div>

          {/* Finance Block : Horizontal Histogram */}
          <div className="h-full">
            <HistogrammeBeninois stats={stats} title="Présentation" subtitle="Introduction et Parcours" />
          </div>
        </div>


        {/* --- EVALUATION MODULE --- */}
        <section className="space-y-8 pb-10">
          <EpisodeCarousel episodes={profil.video_urls} profilId={profil.id} seriesInfo={profil.serie} />
        </section>
      </main>


    </motion.div>
  );
}