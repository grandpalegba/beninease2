'use client';

import { useState, useCallback, useMemo, useEffect } from "react";
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
            <div className="w-full lg:w-[45%] h-[40vh] lg:h-full relative bg-neutral-50">
              <img src={lifeCase.photoUrl} className="w-full h-full object-cover grayscale-[0.2]" />
              <div className="absolute bottom-12 left-12 right-12">
                <h3 className="text-5xl text-black font-serif italic mb-4">{lifeCase.persona}</h3>
                <blockquote className="text-neutral-400 text-lg font-light italic border-l-2 border-[#fcd116] pl-6 leading-relaxed">"{lifeCase.quote}"</blockquote>
              </div>
            </div>

            <div className="w-full lg:w-[55%] h-[60vh] lg:h-full overflow-y-auto bg-white p-12 lg:p-24 flex flex-col relative">
              <div className="flex justify-between items-start mb-20">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-300 font-bold">Signe Révélé</span>
                  <h4 className="text-7xl font-serif italic tracking-tighter text-[#00693e]">{revealed.signX.name} {revealed.signY.name}</h4>
                  <div className="flex gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">{revealed.axisYWord}</span>
                    <span className="text-[10px] text-neutral-200">•</span>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-300">{revealed.axisXWord}</span>
                  </div>
                </div>
                <DotIdeogram leftCode={revealed.signX.code} rightCode={revealed.signY.code} size={100} color="#00693e" />
              </div>

              <div className="space-y-4 mb-24">
                <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-300 font-bold">Dynamique</span>
                <p className="text-4xl font-serif italic text-black/80 leading-snug">"{revealed.dynamicWord}"</p>
              </div>

              <div className="mt-auto space-y-12 pt-12 border-t border-neutral-50">
                <div className="space-y-6">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-300">Votre Sentence</p>
                  <div className="grid gap-2">
                    {lifeCase.options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => setFinalChoice(i)} 
                        className={`p-6 text-left border rounded-2xl transition-all duration-300 ${
                          finalChoice === i 
                            ? "bg-[#00693e] text-white border-[#00693e]" 
                            : "bg-neutral-50 border-neutral-100 text-neutral-400 hover:border-neutral-200"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-bold ${finalChoice === i ? "text-white/40" : "text-neutral-300"}`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-xs font-medium">{opt}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {finalChoice !== null && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <AudioRecorder onSaved={setRecordedBlob} />
                    <div className="space-y-4">
                      <textarea
                        value={wisdomPhrase}
                        onChange={(e) => setWisdomPhrase(e.target.value)}
                        placeholder="Gravez ici l'essence de votre sagesse..."
                        className="w-full bg-transparent border-none p-0 text-3xl font-serif italic focus:ring-0 h-32 resize-none placeholder:text-neutral-100"
                      />
                    </div>
                    <button
                      onClick={handleTransmitSagesse}
                      disabled={isSubmitting || !recordedBlob || wisdomPhrase.length < 5}
                      className="w-full py-6 bg-[#00693e] text-white text-[11px] uppercase tracking-[0.4em] font-bold rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-4 disabled:opacity-20"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <>Sceller la Consultation <ArrowRight size={14} /></>}
                    </button>
                  </motion.div>
                )}
              </div>

              <button 
                onClick={() => setConfirmCloseOpen(true)} 
                className="absolute top-12 right-12 p-2 text-neutral-200 hover:text-black transition-colors"
              >
                <X size={24} strokeWidth={1.5} />
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

export default SandMatrix;