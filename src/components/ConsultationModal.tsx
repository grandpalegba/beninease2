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
  
  // Default values for cases where data is missing (e.g. from the Wall)
  const defaultLifeCase = {
    label: "Question de Vie",
    title: "L'Harmonie du Destin",
    quote: "La sagesse du Fâ est une boussole pour l'âme.",
    photoUrl: "/assets/talents/guide-moise.jpg",
    persona: "Consultant anonyme"
  };

  const defaultSignX = { name: "Gbe", code: [1, 1, 1, 1] as [number, number, number, number] };
  const defaultSignY = { name: "Gbe", code: [1, 1, 1, 1] as [number, number, number, number] };

  const effectiveCase = consultation?.lifeCase || defaultLifeCase;
  const effectiveSignX = consultation?.signX || defaultSignX;
  const effectiveSignY = consultation?.signY || defaultSignY;

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
  
  const casePhoto = effectiveCase.photoUrl;

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
              className="flex items-center px-6 py-5 relative"
              style={{ borderBottom: "1px solid #f0f1f1", background: "#ffffff" }}
            >
              {/* Traffic light dots */}
              <div className="flex items-center gap-1.5 absolute left-6">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#008751" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#fcd116" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#e8112d" }} />
              </div>

              {/* Centered Title */}
              <div className="flex-1 flex justify-center">
                <span
                  className="font-label text-[11px] uppercase tracking-[0.3em] font-black"
                  style={{ color: "#1a1a1a" }}
                >
                  {view === "case" ? "Le cas tiré" : "La parole du bokônon"}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-1 rounded-full transition-colors hover:bg-gray-100 absolute right-6 text-gray-400 hover:text-black"
                aria-label="Fermer"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Swipe indicator / Navigation */}
            <div
              className="flex items-center justify-center gap-6 py-3"
              style={{ background: "#ffffff", borderBottom: "1px solid #f0f1f1" }}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setView("case")}
                  className="p-1 rounded-full transition-colors hover:bg-[#f0f1f1]"
                  aria-label="Vue précédente"
                  disabled={view === "case"}
                  style={{ opacity: view === "case" ? 0.3 : 1, color: "#9ca3af" }}
                >
                  <ChevronLeft size={16} strokeWidth={3} />
                </button>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full transition-all duration-300"
                    style={{
                      background: view === "case" ? "#1a1a1a" : "#e5e7eb",
                      width: view === "case" ? 20 : 6,
                      height: 6,
                    }}
                  />
                  <span
                    className="rounded-full transition-all duration-300"
                    style={{
                      background: view === "bokonon" ? "#1a1a1a" : "#e5e7eb",
                      width: view === "bokonon" ? 20 : 6,
                      height: 6,
                    }}
                  />
                </div>
                <button
                  onClick={() => setView("bokonon")}
                  className="p-1 rounded-full transition-colors hover:bg-[#f0f1f1]"
                  aria-label="Vue suivante"
                  disabled={view === "bokonon"}
                  style={{ opacity: view === "bokonon" ? 0.3 : 1, color: "#9ca3af" }}
                >
                  <ChevronRight size={16} strokeWidth={3} />
                </button>
              </div>
              <span
                className="font-label text-[9px] uppercase tracking-[0.25em] font-black text-gray-400"
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
                    <CaseView photo={casePhoto} lifeCase={effectiveCase} signX={effectiveSignX} signY={effectiveSignY} />
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
    className="p-6 md:p-8 flex items-center justify-center"
    style={{ background: "#fcfaf6" }}
  >
    <div
      className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: "#ececec" }}
    >
      {photo && (
        <motion.img
          src={photo}
          alt={caption}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          animate={animate ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      <div
        className="absolute bottom-4 left-4 px-3 py-2 rounded-xl backdrop-blur-md bg-black/40 border border-white/10"
      >
        <span className="font-headline italic text-[11px] text-white tracking-wide">{caption}</span>
      </div>
      
      <button
        type="button"
        aria-label={ariaLabel}
        className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 shadow-lg active:scale-95"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}
      >
        <Play size={20} fill="currentColor" className="ml-1" />
      </button>
    </div>
  </div>
);

const CaseView = ({ photo, lifeCase, signX, signY }: { photo: string | null; lifeCase: any; signX: any; signY: any }) => {
  const isMeji = signX.name === signY.name;
  const signName = isMeji ? `${signY.name}-Meji` : `${signY.name} · ${signX.name}`;

  return (
    <div className="grid md:grid-cols-2 gap-0">
      <PhotoPanel photo={photo} caption={lifeCase.persona} ariaLabel="Écouter le cas" />
      <div className="p-5 md:p-7 flex flex-col" style={{ background: "#ffffff" }}>
        <span className="font-label text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "#5a5c5c" }}>
          {lifeCase.label}
        </span>
        <h3 className="font-headline text-2xl md:text-3xl leading-tight mt-2 mb-3" style={{ color: "#00693e" }}>
          {lifeCase.title}
        </h3>
        <blockquote className="italic text-sm leading-relaxed pl-3 mb-5" style={{ borderLeft: "3px solid #fbd115", color: "rgba(45, 47, 47, 0.85)" }}>
          "{lifeCase.quote}"
        </blockquote>
        <div className="flex items-center gap-4 mb-3 pt-4" style={{ borderTop: "1px solid #ececec" }}>
          <div className="rounded-xl flex items-center justify-center p-2.5 bg-[#f0f1f1] border border-gray-100 shadow-sm">
            <DotIdeogram leftCode={signX.code} rightCode={signY.code} size={64} color="#00693e" />
          </div>
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-0.5">Signe révélé</p>
            <p className="font-display text-xl font-bold uppercase tracking-widest" style={{ color: "#00693e" }}>
              {signName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BokononView = ({ photo, consultation, submitted, onSubmit, relevance, setRelevance, clarity, setClarity, depth, setDepth }: any) => {
  const isProfile = consultation && 'firstName' in consultation;
  const reflection = isProfile ? "La sagesse est un voyage, pas une destination." : consultation?.reflection;

  return (
    <div className="grid md:grid-cols-2 gap-0 h-full">
      <PhotoPanel photo={photo} caption={isProfile ? `${consultation.firstName} ${consultation.lastName}` : consultation?.author} ariaLabel="Écouter la parole" animate />
      <div className="p-6 md:p-10 flex flex-col justify-center" style={{ background: "#ffffff" }}>
        <p className="font-label text-[10px] uppercase tracking-[0.3em] font-black mb-4 text-gray-400">Sa parole</p>
        <blockquote className="font-headline italic text-lg md:text-xl leading-relaxed pl-6 mb-10 text-gray-800 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#fbd115] rounded-full" />
          "{reflection}"
        </blockquote>
        
        {!submitted ? (
          <div className="space-y-8 pt-6 border-t border-gray-50">
            <p className="font-label text-[10px] uppercase tracking-[0.3em] font-black text-center text-gray-400 mb-2">Votre évaluation</p>
            
            <EvaluationSlider label="Pertinence" value={relevance[0]} onChange={(v) => setRelevance([v])} color="#008751" />
            <EvaluationSlider label="Clarté" value={clarity[0]} onChange={(v) => setClarity([v])} color="#fcd116" />
            <EvaluationSlider label="Profondeur" value={depth[0]} onChange={(v) => setDepth([v])} color="#e8112d" />
            
            <button 
              onClick={onSubmit} 
              className="w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] text-white transition-all shadow-lg active:scale-[0.98] mt-4" 
              style={{ background: "#00693e" }}
            >
              Valider l'évaluation
            </button>
          </div>
        ) : (
          <BokononCard photo={photo} consultation={consultation} relevance={relevance[0]} clarity={clarity[0]} depth={depth[0]} />
        )}
      </div>
    </div>
  );
};

const EvaluationSlider = ({ label, value, onChange, color }: { label: string, value: number, onChange: (v: number) => void, color: string }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-black uppercase tracking-wider text-gray-800">{label}</span>
        <span className="text-[11px] font-black tabular-nums text-gray-900">{value}%</span>
      </div>
      <div className="relative h-6 flex items-center group">
        {/* Track */}
        <div className="absolute w-full h-[3px] rounded-full bg-gray-100" />
        {/* Active Track */}
        <div 
          className="absolute h-[3px] rounded-full transition-all duration-300" 
          style={{ width: `${value}%`, background: color }} 
        />
        {/* Input */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        {/* Thumb Visual */}
        <div 
          className="absolute w-5 h-5 bg-white rounded-full shadow-md border-2 border-gray-50 pointer-events-none transition-transform duration-200 group-active:scale-125"
          style={{ left: `calc(${value}% - 10px)` }}
        />
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
