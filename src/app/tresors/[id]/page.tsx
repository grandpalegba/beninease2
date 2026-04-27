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
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A] font-sans">
      {/* Floating Back Button */}
      <button 
        onClick={() => router.push('/tresors')}
        className="fixed top-8 left-8 z-50 w-12 h-12 bg-white/80 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all text-gray-900"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Hero Section - Image & Titre Principal */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <Image 
          src={tresor.image_url} 
          alt={tresor.nom}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9F7F2] via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:px-24">
          <p className="text-[0.7rem] uppercase font-black tracking-[0.4em] text-[#8B4513] mb-4">
            Trésor N°{tresor.numero} — {tresor.cartographie.origine.ville}
          </p>
          <h1 className="font-serif text-5xl md:text-8xl mb-6 tracking-tighter leading-none">{tresor.nom}</h1>
          <p className="max-w-2xl text-xl md:text-2xl italic opacity-80 font-serif text-gray-700">
            « {tresor.sous_titre} »
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-20 lg:grid lg:grid-cols-12 lg:gap-16">
        {/* Colonne Gauche - Contenu Narratif */}
        <div className="lg:col-span-7 space-y-20">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl mb-8 flex items-center gap-4">
              Analyse Symbolique
              <div className="h-[2px] flex-1 bg-gray-100" />
            </h2>
            <p className="leading-relaxed text-xl opacity-90 text-gray-800">
              {tresor.analyse_symbolique}
            </p>
          </div>

          {tresor.citation && (
            <PullQuote 
              texte={tresor.citation.texte} 
              auteur={tresor.citation.auteur} 
              role={tresor.citation.role} 
            />
          )}

          <div>
            <h2 className="font-serif text-3xl md:text-4xl mb-8 flex items-center gap-4">
              Histoire de l'Exil
              <div className="h-[2px] flex-1 bg-gray-100" />
            </h2>
            <p className="leading-relaxed text-lg opacity-90 text-gray-700">
              {tresor.histoire_exil}
            </p>
          </div>
          
          <div className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
             <h2 className="font-serif text-2xl mb-6">Enjeux de la Restitution</h2>
             <p className="leading-relaxed text-gray-600 italic">
                {tresor.enjeux_restitution}
             </p>
          </div>
        </div>

        {/* Colonne Droite - Sidebar Technique/Data */}
        <aside className="lg:col-span-5 space-y-8 mt-16 lg:mt-0">
          {/* Carte du voyage */}
          <JourneyMap 
            origine={tresor.cartographie.origine}
            exil={tresor.cartographie.exil}
            spoliationDate={tresor.cartographie.evenement.date}
            spoliationEvent={tresor.cartographie.evenement.description}
          />

          {/* Analyse des indicateurs */}
          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 mb-10">
              Indicateurs de Prestige
            </h3>
            <PrestigeBars 
              rarete={tresor.metrics.rarete}
              conservation={tresor.metrics.conservation}
              restitution={tresor.metrics.restitution}
            />
          </div>

          {/* Radar des Jetons */}
          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
              Matrice de Souveraineté
            </h3>
            <JetonsRadar 
              conscience={tresor.jetons.conscience}
              confiance={tresor.jetons.confiance}
              connaissance={tresor.jetons.connaissance}
              competence={tresor.jetons.competence}
            />
          </div>
          
          <div className="p-8 border border-dashed border-gray-200 rounded-[2rem] flex items-center gap-4 text-gray-400">
             <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <span className="text-xs font-black">Mat</span>
             </div>
             <div className="text-[10px] leading-tight font-bold uppercase tracking-widest">
                Matériaux : <span className="text-gray-900">{tresor.materiaux}</span>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
