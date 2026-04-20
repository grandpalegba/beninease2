'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Loader2, CheckCircle2, Home, RotateCcw, Info, Sparkles, MessageSquareQuote, ArrowRight } from "lucide-react";
import { SIGNS, shuffle, valueToMatrixIndex, type FongbeSign } from "@/data/fongbe";
import { DYNAMICS_MATRIX, DYNAMICS_AXIS } from "@/data/dynamics";
import { type LifeCase, useLifeCases } from "@/features/consultation/useLifeCases";
import { supabase } from "@/lib/supabase/client";
import { useLivingOrder } from "@/hooks/useLivingOrder";
import { toast } from "sonner";

// UI Components
import DotIdeogram from "./DotIdeogram";
import BeninFrame from "./BeninFrame";
import SwipeableCaseDeck from "./SwipeableCaseDeck";
import AudioRecorder from "./AudioRecorder";
import EthnicDots from "./EthnicDots";

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

type Phase = "case" | "matrix" | "revealed" | "completed";

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
  // --- ÉTATS (Logique Antigravity Intégrale) ---
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
  const [isPlayingCaseAudio, setIsPlayingCaseAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const WISDOM_MAX = 140;

  // --- LOGIQUE DE NAVIGATION ---
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
        cas_de_vie_id: lifeCase.id,
        option_choisie: lifeCase.options[finalChoice],
        phrase_sagesse: wisdomPhrase,
        audio_url: publicUrlData.publicUrl,
        signe: `${revealed.signX.name} ${revealed.signY.name}`
      }]);

      toast.success("Votre sagesse a été scellée.", { id: toastId });
      setPhase("completed");
      onComplete?.();
    } catch (error) {
      toast.error("Erreur de transmission", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (casesLoading && phase === "case") return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-light selection:bg-[#00693e] selection:text-white">
      <AnimatePresence mode="wait">

        {/* PHASE 1 : SÉLECTION (Minimalist Deck) */}
        {phase === "case" && (
          <motion.div key="case" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-screen-xl mx-auto pt-24 px-8">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-7xl font-extralight tracking-tighter text-[#1a1a1a]">Situations.</h1>
              <p className="text-[10px] uppercase tracking-[0.6em] text-black/30">Choisissez un cas de vie pour interroger le Fâ</p>
            </div>
            <SwipeableCaseDeck
              cases={cases}
              onPickCase={handlePickCase}
              initialCaseId={lifeCase?.id}
            />
          </motion.div>
        )}

        {/* PHASE 2 : MATRICE (Sable Blanc Vivant) */}
        {phase === "matrix" && lifeCase && (
          <motion.div key="matrix" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-screen flex flex-col items-center justify-center p-8 bg-[#fcfcfc]">
            <div className="w-full max-w-2xl text-center mb-12 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.8em] text-[#00693e] font-bold">Matrice des Choix</span>
              <h2 className="text-4xl font-extralight italic">Effleurez le sable.</h2>
              <p className="text-sm text-black/40 font-light max-w-md mx-auto italic">"Un seul chemin parmi les 256 résonne avec votre quête actuelle."</p>
            </div>

            <div className="w-full max-w-[600px] aspect-square relative">
              <BeninFrame thickness={4} inset={12} className="shadow-2xl shadow-black/[0.02]">
                <LivingChoiceGrid onCellClick={handleCellClick} />
              </BeninFrame>
            </div>

            <button onClick={() => setPhase("case")} className="mt-12 text-[9px] uppercase tracking-[0.4em] text-black/20 hover:text-black transition-colors flex items-center gap-3">
              <RotateCcw size={12} /> Retour aux situations
            </button>
          </motion.div>
        )}

        {/* PHASE 3 : RÉVÉLATION (Split Screen Design) */}
        {phase === "revealed" && revealed && lifeCase && (
          <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex flex-col lg:flex-row bg-white overflow-hidden">

            {/* Panneau Gauche : Immersion */}
            <div className="w-full lg:w-[45%] h-[40vh] lg:h-full relative bg-black group">
              <img src={lifeCase.photoUrl} className="w-full h-full object-cover opacity-60 transition-transform duration-[3000ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-12 left-12 right-12 space-y-6">
                <span className="inline-block px-3 py-1 border border-white/20 text-[9px] uppercase tracking-widest text-white/60 rounded-full">Cas n°{lifeCase.cas_numero}</span>
                <h3 className="text-5xl text-white font-extralight italic leading-tight">{lifeCase.persona}</h3>
                <blockquote className="text-white/50 text-lg font-extralight italic border-l border-white/20 pl-6 leading-relaxed">"{lifeCase.quote}"</blockquote>
              </div>
            </div>

            {/* Panneau Droit : L'Oracle & Action */}
            <div className="w-full lg:w-[55%] h-[60vh] lg:h-full overflow-y-auto bg-white p-12 lg:p-24 flex flex-col">
              <div className="flex justify-between items-start mb-20">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-black/30">Signe Révélé</span>
                  <h4 className="text-7xl font-extralight tracking-tighter text-[#00693e]">{revealed.signX.name} {revealed.signY.name}</h4>
                  <div className="flex gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#00693e] font-bold">{revealed.axisYWord}</span>
                    <span className="text-[10px] text-black/20">•</span>
                    <span className="text-[10px] uppercase tracking-widest text-black/40">{revealed.axisXWord}</span>
                  </div>
                </div>
                <DotIdeogram leftCode={revealed.signX.code} rightCode={revealed.signY.code} size={100} color="#00693e" />
              </div>

              <div className="space-y-4 mb-24">
                <span className="text-[10px] uppercase tracking-[0.5em] text-black/30">Dynamique</span>
                <p className="text-4xl font-extralight italic text-black/80 leading-snug">"{revealed.dynamicWord}"</p>
              </div>

              {/* Formulaire de Sagesse (Logique Antigravity) */}
              <div className="mt-auto space-y-12 border-t border-black/5 pt-12">
                <div className="space-y-6">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#00693e]">Votre Sentence</p>
                  <div className="grid gap-3">
                    {lifeCase.options.map((opt, i) => (
                      <button key={i} onClick={() => setFinalChoice(i)} className={`p-6 text-left border transition-all duration-500 ${finalChoice === i ? "bg-black text-white border-black" : "border-black/5 text-black/40 hover:border-black/20"}`}>
                        <div className="flex items-center gap-4">
                          <span className="text-[9px] font-mono opacity-40">{String.fromCharCode(65 + i)}</span>
                          <span className="text-sm">{opt}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {finalChoice !== null && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                      <AudioRecorder onSaved={setRecordedBlob} />
                      <div className="space-y-4">
                        <textarea
                          value={wisdomPhrase}
                          onChange={(e) => setWisdomPhrase(e.target.value)}
                          placeholder="Gravez ici l'essence de votre sagesse..."
                          className="w-full bg-transparent border-none p-0 text-3xl font-extralight italic focus:ring-0 h-32 resize-none placeholder:text-black/5"
                        />
                        <div className="flex justify-between text-[9px] uppercase tracking-widest text-black/20">
                          <span>{wisdomPhrase.length} / {WISDOM_MAX}</span>
                          <span>Format WebM Audio</span>
                        </div>
                      </div>
                      <button
                        onClick={handleTransmitSagesse}
                        disabled={isSubmitting || !recordedBlob || wisdomPhrase.length < 5}
                        className="w-full py-8 bg-[#00693e] text-white text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-black transition-colors flex items-center justify-center gap-6 disabled:opacity-20"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <>Sceller la Consultation <ArrowRight size={14} /></>}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Close Button UI Minimalist */}
              <button onClick={() => setConfirmCloseOpen(true)} className="absolute top-12 right-12 p-4 text-black/20 hover:text-black transition-colors">
                <X size={32} strokeWidth={1} />
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE 4 : COMPLÉTÉ (Clean Success) */}
        {phase === "completed" && (
          <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col items-center justify-center text-center space-y-12">
            <div className="w-32 h-32 rounded-full border border-black/5 flex items-center justify-center">
              <CheckCircle2 size={48} strokeWidth={1} className="text-[#00693e]" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-extralight italic">L'acte est scellé.</h2>
              <p className="text-black/40 font-light tracking-[0.2em] uppercase text-[10px]">Votre sagesse rejoint le mur des pèlerins</p>
            </div>
            <button onClick={restart} className="px-12 py-5 bg-black text-white text-[10px] uppercase tracking-[0.5em] font-bold flex items-center gap-4 hover:bg-[#00693e] transition-colors">
              <RotateCcw size={14} /> Nouvelle Consultation
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* UX Logic Protection */}
      <AlertDialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <AlertDialogContent className="bg-white rounded-none border-none p-12">
          <AlertDialogHeader className="space-y-6">
            <AlertDialogTitle className="text-3xl font-extralight italic text-center">Interrompre le rituel ?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-black/40 text-sm font-light">
              Le sable ne retient pas l'empreinte de celui qui hésite. Votre progression sera perdue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-4 mt-12">
            <AlertDialogCancel className="w-full py-4 border-black/10 rounded-none uppercase text-[9px] tracking-widest">Poursuivre</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setConfirmCloseOpen(false); restart(); }} className="w-full py-4 bg-[#e8112d] text-white rounded-none uppercase text-[9px] tracking-widest">Abandonner</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// --- COMPOSANT GRILLE (Le Sable Vivant Restauré) ---
const CELL_COLORS = [
  "#ffffff", "#fcfcfc", "#f9f9f9", "#f5f5f5",
  "#ffffff", "#fafafa", "rgba(0, 105, 62, 0.04)"
];

const LivingChoiceGrid = ({ onCellClick }: { onCellClick: (row: number, col: number) => void }) => {
  const TOTAL_CELLS = 256;
  const cells = useMemo(() => Array.from({ length: TOTAL_CELLS }, (_, i) => ({
    id: i, row: Math.floor(i / 16), col: i % 16
  })), []);

  const order = useLivingOrder(TOTAL_CELLS, 8, 2000);
  const [colorTick, setColorTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setColorTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid gap-[1px] w-full aspect-square bg-black/[0.03]" style={{ gridTemplateColumns: `repeat(16, 1fr)` }}>
      {order.map((cellId, slot) => {
        const cell = cells[cellId];
        const colorIdx = (cell.id * 7 + colorTick * 13 + slot * 3) % CELL_COLORS.length;
        return (
          <motion.button
            key={cell.id}
            layout
            onClick={() => onCellClick(cell.row, cell.col)}
            className="aspect-square relative group/cell"
            animate={{ backgroundColor: CELL_COLORS[colorIdx] }}
            whileHover={{
              scale: 1.4,
              backgroundColor: "#00693e",
              zIndex: 20,
              boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
            }}
            transition={{ backgroundColor: { duration: 2.5 } }}
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
    <Loader2 className="animate-spin text-black/10" size={40} strokeWidth={1} />
    <span className="text-[10px] uppercase tracking-[0.6em] text-black/20">Initialisation de la Matrice</span>
  </div>
);

export default SandMatrix;