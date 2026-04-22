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

function Noix({ phase, delay, spinDuration }: { phase: string; delay: number; spinDuration: string }) {
  const isLit = phase === "revealed";
  const cls = `noix ${phase === "brewing" ? "spinning" : phase === "settling" ? "settling" : ""} ${isLit ? "lit" : ""}`;
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
          devise: "L'harmonie du monde repose sur le silence de l'esprit.",
          introduction: "Ce signe évoque l'équilibre entre la terre et le ciel. Le Fa vous encourage à cultiver la sérénité face aux épreuves.",
          avantages: "Clarté de vision, force tranquille, protection divine.",
          defis: "Garder son calme dans le tumulte, éviter les jugements hâtifs.",
          recommandation: "Allumez une bougie pour la paix et écoutez le chant du vent."
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

  return (
    <div className="flex h-screen w-full bg-[#fdfcfb] overflow-hidden font-sans fixed inset-0 z-[200]">
      
      {/* ZONE GAUCHE : L'OKPELE (Activation du Fa) */}
      <div className={`transition-all duration-1000 flex flex-col items-center justify-center relative ${phase === 'revealed' ? 'w-[40%] bg-stone-50/50' : 'w-full'}`}>
        <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-stone-300 hover:text-stone-800 transition-colors z-20">
          <ArrowLeft size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest">Retour</span>
        </button>
        
        <div 
          className="relative group cursor-grab active:cursor-grabbing transition-transform" 
          onPointerDown={onPointerDown} 
          onPointerUp={onPointerUp}
        >
          {/* L'armature : l'arc doré en U inversé et CONTINU */}
          <div className="relative" style={{ width: 120, height: 400 }}>
            <svg
              className="absolute inset-0 w-full h-full overflow-visible"
              viewBox="0 0 120 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 380V60C20 27.9675 46.8629 2 80 2C113.137 2 140 27.9675 140 60V380"
                stroke="#D4AF37"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ transform: 'translateX(-40px)' }}
              />
            </svg>

            {/* Noix : Activation du Fa (Lueur interne et externe) */}
            <div className="absolute inset-0 flex justify-between px-2 py-20">
              {/* Left Side */}
              <div className="flex flex-col gap-12 -translate-x-[24px]">
                {[0, 1, 2, 3].map(i => (
                  <Noix key={`l-${i}`} phase={phase} delay={i * 0.1} spinDuration={phase === "brewing" ? "0.3s" : "1.2s"} />
                ))}
              </div>
              {/* Right Side */}
              <div className="flex flex-col gap-12 translate-x-[24px]">
                {[0, 1, 2, 3].map(i => (
                  <Noix key={`r-${i}`} phase={phase} delay={i * 0.1 + 0.2} spinDuration={phase === "brewing" ? "0.3s" : "1.2s"} />
                ))}
              </div>
            </div>
          </div>

          {phase === "idle" && (
            <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center gap-3 animate-pulse">
              <RefreshCw className="text-stone-200" size={18} />
              <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-stone-300">
                Lancer la consultation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ZONE DROITE : LA SAGESSE ET L'ACTION */}
      {phase === "revealed" && details && (
        <div className="w-[60%] bg-white flex flex-col animate-in slide-in-from-right duration-1000 ease-out">
          
          <div className="p-16 lg:p-24 flex-1 overflow-y-auto custom-scrollbar">
            <header className="mb-12">
              <div className="flex items-center gap-10 mb-8">
                <div className="flex gap-4 p-5 bg-stone-50/50 rounded-2xl">
                  <DuIdeogramme du={signe!.duGauche} />
                  <DuIdeogramme du={signe!.duDroite} />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] text-amber-700 block mb-2 opacity-50">Sagesse Activée</span>
                  <h1 className="text-6xl font-serif text-stone-900 leading-tight">{details.signe_nom}</h1>
                </div>
              </div>
              <p className="text-3xl text-amber-700 italic font-serif leading-relaxed">
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
                <div className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100/50">
                  <h4 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-4">Bénédictions</h4>
                  <p className="text-stone-600 leading-relaxed text-sm italic">{details.avantages}</p>
                </div>
                <div className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100/50">
                  <h4 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-4">Défis</h4>
                  <p className="text-stone-600 leading-relaxed text-sm italic">{details.defis}</p>
                </div>
              </div>

              <section className="bg-stone-900 text-amber-400 p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-[9px] font-bold uppercase mb-6 text-amber-500 tracking-widest">Prescription du Bokonon</h3>
                <p className="text-2xl font-serif leading-relaxed italic text-white/90">
                  {details.recommandation}
                </p>
              </section>
            </div>
          </div>

          <footer className="p-12 border-stone-50 flex flex-col items-center gap-6">
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
