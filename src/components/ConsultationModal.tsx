'use client';

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X, Play, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import CombinedTrace from "./CombinedTrace";
import DotIdeogram from "./DotIdeogram";
import SegmentedTrack from "./SegmentedTrack";
import { useSubmitEvaluation } from "@/hooks/useSubmitEvaluation";
import { toast } from "sonner";

// Mock data placeholders - update these with actual data files later
import { PROFILE_PHOTOS } from "@/assets/profiles";

interface Props {
  consultation: any | null; // Using any for now to avoid missing Consultation type errors
  onClose: () => void;
}

type View = "case" | "bokonon";

const SWIPE_THRESHOLD = 60;
const SWIPE_VELOCITY = 350;

const ConsultationModal = ({ consultation, onClose }: Props) => {
  const { mutate: submitEvaluation } = useSubmitEvaluation();
  const [view, setView] = useState<View>("case");
  const [relevance, setRelevance] = useState([50]);
  const [clarity, setClarity] = useState([50]);
  const [depth, setDepth] = useState([50]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!consultation) return;
    
    submitEvaluation({
      consultationId: consultation.id,
      relevance: relevance[0],
      clarity: clarity[0],
      depth: depth[0]
    }, {
      onSuccess: () => {
        setSubmitted(true);
        toast.success("Merci pour votre évaluation !");
      },
      onError: (error: any) => {
        toast.error(error.message || "Erreur lors de l'évaluation");
      }
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setView("case");
      setSubmitted(false);
      setRelevance([50]);
      setClarity([50]);
      setDepth([50]);
    }, 300);
  };

  const isProfile = consultation && 'firstName' in consultation;
  const storageBaseUrl = "https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/profile-photos/";
  
  let bokononPhoto = "";
  if (consultation) {
    if (isProfile && consultation.imageUrl) {
      bokononPhoto = consultation.imageUrl.startsWith('http') 
        ? consultation.imageUrl 
        : `${storageBaseUrl}${consultation.imageUrl}`;
    } else {
      const videoSeed = isProfile ? (consultation.photoIndex || 0) : (consultation.videoSeed || 0);
      bokononPhoto = PROFILE_PHOTOS[videoSeed % PROFILE_PHOTOS.length];
    }
  }
  
  const casePhoto = consultation?.lifeCase?.photoUrl ?? null;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -SWIPE_THRESHOLD || velocity < -SWIPE_VELOCITY) {
      setView("bokonon");
    } else if (offset > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY) {
      setView("case");
    }
  };

  return (
    <AnimatePresence>
      {consultation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          style={{ background: "rgba(45, 47, 47, 0.55)" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl flex flex-col"
            style={{
              background: "#ffffff",
              boxShadow: "0 30px 80px rgba(45, 47, 47, 0.25)",
            }}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-5 pt-4 pb-3"
              style={{ borderBottom: "1px solid #ececec", background: "#ffffff" }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#008751" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#fcd116" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#e8112d" }} />
                <span
                  className="ml-3 font-label text-[10px] uppercase tracking-[0.2em] font-bold"
                  style={{ color: "#5a5c5c" }}
                >
                  {view === "case" ? "Le cas tiré" : "La parole du bokônon"}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full transition-colors hover:bg-[#f0f1f1]"
                style={{ color: "#5a5c5c" }}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Swipe indicator */}
            <div
              className="flex items-center justify-center gap-2 py-2"
              style={{ background: "#fafafa" }}
            >
              <button
                onClick={() => setView("case")}
                className="p-1 rounded-full transition-colors hover:bg-[#ececec]"
                aria-label="Vue précédente"
                disabled={view === "case"}
                style={{ opacity: view === "case" ? 0.3 : 1, color: "#5a5c5c" }}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1.5">
                <span
                  className="rounded-full transition-all"
                  style={{
                    background: view === "case" ? "#00693e" : "#cfd1d1",
                    width: view === "case" ? 16 : 6,
                    height: 6,
                  }}
                />
                <span
                  className="rounded-full transition-all"
                  style={{
                    background: view === "bokonon" ? "#00693e" : "#cfd1d1",
                    width: view === "bokonon" ? 16 : 6,
                    height: 6,
                  }}
                />
              </div>
              <button
                onClick={() => setView("bokonon")}
                className="p-1 rounded-full transition-colors hover:bg-[#ececec]"
                aria-label="Vue suivante"
                disabled={view === "bokonon"}
                style={{ opacity: view === "bokonon" ? 0.3 : 1, color: "#5a5c5c" }}
              >
                <ChevronRight size={16} />
              </button>
              <span
                className="ml-2 font-label text-[9px] uppercase tracking-[0.2em] hidden sm:inline"
                style={{ color: "#5a5c5c" }}
              >
                Swipe
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={view}
                  initial={{ opacity: 0, x: view === "bokonon" ? 80 : -80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: view === "bokonon" ? -80 : 80 }}
                  transition={{ duration: 0.3 }}
                  drag={view === "case" ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={view === "case" ? handleDragEnd : undefined}
                  className={
                    view === "case"
                      ? "touch-pan-y cursor-grab active:cursor-grabbing"
                      : "touch-auto"
                  }
                >
                  {view === "case" ? (
                    <CaseView photo={casePhoto} consultation={consultation} />
                  ) : (
                    <BokononView
                      photo={bokononPhoto}
                      consultation={consultation}
                      submitted={submitted}
                      onSubmit={handleSubmit}
                      relevance={relevance}
                      setRelevance={setRelevance}
                      clarity={clarity}
                      setClarity={setClarity}
                      depth={depth}
                      setDepth={setDepth}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PhotoPanel = ({
  photo,
  caption,
  ariaLabel,
  animate = false,
}: {
  photo: string | null;
  caption: string;
  ariaLabel: string;
  animate?: boolean;
}) => (
  <div
    className="p-5 md:p-7 flex items-center justify-center"
    style={{ background: "#f7f1e6" }}
  >
    <div
      className="relative aspect-[4/5] w-full rounded-xl overflow-hidden select-none"
      style={{ background: "#ececec" }}
    >
      {photo &&
        (animate ? (
          <motion.img
            src={photo}
            alt={caption}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            initial={{ scale: 1.05 }}
            animate={{ scale: [1.05, 1.08, 1.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <img
            src={photo}
            alt={caption}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          />
        ))}
      <div
        className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-lg backdrop-blur-md"
        style={{ background: "rgba(0,0,0,0.45)" }}
      >
        <span className="font-headline italic text-[12px] text-white">{caption}</span>
      </div>
      <button
        type="button"
        aria-label={ariaLabel}
        className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      >
        <Play size={16} fill="currentColor" className="ml-0.5" />
      </button>
    </div>
  </div>
);

const CaseView = ({ photo, consultation }: { photo: string | null; consultation: any }) => (
  <div className="grid md:grid-cols-2 gap-0">
    <PhotoPanel photo={photo} caption={consultation.lifeCase?.persona} ariaLabel="Écouter le cas" />
    <div className="p-5 md:p-7 flex flex-col" style={{ background: "#ffffff" }}>
      <span className="font-label text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "#5a5c5c" }}>
        {consultation.lifeCase?.label}
      </span>
      <h3 className="font-headline text-2xl md:text-3xl leading-tight mt-2 mb-3" style={{ color: "#00693e" }}>
        {consultation.lifeCase?.title}
      </h3>
      <blockquote className="italic text-sm leading-relaxed pl-3 mb-5" style={{ borderLeft: "3px solid #fbd115", color: "rgba(45, 47, 47, 0.85)" }}>
        "{consultation.lifeCase?.quote}"
      </blockquote>
      <div className="flex items-center gap-3 mb-3 pt-4" style={{ borderTop: "1px solid #ececec" }}>
        <div className="rounded-md flex items-center justify-center p-1.5" style={{ background: "#f0f1f1" }}>
          <DotIdeogram leftCode={consultation.signX?.code || [1,1,1,1]} rightCode={consultation.signY?.code || [1,1,1,1]} size={56} color="#00693e" />
        </div>
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "#5a5c5c" }}>Signe révélé</p>
          <p className="font-display text-xl" style={{ color: "#00693e" }}>
            {consultation.signY?.name} · {consultation.signX?.name}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const BokononView = ({ photo, consultation, submitted, onSubmit, relevance, setRelevance, clarity, setClarity, depth, setDepth }: any) => {
  const isProfile = consultation && 'firstName' in consultation;
  const reflection = isProfile ? "La sagesse est un voyage, pas une destination." : consultation?.reflection;

  return (
    <div className="grid md:grid-cols-2 gap-0">
      <PhotoPanel photo={photo} caption={isProfile ? `${consultation.firstName} ${consultation.lastName}` : consultation?.author} ariaLabel="Écouter la parole" animate />
      <div className="p-5 md:p-7 flex flex-col" style={{ background: "#ffffff" }}>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: "#5a5c5c" }}>Sa parole</p>
        <blockquote className="font-headline italic text-base md:text-lg leading-relaxed pl-4 mb-5" style={{ borderLeft: "3px solid #fbd115", color: "rgba(45, 47, 47, 0.9)" }}>
          "{reflection}"
        </blockquote>
        {!submitted ? (
          <div className="space-y-4 pt-4" style={{ borderTop: "1px solid #ececec" }}>
            <p className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-center" style={{ color: "#5a5c5c" }}>Votre évaluation</p>
            <SegmentedTrack label="Pertinence" value={relevance[0]} onChange={(v: number) => setRelevance([v])} />
            <SegmentedTrack label="Clarté" value={clarity[0]} onChange={(v: number) => setClarity([v])} />
            <SegmentedTrack label="Profondeur" value={depth[0]} onChange={(v: number) => setDepth([v])} />
            <button onClick={onSubmit} className="w-full py-3 rounded-md text-sm font-bold uppercase tracking-[0.15em] text-white transition-all" style={{ background: "#00693e" }}>Valider l'évaluation</button>
          </div>
        ) : (
          <BokononCard photo={photo} consultation={consultation} relevance={relevance[0]} clarity={clarity[0]} depth={depth[0]} />
        )}
      </div>
    </div>
  );
};

const BokononCard = ({ photo, consultation, relevance, clarity, depth }: any) => {
  const isProfile = consultation && 'firstName' in consultation;
  const firstName = isProfile ? consultation.firstName : (consultation?.author?.split(' ')[0] || "Bokônon");
  const lastName = isProfile ? consultation.lastName : (consultation?.author?.split(' ').slice(1).join(' ') || "");
  const profileId = isProfile ? consultation.id : (consultation?.profileId || "1");

  return (
    <div className="pt-5" style={{ borderTop: "1px solid #ececec" }}>
      <p className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-center mb-4" style={{ color: "#00693e" }}>✦ Fiche du bokônon</p>
      <div className="flex items-center gap-3 mb-5">
        {photo && <img src={photo} alt="Bokonon" className="w-14 h-14 rounded-full object-cover shrink-0" />}
        <div className="min-w-0 flex-1">
          <p className="font-headline text-base font-bold truncate">{firstName} {lastName}</p>
          <p className="text-[11px] italic truncate">{isProfile ? (consultation.archetype || "Guide Spirituel") : "Guide Spirituel"}</p>
        </div>
      </div>
      <Link href={`/profil/${profileId}`} className="flex items-center justify-center gap-2 w-full py-3 rounded-md text-sm font-bold uppercase tracking-[0.15em] text-white transition-all" style={{ background: "#00693e" }}>
        Voir le profil complet <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default ConsultationModal;
