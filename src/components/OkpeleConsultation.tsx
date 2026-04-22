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

function Noix({ isLit, phase, delay }: { isLit: boolean, phase: string, delay: number }) {
  let animClass = "";
  if (phase === "brewing") animClass = "noix-spinning";
  if (phase === "guided" || phase === "fading") animClass = "noix-settling";

  return (
    <div 
      className={`w-12 h-14 pear-seed-inverted shadow-md relative overflow-hidden ring-1 ring-black/5 ${animClass}`} 
      style={{ 
        backgroundColor: "#833321", 
        animationDelay: `${delay}s`,
        boxShadow: "inset -4px -4px 10px rgba(0,0,0,0.5), 0 6px 12px rgba(0,0,0,0.3)" 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/30"></div>
      
      {isLit && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15,0_0_4px_#facc15] z-10"
          style={{ animation: 'glow-pulse 2s infinite ease-in-out' }}
        ></div>
      )}
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---

export default function OkpeleConsultation({ caseData, onBack, onComplete }: { caseData: any, onBack: () => void, onComplete?: () => void }) {
  const [phase, setPhase] = useState<"idle" | "brewing" | "guided" | "fading" | "revealed">("idle");
  const [signe, setSigne] = useState<SigneFa | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);

  const { playSettle, ensureCtx } = useWoodSound();

  const handleTransmit = async () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      onComplete?.();
    }, 1500);
  };

  const fetchFaDetails = async (nomComplet: string) => {
    try {
      const parts = nomComplet.split(' ');
      const nom = parts[1] || 'Mèdji';

      const { data, error } = await supabase
        .from('signes_fa')
        .select('*')
        .ilike('signe_nom', nom)
        .single();
      
      if (error) {
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
      console.error(err);
    }
  };

  const finalizeTirage = useCallback(async () => {
    ensureCtx();
    const result = genererTirage();
    setSigne(result);
    setPhase("brewing");

    // Préchargement en arrière-plan
    await fetchFaDetails(result.nom);

    // 2. Arrêt et illumination (après 1.5s de rotation)
    setTimeout(() => {
      setPhase("guided");
      playSettle();
      
      // 3. Début du fondu de sortie (après 2.5s de contemplation)
      setTimeout(() => {
        setPhase("fading");
        
        // 4. Remplacement par les données du Fa (après 1s de fade out)
        setTimeout(() => {
          setPhase("revealed");
        }, 1000);

      }, 2500);
    }, 1500);
  }, [playSettle, ensureCtx]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF9F6] font-sans fixed inset-0 z-[200]">
      
      {/* Bouton Retour permanent (sauf en cours d'animation critique si souhaité, mais ici on le garde) */}
      <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-stone-300 hover:text-stone-800 transition-colors z-[210]">
        <ArrowLeft size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest">Retour</span>
      </button>

      {/* BLOC 1 : L'OKPELE ET LE MESSAGE */}
      {phase !== "revealed" && (
        <div 
          className={`flex flex-col items-center transition-opacity duration-1000 ease-in-out
            ${phase === "fading" ? "opacity-0" : "opacity-100"}`}
        >
          {/* L'Okpele */}
          <div onClick={() => phase === "idle" && finalizeTirage()} className={`${phase === "idle" ? "cursor-pointer" : ""}`}>
            <div className="flex flex-col items-center relative mt-14">
              {/* L'Arc Supérieur */}
              <div className="w-24 h-16 border-t-[3px] border-x-[3px] border-yellow-600/70 rounded-t-full absolute -top-14 left-1/2 -translate-x-1/2 z-0">
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-600 rounded-full"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-600 rounded-full"></div>
              </div>

              {/* Les Colonnes (Flexbox) */}
              <div className="flex gap-12 pb-8 relative z-10">
                <div className="flex flex-col items-center">
                  <Noix isLit={phase === "guided" || phase === "fading"} phase={phase} delay={0} />
                  <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm"></div>
                  <Noix isLit={phase === "guided" || phase === "fading"} phase={phase} delay={0.1} />
                  <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm"></div>
                  <Noix isLit={phase === "guided" || phase === "fading"} phase={phase} delay={0.2} />
                  <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm"></div>
                  <Noix isLit={phase === "guided" || phase === "fading"} phase={phase} delay={0.3} />
                </div>
                <div className="flex flex-col items-center">
                  <Noix isLit={phase === "guided" || phase === "fading"} phase={phase} delay={0} />
                  <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm"></div>
                  <Noix isLit={phase === "guided" || phase === "fading"} phase={phase} delay={0.1} />
                  <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm"></div>
                  <Noix isLit={phase === "guided" || phase === "fading"} phase={phase} delay={0.2} />
                  <div className="w-[2px] h-4 bg-gradient-to-b from-yellow-600 to-yellow-700 shadow-sm"></div>
                  <Noix isLit={phase === "guided" || phase === "fading"} phase={phase} delay={0.3} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Le Message Sacré */}
          <div className={`mt-12 h-8 transition-opacity duration-700 ${phase === "guided" || phase === "fading" ? "opacity-100" : "opacity-0"}`}>
            <p className="text-xl font-serif italic text-[#833321] tracking-wide animate-pulse">
              Les Ancêtres vous guident.
            </p>
          </div>

          {phase === "idle" && (
            <p className="mt-8 text-[8px] font-bold uppercase tracking-[0.4em] text-stone-300 animate-pulse">
              Touchez l'Okpele pour consulter
            </p>
          )}
        </div>
      )}

      {/* BLOC 2 : LE SIGNE RÉVÉLÉ */}
      {phase === "revealed" && details && (
        <div className="animate-in fade-in duration-1000 flex flex-col items-center w-full max-w-4xl px-6 h-full py-20 overflow-y-auto custom-scrollbar">
          <header className="mb-12 text-center">
            <div className="flex justify-center gap-10 mb-10">
              <div className="flex gap-4 p-6 bg-stone-50/50 rounded-2xl shadow-inner">
                <DuIdeogramme du={signe!.duGauche} />
                <DuIdeogramme du={signe!.duDroite} />
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-700 block mb-4 opacity-50">Sagesse du Fâ</span>
            <h1 className="text-7xl font-serif text-stone-900 mb-6 leading-tight">{details.signe_nom}</h1>
            <p className="text-3xl text-stone-500 italic font-serif leading-relaxed max-w-2xl mx-auto">
              "{details.devise}"
            </p>
          </header>

          <div className="space-y-16 w-full max-w-2xl">
            <section className="text-center">
              <p className="text-2xl text-stone-600 font-light leading-relaxed italic">
                {details.introduction}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4 p-8 bg-stone-50/50 rounded-3xl">
                <h4 className="text-[10px] font-bold text-stone-300 uppercase tracking-widest text-center">Bénédictions</h4>
                <p className="text-stone-700 leading-relaxed text-center">{details.avantages}</p>
              </div>
              <div className="space-y-4 p-8 bg-stone-50/50 rounded-3xl">
                <h4 className="text-[10px] font-bold text-stone-300 uppercase tracking-widest text-center">Défis</h4>
                <p className="text-stone-700 leading-relaxed text-center">{details.defis}</p>
              </div>
            </div>

            <section className="bg-stone-900 text-stone-100 p-12 rounded-[3rem] shadow-2xl relative text-center">
              <h3 className="text-[10px] font-bold uppercase mb-6 text-amber-500 tracking-widest">Prescription du Bokonon</h3>
              <p className="text-3xl font-serif leading-relaxed italic text-stone-200">
                {details.recommandation}
              </p>
            </section>

            <footer className="pt-10 flex flex-col items-center gap-8 pb-20">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-2">Sceller ma Sagesse</p>
              </div>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${isRecording ? 'bg-red-500 animate-pulse text-white ring-8 ring-red-50' : 'bg-stone-900 text-white hover:scale-110 hover:bg-black'}`}
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
