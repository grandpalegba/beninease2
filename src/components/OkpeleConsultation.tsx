'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { genererTirage, type SigneFa, type DuMajeur } from "@/lib/fa-signes";
import { useWoodSound } from "@/hooks/use-wood-sound";
import { Mic, Send, RefreshCw, ArrowLeft } from "lucide-react";

// --- SOUS-COMPOSANTS ---

function DuIdeogramme({ du }: { du: DuMajeur }) {
  return (
    <div className="flex flex-col gap-3 items-center">
      {du.pattern.map((v, i) => (
        <div key={i} className="flex gap-2 items-center justify-center h-3">
          {Array.from({ length: v }).map((_, j) => (
            <span key={j} className="w-2.5 h-2.5 rounded-full bg-stone-800" />
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
    // Simulation du délai de scellage
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
        // Fallback mockup data if table is missing or empty
        setDetails({
          signe_nom: nomComplet,
          devise: "La sagesse est le sel de la vie.",
          introduction: "Ce signe évoque une période de transition et de renouveau. Le Fa vous conseille la prudence et l'écoute des anciens.",
          avantages: "Protection spirituelle, succès dans les entreprises sincères.",
          defis: "Éviter les conflits inutiles et les décisions hâtives.",
          recommandation: "Faites une offrande symbolique à la terre et restez fidèle à vos principes."
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
      
      {/* GAUCHE : L'OKPELE */}
      <div className={`transition-all duration-1000 flex flex-col items-center justify-center relative ${phase === 'revealed' ? 'w-1/3 border-r border-stone-100 shadow-xl z-10' : 'w-full'}`}>
        <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors z-20">
          <ArrowLeft size={20} /> Retour
        </button>
        
        <div 
          className="relative group cursor-grab active:cursor-grabbing transition-transform hover:scale-105" 
          onPointerDown={onPointerDown} 
          onPointerUp={onPointerUp}
        >
          {/* Okpele Visualizer */}
          <div className="flex gap-16 py-12 px-20 bg-white/50 rounded-[4rem] backdrop-blur-sm border border-white/20 shadow-inner">
            {/* Left Chain */}
            <div className="flex flex-col gap-6">
              {[0, 1, 2, 3].map(i => (
                <Noix key={`l-${i}`} phase={phase} delay={i * 0.1} spinDuration={phase === "brewing" ? "0.4s" : "1.2s"} />
              ))}
            </div>
            {/* Right Chain */}
            <div className="flex flex-col gap-6">
              {[0, 1, 2, 3].map(i => (
                <Noix key={`r-${i}`} phase={phase} delay={i * 0.1 + 0.2} spinDuration={phase === "brewing" ? "0.4s" : "1.2s"} />
              ))}
            </div>
            
            {/* Thread link */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 border-t-[3px] border-stone-200/50 rounded-t-full" />
          </div>

          {phase === "idle" && (
            <div className="absolute -bottom-20 left-0 right-0 flex flex-col items-center gap-2 animate-bounce">
              <RefreshCw className="text-stone-300" size={24} />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                Faites tourner pour consulter
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DROITE : LA FICHE ET L'ARGUMENTATION */}
      {phase === "revealed" && details && (
        <div className="w-2/3 h-full bg-white flex flex-col animate-in slide-in-from-right duration-1000 ease-out">
          
          <div className="p-12 lg:p-20 flex-1 overflow-y-auto custom-scrollbar">
            <header className="mb-16">
              <div className="flex items-center gap-10 mb-8">
                <div className="flex gap-4 p-6 bg-stone-50 rounded-3xl border border-stone-100">
                  <DuIdeogramme du={signe!.duGauche} />
                  <DuIdeogramme du={signe!.duDroite} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600 block mb-2">Signe Révélé</span>
                  <h1 className="text-7xl font-serif text-stone-900 leading-tight">{details.signe_nom}</h1>
                </div>
              </div>
              <p className="text-3xl text-stone-600 italic font-serif leading-relaxed max-w-2xl">
                "{details.devise || "Le silence de la mer cache des trésors infinis."}"
              </p>
            </header>

            <div className="space-y-16 max-w-3xl">
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6 border-b border-stone-100 pb-2">Le Message du Fa</h3>
                <p className="text-xl text-stone-700 font-light leading-relaxed">{details.introduction}</p>
              </section>

              <div className="grid grid-cols-2 gap-10">
                <div className="p-10 bg-green-50/30 rounded-[2.5rem] border border-green-100/50">
                  <h4 className="text-[10px] font-bold text-green-800 uppercase tracking-widest mb-4">Bénédictions</h4>
                  <p className="text-stone-700 leading-relaxed italic">"{details.avantages}"</p>
                </div>
                <div className="p-10 bg-red-50/30 rounded-[2.5rem] border border-red-100/50">
                  <h4 className="text-[10px] font-bold text-red-800 uppercase tracking-widest mb-4">Défis & Interdits</h4>
                  <p className="text-stone-700 leading-relaxed italic">"{details.defis}"</p>
                </div>
              </div>

              <section className="bg-stone-900 text-stone-100 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-[10px] font-bold uppercase mb-6 text-amber-400 tracking-widest">Prescription du Bokonon</h3>
                <p className="text-2xl font-serif leading-relaxed italic text-stone-200">
                  {details.recommandation}
                </p>
              </section>
            </div>
          </div>

          {/* FOOTER : ENREGISTREMENT SAGA */}
          <footer className="p-10 lg:p-14 border-t border-stone-100 bg-stone-50/80 backdrop-blur-md flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-xl font-bold text-stone-900 mb-1">Sceller votre Sagesse</h4>
              <p className="text-sm font-light text-stone-500">Argumentez la prescription pour le consultant.</p>
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
                  <Send size={20} />
                  <span className="text-xs uppercase tracking-widest">
                    {isTransmitting ? "Scellage..." : "Transmettre"}
                  </span>
                </button>
              )}
            </div>
          </footer>
        </div>
      )}
      
      <style jsx>{`
        .okpele-container {
          perspective: 1000px;
        }
        .noix {
          width: 32px;
          height: 48px;
          background: #5d3a1a;
          border-radius: 40% 40% 50% 50%;
          box-shadow: inset -4px -4px 10px rgba(0,0,0,0.4), 
                      0 10px 20px rgba(0,0,0,0.1);
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }
        .noix::after {
          content: '';
          position: absolute;
          top: 10%;
          left: 50%;
          width: 2px;
          height: 80%;
          background: rgba(255,255,255,0.1);
          transform: translateX(-50%);
        }
        .noix.spinning {
          animation: spin var(--spin-duration, 0.5s) linear infinite;
        }
        .noix.settling {
          animation: settle 0.8s ease-out forwards;
        }
        @keyframes spin {
          from { transform: rotateY(0deg) rotateZ(5deg); }
          to { transform: rotateY(360deg) rotateZ(-5deg); }
        }
        @keyframes settle {
          0% { transform: scale(1.1) rotateY(180deg); }
          50% { transform: scale(0.9) rotateY(0deg); }
          100% { transform: scale(1) rotateY(0deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
