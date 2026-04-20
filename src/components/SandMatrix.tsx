'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Loader2, CheckCircle2, Home, RotateCcw, Info, Sparkles, MessageSquareQuote } from "lucide-react";
import { SIGNS, shuffle, valueToMatrixIndex, type FongbeSign } from "@/data/fongbe";
import { DYNAMICS_MATRIX, DYNAMICS_AXIS } from "@/data/dynamics";
import { type LifeCase, useLifeCases } from "@/features/consultation/useLifeCases";
import { supabase } from "@/lib/supabase/client";
import DotIdeogram from "./DotIdeogram";
import BeninFrame from "./BeninFrame";
import SignDisplay from "./SignDisplay";
import SwipeableCaseDeck from "./SwipeableCaseDeck";
import AudioRecorder from "./AudioRecorder";
import EthnicDots from "./EthnicDots";

import { useLivingOrder } from "@/hooks/useLivingOrder";
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
import { toast } from "sonner";

// --- TYPES ---
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

interface SandMatrixProps {
  onComplete?: () => void;
}

const SandMatrix = ({ onComplete }: SandMatrixProps) => {
  // --- ÉTATS ---
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

  const WISDOM_MAX = 100;

  // --- LOGIQUE ---
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

  const handlePickCase = useCallback(
    (picked: LifeCase, selectedOption: number | null) => {
      setLifeCase(picked);
      setIntuitiveChoice(selectedOption);
      setPhase("matrix");
    },
    [],
  );

  const toggleCaseAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingCaseAudio) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlayingCaseAudio(!isPlayingCaseAudio);
  };

  const handleTransmitSagesse = async () => {
    if (!lifeCase || finalChoice === null || !recordedBlob || !revealed) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Transmission de votre sagesse aux ancêtres...");

    try {
      const fileName = `wisdom_${lifeCase.id}_${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('consultation_audios')
        .upload(fileName, recordedBlob);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('consultation_audios')
        .getPublicUrl(fileName);

      const audioUrl = publicUrlData.publicUrl;

      const payload = {
        cas_de_vie_id: lifeCase.id,
        option_choisie: lifeCase.options[finalChoice],
        phrase_sagesse: wisdomPhrase,
        audio_url: audioUrl,
        score_pertinence: 0,
        score_clarte: 0,
        score_profondeur: 0
      };

      const { error: insertError } = await supabase
        .from('consultations')
        .insert([payload]);

      if (insertError) throw insertError;

      toast.success("Votre sagesse a été transmise.", { id: toastId });
      setPhase("completed");
      onComplete?.();
    } catch (error: any) {
      console.error("❌ Erreur de transmission:", error);
      toast.error(`Erreur: ${error.message || "Échec de la transmission"}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestCloseRevealed = useCallback(() => {
    setConfirmCloseOpen(true);
  }, []);

  const confirmCloseRevealed = useCallback(() => {
    setConfirmCloseOpen(false);
    restart();
  }, [restart]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const signX = shuffledX[col];
      const signY = shuffledY[row];
      const matrixRow = signY.valueIndex;
      const matrixCol = valueToMatrixIndex(signX.value);
      const dynamicWord = DYNAMICS_MATRIX[matrixRow]?.[matrixCol] ?? "";
      const axisXWord = DYNAMICS_AXIS[matrixCol] ?? "";
      const axisYWord = DYNAMICS_AXIS[matrixRow] ?? "";

      setRevealed({ row, col, signX, signY, dynamicWord, axisXWord, axisYWord });
      setPhase("revealed");

      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlayingCaseAudio(false);
      }
    },
    [shuffledX, shuffledY]
  );

  // --- RENDU ---
  if (casesLoading && phase === "case") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="animate-spin text-[#00693e]" size={40} />
        <p className="font-headline text-sm text-muted-foreground animate-pulse uppercase tracking-widest">Initialisation de la Matrice...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12">
      <AnimatePresence mode="wait">

        {/* PHASE 1 : SÉLECTION DU CAS */}
        {phase === "case" && (
          <motion.div
            key="case"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-12 text-center">
              <h1 className="font-headline text-4xl text-[#2d2f2f] mb-4">L'Oracle des Décisions</h1>
              <p className="text-[#5a5c5c] max-w-2xl mx-auto">Choisissez une situation de vie qui résonne avec votre quête actuelle pour débuter la consultation.</p>
            </div>
            <SwipeableCaseDeck
              cases={cases}
              onChoice={() => { }}
              initialCaseId={lifeCase?.id}
              onPickCase={handlePickCase}
            />
          </motion.div>
        )}

        {/* PHASE 2 : LA MATRICE 16x16 */}
        {phase === "matrix" && lifeCase && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            className="flex flex-col items-center"
          >
            <div className="max-w-2xl w-full text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8112d]/5 border border-[#e8112d]/10 rounded-full mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#e8112d] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#e8112d]">Connexion au sacré</span>
              </div>
              <h2 className="font-headline text-3xl text-[#2d2f2f] mb-3">Interrogez le Sable</h2>
              <p className="font-body text-[#5a5c5c] leading-relaxed">
                Parmi les 256 chemins possibles, un seul correspond à l'énergie de votre question. Laissez votre main être guidée vers la case de votre destin.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-[#00693e]/5 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <BeninFrame className="relative w-full max-w-[850px]" inset={16} thickness={8}>
                <LivingChoiceGrid onCellClick={handleCellClick} />
              </BeninFrame>
            </div>

            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="flex items-center gap-8 text-muted-foreground opacity-40">
                <EthnicDots size={24} />
                <div className="h-px w-24 bg-current" />
                <EthnicDots size={24} />
              </div>
              <button
                onClick={() => setPhase("case")}
                className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-[#2d2f2f] transition-all"
              >
                <RotateCcw size={14} className="group-hover:-rotate-45 transition-transform" />
                Changer de situation
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE 3 : RÉVÉLATION (LES 250+ LIGNES DE DÉTAILS UX) */}
        {phase === "revealed" && revealed && lifeCase && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-6xl mx-auto"
          >
            {/* Bouton Fermer Flottant */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={requestCloseRevealed}
              className="absolute -top-6 -right-6 z-[60] w-14 h-14 rounded-full bg-white text-[#2d2f2f] shadow-2xl border border-black/5 flex items-center justify-center hover:bg-[#e8112d] hover:text-white transition-colors"
            >
              <X size={24} />
            </motion.button>

            <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">

              {/* PANNEAU GAUCHE : LE CAS DE VIE (IMMERSION) */}
              <div className="w-full lg:w-[45%] flex flex-col bg-[#fafafa] border-r border-black/5">
                <div className="relative aspect-[4/5] lg:aspect-auto lg:flex-1 overflow-hidden group">
                  <img
                    src={lifeCase.photoUrl}
                    alt={lifeCase.persona}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2d2f2f] via-transparent to-transparent opacity-80" />

                  {/* Overlay Contenu Image */}
                  <div className="absolute bottom-10 left-10 right-10">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-3 mb-4"
                    >
                      <span className="px-3 py-1 bg-[#fbd115] text-[#2d2f2f] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                        Voix n°{lifeCase.cas_numero}
                      </span>
                    </motion.div>
                    <h3 className="font-headline text-3xl text-white leading-tight mb-2">{lifeCase.persona}</h3>
                  </div>

                  <button
                    onClick={toggleCaseAudio}
                    className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:bg-[#fbd115] hover:text-[#2d2f2f] transition-all group/play"
                  >
                    {isPlayingCaseAudio ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                    <div className="absolute inset-0 rounded-full border border-white scale-100 group-hover/play:scale-125 opacity-0 group-hover/play:opacity-50 transition-all duration-500" />
                  </button>
                  <audio
                    ref={audioRef}
                    src={`https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/casdevie/cas${lifeCase.cas_numero}.mp3`}
                    onEnded={() => setIsPlayingCaseAudio(false)}
                  />
                </div>

                <div className="p-10 flex flex-col gap-10">
                  <div className="relative">
                    <MessageSquareQuote className="absolute -top-6 -left-6 text-[#fbd115]/20" size={60} />
                    <blockquote className="relative italic text-[#5a5c5c] text-lg leading-relaxed pl-4 border-l-4 border-[#fbd115]">
                      "{lifeCase.quote}"
                    </blockquote>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="h-px flex-1 bg-black/5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#00693e]">Quelle est votre sentence ?</span>
                      <span className="h-px flex-1 bg-black/5" />
                    </div>

                    <div className="grid gap-3">
                      {lifeCase.options.map((opt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ x: 10 }}
                          onClick={() => setFinalChoice(i)}
                          className={`group w-full text-left p-5 rounded-2xl text-sm transition-all border ${finalChoice === i
                            ? "bg-[#00693e] border-[#00693e] text-white shadow-lg shadow-[#00693e]/20"
                            : "bg-white border-black/5 text-[#5a5c5c] hover:border-[#00693e]/30"
                            }`}
                        >
                          <div className="flex items-start gap-4">
                            <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${finalChoice === i ? "border-white/40 text-white" : "border-black/10 text-muted-foreground"
                              }`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="flex-1 font-medium leading-snug">{opt}</span>
                            {intuitiveChoice === i && finalChoice !== i && (
                              <Sparkles size={14} className="text-[#a07d00] animate-pulse" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* PANNEAU DROIT : LE FÂ & LA SAGESSE (INTERPRÉTATION) */}
              <div className="w-full lg:w-[55%] flex flex-col">
                <div className="p-10 lg:p-14 bg-gradient-to-br from-[#f9f9f9] to-white border-b border-black/5">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-[2px] bg-[#00693e]" />
                      <span className="font-label text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Signe du Fâ</span>
                    </div>
                    <EthnicDots size={20} />
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12 mb-12">
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="p-8 bg-white rounded-3xl shadow-xl border border-black/5"
                    >
                      <DotIdeogram leftCode={revealed.signX.code} rightCode={revealed.signY.code} size={100} color="#00693e" />
                    </motion.div>

                    <div className="text-center md:text-left">
                      <h3 className="font-headline text-5xl text-[#00693e] mb-4 tracking-tight">
                        {revealed.signX.name} {revealed.signY.name}
                      </h3>
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                        <span className="px-4 py-1.5 bg-[#00693e]/5 rounded-full text-[#00693e] text-xs font-bold uppercase tracking-widest">{revealed.axisYWord}</span>
                        <X size={12} className="text-muted-foreground/30" />
                        <span className="px-4 py-1.5 bg-black/5 rounded-full text-[#5a5c5c] text-xs font-bold uppercase tracking-widest">{revealed.axisXWord}</span>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-8 rounded-3xl bg-[#00693e] text-white shadow-2xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                      <DotIdeogram leftCode={revealed.signX.code} rightCode={revealed.signY.code} size={120} color="#fff" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] uppercase font-bold tracking-[0.3em] mb-3 opacity-70">Dynamique révélée</p>
                      <p className="font-headline text-4xl font-bold leading-tight">{revealed.dynamicWord}</p>
                    </div>
                  </motion.div>
                </div>

                {/* FORMULAIRE DE TRANSMISSION */}
                <div className="p-10 lg:p-14 flex-1 flex flex-col justify-center bg-white">
                  <AnimatePresence mode="wait">
                    {finalChoice !== null ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10 flex-1 flex flex-col"
                      >
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <Info size={16} className="text-[#fbd115]" />
                            <p className="text-sm font-headline italic text-[#5a5c5c]">
                              Prenez un instant pour verbaliser votre décision et l'enseignement que vous en tirez.
                            </p>
                          </div>

                          <div className="relative">
                            <AudioRecorder onSaved={setRecordedBlob} />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-[#00693e]">L'Essence de votre Sagesse</label>
                            <span className={`text-[10px] font-mono ${wisdomPhrase.length >= WISDOM_MAX ? "text-[#e8112d] font-bold" : "text-muted-foreground"}`}>
                              {wisdomPhrase.length}/{WISDOM_MAX}
                            </span>
                          </div>
                          <textarea
                            value={wisdomPhrase}
                            onChange={(e) => setWisdomPhrase(e.target.value)}
                            maxLength={WISDOM_MAX}
                            placeholder="En quelques mots, quel est le cœur de votre message ?"
                            className="w-full p-6 rounded-3xl bg-[#f9f9f9] border-2 border-transparent focus:border-[#fbd115] focus:bg-white focus:ring-0 italic text-lg transition-all min-h-[140px] resize-none shadow-inner"
                          />
                        </div>

                        <button
                          onClick={handleTransmitSagesse}
                          disabled={isSubmitting || !recordedBlob || wisdomPhrase.trim().length < 5}
                          className="w-full mt-auto py-6 bg-[#00693e] text-white rounded-[2rem] font-bold uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#00693e]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-4 group overflow-hidden relative"
                        >
                          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                          {isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                          ) : (
                            <>
                              <span>Transmettre au Mur des Consultations</span>
                              <CheckCircle2 size={18} className="group-hover:translate-x-2 transition-transform" />
                            </>
                          )}
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-black/5 rounded-[3rem] p-12 text-center"
                      >
                        <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center mb-6">
                          <Info size={32} className="text-black/20" />
                        </div>
                        <h4 className="font-headline text-xl text-[#2d2f2f] mb-2">Décision en attente</h4>
                        <p className="font-headline italic text-sm text-muted-foreground max-w-xs leading-relaxed">
                          Sélectionnez une option à gauche pour lier votre jugement à la puissance du signe révélé.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE 4 : COMPLÉTION (SUCCÈS) */}
        {phase === "completed" && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto py-24 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
              className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-[#cbffda] text-[#00693e] mb-10 shadow-lg shadow-[#cbffda]/50"
            >
              <CheckCircle2 size={56} />
            </motion.div>
            <h2 className="font-headline text-4xl mb-6 text-[#2d2f2f]">Acte de Sagesse Scellé</h2>
            <p className="font-headline italic text-xl text-[#5a5c5c] mb-16 leading-relaxed">
              Votre consultation a été gravée dans la mémoire de Beninease. Elle éclairera désormais le chemin d'autres pèlerins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restart}
                className="flex items-center justify-center gap-3 px-10 py-5 bg-[#00693e] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#00693e]/20 hover:bg-[#005a35] transition-all"
              >
                <RotateCcw size={18} /> Recommencer
              </button>
              <button className="flex items-center justify-center gap-3 px-10 py-5 bg-white border-2 border-black/5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#fafafa] transition-all text-[#2d2f2f]">
                <Home size={18} /> Retour au Mur
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ALERT DIALOG - UX PROTECTION */}
      <AlertDialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-2xl text-center">Interrompre la séance ?</AlertDialogTitle>
            <AlertDialogDescription className="font-headline italic text-center text-lg mt-4">
              "Le sable ne retient pas l'empreinte de celui qui hésite."
            </AlertDialogDescription>
            <p className="text-center text-sm text-muted-foreground mt-2">Votre progression et le signe révélé seront effacés.</p>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-4 mt-8">
            <AlertDialogCancel className="rounded-2xl border-2 px-8 py-3 font-bold text-[10px] uppercase tracking-widest transition-all">Poursuivre</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCloseRevealed} className="rounded-2xl bg-[#e8112d] hover:bg-[#c40e26] px-8 py-3 font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-[#e8112d]/20">Abandonner</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// --- COMPOSANTS INTERNES DÉTAILLÉS (GRILLE 16x16) ---

const TOTAL_CELLS = 16 * 16;
const CELL_COLORS = [
  "#ececec", "#f4f4f4", "#ececec", "#f4f4f4",
  "rgba(0, 135, 81, 0.55)", "#ececec",
  "rgba(252, 209, 22, 0.65)", "#f4f4f4",
  "#ececec", "rgba(232, 17, 45, 0.55)",
  "#f4f4f4", "#ececec"
];

const LivingChoiceGrid = ({ onCellClick }: { onCellClick: (row: number, col: number) => void }) => {
  const cells = useMemo(() => Array.from({ length: TOTAL_CELLS }, (_, i) => ({
    id: i,
    row: Math.floor(i / 16),
    col: i % 16
  })), []);

  // Hook personnalisé pour l'ordre d'apparition organique
  const order = useLivingOrder(TOTAL_CELLS, 8, 1800);
  const [colorTick, setColorTick] = useState(0);

  // Animation de pulsation des couleurs
  useEffect(() => {
    const id = window.setInterval(() => setColorTick((t) => t + 1), 1600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="grid gap-[2px] w-full aspect-square bg-white shadow-inner rounded-sm"
      style={{ gridTemplateColumns: `repeat(16, 1fr)` }}
    >
      {order.map((cellId, slot) => {
        const cell = cells[cellId];
        // Logique de couleur changeante pour l'effet "sable vivant"
        const colorIdx = (cell.id * 7 + colorTick * 13 + slot * 3) % CELL_COLORS.length;
        const bg = CELL_COLORS[colorIdx];

        return (
          <motion.button
            key={cell.id}
            layout
            onClick={() => onCellClick(cell.row, cell.col)}
            className="aspect-square rounded-[1px] relative overflow-hidden group/cell"
            animate={{ backgroundColor: bg }}
            whileHover={{
              scale: 1.25,
              backgroundColor: "#fbd115",
              zIndex: 50,
              borderRadius: "4px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
            }}
            whileTap={{ scale: 0.85 }}
            transition={{
              layout: { type: "spring", stiffness: 150, damping: 20 },
              backgroundColor: { duration: 1.5, ease: "easeInOut" },
              default: { type: "spring", stiffness: 400, damping: 25 }
            }}
          >
            {/* Micro-effet de brillance au survol */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover/cell:opacity-20 transition-opacity pointer-events-none" />
          </motion.button>
        );
      })}
    </div>
  );
};

export default SandMatrix;