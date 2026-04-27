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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch main treasure
        const { data, error } = await supabase
          .from("tresors_benin")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        // Transformation logic
        const mappedTresor: TresorDetail = {
          id: data.id,
          numero: data.numero || 1,
          nom: data.nom,
          sous_titre: data.sous_titre,
          image_url: data.image_url,
          materiaux: data.materiaux || "Bronze, alliages cuivreux, bois sculpté.",
          analyse_symbolique: data.analyse_symbolique || "Cette pièce incarne la souveraineté du Royaume de Dahomey.",
          histoire_exil: data.histoire_exil || "Spolié lors de l'expédition punitive française de 1892.",
          enjeux_restitution: data.enjeux_restitution || "Objet d'une demande officielle de restitution depuis 2016.",
          metrics: {
            rarete: data.metric_rarete || 85,
            conservation: data.metric_conservation || 92,
            restitution: data.metric_restitution || 70,
          },
          cartographie: {
            origine: { ville: data.origine_ville || "Abomey", pays: data.origine_pays || "Bénin" },
            exil: { ville: data.exil_ville || "Paris", pays: data.exil_pays || "France", institution: data.exil_institution || "Musée du Quai Branly" },
            evenement: { date: data.evenement_date || "Novembre 1892", description: data.evenement_desc || "Prise du palais royal d'Abomey." },
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
          } : undefined
        };

        setTresor(mappedTresor);

        // Fetch 3 random suggestions
        const { data: suggData } = await supabase
          .from("tresors_benin")
          .select("id, nom, image_url, exil_institution, exil_ville")
          .neq("id", id)
          .limit(3);
        
        if (suggData) setSuggestions(suggData);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
          <div className="bg-white rounded-[3rem] overflow-hidden border-2 border-[#D4AF37]/30 shadow-sm relative h-[450px] bg-[#FBFBFA] p-10 flex items-center justify-center">
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              <Image 
                src={tresor.image_url} 
                alt={tresor.nom}
                fill
                className="object-contain"
                priority
              />
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
            <h1 className="font-sans font-black text-3xl md:text-4xl mb-4 tracking-tight leading-[1.3] text-gray-900">
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
            {/* Histoire de l'exil (Remonté sous la carte) */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">HISTOIRE DE L'EXIL</p>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {tresor.histoire_exil}
              </p>
            </div>

            {/* Matériaux (Texte simple) */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">MATÉRIAUX</p>
              <p className="text-sm font-bold text-gray-700 uppercase tracking-widest leading-relaxed">
                {tresor.materiaux}
              </p>
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

          <div>
            <h2 className="font-sans font-black text-3xl mb-8 text-gray-900">Enjeux de restitution</h2>
            <p className="leading-relaxed text-lg text-gray-600 font-medium">
              {tresor.enjeux_restitution}
            </p>
          </div>

          {tresor.citation && (
            <div className="relative pl-12 py-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E8112D] rounded-full" />
              <p className="font-sans text-xl font-bold text-gray-800 leading-snug mb-6">
                « {tresor.citation.texte} »
              </p>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                — {tresor.citation.auteur} · {tresor.citation.role}
              </div>
            </div>
          )}
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

    </div>
  );
}
