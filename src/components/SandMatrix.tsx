'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, RotateCcw } from "lucide-react";
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
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const restart = useCallback(() => {
    setLifeCase(null);
    setIntuitiveChoice(null);
    setShuffledX(shuffle(SIGNS));
    setShuffledY(shuffle(SIGNS));
    setRevealed(null);
    setFinalChoice(null);
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
    <div className="w-full min-h-screen bg-white">
      <AnimatePresence mode="wait">

        {/* PHASE 1 : SÉLECTION (Le Bumble) */}
        {phase === "case" && (
          <motion.div
            key="case"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen w-full"
          >
            <SwipeableCaseDeck
              cases={cases}
              onPickCase={handlePickCase}
              initialCaseId={lifeCase?.id}
            />
          </motion.div>
        )}

        {/* PHASE 2 : MATRICE (L'immensité) */}
        {phase === "matrix" && lifeCase && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif mb-2">La Matrice des Choix</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
                Touchez une case pour sceller votre destin
              </p>
            </div>

            <div className="w-full max-w-[600px] aspect-square relative shadow-2xl border-[12px] border-neutral-50 rounded-xl overflow-hidden">
              <LivingChoiceGrid onCellClick={handleCellClick} />
            </div>

            <button
              onClick={() => setPhase("case")}
              className="mt-10 px-8 py-3 rounded-full border border-neutral-100 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-all"
            >
              Retourner aux situations
            </button>
          </motion.div>
        )}

        {/* PHASE 3 : RÉVÉLATION (Split Panel) */}
        {phase === "revealed" && revealed && lifeCase && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white lg:bg-neutral-900/10 p-4"
          >
            <div className="w-full max-w-6xl bg-white lg:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-full lg:h-[85vh]">

              {/* PANNEAU GAUCHE : Rappel de l'immersion */}
              <div className="w-full lg:w-[40%] flex flex-col bg-white border-r border-neutral-50 overflow-y-auto">
                <div className="relative w-full aspect-[4/3] lg:h-1/2 shrink-0">
                  <img src={`https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/images_casdevie/cas${lifeCase.id}.jpg`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 block mb-1">{lifeCase.label}</span>
                    <h3 className="text-2xl font-serif">{lifeCase.persona}</h3>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#00693e] mb-4">Confirmation du choix</p>
                  <div className="space-y-3">
                    {lifeCase.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setFinalChoice(i)}
                        className={`w-full p-4 text-left rounded-2xl transition-all flex items-center gap-4 relative ${finalChoice === i ? "bg-[#00693e]/5 ring-1 ring-[#00693e]/20" : "bg-neutral-50"
                          }`}
                      >
                        <span className="font-bold text-xs">{String.fromCharCode(65 + i)}</span>
                        <span className="text-xs font-light pr-12">{opt}</span>
                        {intuitiveChoice === i && <span className="absolute right-4 text-[8px] font-bold text-[#fcd116] uppercase">Intuition</span>}
                        {finalChoice === i && <div className="absolute right-4 w-2 h-2 rounded-full bg-[#00693e]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* PANNEAU DROIT : Oracle & Transmission */}
              <div className="flex-1 bg-[#fafafa] p-8 lg:p-12 overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center mb-10">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Le Signe du Fâ</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-200" />)}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm mb-8 flex items-center gap-8">
                  <div className="shrink-0 p-4 bg-neutral-50 rounded-2xl">
                    <DotIdeogram leftCode={revealed.signX.code} rightCode={revealed.signY.code} size={50} color="#00693e" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-serif text-[#00693e] mb-2">{revealed.signX.name} {revealed.signY.name}</h4>
                    <p className="text-sm font-light text-neutral-500 leading-relaxed">
                      L'union de ces deux énergies révèle une dynamique de <span className="font-bold text-black">{revealed.dynamicWord}</span>.
                    </p>
                  </div>
                </div>

                {/* Zone d'action dynamique */}
                <div className="mt-auto">
                  {finalChoice === null ? (
                    <div className="p-8 border-2 border-dashed border-[#e8112d]/20 rounded-[2rem] text-center bg-[#e8112d]/[0.02]">
                      <p className="text-xs font-bold text-[#e8112d] italic">
                        Scellez votre choix à gauche pour déverrouiller la parole.
                      </p>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#00693e]">Enregistrement</span>
                        <span className="text-[9px] text-neutral-400">Audio 1 min max</span>
                      </div>
                      <AudioRecorder onSaved={setRecordedBlob} />
                      <button
                        onClick={handleTransmitSagesse}
                        disabled={!recordedBlob || isSubmitting}
                        className="w-full mt-6 py-5 bg-[#00693e] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#00693e]/20 disabled:opacity-20 transition-all"
                      >
                        {isSubmitting ? "Scellage en cours..." : "Transmettre ma sagesse"}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              <button onClick={() => setConfirmCloseOpen(true)} className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <AlertDialogContent className="rounded-[2.5rem] p-12">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-serif text-center">Interrompre le rituel ?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-neutral-400">
              Votre progression dans cette consultation sera perdue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4 flex-col sm:flex-row">
            <AlertDialogCancel className="rounded-2xl py-4 flex-1">Poursuivre</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setConfirmCloseOpen(false); restart(); }} className="bg-[#e8112d] rounded-2xl py-4 flex-1">Abandonner</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// --- Reste du code (LivingChoiceGrid, LoadingScreen, etc.) inchangé mais optimisé visuellement ---
const MOCKUP_COLORS = ["#ffffff", "#f5d5d5", "#b4ccc0", "#f9e8b0", "#f7f7f7"];

const LivingChoiceGrid = ({ onCellClick }: { onCellClick: (row: number, col: number) => void }) => {
  const cells = useMemo(() => Array.from({ length: 256 }, (_, i) => ({ id: i, row: Math.floor(i / 16), col: i % 16 })), []);
  const order = useLivingOrder(256, 8, 3000);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-16 w-full h-full bg-white gap-[1px]" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
      {order.map((cellId, slot) => {
        const cell = cells[cellId];
        const color = MOCKUP_COLORS[(cell.id + tick) % MOCKUP_COLORS.length];
        return (
          <motion.button
            key={cell.id}
            onClick={() => onCellClick(cell.row, cell.col)}
            animate={{ backgroundColor: color }}
            whileHover={{ scale: 1.5, zIndex: 10, backgroundColor: "#00693e" }}
            className="aspect-square border-[0.5px] border-neutral-50/10"
          />
        );
      })}
    </div>
  );
};

const LoadingScreen = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-white">
    <Loader2 className="animate-spin text-neutral-200 mb-4" size={48} strokeWidth={1} />
    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-neutral-300">Ouverture de la Matrice</span>
  </div>
);

export default SandMatrix;