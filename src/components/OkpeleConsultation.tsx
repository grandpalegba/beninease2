'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { genererTirage, type SigneFa, type DuMajeur } from "@/lib/fa-signes";
import { useWoodSound } from "@/hooks/use-wood-sound";
import { Mic, Send, RefreshCw, ArrowLeft, Play, Pause, CheckCircle2, Video, Check } from "lucide-react";
import CaseCard from "./CaseCard";

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
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playSettle, ensureCtx } = useWoodSound();

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileName = `guidance_${caseData.id}_${Date.now()}.mp4`;
      const { error } = await supabase.storage.from('consultation_videos').upload(fileName, file);
      if (error) throw error;

      const { data } = supabase.storage.from('consultation_videos').getPublicUrl(fileName);
      setVideoUrl(data.publicUrl);
    } catch (err) {
      console.error("Video upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTransmit = async () => {
    if (!finalDecision || !videoUrl) return;
    setIsTransmitting(true);
    
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ 
          final_decision: finalDecision,
          signe_fa: signe?.nom,
          status: 'completed',
          video_url: videoUrl,
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
    try {
      const searchKey = nomTire
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

      const words = searchKey.split(' ');
      const fuzzyPattern = `%${words.join('%')}%`;

      const [tradRes, univRes] = await Promise.all([
        supabase.from("signes_fa")
          .select("*")
          .ilike("signe_nom", `%${searchKey}%`)
          .single(),
        supabase.from("valeurs_universelles")
          .select("*")
          .or(`signe_fa.ilike.${fuzzyPattern},valeur.ilike.${fuzzyPattern}`)
          .limit(1)
      ]);

      if (tradRes.data) setDetailsTrad(tradRes.data);
      if (univRes.data && univRes.data.length > 0) setDetailsUniv(univRes.data[0]);
    } catch (err) {
      console.error("Fetch error:", err);
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

  const canSubmit = finalDecision !== null && videoUrl !== null;

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
        <div className="animate-in fade-in duration-1000 flex flex-col w-full max-w-5xl px-6 py-12 mx-auto overflow-y-auto custom-scrollbar h-full font-sans relative z-[205]">
          
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
                <p className="text-xl font-medium italic text-[#a0412d]">{detailsTrad.devise}</p>
              </div>
              
              <section>
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

          {/* MODULE : ARBITRAGE FINAL (Compact Single-Screen) */}
          <div className="mt-32 pt-16 border-t border-[#f4f3f2] pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
              
              {/* À GAUCHE (La Carte Originale) */}
              <div className="flex flex-col h-full">
                <div className="w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-black border-4 border-white">
                  <CaseCard lifeCase={caseData} isActive={true} />
                </div>
              </div>

              {/* À DROITE (Arbitrage final) */}
              <div className="flex flex-col h-full space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Arbitrage final</p>
                
                <div className="grid grid-cols-1 gap-2">
                  {caseData.options.map((opt: string, i: number) => {
                    const isSelected = finalDecision === opt;

                    return (
                      <button 
                        key={i}
                        onClick={() => setFinalDecision(opt)}
                        className={`p-3.5 rounded-xl text-left transition-all border-2 flex items-center justify-between relative
                          ${isSelected 
                            ? 'bg-white border-[#22C55E] shadow-sm' 
                            : 'bg-[#f4f3f2] border-transparent opacity-60 hover:opacity-100'}
                        `}
                      >
                        <span className="text-sm font-semibold text-[#303333]">{opt}</span>
                        {isSelected && <CheckCircle2 size={14} className="text-[#22C55E]" />}
                      </button>
                    );
                  })}
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#f4f3f2] border-2 border-dashed border-stone-200 rounded-2xl p-3.5 flex items-center gap-4 group cursor-pointer hover:border-[#b48224] transition-colors relative"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleVideoUpload} 
                    accept="video/*" 
                    className="hidden" 
                  />
                  
                  <div className={`w-9 h-9 rounded-full bg-white flex items-center justify-center transition-colors shadow-sm ${videoUrl ? 'text-[#22C55E]' : 'text-stone-400 group-hover:text-[#b48224]'}`}>
                    {isUploading ? (
                      <RefreshCw className="animate-spin" size={18} />
                    ) : videoUrl ? (
                      <Check size={18} />
                    ) : (
                      <Video size={18} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-[#303333] uppercase tracking-widest">Partager votre sagesse</p>
                    <p className="text-[9px] text-stone-400 mt-0.5">{videoUrl ? "Vidéo prête" : "Vidéo courte"}</p>
                  </div>
                </div>

                <div className="mt-auto pt-2">
                  <button 
                    onClick={handleTransmit}
                    disabled={!canSubmit || isTransmitting}
                    className={`w-full py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl flex items-center justify-center gap-4
                      ${!canSubmit ? 'bg-stone-100 text-stone-300 cursor-not-allowed' : 'bg-[#b48224] text-white hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0'}
                    `}
                  >
                    {isTransmitting ? (
                      <RefreshCw className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Transmettre ma guidance</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      );

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
