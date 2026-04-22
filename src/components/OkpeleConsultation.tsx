'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { genererTirage, type SigneFa, type DuMajeur } from "@/lib/fa-signes";
import { useWoodSound } from "@/hooks/use-wood-sound";
import { Mic, Send, RefreshCw, ArrowLeft, Hand, Music, Activity } from "lucide-react";

// --- SOUS-COMPOSANTS ---

function DuIdeogramme({ du }: { du: DuMajeur }) {
  return (
    <div className="flex flex-col gap-1.5 items-center">
      {du.pattern.map((v, i) => (
        <div key={i} className="flex gap-1.5 items-center justify-center h-2.5">
          {Array.from({ length: v }).map((_, j) => (
            <span key={j} className="w-1.5 h-1.5 rounded-full bg-[#303333]" />
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
  
  const [activeVision, setActiveVision] = useState<"traditionnelle" | "universelle">("traditionnelle");
  const [detailsTrad, setDetailsTrad] = useState<any>(null);
  const [detailsUniv, setDetailsUniv] = useState<any>(null);

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

  const fetchFaDetails = async (nomTire: string) => {
    try {
      const nomRecherche = nomTire.split(" ").pop() || nomTire;

      const [tradResponse, univResponse] = await Promise.all([
        supabase.from("signes_fa").select("*").ilike("signe_nom", `%${nomRecherche}%`).single(),
        supabase.from("valeurs_universelles").select("*").ilike("signe_label", `%${nomRecherche}%`).single()
      ]);

      if (tradResponse.data) {
        setDetailsTrad(tradResponse.data);
      } else {
        // Fallback Trad
        setDetailsTrad({
          signe_nom: nomTire,
          devise: "La vérité est le fruit de la patience.",
          introduction: "Ce signe évoque l'équilibre parfait des forces de la nature. Le Fa vous invite à la réflexion avant l'action.",
          avantages: "Protection accrue, clairvoyance spirituelle.",
          defis: "Résistance au changement, doutes passagers.",
          recommandation: "Honorez la terre et restez fidèle à votre parole."
        });
      }

      if (univResponse.data) {
        setDetailsUniv(univResponse.data);
      } else {
        // Fallback Univ
        setDetailsUniv({
          concept: `Principe de ${nomRecherche}`,
          combinaison: nomTire,
          rythme: "Stable / Ancestral",
          recit: "Le récit universel de ce signe nous parle de la transmission silencieuse des savoirs et de la force de l'intention.",
          revelation: "Chaque pas compte pour celui qui connaît sa direction.",
          piege: "L'impatience et le mépris des petits commencements.",
          geste: "Main posée sur le cœur en fermant les yeux.",
          chant: "Un murmure profond montant du plexus solaire."
        });
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

    await fetchFaDetails(result.nom);

    setTimeout(() => {
      setPhase("guided");
      playSettle();
      
      setTimeout(() => {
        setPhase("fading");
        
        setTimeout(() => {
          setPhase("revealed");
        }, 1000);

      }, 2500);
    }, 1500);
  }, [playSettle, ensureCtx]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF9F6] font-sans fixed inset-0 z-[200]">
      
      <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-stone-300 hover:text-stone-800 transition-colors z-[210]">
        <ArrowLeft size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest">Retour</span>
      </button>

      {/* BLOC 1 : L'OKPELE ET LE MESSAGE */}
      {phase !== "revealed" && (
        <div 
          className={`flex flex-col items-center transition-opacity duration-1000 ease-in-out
            ${phase === "fading" ? "opacity-0" : "opacity-100"}`}
        >
          <div onClick={() => phase === "idle" && finalizeTirage()} className={`${phase === "idle" ? "cursor-pointer hover:scale-105 transition-transform" : ""}`}>
            <div className="flex flex-col items-center relative mt-14">
              <div className="w-24 h-16 border-t-[3px] border-x-[3px] border-yellow-600/70 rounded-t-full absolute -top-14 left-1/2 -translate-x-1/2 z-0">
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-600 rounded-full"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-600 rounded-full"></div>
              </div>

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
          
          <div className={`mt-12 h-8 transition-opacity duration-700 ${phase === "guided" || phase === "fading" ? "opacity-100" : "opacity-0"}`}>
            <p className="text-xl font-serif italic text-[#833321] tracking-wide animate-pulse text-center px-6">
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

      {/* BLOC 2 : LE SIGNE RÉVÉLÉ (Double Vision) */}
      {phase === "revealed" && detailsTrad && detailsUniv && (
        <div className="animate-in fade-in duration-1000 flex flex-col w-full max-w-3xl px-6 py-12 mx-auto overflow-y-auto custom-scrollbar h-full relative z-[205]">
          
          {/* HEADER COMMUN */}
          <header className="flex flex-col items-center text-center mb-10">
            <div className="flex gap-6 mb-8 opacity-80 scale-125">
              <DuIdeogramme du={signe!.duGauche} />
              <DuIdeogramme du={signe!.duDroite} />
            </div>
            <h1 className="text-6xl font-serif text-[#303333] mb-4 tracking-tight">{detailsTrad.signe_nom}</h1>
            
            {/* EDITORIAL TOGGLE (Earth & Ether Style) */}
            <div className="flex bg-[#f4f3f2] p-1 rounded-full mt-6">
              <button 
                onClick={() => setActiveVision("traditionnelle")}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeVision === "traditionnelle" ? "bg-[#a0412d] text-white shadow-lg" : "text-[#5d605f] hover:text-[#303333]"}`}
              >
                Tradition (256 Signes)
              </button>
              <button 
                onClick={() => setActiveVision("universelle")}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeVision === "universelle" ? "bg-[#006b60] text-white shadow-lg" : "text-[#5d605f] hover:text-[#303333]"}`}
              >
                Universel (256 Valeurs)
              </button>
            </div>
          </header>

          {/* CONTENU : VISION TRADITIONNELLE */}
          {activeVision === "traditionnelle" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center">
                <p className="text-2xl font-serif italic text-[#a0412d] leading-relaxed max-w-xl mx-auto">"{detailsTrad.devise}"</p>
              </div>
              
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#b0b2b1] mb-6 text-center">L'Essence du Signe</h3>
                <p className="text-[#303333] leading-relaxed text-lg font-light text-center max-w-2xl mx-auto italic border-l-2 border-[#f4f3f2] pl-8 py-2">
                  {detailsTrad.introduction}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#f4f3f2] p-8 rounded-3xl">
                  <h4 className="text-[10px] font-bold text-[#006b60] uppercase tracking-widest mb-4">Bénédictions</h4>
                  <p className="text-sm text-[#5d605f] leading-relaxed font-light">{detailsTrad.avantages}</p>
                </div>
                <div className="bg-[#f4f3f2] p-8 rounded-3xl">
                  <h4 className="text-[10px] font-bold text-[#a0412d] uppercase tracking-widest mb-4">Défis</h4>
                  <p className="text-sm text-[#5d605f] leading-relaxed font-light">{detailsTrad.defis}</p>
                </div>
              </div>

              <section className="bg-[#151515] text-[#faf9f8] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-center group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                <h3 className="text-[10px] font-bold uppercase mb-6 text-[#b48224] tracking-widest">Recommandation du Fa</h3>
                <p className="text-2xl font-serif italic leading-relaxed text-white/90">
                  {detailsTrad.recommandation}
                </p>
              </section>
            </div>
          )}

          {/* CONTENU : VISION UNIVERSELLE */}
          {activeVision === "universelle" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center">
                <h2 className="text-4xl font-serif text-[#006b60] mb-4 tracking-tight">{detailsUniv.concept}</h2>
                <div className="flex justify-center gap-4 text-[9px] font-bold uppercase tracking-widest text-[#797b7a] opacity-60">
                  <span>Combinaison: {detailsUniv.combinaison}</span>
                  <span>•</span>
                  <span>Rythme: {detailsUniv.rythme}</span>
                </div>
              </div>

              <section className="bg-white/40 p-10 rounded-[3rem] shadow-inner border border-white/20">
                <p className="text-[#303333] leading-relaxed text-lg font-light text-center italic">
                  {detailsUniv.recit}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#eefbff] p-8 rounded-3xl shadow-sm">
                  <h4 className="text-[10px] font-bold text-[#2e5b65] uppercase tracking-widest mb-4">Révélation</h4>
                  <p className="text-sm text-[#38666f] leading-relaxed font-light">{detailsUniv.revelation}</p>
                </div>
                <div className="bg-[#fff7f6] p-8 rounded-3xl shadow-sm">
                  <h4 className="text-[10px] font-bold text-[#721f0f] uppercase tracking-widest mb-4">Piège</h4>
                  <p className="text-sm text-[#913523] leading-relaxed font-light">{detailsUniv.piege}</p>
                </div>
              </div>

              <section className="flex flex-col gap-4">
                {detailsUniv.geste && (
                  <div className="bg-[#f4f3f2] p-8 rounded-[2rem] flex items-center gap-8 group hover:bg-white transition-colors duration-500 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md text-[#a0412d] group-hover:scale-110 transition-transform">
                      <Hand size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase mb-1 text-[#5d605f] tracking-widest opacity-50">Le Geste</h4>
                      <p className="text-sm text-[#303333] font-serif italic leading-relaxed">{detailsUniv.geste}</p>
                    </div>
                  </div>
                )}
                {detailsUniv.chant && (
                  <div className="bg-[#f4f3f2] p-8 rounded-[2rem] flex items-center gap-8 group hover:bg-white transition-colors duration-500 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md text-[#006b60] group-hover:scale-110 transition-transform">
                      <Music size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase mb-1 text-[#5d605f] tracking-widest opacity-50">Le Chant</h4>
                      <p className="text-sm text-[#303333] font-serif italic leading-relaxed">{detailsUniv.chant}</p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* FOOTER ACTION (Toujours présent dans la révélation) */}
          <footer className="mt-20 pt-12 border-t border-stone-100 flex flex-col items-center gap-8 pb-32">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-300 mb-2">Sceller ma Sagesse</p>
            </div>
            
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl ${isRecording ? 'bg-red-500 animate-pulse text-white ring-8 ring-red-50' : 'bg-[#303333] text-white hover:scale-110 hover:bg-black'}`}
              >
                <Mic size={32} />
              </button>
              
              {isRecording && (
                <button 
                  onClick={handleTransmit}
                  disabled={isTransmitting}
                  className="flex items-center gap-4 bg-[#a0412d] text-white px-12 py-5 rounded-full font-bold shadow-2xl hover:bg-[#833321] transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                >
                  <Send size={20} />
                  <span className="text-[11px] uppercase tracking-[0.2em]">
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
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e2e2;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
