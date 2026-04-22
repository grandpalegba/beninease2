'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { genererTirage, type SigneFa, type DuMajeur } from "@/lib/fa-signes";
import { useWoodSound } from "@/hooks/use-wood-sound";
import { Mic, Send, RefreshCw, ArrowLeft, Play, Pause, CheckCircle2 } from "lucide-react";

// --- SOUS-COMPOSANTS ---

function DuIdeogramme({ du, large = false }: { du: DuMajeur, large?: boolean }) {
  const dotSize = large ? "w-2.5 h-2.5" : "w-1.5 h-1.5";
  const gapSize = large ? "gap-2.5" : "gap-1.5";
  const rowHeight = large ? "h-4" : "h-2.5";

  return (
    <div className={`flex flex-col ${gapSize} items-center`}>
      {du.pattern.map((v, i) => (
        <div key={i} className={`flex ${gapSize} items-center justify-center ${rowHeight}`}>
          {Array.from({ length: v }).map((_, j) => (
            <span key={j} className={`${dotSize} rounded-full bg-[#303333]`} />
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

  const [finalDecision, setFinalDecision] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { playSettle, ensureCtx } = useWoodSound();

  const handleTransmit = async () => {
    if (!finalDecision) return;
    setIsTransmitting(true);
    
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ 
          final_decision: finalDecision,
          signe_fa: signe?.nom,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', caseData.id);

      if (error) throw error;
      
      setTimeout(() => {
        setIsTransmitting(false);
        onComplete?.();
      }, 1500);
    } catch (err) {
      console.error("Error sealing decision:", err);
      setIsTransmitting(false);
    }
  };

  const fetchFaDetails = async (nomTire: string) => {
    console.log("--- DÉBUT DU TEST DE DIAGNOSTIC ---");
    
    // TEST 1 : Récupérer n'importe quoi dans la table sans filtre
    const { data: testAll, error: errAll } = await supabase
      .from("valeurs_universelles")
      .select("signe_fa")
      .limit(5);
    
    console.log("TEST 1 (5 premiers noms en base) :", testAll);
    if (errAll) console.error("ERREUR TEST 1 :", errAll);

    // TEST 2 : Recherche avec le nom du tirage
    const searchKey = nomTire.trim();
    const { data: testResult, error: errResult } = await supabase
      .from("valeurs_universelles")
      .select("*")
      .ilike("signe_fa", `%${searchKey}%`);

    console.log("TEST 2 (Résultat pour " + searchKey + ") :", testResult);
    
    // Récupération Traditionnelle (Normale)
    const { data: tradData } = await supabase
      .from("signes_fa")
      .select("*")
      .ilike("signe_nom", `%${searchKey.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}%`)
      .single();
    if (tradData) setDetailsTrad(tradData);

    if (testResult && testResult.length > 0) {
      setDetailsUniv(testResult[0]);
    } else {
      // FALLBACK DE SECOURS : Si rien n'est trouvé, on force l'affichage du premier signe 
      // pour vérifier que le rendu JSX fonctionne.
      if (testAll && testAll.length > 0) {
        console.warn("Recherche échouée, chargement forcé du premier signe pour test.");
        const { data: fallback } = await supabase.from("valeurs_universelles").select("*").limit(1).single();
        setDetailsUniv(fallback);
      }
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

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white font-sans fixed inset-0 z-[200]">
      
      <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-stone-300 hover:text-stone-800 transition-colors z-[210]">
        <ArrowLeft size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest font-sans">Retour</span>
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
            <p className="text-xl font-sans italic font-light text-[#833321] tracking-wide text-center px-6">
              Les Ancêtres vous guident.
            </p>
          </div>

          {phase === "idle" && (
            <p className="mt-8 text-[8px] font-bold uppercase tracking-[0.4em] text-stone-300 animate-pulse font-sans">
              Touchez l'Okpele pour consulter
            </p>
          )}
        </div>
      )}

      {/* BLOC 2 : LE SIGNE RÉVÉLÉ */}
      {phase === "revealed" && (
        <div className="animate-in fade-in duration-1000 flex flex-col w-full max-w-3xl px-6 py-12 mx-auto overflow-y-auto custom-scrollbar h-full font-sans relative z-[205]">
          
          {/* HEADER FIXE */}
          <header className="flex flex-col items-center text-center mb-10 shrink-0">
            <div className="flex gap-8 mb-4 opacity-100 scale-[1.35]">
              <DuIdeogramme du={signe!.duGauche} large />
              <DuIdeogramme du={signe!.duDroite} large />
            </div>
            
            <div className="flex bg-[#f4f3f2] p-1 rounded-full mt-10">
              <button 
                onClick={() => setActiveVision("traditionnelle")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeVision === "traditionnelle" ? "bg-[#a0412d] text-white shadow-md" : "text-[#5d605f] hover:text-[#303333]"}`}
              >
                Tradition du Fâ
              </button>
              <button 
                onClick={() => setActiveVision("universelle")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeVision === "universelle" ? "bg-[#006b60] text-white shadow-md" : "text-[#5d605f] hover:text-[#303333]"}`}
              >
                Universalité
              </button>
            </div>
          </header>

          {/* CONTENU : TRADITION DU FÂ */}
          {activeVision === "traditionnelle" && detailsTrad && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center">
                <h2 className="text-5xl font-bold text-[#303333] mb-4 tracking-tight">{detailsTrad.signe_nom}</h2>
                <p className="text-xl font-medium italic text-[#a0412d]">"{detailsTrad.devise}"</p>
              </div>
              
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#b0b2b1] mb-4">Introduction</h3>
                <p className="text-[#303333] leading-relaxed text-lg font-light">{detailsTrad.introduction}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#f4f3f2] p-8 rounded-2xl shadow-sm">
                  <h4 className="text-xs font-bold text-[#006b60] uppercase tracking-widest mb-3">Avantages</h4>
                  <p className="text-sm text-[#303333] leading-relaxed font-light">{detailsTrad.avantages}</p>
                </div>
                <div className="bg-[#f4f3f2] p-8 rounded-2xl shadow-sm">
                  <h4 className="text-xs font-bold text-[#a0412d] uppercase tracking-widest mb-3">Défis</h4>
                  <p className="text-sm text-[#303333] leading-relaxed font-light">{detailsTrad.defis}</p>
                </div>
              </div>

              <section className="bg-[#151515] text-[#faf9f8] p-10 rounded-3xl relative overflow-hidden">
                <h3 className="text-xs font-bold uppercase mb-4 text-[#b48224] tracking-widest">Recommandation</h3>
                <p className="text-xl font-medium leading-relaxed italic">{detailsTrad.recommandation}</p>
              </section>
            </div>
          )}

          {/* CONTENU : UNIVERSALITÉ */}
          {activeVision === "universelle" && detailsUniv && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center">
                <h2 className="text-5xl font-bold text-[#006b60] mb-4 tracking-tight">{detailsUniv.valeur}</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-[#797b7a] opacity-60">
                  {detailsUniv.combinaison}
                </p>
              </div>

              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#b0b2b1] mb-4">Le Récit</h3>
                <p className="text-[#303333] leading-relaxed text-lg font-light">{detailsUniv.recit}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#f4f3f2] p-8 rounded-2xl shadow-sm">
                  <h4 className="text-xs font-bold text-[#006b60] uppercase tracking-widest mb-3">Révélation</h4>
                  <p className="text-sm text-[#303333] leading-relaxed font-light">{detailsUniv.revelation}</p>
                </div>
                <div className="bg-[#f4f3f2] p-8 rounded-2xl shadow-sm">
                  <h4 className="text-xs font-bold text-[#a0412d] uppercase tracking-widest mb-3">Piège</h4>
                  <p className="text-sm text-[#303333] leading-relaxed font-light">{detailsUniv.piege}</p>
                </div>
              </div>

              <section className="bg-[#151515] text-[#faf9f8] p-10 rounded-3xl relative overflow-hidden">
                <h3 className="text-xs font-bold uppercase mb-4 text-[#b48224] tracking-widest">Inspiration</h3>
                <p className="text-xl font-medium leading-relaxed italic">{detailsUniv.inspiration}</p>
              </section>
            </div>
          )}

          {/* MODULE : MA DÉCISION FINALE (Affichage Forcé) */}
          <div className="mt-24 pt-16 border-t border-[#f4f3f2] space-y-12 pb-32">
            <header className="text-center">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#b0b2b1] mb-8">Ma Décision Finale</h3>
              
              <div className="flex justify-center items-center gap-6 mb-12">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white relative group">
                  <img src={caseData.image} alt="Le Cas" className="w-full h-full object-cover" />
                  <button 
                    onClick={toggleAudio}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isPlayingAudio ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <audio ref={audioRef} src={caseData.audio} onEnded={() => setIsPlayingAudio(false)} className="hidden" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-[#a0412d] uppercase tracking-widest font-sans">Rappel du Cas</span>
                  <p className="text-[#303333] font-medium leading-tight max-w-[200px] mt-1 line-clamp-2">"Consultation scellée par le Fâ"</p>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map((num) => {
                const opt = caseData[`option${num}`];
                if (!opt) return null;
                const isIntuition = caseData.selectedOption === num;
                const isSelected = finalDecision === opt;

                return (
                  <button 
                    key={num}
                    onClick={() => setFinalDecision(opt)}
                    className={`p-6 rounded-2xl text-left transition-all relative overflow-hidden border-2 font-sans
                      ${isSelected ? 'bg-[#303333] border-[#303333] text-white shadow-xl -translate-y-1' : 'bg-[#f4f3f2] border-transparent text-[#303333] hover:bg-stone-200'}
                    `}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium pr-10">{opt}</span>
                      <div className="flex items-center gap-3">
                        {isIntuition && (
                          <span className={`text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                            Intuition
                          </span>
                        )}
                        {isSelected && <CheckCircle2 size={20} className="text-amber-400" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-10 flex flex-col items-center gap-8">
              <button 
                onClick={handleTransmit}
                disabled={!finalDecision || isTransmitting}
                className={`w-full max-w-sm py-6 rounded-full font-bold text-sm uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-4 font-sans
                  ${!finalDecision ? 'bg-stone-100 text-stone-300 cursor-not-allowed' : 'bg-[#a0412d] text-white hover:bg-[#833321] hover:-translate-y-1 active:translate-y-0'}
                `}
              >
                {isTransmitting ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    <span>Scellage en cours...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Sceller la décision</span>
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-stone-300 uppercase tracking-widest text-center font-sans">
                Une fois scellée, la sagesse du Fâ est immuable.
              </p>
            </div>
          </div>
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
