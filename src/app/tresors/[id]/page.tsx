"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { JourneyMap } from "@/components/tresors/JourneyMap";
import { PrestigeBars } from "@/components/tresors/PrestigeBars";
import { JetonsRadar } from "@/components/tresors/JetonsRadar";
import { PullQuote } from "@/components/tresors/PullQuote";
import Image from "next/image";

export interface TresorDetail {
  id: string;
  numero: number;
  nom: string;
  sous_titre: string;
  image_url: string;
  materiaux: string;
  analyse_symbolique: string;
  histoire_exil: string;
  enjeux_restitution: string;
  metrics: {
    rarete: number;
    conservation: number;
    restitution: number;
  };
  cartographie: {
    origine: { ville: string; pays: string };
    exil: { ville: string; pays: string; institution: string };
    evenement: { date: string; description: string };
  };
  jetons: {
    conscience: number;
    confiance: number;
    connaissance: number;
    competence: number;
  };
  citation?: {
    texte: string;
    auteur: string;
    role: string;
  };
}

export default function TresorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [tresor, setTresor] = useState<TresorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchDetail() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("tresors_benin")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        // Transformation logic to match the requested TresorDetail interface
        // We use fallbacks for columns that might not exist yet in the DB
        const mappedTresor: TresorDetail = {
          id: data.id,
          numero: data.numero || 1,
          nom: data.nom,
          sous_titre: data.sous_titre,
          image_url: data.image_url,
          materiaux: data.materiaux || "Bronze, alliages cuivreux, bois sculpté.",
          analyse_symbolique: data.analyse_symbolique || "Cette pièce incarne la souveraineté du Royaume de Dahomey. Chaque motif sculpté représente un proverbe ou un exploit guerrier du souverain.",
          histoire_exil: data.histoire_exil || "Spolié lors de l'expédition punitive française de 1892 menée par le colonel Dodds. Emporté comme trophée de guerre et déposé plus tard au Musée de l'Homme.",
          enjeux_restitution: data.enjeux_restitution || "Objet d'une demande officielle de restitution depuis 2016. Symbole fort du renouveau culturel béninois.",
          metrics: {
            rarete: data.metric_rarete || 85,
            conservation: data.metric_conservation || 92,
            restitution: data.metric_restitution || 70,
          },
          cartographie: {
            origine: { 
              ville: data.origine_ville || "Abomey", 
              pays: data.origine_pays || "Bénin" 
            },
            exil: { 
              ville: data.exil_ville || "Paris", 
              pays: data.exil_pays || "France", 
              institution: data.exil_institution || "Musée du Quai Branly" 
            },
            evenement: { 
              date: data.evenement_date || "Novembre 1892", 
              description: data.evenement_desc || "Prise du palais royal d'Abomey par les troupes coloniales." 
            },
          },
          jetons: {
            conscience: data.jeton_conscience || 60,
            confiance: data.jeton_confiance || 45,
            connaissance: data.jeton_connaissance || 80,
            competence: data.jeton_competence || 70,
          },
          citation: data.citation_texte ? {
            texte: data.citation_texte,
            auteur: data.citation_auteur || "Historien local",
            role: data.citation_role || "Gardien de la mémoire"
          } : {
            texte: "Ce trésor n'est pas seulement un objet, c'est l'âme de nos ancêtres qui respire encore.",
            auteur: "Sage d'Abomey",
            role: "Dignitaire de la Cour Royale"
          }
        };

        setTresor(mappedTresor);
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F9F7F2]">
        <Loader2 className="w-8 h-8 animate-spin text-[#008751]" />
      </div>
    );
  }

  if (!tresor) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F9F7F2]">
      <p className="text-gray-400">Trésor introuvable</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A] font-sans pb-24">
      {/* Navigation Flottante */}
      <button 
        onClick={() => router.push('/tresors')}
        className="fixed top-8 left-8 z-50 w-12 h-12 bg-white/90 backdrop-blur-md border border-gray-100 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all text-gray-900"
      >
        <ArrowLeft size={20} />
      </button>

      {/* ── SECTION HAUTE : Image & Infos Clés ── */}
      <section className="max-w-[1400px] mx-auto pt-12 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Colonne Gauche : Image + Jetons (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Image du Trésor */}
          <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm relative h-[450px] bg-[#FBFBFA] p-10">
            <div className="relative w-full h-full">
              <Image 
                src={tresor.image_url} 
                alt={tresor.nom}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="absolute bottom-6 right-6 w-10 h-10 bg-black/5 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </div>
          </div>

          {/* Radar des Jetons (Sous l'image) */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
             <div className="mb-10 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">LES QUATRE JETONS</p>
             </div>
             <JetonsRadar 
                conscience={tresor.jetons.conscience}
                confiance={tresor.jetons.confiance}
                connaissance={tresor.jetons.connaissance}
                competence={tresor.jetons.competence}
             />
             
             {/* Bouton Action */}
             <button className="w-full mt-12 py-5 bg-[#BC4B2D] hover:bg-[#A33818] text-white rounded-2xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg active:scale-95">
                Libérer le Trésor
             </button>
          </div>
        </div>

        {/* Colonne Droite : Infos & Carte (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] p-8 md:p-14 border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E8112D] mb-4">
              XIXe SIÈCLE
            </p>
            <h1 className="font-sans font-black text-5xl md:text-6xl mb-4 tracking-tighter leading-tight text-gray-900">
              {tresor.nom}
            </h1>
            <p className="text-gray-500 font-medium text-lg">
              {tresor.sous_titre} — Royaume de Dahomey
            </p>
          </div>

          {/* Itinéraire Intégré */}
          <div className="mb-10 flex-1 min-h-[300px]">
            <JourneyMap 
              origine={tresor.cartographie.origine}
              exil={tresor.cartographie.exil}
              spoliationDate={tresor.cartographie.evenement.date}
              spoliationEvent={tresor.cartographie.evenement.description}
            />
          </div>

          <div className="space-y-8">
            {/* Évènement Pill */}
            <div className="bg-[#FFF5F5] border border-[#FFE0E0] rounded-full px-6 py-4 flex items-center gap-4">
              <span className="text-[#E8112D] font-black text-sm tabular-nums">1892</span>
              <div className="h-4 w-[1px] bg-[#E8112D]/20" />
              <span className="text-[10px] uppercase font-black tracking-widest text-[#E8112D]">
                SAC D'ABOMEY — GÉNÉRAL DODDS
              </span>
            </div>

            {/* Matériaux Tags */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">MATÉRIAUX</p>
              <div className="flex flex-wrap gap-2">
                {tresor.materiaux.split(',').map((mat) => (
                  <span key={mat} className="px-5 py-2 bg-[#F9F7F2] border border-gray-100 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                    {mat.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION MÉDIANE : Récit & Évaluation ── */}
      <section className="max-w-[1400px] mx-auto mt-12 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Colonne Narratve (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-sm space-y-16">
          <div>
            <h2 className="font-sans font-black text-3xl mb-8 text-gray-900">Analyse symbolique</h2>
            <p className="leading-relaxed text-lg text-gray-600 font-medium">
              {tresor.analyse_symbolique}
            </p>
          </div>

          {tresor.citation && (
            <div className="relative pl-12 py-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E8112D] rounded-full" />
              <p className="font-sans text-2xl font-bold text-gray-800 leading-snug mb-6">
                « {tresor.citation.texte} »
              </p>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                — {tresor.citation.auteur} · {tresor.citation.role}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-sans font-black text-3xl mb-8 text-gray-900">Histoire de l'exil</h2>
            <p className="leading-relaxed text-gray-600 font-medium">
              {tresor.histoire_exil}
            </p>
          </div>

          <div>
            <h2 className="font-sans font-black text-3xl mb-8 text-gray-900">Enjeux de restitution</h2>
            <p className="leading-relaxed text-gray-600 font-medium">
              {tresor.enjeux_restitution}
            </p>
          </div>
        </div>

        {/* Colonne Évaluation (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-gray-100 shadow-sm sticky top-8">
             <div className="mb-12">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">INDICE DE PRESTIGE</p>
                <h3 className="text-3xl font-sans font-black text-gray-900">Évaluation</h3>
             </div>
             <PrestigeBars 
                rarete={tresor.metrics.rarete}
                conservation={tresor.metrics.conservation}
                restitution={tresor.metrics.restitution}
             />
             <p className="mt-12 text-[11px] italic text-gray-400 leading-relaxed">
                Indices estimés à partir de l'historiographie et des dossiers diplomatiques disponibles.
             </p>
          </div>
        </div>
      </section>

      {/* ── SECTION BASSE : Suggestions ── */}
      <section className="max-w-[1400px] mx-auto mt-24 px-6 md:px-12">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E8112D] mb-8">SUGGESTIONS</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map((i) => (
             <div key={i} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm group cursor-pointer hover:shadow-xl transition-all duration-500">
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-50 p-6">
                   <div className="w-full h-full bg-gray-200 animate-pulse rounded-xl" />
                </div>
                <div className="p-8">
                   <p className="text-[8px] font-black text-[#E8112D] uppercase tracking-widest mb-3">XVIIIe-XIXe SIÈCLE</p>
                   <h4 className="font-sans font-bold text-xl mb-2">Portes du palais d'Abomey</h4>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Musée du quai Branly, Paris</p>
                </div>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
}
