'use client';

import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Loader2, ArrowRight, RotateCcw } from "lucide-react";
import { SIGNS, shuffle, valueToMatrixIndex, type FongbeSign } from "@/data/fongbe";
import { DYNAMICS_MATRIX, DYNAMICS_AXIS } from "@/data/dynamics";
import { type LifeCase, useLifeCases } from "@/features/consultation/useLifeCases";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

// Composants internes (assure-toi que les imports vers tes fichiers SVG/UI sont corrects)
import DotIdeogram from "./DotIdeogram";
import AudioRecorder from "./AudioRecorder";

type Phase = "case" | "matrix" | "revealed" | "completed";

interface RevealedCell {
  signX: FongbeSign;
  signY: FongbeSign;
  dynamicWord: string;
  axisXWord: string;
  axisYWord: string;
}

const SandMatrix = () => {
  const { cases, loading } = useLifeCases();
  const [phase, setPhase] = useState<Phase>("case");
  const [lifeCase, setLifeCase] = useState<LifeCase | null>(null);
  const [revealed, setRevealed] = useState<RevealedCell | null>(null);
  const [finalChoice, setFinalChoice] = useState<number | null>(null);
  const [wisdomPhrase, setWisdomPhrase] = useState("");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mélange unique pour cette session de consultation
  const [shuffledX] = useState(() => shuffle(SIGNS));
  const [shuffledY] = useState(() => shuffle(SIGNS));

  // --- LOGIQUE DE CLIC SUR LA GRILLE ---
  const handleCellClick = useCallback((row: number, col: number) => {
    const signX = shuffledX[col];
    const signY = shuffledY[row];

    // Calcul de l'index dans la matrice dynamique (16x16)
    const matrixRow = signY.valueIndex;
    const matrixCol = valueToMatrixIndex(signX.value);

    const dynamicWord = DYNAMICS_MATRIX[matrixRow]?.[matrixCol] ?? "Message en attente";
    const axisXWord = DYNAMICS_AXIS[matrixCol] ?? "";
    const axisYWord = DYNAMICS_AXIS[matrixRow] ?? "";

    setRevealed({ signX, signY, dynamicWord, axisXWord, axisYWord });
    setPhase("revealed");
  }, [shuffledX, shuffledY]);

  // --- TRANSMISSION FINALE ---
  const handleTransmit = async () => {
    if (!lifeCase || finalChoice === null || !recordedBlob || !revealed) return;
    setIsSubmitting(true);

    try {
      const fileName = `wisdom_${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from('consultation_audios')
        .upload(fileName, recordedBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('consultation_audios')
        .getPublicUrl(fileName);

      await supabase.from('consultations').insert([{
        cas_de_vie_id: lifeCase.id,
        option_choisie: lifeCase.options[finalChoice],
        phrase_sagesse: wisdomPhrase,
        audio_url: publicUrl,
        signe: `${revealed.signX.name} ${revealed.signY.name}`
      }]);

      setPhase("completed");
      toast.success("Votre sagesse a été scellée.");
    } catch (err) {
      toast.error("Erreur de transmission");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-black/10" /></div>;

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-light selection:bg-black selection:text-white">
      <AnimatePresence mode="wait">

        {/* PHASE 1: CHOIX DU CAS */}
        {phase === "case" && (
          <motion.div key="case" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-screen-xl mx-auto pt-32 px-8">
            <h1 className="text-7xl font-extralight tracking-tighter mb-20">Situations.</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cases?.map((c) => (
                <button key={c.id} onClick={() => { setLifeCase(c); setPhase("matrix"); }} className="group text-left space-y-4">
                  <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                    <img src={c.photoUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-black/40">Voix {c.cas_numero}</p>
                  <h3 className="text-2xl font-extralight italic">{c.persona}</h3>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PHASE 2: LA GRILLE CLIQUABLE */}
        {phase === "matrix" && (
          <motion.div key="matrix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col items-center justify-center p-8 bg-[#fcfcfc]">
            <div className="w-full max-w-2xl space-y-12">
              <div className="text-center space-y-2">
                <span className="text-[10px] uppercase tracking-[0.5em] text-[#00693e] font-bold">Matrice du Fâ</span>
                <h2 className="text-3xl font-extralight italic text-black/60">Touchez une case pour révéler votre chemin.</h2>
              </div>
              <div className="grid grid-cols-16 gap-[1px] bg-black/5 p-[1px] aspect-square shadow-2xl">
                {Array.from({ length: 256 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleCellClick(Math.floor(i / 16), i % 16)}
                    className="bg-white hover:bg-[#00693e] transition-colors duration-300 aspect-square"
                  />
                ))}
              </div>
              <button onClick={() => setPhase("case")} className="mx-auto block text-[10px] uppercase tracking-widest text-black/20 hover:text-black transition-colors">Retour</button>
            </div>
          </motion.div>
        )}

        {/* PHASE 3: REVEALED - L'INTERFACE SPLIT DYNAMIQUE */}
        {phase === "revealed" && revealed && lifeCase && (
          <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex flex-col lg:flex-row bg-white">
            {/* Colonne gauche : Le Cas (Immersion) */}
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative bg-black">
              <img src={lifeCase.photoUrl} className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-16 left-16 right-16 space-y-6">
                <h3 className="text-5xl text-white font-extralight italic">{lifeCase.persona}</h3>
                <blockquote className="text-white/40 font-extralight italic border-l border-white/10 pl-6 leading-relaxed italic">"{lifeCase.quote}"</blockquote>
              </div>
            </div>

            {/* Colonne droite : Le Signe (Action) */}
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-y-auto p-12 lg:p-24 space-y-20">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-black/30">Signe Révélé</span>
                  <h4 className="text-6xl font-extralight tracking-tighter text-[#00693e]">{revealed.signX.name} {revealed.signY.name}</h4>
                  <p className="text-xs uppercase tracking-widest text-black/40">{revealed.axisYWord} • {revealed.axisXWord}</p>
                </div>
                <DotIdeogram leftCode={revealed.signX.code} rightCode={revealed.signY.code} size={80} color="#00693e" />
              </div>

              <div className="space-y-6">
                <p className="text-[10px] uppercase tracking-[0.5em] text-black/30">Dynamique</p>
                <p className="text-4xl font-extralight italic text-black/80 leading-tight">"{revealed.dynamicWord}"</p>
              </div>

              <div className="space-y-12 pt-12 border-t border-black/5">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#00693e]">Quelle est votre sentence ?</p>
                  <div className="grid gap-2">
                    {lifeCase.options.map((opt, i) => (
                      <button key={i} onClick={() => setFinalChoice(i)} className={`p-6 text-left border text-sm transition-all ${finalChoice === i ? "bg-black text-white" : "border-black/5 text-black/40 hover:border-black/20"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {finalChoice !== null && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                    <AudioRecorder onSaved={setRecordedBlob} />
                    <textarea value={wisdomPhrase} onChange={(e) => setWisdomPhrase(e.target.value)} placeholder="Votre sagesse..." className="w-full bg-transparent border-none p-0 text-3xl font-extralight italic focus:ring-0 h-32" />
                    <button onClick={handleTransmit} disabled={isSubmitting || !recordedBlob} className="w-full py-8 bg-[#00693e] text-white text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-black transition-colors flex items-center justify-center gap-4">
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <>Sceller la consultation <ArrowRight size={14} /></>}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE 4: COMPLÉTÉ */}
        {phase === "completed" && (
          <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col items-center justify-center text-center space-y-8">
            <h2 className="text-5xl font-extralight italic">C'est accompli.</h2>
            <button onClick={() => window.location.reload()} className="px-12 py-4 bg-black text-white text-[10px] uppercase tracking-widest flex items-center gap-4"> <RotateCcw size={14} /> Nouvelle Consultation</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default SandMatrix; 