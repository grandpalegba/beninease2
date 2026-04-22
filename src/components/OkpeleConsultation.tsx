'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { genererTirage, type SigneFa, type DuMajeur } from "@/lib/fa-signes";
import { useWoodSound } from "@/hooks/use-wood-sound";
import { Mic, Send, RefreshCw, ArrowLeft } from "lucide-react";

// --- SOUS-COMPOSANTS ---

function DuIdeogramme({ du }: { du: DuMajeur }) {
  return (
    <div className="flex flex-col gap-2 items-center">
      {du.pattern.map((v, i) => (
        <div key={i} className="flex gap-1.5 items-center justify-center h-2.5">
          {Array.from({ length: v }).map((_, j) => (
            <span key={j} className="w-2 h-2 rounded-full bg-stone-800" />
          ))}
        </div>
      ))}
    </div>
  );
}

function Noix({ phase, delay, spinDuration }: { phase: string; delay: number; spinDuration: string }) {
  const cls = phase === "brewing" ? "noix spinning" : phase === "settling" ? "noix settling" : "noix";
  return (
    <div 
      className={cls} 
      style={{ "--spin-duration": spinDuration, animationDelay: `${delay}s` } as any} 
    />
  );
}

// --- COMPOSANT PRINCIPAL ---

export default function OkpeleConsultation({ caseData, onBack, onComplete }: { caseData: any, onBack: () => void, onComplete?: () => void }) {
  const [phase, setPhase] = useState<"idle" | "brewing" | "settling" | "revealed">("idle");
  const [signe, setSigne] = useState<SigneFa | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);

  const draggingRef = useRef(false);
  const { playSettle, ensureCtx } = useWoodSound();

  const handleTransmit = async () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      onComplete?.();
    }, 1500);
  };

  // Récupération Supabase
  const fetchSigneDetails = async (nomComplet: string) => {
    try {
      const parts = nomComplet.split(' ');
      const cycle = parts[0]; 
      const nom = parts[1] || 'Mèdji';

      const { data, error } = await supabase
        .from('signes_fa')
        .select('*')
        .ilike('signe_nom', nom)
        .single();
      
      if (error) {
        console.error("Erreur fetch signes_fa:", error);
        // Fallback mockup data
        setDetails({
          signe_nom: nomComplet,
          devise: "La patience est le pont vers la lumière.",
          introduction: "Ce signe indique une période de recueillement nécessaire. Le Fa suggère d'observer avant d'agir.",
          avantages: "Paix intérieure, clarté mentale, soutien des ancêtres.",
          defis: "Résister à l'impatience et aux influences extérieures négatives.",
          recommandation: "Consacrez du temps à la méditation et suivez votre intuition profonde."
        });
      } else {
        setDetails(data);
      }
    } catch (err) {
      console.error("Exception fetching signs:", err);
    }
  };

  const finalizeTirage = useCallback(async () => {
    const result = genererTirage();
    setSigne(result);
    await fetchSigneDetails(result.nom);
    playSettle();
    setPhase("settling");
    setTimeout(() => setPhase("revealed"), 1000);
  }, [playSettle]);

  const onPointerDown = (e: React.PointerEvent) => {
    ensureCtx();
    draggingRef.current = true;
    setPhase("brewing");
    // @ts-ignore
    if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    finalizeTirage();
  };

  return (
    <div className="flex h-screen w-full bg-[#fdfcfb] overflow-hidden font-sans fixed inset-0 z-[200]">
      
      {/* ZONE GAUCHE : L'OKPELE (Se réduit à 40% après le tirage) */}
      <div className={`transition-all duration-1000 flex flex-col items-center justify-center relative ${phase === 'revealed' ? 'w-[40%] bg-stone-50/50 border-r' : 'w-full'}`}>
        <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors z-20">
          <ArrowLeft size={20} /> <span className="text-xs uppercase tracking-widest font-bold">Retour</span>
        </button>
        
        <div 
          className="relative group cursor-grab active:cursor-grabbing transition-transform" 
          onPointerDown={onPointerDown} 
          onPointerUp={onPointerUp}
        >
          {/* SVG Okpele Chain */}
          <div className="relative">
            <svg width="180" height="480" viewBox="0 0 120 400" fill="none" className="opacity-20">
               <path d="M10 380V60C10 27.96 32.86 2 60 2C87.13 2 110 27.96 110 60V380" stroke="#b48224" strokeWidth="2.5" strokeDasharray="5 5" />
            </svg>

            {/* Noix rendering */}
            <div className="absolute inset-0 flex justify-between px-1.5 py-20">
              <div className="flex flex-col gap-12">
                {[0, 1, 2, 3].map(i => (
                  <Noix key={`l-${i}`} phase={phase} delay={i * 0.1} spinDuration={phase === "brewing" ? "0.4s" : "1s"} />
                ))}
              </div>
              <div className="flex flex-col gap-12">
                {[0, 1, 2, 3].map(i => (
                  <Noix key={`r-${i}`} phase={phase} delay={i * 0.1 + 0.2} spinDuration={phase === "brewing" ? "0.4s" : "1s"} />
                ))}
              </div>
            </div>
          </div>

          {phase === "idle" && (
            <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center gap-2 animate-pulse">
              <RefreshCw className="text-stone-300" size={20} />
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-stone-400">
                Faites tourner pour consulter
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ZONE DROITE : LA SAGESSE ET L'ACTION (Apparaît à 60%) */}
      {phase === "revealed" && details && (
        <div className="w-[60%] bg-white border-l border-stone-100 flex flex-col animate-in slide-in-from-right duration-1000 ease-out">
          
          <div className="p-12 lg:p-16 flex-1 overflow-y-auto custom-scrollbar">
            {/* 1. Header : Signe et Devise */}
            <header className="mb-10">
              <div className="flex items-center gap-8 mb-6">
                <div className="flex gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100 shadow-sm">
                  <DuIdeogramme du={signe!.duGauche} />
                  <DuIdeogramme du={signe!.duDroite} />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-amber-600 block mb-1">Révélation</span>
                  <h1 className="text-5xl lg:text-6xl font-serif text-stone-900">{details.signe_nom}</h1>
                </div>
              </div>
              <p className="text-2xl text-stone-500 italic font-serif leading-relaxed border-l-4 border-amber-100 pl-6">
                "{details.devise}"
              </p>
            </header>

            {/* 2. Contenu : Allégé mais complet */}
            <div className="space-y-8 max-w-2xl">
              <section>
                <h3 className="text-[9px] font-bold uppercase tracking-widest text-stone-300 mb-4 border-b pb-1">Le Message</h3>
                <p className="text-lg text-stone-700 font-light leading-relaxed italic">{details.introduction}</p>
              </section>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100/50">
                  <h4 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-3">Bénédictions</h4>
                  <p className="text-sm text-stone-600 leading-relaxed italic">{details.avantages}</p>
                </div>
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100/50">
                  <h4 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-3">Défis</h4>
                  <p className="text-sm text-stone-600 leading-relaxed italic">{details.defis}</p>
                </div>
              </div>

              <section className="bg-stone-900 text-stone-100 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full" />
                <h3 className="text-[9px] font-bold uppercase mb-4 text-amber-500 tracking-widest">Prescription du Bokonon</h3>
                <p className="text-xl lg:text-2xl font-serif leading-relaxed italic text-stone-200">
                  {details.recommandation}
                </p>
              </section>
            </div>
          </div>

          {/* 3. Action : Enregistrement Saga */}
          <footer className="p-10 border-t border-stone-100 bg-stone-50/50 backdrop-blur-md flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-1">Transmettre ma Sagesse</p>
              <p className="text-[10px] text-stone-300">Enregistrez l'argumentation finale</p>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${isRecording ? 'bg-red-500 animate-pulse text-white ring-8 ring-red-50' : 'bg-stone-900 text-white hover:scale-105 hover:bg-black'}`}
              >
                <Mic size={32} />
              </button>
              
              {isRecording && (
                <button 
                  onClick={handleTransmit}
                  disabled={isTransmitting}
                  className="flex items-center gap-3 bg-amber-600 text-white px-10 py-5 rounded-full font-bold shadow-2xl hover:bg-amber-700 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                >
                  <Send size={18} />
                  <span className="text-[10px] uppercase tracking-widest">
                    {isTransmitting ? "Scellage..." : "Transmettre"}
                  </span>
                </button>
              )}
            </div>
          </footer>
        </div>
      )}
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f3f4f6;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
