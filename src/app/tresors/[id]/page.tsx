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
    annee?: string;
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
          materiaux: data.materiaux || "Non renseigné",
          analyse_symbolique: data.analyse_symbolique || "Aucune analyse disponible.",
          histoire_exil: data.histoire_exil || "Aucun récit disponible.",
          enjeux_restitution: data.enjeux_restitution || "Aucun enjeu renseigné.",
          metrics: {
            rarete: data.rarete_historique || 50,
            conservation: data.etat_conservation || 50,
            restitution: data.potentiel_restitution || 50,
          },
          cartographie: {
            origine: { ville: data.origine_ville || "Bénin", pays: "Bénin" },
            exil: { 
              ville: data.exil_ville || "Non renseignée", 
              pays: data.pays_localisation_tresors || data.exil_pays || "Non renseigné", 
              institution: data.exil_institution || "Non renseignée" 
            },
            evenement: { 
              date: data.evenement_date || "Date inconnue", 
              description: data.evenement_desc || "Évènement non renseigné" 
            },
          },
          jetons: {
            conscience: data.jeton_conscience || 5,
            confiance: data.jeton_confiance || 5,
            connaissance: data.jeton_connaissance || 5,
            competence: data.jeton_competence || 5,
          },
          citation: data.citation_texte ? {
            texte: data.citation_texte,
            auteur: data.auteur_contexte || "Source anonyme",
            role: data.auteur_fonction || "Historien",
            annee: data.source_annee
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

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    
    // Swipe left or right > 50px
    if (distance > 50 || distance < -50) {
      router.push('/tresors');
    }
    setTouchStart(null);
  };

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
    <div 
      className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A] font-sans pb-24"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* ── SECTION HAUTE : Image & Infos Clés ── */}
      <section className="max-w-[1400px] mx-auto pt-12 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Colonne Gauche : Image + Jetons (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Image du Trésor */}
          <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm relative h-[450px] bg-[#FBFBFA] p-10 flex items-center justify-center">
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

          {/* Nom et sous-titre — sous la photo */}
          <div className="px-2">
            <h1 className="font-sans font-black text-2xl md:text-3xl mb-2 tracking-tight leading-[1.3] text-gray-900">
              {tresor.nom}
            </h1>
            <p className="text-gray-500 font-medium text-base">
              {tresor.sous_titre?.replace(/\.\s*$/, '')}
            </p>
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
             <button className="w-full mt-12 py-5 bg-black hover:bg-gray-800 text-white rounded-2xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg active:scale-95">
                Libérer le Trésor
             </button>
          </div>
        </div>

        {/* Colonne Droite : Infos & Carte (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] p-8 md:p-14 border border-gray-100 shadow-sm flex flex-col">
          {/* Itinéraire Intégré */}
          <div className="mb-10 h-[350px]">
            <JourneyMap 
              origine={tresor.cartographie.origine}
              exil={tresor.cartographie.exil}
              spoliationDate={tresor.cartographie.evenement.date}
              spoliationEvent={tresor.cartographie.evenement.description}
            />
          </div>

          {/* Histoire de l'exil + Enjeux + Analyse — sous la carte */}
          <div className="space-y-10">
            <div>
              <h2 className="font-sans font-black text-2xl mb-4 text-gray-900">Histoire de l'exil</h2>
              <p className="leading-relaxed text-base text-gray-600 font-medium">
                {tresor.histoire_exil}
              </p>
            </div>

            <div>
              <h2 className="font-sans font-black text-2xl mb-4 text-gray-900">Enjeux de restitution</h2>
              <p className="leading-relaxed text-base text-gray-600 font-medium">
                {tresor.enjeux_restitution}
              </p>
            </div>

            <div>
              <h2 className="font-sans font-black text-2xl mb-4 text-gray-900">Analyse symbolique</h2>
              <p className="leading-relaxed text-base text-gray-600 font-medium">
                {tresor.analyse_symbolique}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION MÉDIANE : Récit & Évaluation ── */}
      <section className="max-w-[1400px] mx-auto mt-12 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Colonne Narrative (7 cols) — Matériaux + Citation */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-sm space-y-16">
          <div>
            <h2 className="font-sans font-black text-3xl mb-8 text-gray-900">Matériaux</h2>
            <p className="leading-relaxed text-lg text-gray-600 font-medium">
              {tresor.materiaux}
            </p>
          </div>

          {tresor.citation && (
            <div className="relative pl-12 py-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E8112D] rounded-full" />
              <p className="font-sans text-xl font-bold text-gray-800 leading-snug mb-6">
                « {tresor.citation.texte} »
              </p>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {tresor.citation.auteur} · {tresor.citation.role} {tresor.citation.annee && `(${tresor.citation.annee})`}
              </div>
            </div>
          )}
        </div>

        {/* Colonne Évaluation (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-gray-100 shadow-sm sticky top-8">
             <div className="mb-12">
                <h3 className="text-3xl font-sans font-black text-gray-900">Évaluation du trésor</h3>
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
