'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, RotateCcw, ArrowRight } from "lucide-react";
import { SIGNS, shuffle, valueToMatrixIndex, type FongbeSign } from "@/data/fongbe";
import { DYNAMICS_MATRIX, DYNAMICS_AXIS } from "@/data/dynamics";
import { type LifeCase, useLifeCases } from "@/features/consultation/useLifeCases";
import { supabase } from "@/lib/supabase/client";
import { useLivingOrder } from "@/hooks/useLivingOrder";
import { toast } from "sonner";

// UI Components
import DotIdeogram from "./DotIdeogram";
import SwipeableCaseDeck from "./SwipeableCaseDeck";
import AudioRecorder from "./AudioRecorder";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Phase = "case" | "matrix" | "revealed";

interface RevealedCell {
  row: number;
  col: number;
  signX: FongbeSign;
  signY: FongbeSign;
  dynamicWord: string;
  axisXWord: string;
  axisYWord: string;
}

const SandMatrix = ({ onComplete }: { onComplete?: () => void }) => {
  const { cases, loading: casesLoading } = useLifeCases();
  const [phase, setPhase] = useState<Phase>("case");
  const [lifeCase, setLifeCase] = useState<LifeCase | null>(null);
  const [intuitiveChoice, setIntuitiveChoice] = useState<number | null>(null);
  const [shuffledX, setShuffledX] = useState(() => shuffle(SIGNS));
  const [shuffledY, setShuffledY] = useState(() => shuffle(SIGNS));
  const [revealed, setRevealed] = useState<RevealedCell | null>(null);
  const [finalChoice, setFinalChoice] = useState<number | null>(null);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [wisdomPhrase, setWisdomPhrase] = useState("");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const restart = useCallback(() => {
    setLifeCase(null);
    setIntuitiveChoice(null);
    setShuffledX(shuffle(SIGNS));
    setShuffledY(shuffle(SIGNS));
    setRevealed(null);
    setFinalChoice(null);
    setWisdomPhrase("");
    setRecordedBlob(null);
    setPhase("case");
  }, []);

  const handlePickCase = useCallback((picked: LifeCase, selectedOption: number | null) => {
    setLifeCase(picked);
    setIntuitiveChoice(selectedOption);
    setPhase("matrix");
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    const signX = shuffledX[col];
    const signY = shuffledY[row];
    const matrixRow = signY.valueIndex;
    const matrixCol = valueToMatrixIndex(signX.value);

    setRevealed({
      row, col, signX, signY,
      dynamicWord: DYNAMICS_MATRIX[matrixRow]?.[matrixCol] ?? "",
      axisXWord: DYNAMICS_AXIS[matrixCol] ?? "",
      axisYWord: DYNAMICS_AXIS[matrixRow] ?? ""
    });
    setPhase("revealed");
  }, [shuffledX, shuffledY]);

  const handleTransmitSagesse = async () => {
    if (!lifeCase || finalChoice === null || !recordedBlob || !revealed) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Scellage de la sagesse...");

    try {
      const fileName = `wisdom_${lifeCase.id}_${Date.now()}.webm`;
      await supabase.storage.from('consultation_audios').upload(fileName, recordedBlob);
      const { data: publicUrlData } = supabase.storage.from('consultation_audios').getPublicUrl(fileName);

      await supabase.from('consultations').insert([{
        case_id: lifeCase.id,
        choix_intuitif: intuitiveChoice !== null ? lifeCase.options[intuitiveChoice] : null,
        choix_definitif: lifeCase.options[finalChoice],
        phrase_sagesse: wisdomPhrase,
        audio_url: publicUrlData.publicUrl,
        signe_revele: `${revealed.signX.name} ${revealed.signY.name}`
      }]);

      toast.success("Votre sagesse a été scellée.", { id: toastId });
      onComplete?.();
      restart();
    } catch (error) {
      toast.error("Erreur de transmission", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (casesLoading && phase === "case") return <LoadingScreen />;

  return (
    <div className="w-full flex items-center justify-center">
      <AnimatePresence mode="wait">

        {/* PHASE 1 : SÉLECTION */}
        {phase === "case" && (
          <motion.div 
            key="case" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="w-full"
          >
            <SwipeableCaseDeck
              cases={cases}
              onPickCase={handlePickCase}
              initialCaseId={lifeCase?.id}
              onChoice={() => {}}
            />
          </motion.div>
        )}

        {/* PHASE 2 : MATRICE */}
        {phase === "matrix" && lifeCase && (
          <motion.div 
            key="matrix" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex flex-col items-center w-full"
          >
            <div className="text-center mb-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 block mb-2">LA MATRICE DES CHOIX</span>
              <p className="text-sm italic text-neutral-400 font-light">
                Touchez une case — un signe du Fâ se révélera.
              </p>
            </div>

            <div className="w-full max-w-[700px] aspect-square relative p-2">
              {/* Benin Tricolor Border Decor */}
              <div className="absolute inset-0 border-2 border-[#e8112d]" />
              <div className="absolute inset-0 border-t-2 border-l-2 border-[#fcd116]" />
              <div className="absolute inset-0 border-b-2 border-r-2 border-[#008751]" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }} />
              <div className="absolute inset-0 border-t-2 border-r-2 border-[#008751]" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }} />
              {/* Actually let's use a simpler way for the tricolor border as shown in image */}
              <div className="absolute inset-0 flex flex-col">
                 <div className="h-[2px] w-full flex">
                    <div className="flex-1 bg-[#e8112d]" />
                    <div className="flex-1 bg-[#008751]" />
                 </div>
                 <div className="flex-1 w-full flex">
                    <div className="w-[2px] bg-[#fcd116]" />
                    <div className="flex-1" />
                    <div className="w-[2px] bg-[#e8112d]" />
                 </div>
                 <div className="h-[2px] w-full flex">
                    <div className="flex-1 bg-[#008751]" />
                    <div className="flex-1 bg-[#fcd116]" />
                 </div>
              </div>

              <div className="w-full h-full p-1 bg-white">
                <LivingChoiceGrid onCellClick={handleCellClick} />
              </div>
            </div>

            <button 
              onClick={() => setPhase("case")} 
              className="mt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-300 hover:text-black transition-colors flex items-center gap-3"
            >
              <RotateCcw size={12} /> Retour aux situations
            </button>
          </motion.div>
        )}

        {/* PHASE 3 : RÉVÉLATION */}
        {phase === "revealed" && revealed && lifeCase && (
          <motion.div 
            key="revealed" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 z-50 flex flex-col lg:flex-row bg-white overflow-hidden"
          >
            {/* Panneau Gauche : Immersion & Choix Définitif */}
            <div className="w-full lg:w-[50%] h-[50vh] lg:h-full flex flex-col bg-white overflow-y-auto custom-scrollbar border-r border-neutral-100">
              <div className="relative aspect-[16/9] w-full shrink-0">
                <img src={lifeCase.photoUrl} className="w-full h-full object-cover grayscale-[0.2]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                    <span className="text-white text-sm font-light italic">{lifeCase.persona}</span>
                  </div>
                </div>
                <div className="absolute bottom-6 right-6">
                  <AudioPlayer audioUrl={lifeCase.audioUrl} />
                </div>
              </div>

              <div className="p-8 lg:p-12 flex-1 flex flex-col">
                <blockquote className="text-sm text-neutral-500 font-light italic border-l-2 border-[#fcd116] pl-6 leading-relaxed mb-10">
                  "{lifeCase.quote}"
                </blockquote>

                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#00693e] mb-6">Ton choix définitif</p>
                <div className="grid gap-3 mb-8">
                  {lifeCase.options.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => setFinalChoice(i)} 
                      className={`p-5 text-left rounded-xl transition-all duration-300 flex items-start gap-4 relative overflow-hidden ${
                        finalChoice === i 
                          ? "bg-[#00693e]/5 ring-1 ring-[#00693e]/30" 
                          : "bg-neutral-50 hover:bg-neutral-100 ring-1 ring-transparent"
                      }`}
                    >
                      <span className={`text-[11px] font-bold mt-0.5 ${finalChoice === i ? "text-[#00693e]" : "text-black"}`}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <span className="text-sm font-light text-neutral-600 leading-snug">{opt}</span>
                      
                      {/* Badges (Intuition vs Définitif) */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 items-end">
                        {intuitiveChoice === i && (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#fcd116]">Intuition</span>
                        )}
                        {finalChoice === i && (
                          <span className="bg-[#00693e] text-white text-[8px] px-2 py-1 rounded font-bold uppercase tracking-widest">Définitif</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Panneau Droit : L'Oracle & Action */}
            <div className="w-full lg:w-[50%] h-[50vh] lg:h-full overflow-y-auto bg-[#fafafa] p-8 lg:p-16 flex flex-col relative">
              
              {/* Header Oracle */}
              <div className="flex justify-between items-center mb-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">Signe Révélé</span>
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: '#008751' }} />
                  <span className="w-2 h-2 rounded-full" style={{ background: '#fcd116' }} />
                  <span className="w-2 h-2 rounded-full" style={{ background: '#e8112d' }} />
                </div>
              </div>

              {/* Sign Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-neutral-100 mb-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="bg-neutral-50 p-4 rounded-2xl">
                    {/* Using CombinedTrace for thin lines */}
                    <DotIdeogram leftCode={revealed.signX.code} rightCode={revealed.signY.code} size={40} color="#00693e" />
                  </div>
                  <h4 className="text-4xl font-serif text-[#00693e]">{revealed.signX.name} {revealed.signY.name}</h4>
                </div>
                <div>
                   <p className="text-sm text-neutral-600 leading-relaxed font-light">
                     {revealed.signX.name} {revealed.signY.name} révèle une énergie de {revealed.dynamicWord.toLowerCase()}. Ce signe combine la force de {revealed.signY.name} et celle de {revealed.signX.name}. Leur rencontre dessine une voie d'évolution : un appel à honorer ce qui, en toi, cherche à s'accorder. Écoute ce que cette tension intérieure veut révéler — c'est là que se trouve ta réponse.
                   </p>
                </div>
              </div>

              {/* Résonances */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-neutral-100 mb-12">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#806c00] font-bold block mb-4">Résonances à explorer</span>
                <div className="flex items-center gap-3 text-sm md:text-base font-medium text-neutral-800">
                  <span className="text-[#00693e]">{revealed.axisYWord}</span>
                  <span className="text-[#fcd116]">×</span>
                  <span className="text-neutral-500">{revealed.axisXWord}</span>
                  <span className="text-[#e8112d]">=</span>
                  <span className="font-bold">{revealed.dynamicWord}</span>
                </div>
              </div>

              {/* Action Area (Empty State vs Active State) */}
              <div className="mt-auto">
                <AnimatePresence mode="wait">
                  {finalChoice === null ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border border-dashed border-[#e8112d]/50 bg-[#e8112d]/[0.02] rounded-2xl p-8 text-center"
                    >
                      <p className="text-xs text-[#e8112d] font-bold italic">
                        Compte tenu du signe révélé et des résonances à explorer, faîtes un choix définitif et enregistrer votre interprétation.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="active"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-[2rem] p-8 border border-[#e8112d]/20 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#e8112d]">Enregistre ta réponse</span>
                        <span className="text-[10px] font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-500">1 minute maximum</span>
                      </div>
                      
                      <div className="mb-8">
                        <AudioRecorder onSaved={setRecordedBlob} />
                      </div>

                      <div className="space-y-4 mb-8">
                        <textarea
                          value={wisdomPhrase}
                          onChange={(e) => setWisdomPhrase(e.target.value)}
                          maxLength={100}
                          placeholder="Une phrase courte qui accompagne ton enregistrement..."
                          className="w-full bg-white border-l-4 border-[#fcd116] p-4 text-sm md:text-base font-light italic focus:ring-0 focus:outline-none resize-none placeholder:text-neutral-300 shadow-inner rounded-r-xl"
                          rows={3}
                        />
                      </div>

                      <button
                        onClick={handleTransmitSagesse}
                        disabled={isSubmitting || !recordedBlob || wisdomPhrase.length < 5}
                        className="w-full py-5 bg-[#00693e] text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Transmettre ma sagesse"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setConfirmCloseOpen(true)} 
                className="absolute top-10 right-10 p-2 text-neutral-300 hover:text-black transition-colors bg-white rounded-full border border-neutral-100 shadow-sm"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <AlertDialogContent className="bg-white rounded-[2rem] border-none p-12 shadow-2xl">
          <AlertDialogHeader className="space-y-6">
            <AlertDialogTitle className="text-3xl font-serif italic text-center text-black">Interrompre le rituel ?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-neutral-400 text-sm font-light">
              Le sable ne retient pas l'empreinte de celui qui hésite. Votre progression sera perdue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-12">
            <AlertDialogCancel className="w-full py-5 border-neutral-100 bg-neutral-50 rounded-2xl uppercase text-[10px] font-bold tracking-widest text-neutral-400">Poursuivre</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setConfirmCloseOpen(false); restart(); }} className="w-full py-5 bg-[#e8112d] text-white rounded-2xl uppercase text-[10px] font-bold tracking-widest">Abandonner</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// --- COLORS FROM MOCKUP ---
const MOCKUP_COLORS = [
  "#ffffff", // White
  "#f5d5d5", // Soft Pink
  "#b4ccc0", // Soft Green
  "#f9e8b0", // Soft Yellow
  "#f7f7f7", // Off White
];

const LivingChoiceGrid = ({ onCellClick }: { onCellClick: (row: number, col: number) => void }) => {
  const TOTAL_CELLS = 256;
  const cells = useMemo(() => Array.from({ length: TOTAL_CELLS }, (_, i) => ({
    id: i, row: Math.floor(i / 16), col: i % 16
  })), []);

  const order = useLivingOrder(TOTAL_CELLS, 8, 3000);
  const [colorTick, setColorTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setColorTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid gap-[1px] w-full aspect-square bg-neutral-100/30" style={{ gridTemplateColumns: `repeat(16, 1fr)` }}>
      {order.map((cellId, slot) => {
        const cell = cells[cellId];
        const colorIdx = (cell.id * 11 + colorTick * 17 + slot * 5) % MOCKUP_COLORS.length;
        return (
          <motion.button
            key={cell.id}
            layout
            onClick={() => onCellClick(cell.row, cell.col)}
            className="aspect-square relative group/cell border-[0.5px] border-white/50"
            animate={{ backgroundColor: MOCKUP_COLORS[colorIdx] }}
            whileHover={{
              scale: 1.4,
              backgroundColor: "#00693e",
              zIndex: 20,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}
            transition={{ backgroundColor: { duration: 3 } }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover/cell:opacity-10 transition-opacity" />
          </motion.button>
        );
      })}
    </div>
  );
};

const LoadingScreen = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-white space-y-6">
    <Loader2 className="animate-spin text-neutral-100" size={40} strokeWidth={1} />
    <span className="text-[10px] uppercase tracking-[0.6em] text-neutral-300">Initialisation de la Matrice</span>
  </div>
);

const AudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop playback when url changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [audioUrl]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(console.error);
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <button 
        onClick={toggle}
        className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md text-white transition-transform active:scale-90"
      >
        {isPlaying ? <div className="w-3 h-3 bg-white" /> : <div className="w-0 h-0 border-t-8 border-b-8 border-l-[12px] border-t-transparent border-b-transparent border-l-white ml-1" />}
      </button>
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        playsInline
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </>
  );
};

export default SandMatrix;