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
            <span key={j} className="w-1.5 h-1.5 rounded-full bg-stone-800" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Le sous-composant Noix reproduit fidèlement le HTML Flexbox
function Noix({ isLit, phase, delay }: { isLit: boolean, phase: string, delay: number }) {
  let animClass = "";
  if (phase === "brewing") animClass = "noix-spinning";
  if (phase === "settling") animClass = "noix-settling";

  return (
    <div 
      className={`w-12 h-14 pear-seed-inverted shadow-md relative overflow-hidden ring-1 ring-black/5 ${animClass}`} 
      style={{ backgroundColor: "#833321", animationDelay: `${delay}s` }}
    >
      {/* Texture bois d'origine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/30"></div>
      
      {/* Fente lumineuse UNIQUEMENT si la noix est "allumée" */}
      {isLit && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15,0_0_4px_#facc15] z-10"></div>
      )}
    </div>
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

  const fetchSigneDetails = async (nomComplet: string) => {
    try {
      const parts = nomComplet.split(' ');
      const nom = parts[1] || 'Mèdji';

      const { data, error } = await supabase
        .from('signes_fa')
        .select('*')
        .ilike('signe_nom', nom)
        .single();
      
      if (error) {
        console.error("Erreur fetch signes_fa:", error);
        setDetails({
          signe_nom: nomComplet,
          devise: "La vérité est le fruit de la patience.",
          introduction: "Ce signe évoque l'équilibre parfait des forces de la nature. Le Fa vous invite à la réflexion avant l'action.",
          avantages: "Protection accrue, clairvoyance spirituelle.",
          defis: "Résistance au changement, doutes passagers.",
          recommandation: "Honorez la terre et restez fidèle à votre parole."
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
    setTimeout(() => setPhase("revealed"), 1200);
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

  const isRevealed = phase === "revealed";

  return (
    <div className="flex h-screen w-full bg-[#fdfcfb] overflow-hidden font-sans fixed inset-0 z-[200]">
      
      {/* ZONE GAUCHE : L'OKPELE (Structure Flexbox fidèle) */}
      <div className={`transition-all duration-1000 flex flex-col items-center justify-center relative ${isRevealed ? 'w-[40%] bg-stone-50/50 border-r border-stone-100' : 'w-full'}`}>
        <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-stone-300 hover:text-stone-800 transition-colors z-20">
          <ArrowLeft size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest">Retour</span>
        </button>
        
        <div 
          className="relative group cursor-grab active:cursor-grabbing transition-transform" 
          onPointerDown={onPointerDown} 
          onPointerUp={onPointerUp}
        >
          {/* Rendu de l'Okpele via Flexbox */}
          <div className="flex flex-col items-center relative mt-14">
            {/* L'Arc Supérieur */}
            <div className="w-24 h-16 border-t-[3px] border-x-[3px] border-yellow-600/70 rounded-t-full absolute -top-14 left-1/2 -translate-x-1/2 z-0">
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-600 rounded-full"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-600 rounded-full"></div>
            </div>

            {/* Les Colonnes (Flexbox) */}
            <div className="flex gap-12 pb-8 relative z-10">
              {/* Colonne Gauche */}
              <div className="flex flex-col items-center">
                <Noix isLit={isRevealed} phase={phase} delay={0} />
                <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm"></div>
                <Noix isLit={isRevealed} phase={phase} delay={0.1} />
                <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm"></div>
                <Noix isLit={isRevealed} phase={phase} delay={0.2} />
                <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm"></div>
                <Noix isLit={isRevealed} phase={phase} delay={0.3} />
              </div>

              {/* Colonne Droite */}
              <div className="flex flex-col items-center">
                <Noix isLit={isRevealed} phase={phase} delay={0} />
                <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm"></div>
                <Noix isLit={isRevealed} phase={phase} delay={0.1} />
                <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm"></div>
                <Noix isLit={isRevealed} phase={phase} delay={0.2} />
                <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm"></div>
                <Noix isLit={isRevealed} phase={phase} delay={0.3} />
              </div>
            </div>
          </div>

          {phase === "idle" && (
            <div className="absolute -bottom-12 left-0 right-0 flex flex-col items-center gap-3 animate-pulse">
              <RefreshCw className="text-stone-200" size={18} />
              <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-stone-300">
                Lancer le rituel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ZONE DROITE : LA SAGESSE ET L'ACTION */}
      {isRevealed && details && (
        <div className="w-[60%] bg-white flex flex-col animate-in slide-in-from-right duration-1000 ease-out">
          
          <div className="p-16 lg:p-24 flex-1 overflow-y-auto custom-scrollbar">
            <header className="mb-12">
              <div className="flex items-center gap-10 mb-8">
                <div className="flex gap-4 p-5 bg-stone-50/50 rounded-2xl">
                  <DuIdeogramme du={signe!.duGauche} />
                  <DuIdeogramme du={signe!.duDroite} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] text-amber-700 block mb-2 opacity-50">Sagesse Déployée</span>
                  <h1 className="text-6xl font-serif text-stone-900 leading-tight">{details.signe_nom}</h1>
                </div>
              </div>
              <p className="text-3xl text-stone-400 italic font-serif leading-relaxed">
                "{details.devise}"
              </p>
            </header>

            <div className="space-y-12 max-w-2xl">
              <section>
                <p className="text-xl text-stone-600 font-light leading-relaxed italic border-l-2 border-stone-100 pl-8">
                  {details.introduction}
                </p>
              </section>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Bénédictions</h4>
                  <p className="text-stone-700 leading-relaxed text-sm">{details.avantages}</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Défis</h4>
                  <p className="text-stone-700 leading-relaxed text-sm">{details.defis}</p>
                </div>
              </div>

              <section className="bg-stone-900 text-stone-100 p-12 rounded-[2.5rem] shadow-2xl relative">
                <h3 className="text-[9px] font-bold uppercase mb-6 text-amber-500 tracking-widest">Prescription du Bokonon</h3>
                <p className="text-2xl font-serif leading-relaxed italic text-stone-200">
                  {details.recommandation}
                </p>
              </section>
            </div>
          </div>

          <footer className="p-12 border-t border-stone-50 flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-2">Transmettre ma Sagesse</p>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${isRecording ? 'bg-red-500 animate-pulse text-white ring-8 ring-red-50' : 'bg-stone-900 text-white hover:scale-110 hover:bg-black'}`}
              >
                <Mic size={24} />
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
          background: #f1f1f1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
